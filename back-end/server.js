const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const eventoRoutes = require('./routes/eventoRoutes');
const authRoutes = require('./routes/auth.js');

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);

// Rutas
app.use('/api/eventos', eventoRoutes);

// Ruta básica
app.get('/', (req, res) => {
  res.send('Bienvenido a la Plataforma de Turismo Deportivo en Ecuador');
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
