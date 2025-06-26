const express = require('express');
const router = express.Router();
const Evento = require('../models/Evento');
const { authMiddleware } = require('../middlewares/auth');
const upload = require('../config/multer'); // Importamos la configuración de Multer

router.get('/', async (req, res) => {
  try {
    const eventos = await Evento.find();

    // Asegurarnos de que la ruta de la imagen sea accesible desde el frontend
    const eventosConImagen = eventos.map((evento) => {
      if (evento.image) {
        // Corregir: Aseguramos que no haya duplicación de 'uploads/'
        if (!evento.image.startsWith('uploads/')) {
          evento.image = `uploads/${evento.image}`;
        }
        
        // Corregimos la ruta para asegurarnos de que solo haya una ocurrencia de 'uploads/'
        evento.image = `${process.env.BASE_URL || 'http://localhost:3000'}/uploads/${evento.image.replace(/\\/g, '/').replace(/^uploads\//, '')}`;
      }
      return evento;
    });

    res.status(200).json(eventosConImagen); // Devolvemos los eventos con la URL completa de las imágenes
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener eventos' });
  }
});

// Crear evento
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, description, date, location } = req.body;
  const image = req.file ? req.file.path.replace(/\\/g, '/') : null; // Reemplazamos las barras invertidas con barras normales

  // Verificar si el usuario tiene el rol correcto
  if (req.user.role !== "admin" && req.user.role !== "publicador") {
    return res.status(403).json({ message: "Acceso denegado" });
  }

  const newEvento = new Evento({ title, description, date, location, image });
  await newEvento.save();

  res.status(201).json({ message: "Evento publicado con éxito", evento: newEvento });
});


// Mostrar un evento por ID
router.get('/:id', async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Asegurándonos de que la ruta de la imagen sea correcta
    if (evento.image) {
      // Corregimos el problema de duplicación de 'uploads/'
      if (!evento.image.startsWith('uploads/')) {
        evento.image = `uploads/${evento.image}`;
      }
      
      // Corregimos la URL de la imagen
      evento.image = `${process.env.BASE_URL || 'http://localhost:3000'}/uploads/${evento.image.replace(/\\/g, '/').replace(/^uploads\//, '')}`;
    }

    res.status(200).json(evento); // Devolvemos el evento con la URL completa de la imagen
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el evento' });
  }
});

// Modificar un evento existente (editar)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, description, date, location } = req.body;
  const image = req.file ? req.file.path.replace(/\\/g, '/') : null; // Guardar la ruta de la nueva imagen si se sube

  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Asegurarse de que el usuario tiene el rol correcto para editar
    if (req.user.role !== "admin" && req.user.role !== "publicador") {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    // Actualizar el evento
    evento.title = title || evento.title;
    evento.description = description || evento.description;
    evento.date = date || evento.date;
    evento.location = location || evento.location;
    if (image) evento.image = image; // Solo si hay una nueva imagen, actualizarla

    await evento.save();

    res.status(200).json({ message: 'Evento actualizado con éxito', evento });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el evento' });
  }
});

// Eliminar un evento
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const evento = await Evento.findByIdAndDelete(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Asegurarse de que el usuario tiene el rol correcto para eliminar
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    res.status(200).json({ message: 'Evento eliminado con éxito' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el evento' });
  }
});

module.exports = router;
