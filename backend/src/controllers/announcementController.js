const announcementModel = require('../models/announcementModel'); // Pastikan path benar
const path = require('path');
const fs = require('fs');

// Helper untuk menghapus file (tetap sama)
const deleteFile = (filePath) => {
    // Pastikan filePath ada dan terlihat seperti path lokal sebelum mencoba menghapus
    if (filePath && typeof filePath === 'string' && filePath.startsWith('/uploads/')) {
        const fullPath = path.join(__dirname, '../../', filePath);
        fs.unlink(fullPath, (err) => {
            if (err) {
                // Log error jika file tidak bisa dihapus (misal: tidak ada, permission)
                console.error('Error deleting file:', fullPath, err);
            } else {
                console.log('File deleted successfully:', fullPath);
            }
        });
    } else {
        console.log('Skipping file deletion: Invalid or non-local path', filePath);
    }
};


const getAllAnnouncements = async (req, res) => {
    console.log('AnnouncementController: Menerima permintaan GET semua pengumuman');
    try {
        const announcements = await announcementModel.getAllAnnouncements();
        res.json(announcements);
    } catch (error) {
        console.error('AnnouncementController: Error saat ambil semua pengumuman:', error);
        res.status(500).json({ message: 'Gagal mengambil daftar pengumuman', error: error.message });
    }
};

const getAnnouncementById = async (req, res) => {
    const announcementId = req.params.id;
    console.log(`AnnouncementController: Menerima permintaan GET pengumuman ID: ${announcementId}`);
    try {
        const announcementItem = await announcementModel.getAnnouncementById(announcementId);
        if (announcementItem) {
            res.json(announcementItem);
        } else {
            res.status(404).json({ message: 'Pengumuman tidak ditemukan' });
        }
    } catch (error) {
        console.error(`AnnouncementController: Error saat ambil pengumuman ID ${announcementId}:`, error);
        res.status(500).json({ message: 'Gagal mengambil detail pengumuman', error: error.message });
    }
};

const createAnnouncement = async (req, res) => {
     console.log('AnnouncementController: Menerima permintaan POST pengumuman baru');
     console.log('AnnouncementController: Req.body:', req.body);
     console.log('AnnouncementController: Req.file:', req.file);

    try {
        const announcementData = {
            title: req.body.title,
            content: req.body.content,
            author_id: req.body.author_id || null,
            published_at: req.body.published_at || null,
            status: req.body.status || 'draft',
            image_url: req.file ? `/uploads/${req.file.filename}` : null
            // Hapus properti slug di sini jika ada sebelumnya
        };

        const result = await announcementModel.createAnnouncement(announcementData);
        res.status(201).json({
            message: 'Pengumuman berhasil dibuat',
            id: result.id,
            // Hapus slug dari respons sukses
            // slug: result.slug,
            image_url: announcementData.image_url
        });

    } catch (error) {
        console.error('AnnouncementController: Error saat membuat pengumuman baru:', error);

         if (req.file) {
            const filePath = path.join(__dirname, '../../uploads', req.file.filename);
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) console.error('AnnouncementController: Gagal menghapus file setelah error database:', filePath, unlinkErr);
                else console.log('AnnouncementController: File berhasil dihapus setelah error database:', filePath);
            });
         }

        res.status(500).json({ message: 'Gagal membuat pengumuman', error: error.message });
    }
};

const updateAnnouncement = async (req, res) => {
    const announcementId = req.params.id;
     console.log(`AnnouncementController: Menerima permintaan PUT pengumuman ID: ${announcementId}`);
     console.log('AnnouncementController: Req.body:', req.body);
     console.log('AnnouncementController: Req.file:', req.file);

    try {
        const announcementData = {
            title: req.body.title,
            content: req.body.content,
            author_id: req.body.author_id || null,
            published_at: req.body.published_at || null,
            status: req.body.status || 'draft',
            image_url: req.body.image_url !== undefined ? req.body.image_url : (req.file ? `/uploads/${req.file.filename}` : undefined)
             // Hapus properti slug di sini jika ada sebelumnya
        };

         if (announcementData.image_url === undefined && !req.file && req.body.image_url === undefined) {
             delete announcementData.image_url;
         }


        const result = await announcementModel.updateAnnouncement(announcementId, announcementData);

        res.json({
            message: 'Pengumuman berhasil diupdate',
            id: result.id,
            // Hapus slug dari respons sukses
            // slug: result.slug,
            image_url: announcementData.image_url
        });

    } catch (error) {
        console.error(`AnnouncementController: Error saat mengupdate pengumuman ID ${announcementId}:`, error);

         if (req.file) {
            const filePath = path.join(__dirname, '../../uploads', req.file.filename);
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) console.error('AnnouncementController: Gagal menghapus file baru setelah error database saat update:', filePath, unlinkErr);
                else console.log('AnnouncementController: File baru berhasil dihapus setelah error database saat update:', filePath);
            });
         }

        res.status(500).json({ message: 'Gagal mengupdate pengumuman', error: error.message });
    }
};

const deleteAnnouncement = async (req, res) => {
    const announcementId = req.params.id;
    console.log(`AnnouncementController: Menerima permintaan DELETE pengumuman ID: ${announcementId}`);
    try {
        const affectedRows = await announcementModel.deleteAnnouncement(announcementId);
        if (affectedRows > 0) {
            res.json({ message: 'Pengumuman berhasil dihapus' });
        } else {
            res.status(404).json({ message: 'Pengumuman tidak ditemukan' });
        }
    } catch (error) {
        console.error(`AnnouncementController: Error saat menghapus pengumuman ID ${announcementId}:`, error);
        res.status(500).json({ message: 'Gagal menghapus pengumuman', error: error.message });
    }
};

// Di file controller pengumuman ini, tidak ada fungsi terpisah untuk mengambil pengumuman publik
// seperti getNewsByIdPublic di newsController. Ini berarti tidak ada route publik
// spesifik untuk pengumuman berdasarkan slug yang perlu dihapus dari sisi controller.


module.exports = {
    getAllAnnouncements,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    // Tidak ada fungsi publik terkait slug di sini, jadi ekspor tetap sama
};