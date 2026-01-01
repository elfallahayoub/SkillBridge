const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

router.post("/createProject", projectController.createProject);
router.get("/getAllProjects", projectController.getAllProjects);
router.get("/getProject/:id", projectController.getProjectById);
router.put("/modifierProject/:id", projectController.modifierProject);
router.delete("/deleteProject/:id", projectController.deleteProject);
router.delete("/deleteAllProjects", projectController.deleteAllProjects);

module.exports = router;
