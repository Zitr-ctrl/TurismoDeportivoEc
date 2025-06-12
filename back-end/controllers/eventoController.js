const Evento = require('../models/Evento');

exports.getEventos = async (req, res) => {
  const eventos = await Evento.find();
  res.json(eventos);
};

exports.crearEvento = async (req, res) => {
  const nuevoEvento = new Evento(req.body);
  await nuevoEvento.save();
  res.status(201).json(nuevoEvento);
};
