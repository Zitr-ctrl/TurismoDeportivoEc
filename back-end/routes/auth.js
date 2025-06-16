const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const { authMiddleware } = require("../middlewares/auth");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔒 Crear token JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// ✅ Crear usuario
router.post("/register", authMiddleware, async (req, res) => {
  const { name, email, password, role } = req.body;

  // Solo admins pueden acceder a esta ruta
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({
        message:
          "Acceso denegado: solo los administradores pueden crear usuarios",
      });
  }

  // Solo se permiten crear usuarios con rol admin o publicador
  if (!["admin", "publicador"].includes(role)) {
    return res
      .status(400)
      .json({
        message: "Solo se pueden crear usuarios con rol admin o publicador",
      });
  }

  // Validar duplicidad
  const existe = await User.findOne({ email });
  if (existe)
    return res.status(400).json({ message: "El correo ya está registrado" });

  // Crear el nuevo usuario
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });

  await newUser.save();
  res
    .status(201)
    .json({ message: "Usuario creado correctamente", userId: newUser._id });
});

// ✅ Login tradicional
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.password) {
    return res.status(400).json({ message: "Usuario no válido" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Contraseña incorrecta" });

  const token = generateToken(user);
  res.json({ token });
});

// ✅ Login con Google OAuth
router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name,
        isGoogleUser: true,
        role: "usuario", // 👈 por defecto
      });
      await user.save();
    }

    const jwtToken = generateToken(user);
    res.json({ token: jwtToken });
  } catch (error) {
    console.error("Error al verificar token de Google:", error);
    res.status(500).json({ message: "Error al procesar login con Google" });
  }
});

// ✅ Obtener todos los usuarios (solo admin)
router.get("/users", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({
        message: "Solo los administradores pueden ver esta información",
      });
  }

  const users = await User.find({}, "-password");
  res.json(users);
});

module.exports = router;
