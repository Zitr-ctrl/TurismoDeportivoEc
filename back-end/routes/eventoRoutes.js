const express = require('express');
const router = express.Router();
const Evento = require('../models/Evento');
const { authMiddleware } = require('../middlewares/auth');
const upload = require('../config/multer'); // Importamos la configuración de Multer
const axios = require('axios'); // Para hacer la solicitud HTTP a la API de Geocoding

// Crear evento
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, description, date, location } = req.body;
  const image = req.file ? req.file.path.replace(/\\/g, '/') : null; // Reemplazamos las barras invertidas con barras normales

  // Verificar si el usuario tiene el rol correcto
  if (req.user.role !== "admin" && req.user.role !== "publicador") {
    return res.status(403).json({ message: "Acco de denegado" });
  }

  // Usar la API de Geocoding de Google para obtener las coordenadas de la ubicación
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&region=EC&key=AIzaSyDsrWTJEfxG_Njk_GQjSaKPUGSRTwr6sK8`;

  try {
    const response = await axios.get(geocodeUrl);

    // Imprimir la respuesta completa de la API para depuración
    console.log("Respuesta de la API de Geocoding: ", response.data);

    const locationData = response.data.results[0];

    // Verificar si la API devolvió resultados
    if (locationData) {
      const lat = locationData.geometry.location.lat;
      const lng = locationData.geometry.location.lng;

      // Imprimir las coordenadas para verificar que se obtienen correctamente
      console.log("Coordenadas obtenidas para el evento: lat =", lat, ", lng =", lng);

      // Crear el nuevo evento con latitud y longitud
      const newEvento = new Evento({
        title,
        description,
        date,
        location,
        image,
        lat, // Guardar latitud
        lng, // Guardar longitud
      });

      // Verificar los datos antes de guardar
      console.log("Evento a guardar: ", newEvento);

      await newEvento.save();

      res.status(201).json({ message: "Evento publicado con éxito", evento: newEvento });
    } else {
      res.status(400).json({ message: "No se pudo obtener las coordenadas para la ubicación proporcionada" });
    }
  } catch (error) {
    console.error("Error al obtener las coordenadas:", error.message); // Imprimir detalles del error
    res.status(500).json({ message: "Error al obtener las coordenadas", error: error.message });
  }
});

// Mostrar eventos
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

// Mostrar un evento por ID
router.get('/:id', async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Asegurándonos de que la ruta de la imagen sea correcta
    if (evento.image) {
      if (!evento.image.startsWith('uploads/')) {
        evento.image = `uploads/${evento.image}`;
      }
      
      // Corregimos la URL de la imagen
      evento.image = `${process.env.BASE_URL || 'http://localhost:3000'}/uploads/${evento.image.replace(/\\/g, '/').replace(/^uploads\//, '')}`;
    }

    res.status(200).json(evento); // Devolvemos el evento con la URL completa de las imágenes
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
