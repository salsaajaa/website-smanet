// src/routes/uploadRoute.js

const express = require('express');
const router = express.Router();

// Import controller upload yang sudah kita buat
// Pastikan path require ini benar relatif dari src/routes ke src/controllers
const uploadController = require('../controllers/uploadController');


// --- DEFINISI RUTE UNTUK UPLOAD FILE ---

// Rute POST untuk menerima upload gambar
// Path ini akan menjadi '/api/upload/image' ketika ditautkan di index.js
// uploadController.uploadMiddleware adalah middleware Multer (upload.single('image'))
// uploadController.uploadImage adalah handler controller setelah file disimpan Multer
router.post('/image',
    uploadController.uploadMiddleware, 
    uploadController.uploadImage      
);

// --- Anda bisa tambahkan rute upload lain di sini jika perlu ---
// Contoh: upload multiple files, upload untuk jenis file lain, dll.


// --- EXPORT ROUTER ---
module.exports = router;