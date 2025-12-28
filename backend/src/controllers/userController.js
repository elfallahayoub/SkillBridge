const User = require("../models/User");

// ✅ Create user
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Get all users
exports.getAllUsers = async (req, res) => {
  try {
    console.log("DELETE ID:", req.params.id);

    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update (modifier) user
exports.modifierUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Delete user
exports.deleteUser = async (req, res) => {
  try {
    console.log("DELETE ID:", req.params.id);

    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: error.message
    });
  }
};
