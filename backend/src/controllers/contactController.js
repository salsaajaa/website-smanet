// backend/controllers/contactController.js
const contactMessageModel = require('../models/contactMessageModel');

// Fungsi submitContactForm - Subjek Dihapus
const submitContactForm = async (req, res) => {
  try {
    // Hapus 'subject' dari destructuring
    const { name, email, message } = req.body;
    // Baris const subject = req.body.subject || null; tidak perlu lagi

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Nama, email, dan pesan harus diisi.' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return res.status(400).json({ success: false, message: 'Format email tidak valid.' });
    }

    // Panggil fungsi model tanpa parameter subject
    const newContactMessage = await contactMessageModel.createContactMessage(name, email, message); // Hapus subject

    console.log('Pesan kontak berhasil disimpan via SQL:', newContactMessage);

    res.status(201).json({
      success: true,
      message: 'Pesan Anda berhasil terkirim!',
      data: newContactMessage
    });

  } catch (error) {
    console.error('Error submitting contact form:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Gagal mengirim pesan. Mohon coba lagi.',
      error: error
    });
  }
};

const getAllContactMessages = async (req, res) => {
  try {
    const messages = await contactMessageModel.getAllContactMessages();
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages // Kirim data yang sudah diproses dari model
    });

  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil pesan kontak.',
      error: error
    });
  }
};

// Fungsi markMessageAsRead - Perbaiki Logika Respon Berdasarkan Hasil Model
const markMessageAsRead = async (req, res) => {
  try {
    const messageId = req.params.id;

    // Panggil fungsi UPDATE di model SQL dan terima hasilnya
    const result = await contactMessageModel.markMessageAsReadInDb(messageId); // Panggil fungsi model

    // Periksa apakah baris benar-benar terupdate di DB
    if (result && result.affectedRows > 0) {
        // Ambil ulang pesan yang diupdate untuk respon agar frontend dapat data terbaru (opsional tapi disarankan)
        // Atau jika tidak ingin fetch ulang 1 pesan, frontend bisa panggil fetchAllMessages lagi
        // Contoh sederhana: Kirim respon sukses tanpa data objek lengkap, frontend akan memanggil fetchAllMessages
        res.status(200).json({
            success: true,
            message: 'Pesan berhasil ditandai sudah dibaca.',
        });

    } else {
        // Jika 0 baris terpengaruh, mungkin pesan tidak ditemukan atau sudah dibaca
         return res.status(404).json({
            success: false,
            message: `Pesan dengan ID ${messageId} tidak ditemukan atau statusnya sudah 'sudah dibaca'.`
        });
    }

  } catch (error) {
    console.error(`Error marking message ${req.params.id} as read:`, error);
    res.status(500).json({
      success: false,
      message: 'Gagal menandai pesan sudah dibaca: ' + (error.message || 'Terjadi kesalahan'),
      error: error
    });
  }
};

// Fungsi deleteMessage - Perbaiki Logika Respon Berdasarkan Hasil Model
const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;

    // Panggil fungsi DELETE di model SQL dan terima hasilnya
    const result = await contactMessageModel.deleteContactMessageInDb(messageId); // Panggil fungsi model

    // Periksa apakah baris benar-benar terhapus di DB
    if (result && result.affectedRows > 0) {
        res.status(200).json({
            success: true,
            message: 'Pesan berhasil dihapus.',
            data: {} // Data kosong untuk operasi hapus
        });
    } else {
         // Jika 0 baris terpengaruh, pesan tidak ditemukan
         return res.status(404).json({
            success: false,
            message: `Pesan dengan ID ${messageId} tidak ditemukan.`
        });
    }

  } catch (error) {
    console.error(`Error deleting message ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus pesan: ' + (error.message || 'Terjadi kesalahan'),
      error: error
    });
  }
};

module.exports = {
  submitContactForm,
  getAllContactMessages,
  markMessageAsRead,
  deleteMessage
};