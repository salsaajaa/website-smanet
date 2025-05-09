// backend/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const {
  submitContactForm,
  getAllContactMessages,
  markMessageAsRead,
  deleteMessage
} = require('../controllers/contactController'); // Import fungsi controller

// Import middleware autentikasi jika sudah ada (misalnya authMiddleware)
// const { protect, authorize } = require('../middleware/authMiddleware');

// Route untuk mengirim pesan kontak (publik)
// POST ke /api/contact
router.post('/', submitContactForm);

// Route untuk mengambil semua pesan kontak (untuk admin)
// GET ke /api/contact/admin
// Harusnya dilindungi dengan middleware autentikasi admin, contoh:
// router.get('/admin', protect, authorize('admin'), getAllContactMessages);
router.get('/admin', getAllContactMessages);

// Route untuk menandai pesan sebagai sudah dibaca (untuk admin)
// PUT ke /api/contact/:id/read
// Harusnya dilindungi: router.put('/:id/read', protect, authorize('admin'), markMessageAsRead);
router.put('/:id/read', markMessageAsRead);

// Route untuk menghapus pesan (untuk admin)
// DELETE ke /api/contact/:id
// Harusnya dilindungi: router.delete('/:id', protect, authorize('admin'), deleteMessage);
router.delete('/:id', deleteMessage); 
module.exports = router; // Export router
