const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const enrollmentController = require("../controllers/enrollmentController");

// Create project
router.post("/createProject", projectController.createProject);

// Get all projects
router.get("/getAllProjects", projectController.getAllProjects);

// Get project by id
router.get("/getProject/:id", projectController.getProjectById);

// Request to join a project
router.post("/:id/requestJoin", enrollmentController.requestToJoin);

// Accept enrollment
router.get("/enroll/accept/:token", enrollmentController.acceptEnrollment);

// Update project
router.put("/updateProject/:id", projectController.updateProject);

// Delete project
router.delete("/deleteProject/:id", projectController.deleteProject);

// Delete all projects
router.delete("/deleteAllProjects", projectController.deleteAllProjects);

module.exports = router;
