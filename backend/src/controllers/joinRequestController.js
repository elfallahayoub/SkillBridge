const JoinRequest = require("../models/JoinRequest");
const Project = require("../models/Project");

/* ================= CREATE REQUEST ================= */
exports.createRequest = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // éviter doublons
    const exists = await JoinRequest.findOne({
      project: projectId,
      user: userId,
      status: "pending"
    });

    if (exists) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = new JoinRequest({
      project: projectId,
      user: userId,
      owner: project.owner
    });

    await request.save();

    res.status(201).json({
      message: "Join request sent",
      request
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET REQUESTS FOR OWNER ================= */
exports.getOwnerRequests = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const requests = await JoinRequest.find({
      owner: ownerId,
      status: "pending"
    })
      .populate("user", "nom prenom email")
      .populate("project", "title");

    res.status(200).json(requests);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= ACCEPT REQUEST ================= */
exports.acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await JoinRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // ajouter l'utilisateur au projet
    await Project.findByIdAndUpdate(
      request.project,
      { $addToSet: { members: request.user } } // empêche doublons
    );

    request.status = "accepted";
    await request.save();

    res.status(200).json({ message: "Request accepted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= REJECT REQUEST ================= */
exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    await JoinRequest.findByIdAndUpdate(id, {
      status: "rejected"
    });

    res.status(200).json({ message: "Request rejected" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
