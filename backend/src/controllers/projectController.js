const mongoose = require('mongoose');
const Project = require("../models/Project");
const User = require("../models/User");

async function resolveUserIdentifier(identifier) {
	if (!identifier) return null;
	if (mongoose.isValidObjectId(identifier)) return identifier;

	let user = await User.findOne({ numeroEtudiant: identifier }).select('_id').lean();
	if (user) return user._id;

	user = await User.findOne({ email: identifier }).select('_id').lean();
	if (user) return user._id;

	const sep = identifier.includes('-') ? '-' : (identifier.includes(' ') ? ' ' : null);
	if (sep) {
		const parts = identifier.split(sep).map(s => s.trim()).filter(Boolean);
		if (parts.length >= 2) {
			const nom = parts[0];
			const prenom = parts[1];
			user = await User.findOne({ nom, prenom }).select('_id').lean();
			if (user) return user._id;
		}
	}

	return null;
}

function normalizeMembersInput(members) {
	if (!members) return [];
	if (Array.isArray(members)) return members;
	if (typeof members === 'string') {
		try {
			const parsed = JSON.parse(members);
			if (Array.isArray(parsed)) return parsed;
		} catch (e) {
			// not JSON
		}
		return members.split(',').map(s => s.trim()).filter(Boolean);
	}
	return [members];
}

// Create project
exports.createProject = async (req, res) => {
	try {
		const data = { ...req.body };

		// Basic validation
		if (!data.title || !data.description || !data.category) {
			return res.status(400).json({ message: 'title, description and category are required' });
		}

		// Normalize members and try to resolve to IDs. Do NOT reject creation if none resolve.
		const membersRaw = normalizeMembersInput(data.members);
		const membersResolved = [];
		const unresolvedMembers = [];
		for (const m of membersRaw) {
			const id = await resolveUserIdentifier(m);
			if (id) membersResolved.push(id);
			else unresolvedMembers.push(m);
		}

		// Always set members to resolved ids (may be empty). Keep unresolved strings in a separate field for reference.
		data.members = membersResolved;
		if (unresolvedMembers.length) data.membersStrings = unresolvedMembers;

		// Resolve owner if provided by client; if not provided or not resolvable, don't block creation.
		if (data.owner) {
			const ownerId = await resolveUserIdentifier(data.owner);
			if (ownerId) data.owner = ownerId;
			else {
				// leave owner undefined/null so project can still be created; frontend should send owner when possible
				delete data.owner;
			}
		}

		// If client didn't send owner, we don't have auth middleware; keep owner unset (frontend should send owner)
		const project = new Project(data);
		await project.save();

		// return populated project
		const result = await Project.findById(project._id)
			.populate('owner', 'nom prenom')
			.populate('members', 'nom prenom')
			.lean()
			.exec();

		res.status(201).json(result);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Get all projects (use lean + select to speed up responses)
// Get all projects (paginated)
exports.getAllProjects = async (req, res) => {
	try {
		const page = Math.max(1, parseInt(req.query.page || '1', 10));
		const limit = Math.max(1, parseInt(req.query.limit || '50', 10));
		const skip = (page - 1) * limit;

		const [projects, total] = await Promise.all([
			Project.find()
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.select('title description category createdAt owner members')
				.populate('owner', 'nom prenom')
				.populate('members', 'nom prenom')
				.lean()
				.exec(),
			Project.countDocuments()
		]);

		res.json({ total, page, limit, projects });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get single project by id (lean + select)
// Get single project by id
exports.getProjectById = async (req, res) => {
	try {
		const project = await Project.findById(req.params.id)
			.populate('owner', 'nom prenom')
			.populate('members', 'nom prenom')
			.lean()
			.exec();

		if (!project) return res.status(404).json({ message: 'Project not found' });
		res.json(project);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Update project
// Update project
exports.modifierProject = async (req, res) => {
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
				if (membersRaw.length > 0 && resolved.length === 0) {
					return res.status(400).json({ message: 'Some members could not be resolved to users', unresolved });
				}
				updates.members = resolved;
		}

		if (updates.owner) {
			const ownerId = await resolveUserIdentifier(updates.owner);
			if (ownerId) updates.owner = ownerId;
			else return res.status(400).json({ message: 'Owner identifier could not be resolved to a user', owner: updates.owner });
		}

		const project = await Project.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
		if (!project) return res.status(404).json({ message: 'Project not found' });

		const populated = await Project.findById(project._id)
			.populate('owner', 'nom prenom')
			.populate('members', 'nom prenom')
			.lean()
			.exec();

		res.json(populated);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// Delete project
// Delete project
exports.deleteProject = async (req, res) => {
	try {
		const deleted = await Project.findByIdAndDelete(req.params.id);
		if (!deleted) return res.status(404).json({ message: 'Project not found' });
		res.status(200).json({ message: 'Project deleted successfully', project: deleted });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Delete all projects
exports.deleteAllProjects = async (req, res) => {
	try {
		const result = await Project.delete// ...existing code...
'use strict';

const mongoose = require('mongoose');
const Project = require('../models/Project');
const User = require('../models/User');

/**
 * Résout un identifiant utilisateur qui peut être :
 * - un ObjectId Mongo valide
 * - numeroEtudiant
 * - email
 * - "Nom Prenom" ou "Nom-Prenom"
 * Retourne l'_id si trouvé, sinon null.
 */
async function resolveUserIdentifier(identifier) {
    if (!identifier) return null;
    if (mongoose.isValidObjectId(identifier)) return identifier;

    let user = await User.findOne({ numeroEtudiant: identifier }).select('_id').lean();
    if (user) return user._id;

    user = await User.findOne({ email: identifier }).select('_id').lean();
    if (user) return user._id;

    const sep = identifier.includes('-') ? '-' : (identifier.includes(' ') ? ' ' : null);
    if (sep) {
        const parts = identifier.split(sep).map(s => s.trim()).filter(Boolean);
        if (parts.length >= 2) {
            const nom = parts[0];
            const prenom = parts[1];
            user = await User.findOne({ nom, prenom }).select('_id').lean();
            if (user) return user._id;
        }
    }

    return null;
}

/**
 * Normalise l'entrée members qui peut être :
 * - tableau
 * - JSON stringifié
 * - chaîne séparée par des virgules
 * - ou un seul identifiant (string)
 * Retourne toujours un tableau (possiblement vide).
 */
function normalizeMembersInput(members) {
    if (!members) return [];
    if (Array.isArray(members)) return members;
    if (typeof members === 'string') {
        try {
            const parsed = JSON.parse(members);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {
            // not JSON
        }
        return members.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [members];
}

/* Create project */
async function createProject(req, res) {
    try {
        const data = { ...req.body };

        // Validation minimale
        if (!data.title || !data.description || !data.category) {
            return res.status(400).json({ message: 'title, description and category are required' });
        }

        // Normaliser et résoudre les membres (ne bloque pas la création si certains ne sont pas résolus)
        const membersRaw = normalizeMembersInput(data.members);
        const membersResolved = [];
        const unresolved = [];
        for (const m of membersRaw) {
            const id = await resolveUserIdentifier(m);
            if (id) membersResolved.push(id);
            else unresolved.push(m);
        }
        data.members = membersResolved;
        if (unresolved.length) data.membersStrings = unresolved;

        // Résoudre owner si fourni (ne bloque pas la création si non résolu)
        if (data.owner) {
            const ownerId = await resolveUserIdentifier(data.owner);
            if (ownerId) data.owner = ownerId;
            else delete data.owner;
        }

        const project = new Project(data);
        await project.save();

        const result = await Project.findById(project._id)
            .populate('owner', 'nom prenom')
            .populate('members', 'nom prenom')
            .lean()
            .exec();

        return res.status(201).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

/* Get all projects (paginated) */
async function getAllProjects(req, res) {
    try {
        const page = Math.max(1, parseInt(req.query.page || '1', 10));
        const limit = Math.max(1, parseInt(req.query.limit || '50', 10));
        const skip = (page - 1) * limit;

        const [projects, total] = await Promise.all([
            Project.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('title description category createdAt owner members')
                .populate('owner', 'nom prenom')
                .populate('members', 'nom prenom')
                .lean()
                .exec(),
            Project.countDocuments()
        ]);

        return res.json({ total, page, limit, projects });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

/* Get single project by id */
async function getProjectById(req, res) {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'nom prenom')
            .populate('members', 'nom prenom')
            .lean()
            .exec();

        if (!project) return res.status(404).json({ message: 'Project not found' });
        return res.json(project);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

/* Update project */
async function modifierProject(req, res) {
    try {
        const updates = { ...req.body };

        // Mettre à jour les members si fournis (exige que au moins un soit résolu)
        if (updates.members) {
            const membersRaw = normalizeMembersInput(updates.members);
            const resolved = [];
            const unresolved = [];
            for (const m of membersRaw) {
                const id = await resolveUserIdentifier(m);
                if (id) resolved.push(id);
                else unresolved.push(m);
            }
            if (membersRaw.length > 0 && resolved.length === 0) {
                return res.status(400).json({ message: 'Some members could not be resolved to users', unresolved });
            }
            updates.members = resolved;
        }

        // Mettre à jour owner si fourni (doit être résolu)
        if (updates.owner) {
            const ownerId = await resolveUserIdentifier(updates.owner);
            if (ownerId) updates.owner = ownerId;
            else return res.status(400).json({ message: 'Owner identifier could not be resolved to a user', owner: updates.owner });
        }

        const project = await Project.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const populated = await Project.findById(project._id)
            .populate('owner', 'nom prenom')
            .populate('members', 'nom prenom')
            .lean()
            .exec();

        return res.json(populated);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

/* Delete project */
async function deleteProject(req, res) {
    try {
        const deleted = await Project.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Project not found' });
        return res.status(200).json({ message: 'Project deleted successfully', project: deleted });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

/* Delete all projects (admin) */
async function deleteAllProjects(req, res) {
    try {
        const result = await Project.deleteMany({});
        return res.status(200).json({ message: 'All projects deleted', deletedCount: result.deletedCount });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    resolveUserIdentifier,
    normalizeMembersInput,
    createProject,
    getAllProjects,
    getProjectById,
    modifierProject,
    deleteProject,
    deleteAllProjects
};
// ...existing code...Many({});
		res.status(200).json({ message: 'All projects deleted', deletedCount: result.deletedCount });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
