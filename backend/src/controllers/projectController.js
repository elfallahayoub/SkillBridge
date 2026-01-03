'use strict';

const mongoose = require("mongoose");
const Project = require("../models/Project");
const User = require("../models/User");

/**
 * Résoudre un identifiant utilisateur en ObjectId
 */
const resolveUserIdentifier = async (identifier) => {
  if (!identifier) return null;

  if (mongoose.isValidObjectId(identifier)) {
    return identifier;
  }

  let user = await User.findOne({ numeroEtudiant: identifier }).select("_id");
  if (user) return user._id;

  user = await User.findOne({ email: identifier }).select("_id");
  if (user) return user._id;

  const sep = identifier.includes("-")
    ? "-"
    : identifier.includes(" ")
    ? " "
    : null;

  if (sep) {
    const [nom, prenom] = identifier.split(sep).map(s => s.trim());
    if (nom && prenom) {
      user = await User.findOne({ nom, prenom }).select("_id");
      if (user) return user._id;
    }
  }

  return null;
};

/**
 * Normaliser l'entrée members en tableau
 */
const normalizeMembersInput = (members) => {
  if (!members) return [];

  if (Array.isArray(members)) return members;

  if (typeof members === "string") {
    try {
      const parsed = JSON.parse(members);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}

    return members.split(",").map(m => m.trim()).filter(Boolean);
  }

  return [members];
};

/* ================= CREATE PROJECT ================= */
exports.createProject = async (req, res) => {
  try {
    const data = { ...req.body };

    if (!data.title || !data.description || !data.category) {
      return res.status(400).json({
        message: "title, description and category are required"
      });
    }

    // Members
    const membersRaw = normalizeMembersInput(data.members);
    const resolvedMembers = [];
    const unresolved = [];

    for (const m of membersRaw) {
      const id = await resolveUserIdentifier(m);
      if (id) resolvedMembers.push(id);
      else unresolved.push(m);
    }

    data.members = resolvedMembers;
    if (unresolved.length > 0) {
      data.membersStrings = unresolved;
    }

    // Owner
    if (data.owner) {
      const ownerId = await resolveUserIdentifier(data.owner);
      if (ownerId) data.owner = ownerId;
      else delete data.owner;
    }

    const project = new Project(data);
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
    const updates = { ...req.body };

    if (updates.members) {
      const membersRaw = normalizeMembersInput(updates.members);
      const resolved = [];
      const unresolved = [];

      for (const m of membersRaw) {
        const id = await resolveUserIdentifier(m);
        if (id) resolved.push(id);
        else unresolved.push(m);
      }

      if (resolved.length === 0) {
        return res.status(400).json({
          message: "No valid members found",
          unresolved
        });
      }

      updates.members = resolved;
    }

    if (updates.owner) {
      const ownerId = await resolveUserIdentifier(updates.owner);
      if (!ownerId) {
        return res.status(400).json({
          message: "Owner could not be resolved"
        });
      }
      updates.owner = ownerId;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
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
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE PROJECT ================= */
exports.deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project deleted successfully",
      project: deletedProject
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ALL PROJECTS ================= */
exports.deleteAllProjects = async (req, res) => {
  try {
    const result = await Project.deleteMany({});
    res.status(200).json({
      message: "All projects deleted",
      deletedCount: result.deletedCount
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
