const mongoose = require('mongoose');

const EventoSchema = new mongoose.Schema({
  nombre: String,
  fecha: Date,
  lugar: String,
  descripcion: String,
  tipo: String, // ciclismo, triatlón, senderismo
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Evento', EventoSchema);
