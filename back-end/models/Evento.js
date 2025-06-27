const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  image: String, // Ruta a la imagen guardada
  lat: Number, // Latitud
  lng: Number, // Longitud
}, { timestamps: true });

module.exports = mongoose.model('Evento', eventoSchema);
