// config/multer.js
const multer = require('multer');
const path = require('path');

// Configuración de Multer para guardar archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Guardar en la carpeta 'uploads'
  },
  filename: (req, file, cb) => {
    // Usamos un nombre de archivo basado en el ID del evento o un sufijo único
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const eventId = req.body.eventId || uniqueSuffix; // Usar el ID del evento si está disponible, de lo contrario, usar un sufijo único
    const fileName = `evento-${eventId}${path.extname(file.originalname)}`; // Nombre simple sin barras invertidas
    cb(null, fileName); // Ejemplo: evento-1750291135613-267573769.jpeg
  }
});

// Aceptar solo imágenes con extensión .jpg, .jpeg, .png
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Máximo 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes JPG, JPEG o PNG.'));
  }
});

module.exports = upload;
