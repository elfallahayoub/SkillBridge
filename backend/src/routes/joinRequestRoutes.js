const express = require("express");
const router = express.Router();
const controller = require("../controllers/joinRequestController");

router.post("/", controller.createRequest);
router.get("/owner/:ownerId", controller.getOwnerRequests);
router.put("/:id/accept", controller.acceptRequest);
router.put("/:id/reject", controller.rejectRequest);

module.exports = router;
