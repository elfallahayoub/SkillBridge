const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middlewares/upload");

// Create user
router.post("/createUser", userController.createUser);

// Get all users
router.get("/getAllUsers", userController.getAllUsers);



router.put("/updateUser/:id",upload.single("photo"),userController.updateUser);
// Update user

//router.put("/modifierUser/:id", userController.modifierUser);

//login
router.post("/login", userController.loginUser);

router.put("/updateUser/:id", userController.updateUser);
// Delete user
router.delete("/deleteUser/:id", userController.deleteUser);

module.exports = router;
