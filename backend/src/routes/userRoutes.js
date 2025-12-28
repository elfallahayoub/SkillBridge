const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Create user
router.post("/createUser", userController.createUser);

// Get all users
router.get("/getAllUsers", userController.getAllUsers);

// Update user
router.put("/modifierUser/:id", userController.modifierUser);



// Delete user
router.delete("/deleteUser/:id", userController.deleteUser);

module.exports = router;
