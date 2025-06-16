const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  isGoogleUser: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["admin", "publicador", "usuario"],
    default: "usuario", // 👈 Por defecto los usuarios normales serán lectores
  },
});

module.exports = mongoose.model("User", userSchema);
