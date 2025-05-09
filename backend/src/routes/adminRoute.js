const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const adminController = require('../controllers/adminController');

function safeHandler(handlerName) {
  const fn = adminController[handlerName];
  if (typeof fn !== 'function') {
    return (req, res) => {
      res.status(501).json({ error: `Handler '${handlerName}' belum diimplementasikan.` });
    };
  }
  return fn;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Rute Dashboard
router.get('/dashboard', safeHandler('getDashboardSummary'));
router.get('/dashboard/buang-sampah', safeHandler('getBuangSampahClass'));
router.post('/dashboard/buang-sampah', safeHandler('saveBuangSampahClass'));

// Rute Dashboard Parkiran
router.get('/dashboard/parkiran', safeHandler('getParkiranAssignments'));
router.post('/dashboard/parkiran', safeHandler('addParkiranAssignment'));
router.put('/dashboard/parkiran/:id', safeHandler('updateParkiranAssignment'));
router.delete('/dashboard/parkiran/:id', safeHandler('deleteParkiranAssignment'));

// Rute Dashboard Piket
router.get('/dashboard/piket', safeHandler('getPiketAssignments'));
router.post('/dashboard/piket', safeHandler('addPiketAssignment'));
router.put('/dashboard/piket/:id', safeHandler('updatePiketAssignment'));
router.delete('/dashboard/piket/:id', safeHandler('deletePiketAssignment'));

// Rute Dashboard Duta
router.get('/dashboard/duta', safeHandler('getDutaAssignments'));
router.post('/dashboard/duta', safeHandler('addDutaAssignment'));
router.put('/dashboard/duta/:id', safeHandler('updateDutaAssignment'));
router.delete('/dashboard/duta/:id', safeHandler('deleteDutaAssignment'));

// Rute Berita Admin
router.get('/news', safeHandler('getAllNews'));
router.post('/news', upload.single('image'), safeHandler('createNews'));
router.get('/news/:id', safeHandler('getNewsById'));
router.put('/news/:id', upload.single('image'), safeHandler('updateNews'));
router.delete('/news/:id', safeHandler('deleteNews'));

// Rute Pengumuman Admin
router.get('/announcements', safeHandler('getAllAnnouncements'));
router.post('/announcements', upload.single('image'), safeHandler('createAnnouncement'));
router.get('/announcements/:id', safeHandler('getAnnouncementById'));
router.put('/announcements/:id', upload.single('image'), safeHandler('updateAnnouncement'));
router.delete('/announcements/:id', safeHandler('deleteAnnouncement'));

// Rute Pesan Kontak Admin
router.get('/contact-messages', safeHandler('getAllContactMessages'));
router.delete('/contact-messages/:id', safeHandler('deleteContactMessage'));

module.exports = router;