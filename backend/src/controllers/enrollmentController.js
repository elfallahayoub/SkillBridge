const crypto = require('crypto');
const Enrollment = require('../models/Enrollment');
const Project = require('../models/Project');
const User = require('../models/User');
const { sendMail } = require('../utils/email');

exports.requestToJoin = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.body.userId;

    if (!projectId || !userId) return res.status(400).json({ message: 'project id and userId required' });

    const project = await Project.findById(projectId).populate('owner', 'email nom prenom');
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = crypto.randomBytes(20).toString('hex');

    const enrollment = new Enrollment({ project: projectId, user: userId, token });
    await enrollment.save();

    // Send email to project owner with accept link
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const acceptLink = `${backendUrl}/api/enroll/accept/${token}`;

    const subject = `Nouvelle demande pour le projet "${project.title}"`;
    const html = `Bonjour ${project.owner.nom || project.owner.email},<br/><br/>
    ${user.nom} ${user.prenom} (${user.email}) a demandé à rejoindre votre projet "${project.title}".<br/>
    <a href="${acceptLink}">Cliquez ici pour accepter la demande</a><br/><br/>
    Si vous ne souhaitez pas accepter, ignorez ce message.`;

    try {
      await sendMail({ to: project.owner.email, subject, html });
    } catch (mailErr) {
      console.error('Failed to send email:', mailErr.message);
    }

    res.status(201).json({ message: 'Request sent to project owner' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.acceptEnrollment = async (req, res) => {
  try {
    const token = req.params.token;
    const enrollment = await Enrollment.findOne({ token }).populate('project user');
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    if (enrollment.status !== 'pending') return res.status(400).json({ message: 'Enrollment already handled' });

    // Add user to project members if not already
    const project = await Project.findById(enrollment.project._id);
    const userId = enrollment.user._id;

    if (!project.members.some(m => m.toString() === userId.toString())) {
      project.members.push(userId);
      await project.save();
    }

    enrollment.status = 'accepted';
    await enrollment.save();

    res.status(200).json({ message: 'User added to project and enrollment accepted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
