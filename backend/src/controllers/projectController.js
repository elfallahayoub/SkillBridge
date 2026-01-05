'use strict';

const mongoose = require("mongoose");
const Project = require("../models/Project");
const User = require("../models/User");

/* ================= UTILITIES ================= */

const resolveUserIdentifier = async (identifier) => {
  if (!identifier) return null;

  if (mongoose.isValidObjectId(identifier)) {
    return identifier;
  }

  let user = await User.findOne({ numeroEtudiant: identifier }).select("_id");
  if (user) return user._id;

  user = await User.findOne({ email: identifier }).select("_id");
  if (user) return user._id;

  return null;
};

const normalizeMembersInput = (members) => {
  if (!members) return [];
  if (Array.isArray(members)) return members;
  if (typeof members === "string") {
    return members.split(",").map(m => m.trim()).filter(Boolean);
  }
  return [members];
};

/* ================= CREATE PROJECT ================= */
exports.createProject = async (req, res) => {
  try {
    const { title, description, category, owner, members } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        message: "title, description and category are required"
      });
    }

    // Owner
    let ownerId = null;
    if (owner) {
      ownerId = await resolveUserIdentifier(owner);
    }

    // Members
    const membersRaw = normalizeMembersInput(members);
    const membersIds = [];

    for (const m of membersRaw) {
      const id = await resolveUserIdentifier(m);
      if (id) membersIds.push(id);
    }

    const project = new Project({
      title,
      description,
      category,
      owner: ownerId,
      members: membersIds
    });

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate("owner", "nom prenom")
      .populate("members", "nom prenom");

    res.status(201).json({
      message: "Project created successfully",
      project: populatedProject
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET ALL PROJECTS ================= */
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner", "nom prenom")
      .populate("members", "nom prenom")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET PROJECT BY ID ================= */
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "nom prenom")
      .populate("members", "nom prenom");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE PROJECT ================= */
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.owner) {
      const ownerId = await resolveUserIdentifier(updates.owner);
      if (!ownerId) {
        return res.status(400).json({ message: "Invalid owner" });
      }
      updates.owner = ownerId;
    }

    if (updates.members) {
      const membersRaw = normalizeMembersInput(updates.members);
      const membersIds = [];

      for (const m of membersRaw) {
        const id = await resolveUserIdentifier(m);
        if (id) membersIds.push(id);
      }

      updates.members = membersIds;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    )
      .populate("owner", "nom prenom")
      .populate("members", "nom prenom");

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ================= DELETE PROJECT ================= */
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project deleted successfully",
      project: deletedProject
    });

  } catch (err) {
    res.status(500).json({
      message: "Error deleting project",
      error: err.message
    });
  }
};
