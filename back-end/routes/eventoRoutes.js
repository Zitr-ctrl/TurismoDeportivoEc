const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');

router.get('/', eventoController.getEventos);
router.post('/', eventoController.crearEvento);

module.exports = router;
