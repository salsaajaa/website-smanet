const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController'); // Import newsController
const authMiddleware = require('../middleware/authMiddleware'); // <-- PASTIKAN PATH INI BENAR
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfigurasi Multer (tetap sama)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating upload directory:', err);
        return cb(err, null);
      }
      cb(null, uploadPath);
    });
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    cb(null, true);
  } else {
    cb(new Error('Jenis file tidak didukung. Hanya gambar (JPG, JPEG, PNG, GIF) yang diizinkan.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


// --- Public News Routes ---
// Route publik tidak memerlukan autentikasi.
// Definikan route publik di sini, SEBELUM router.use(authMiddleware)

// GET semua berita untuk halaman publik (Ini akan menjadi GET /api/news karena router dipasang di '/api/news' di index.js)
// Panggil newsController.getAllNewsPublic untuk route ini
router.get('/', newsController.getAllNewsPublic); // <-- Panggil controller publik di sini

// GET berita berdasarkan ID atau Slug untuk halaman publik (Ini akan menjadi GET /api/news/:identifier)
// Panggil newsController.getNewsByIdPublic untuk route ini
router.get('/:identifier', newsController.getNewsByIdPublic); // <-- Panggil controller publik di sini


// --- Admin News Routes ---
// Route di bawah ini memerlukan autentikasi
router.use(authMiddleware); // Terapkan middleware auth di sini

// GET berita berdasarkan ID (untuk form edit admin) - Ini akan menjadi GET /api/news/:id
// Karena authMiddleware sudah diterapkan, ini hanya bisa diakses setelah login admin
// Ini adalah route yang berbeda dari GET /:identifier di atas karena ini untuk ADMIN
// Jadi pastikan frontend admin memanggil endpoint yang benar (misalnya GET /api/news/:id dengan token)
router.get('/:id', newsController.getNewsById); // <-- Controller admin tetap di sini


// POST berita baru (dengan upload gambar) - Ini akan menjadi POST /api/news
router.post('/', upload.single('image'), newsController.createNews);

// PUT update berita berdasarkan ID (dengan upload gambar opsional) - Ini akan menjadi PUT /api/news/:id
router.put('/:id', upload.single('image'), newsController.updateNews);

// DELETE berita berdasarkan ID - Ini akan menjadi DELETE /api/news/:id
router.delete('/:id', newsController.deleteNews);


module.exports = router;