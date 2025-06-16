const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const exists = await User.findOne({ email: "admin@ecuador.ec" });
  if (exists) {
    console.log("El admin ya existe.");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = new User({
    name: "Admin Principal",
    email: "admin@ecuador.ec",
    password: hashedPassword,
    role: "admin",
    isGoogleUser: false,
  });

  await admin.save();
  console.log("✅ Admin creado con éxito");
  process.exit(0);
});
