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
      required: false,
      default:"to_fill",
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
    specialite:{
      type: String,
      required : false,
      unique : false,
      default : "Ingenierie Logiciel"
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    numeroTele: {
      type: String,
      default:"0600000000",
      required: false
    },
    niveau: {
      type: String,
      required : false,
      default: "3eme annee"
    },
    university:{
      type : String,
      default: "ESISA"
    },
    photo: {
      type: String, 
      required : false,
      default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
