// backend/src/routes/announcementRoute.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); // Import controller yang sesuai

// Rute untuk mendapatkan semua pengumuman
router.get('/', adminController.getAllAnnouncements);

// Rute untuk membuat pengumuman baru
router.post('/', adminController.createAnnouncement);

// Rute untuk mendapatkan pengumuman berdasarkan ID
router.get('/:id', adminController.getAnnouncementById);

// Rute untuk memperbarui pengumuman berdasarkan ID
router.put('/:id', adminController.updateAnnouncement);

// Rute untuk menghapus pengumuman berdasarkan ID
router.delete('/:id', adminController.deleteAnnouncement);

module.exports = router;