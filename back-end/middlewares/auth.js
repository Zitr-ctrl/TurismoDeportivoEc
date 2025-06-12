const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔒 Crear token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// ✅ Registro tradicional
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const existe = await User.findOne({ email });
  if (existe) return res.status(400).json({ message: 'El correo ya está registrado' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });

  await newUser.save();
  const token = generateToken(newUser);
  res.status(201).json({ token });
});

// ✅ Login tradicional
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.password) return res.status(400).json({ message: 'Usuario no válido' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Contraseña incorrecta' });

  const token = generateToken(user);
  res.json({ token });
});

// ✅ Login con Google OAuth
router.post('/google', async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { email, name } = ticket.getPayload();
  let user = await User.findOne({ email });

  if (!user) {
    user = new User({ email, name, isGoogleUser: true });
    await user.save();
  }

  const jwtToken = generateToken(user);
  res.json({ token: jwtToken });
});

module.exports = router;
