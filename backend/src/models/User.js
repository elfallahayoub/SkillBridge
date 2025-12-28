const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true
    },
    prenom: {
      type: String,
      required: true,
      trim: true
    },
    numeroEtudiant: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, "Email invalide"]
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    numeroTele: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
