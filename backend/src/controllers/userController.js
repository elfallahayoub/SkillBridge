const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ✅ Create user 
exports.createUser = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      password,
      numeroTele,
      specialite,
      niveau,
      numeroEtudiant,
      photo
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      nom,
      prenom,
      email,
      password: hashedPassword,
      numeroTele,
      specialite,
      niveau,
      numeroEtudiant,
      photo // optionnel
    });

    await user.save();

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      message: "User created",
      user: userWithoutPassword
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// ✅ Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

  //update 
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nom,
      prenom,
      numeroTele,
      specialite,
      niveau,
      photo,
      numeroEtudiant
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        nom,
        prenom,
        numeroTele,
        specialite,
        niveau,
        photo,
        numeroEtudiant
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      message: "Profil mis à jour avec succès",
      user: updatedUser
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
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


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
