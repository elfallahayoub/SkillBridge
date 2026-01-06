const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const enrollmentController = require("../controllers/enrollmentController");

function ensureHandler(fn, name) {
	if (typeof fn !== 'function') {
		throw new TypeError(`Route handler for ${name} is not a function`);
	}
	return fn;
}

router.post("/createProject", ensureHandler(projectController.createProject, 'createProject'));
router.post(":id/requestJoin", ensureHandler(enrollmentController.requestToJoin, 'requestToJoin'));
router.get("/getAllProjects", ensureHandler(projectController.getAllProjects, 'getAllProjects'));
router.get("/getProject/:id", ensureHandler(projectController.getProjectById, 'getProjectById'));
router.get("/enroll/accept/:token", ensureHandler(enrollmentController.acceptEnrollment, 'acceptEnrollment'));
router.put("/:id", ensureHandler(projectController.updateProject, 'updateProject'));
router.delete("/deleteProject/:id", ensureHandler(projectController.deleteProject, 'deleteProject'));
router.delete("/deleteAllProjects", ensureHandler(projectController.deleteAllProjects, 'deleteAllProjects'));

module.exports = router;
