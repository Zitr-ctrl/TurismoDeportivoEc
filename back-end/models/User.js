const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Solo para usuarios tradicionales
  isGoogleUser: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
