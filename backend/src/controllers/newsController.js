// backend/src/controllers/newsController.js
const newsModel = require('../models/newsModel');
const path = require('path');
const fs = require('fs');

// Helper untuk menghapus file (lebih aman)
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


// --- Admin News Controllers ---
const getAllNews = async (req, res) => {
    try {
        const news = await newsModel.getAllNews();
        res.json(news);
    } catch (error) {
        console.error('NewsController (Admin): Error fetching all news:', error);
        res.status(500).json({ message: 'Failed to fetch news list', error: error.message });
    }
};

const createNews = async (req, res) => {
    console.log('NewsController (Admin): Menerima permintaan POST berita baru');
    console.log('NewsController (Admin): Req.body:', req.body);
    console.log('NewsController (Admin): Req.file:', req.file);

    try {
        const status = req.body.status || 'draft'; // Default status draft jika tidak dikirim
        let published_at = null; // Default published_at adalah null

        // Jika status yang dikirim adalah 'published' DAN tanggal publikasi disediakan dari frontend
        if (status === 'published' && req.body.published_at) {
             published_at = req.body.published_at; // Gunakan tanggal dari frontend
        } else if (status === 'published' && !req.body.published_at) {
             // Jika status published tapi tanggal tidak disediakan, gunakan tanggal dan waktu saat ini
             published_at = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format-MM-DD HH:mm:ss untuk MySQL DATETIME
        }
        // Jika status adalah 'draft', published_at tetap null, ini sudah benar.


        const newsData = {
            title: req.body.title,
            author: req.body.author || null, // <-- PERBAIKAN DI SINI: Pastikan null jika undefined
            slug: req.body.slug || null, // Slug bisa opsional, model akan generate jika null
            content: req.body.content,
            published_at: published_at, // Gunakan nilai published_at yang sudah diproses
            status: status, // Gunakan nilai status yang sudah diproses
            image_url: req.file ? `/uploads/${req.file.filename}` : null // Path gambar dari multer
        };

        console.log('NewsController (Admin): Prepared newsData for model:', newsData); // Log newsData sebelum ke model

        const result = await newsModel.createNews(newsData);
        res.status(201).json({
            message: 'News added successfully',
            id: result.insertId,
            image_url: newsData.image_url
        });

    } catch (error) {
        console.error('NewsController (Admin): Error creating news:', error);

         // Hapus file yang baru diupload jika terjadi error database
         if (req.file) {
            const filePath = req.file.path; // Path lengkap dari multer
            deleteFile(filePath); // Gunakan fungsi deleteFile
         }

        res.status(500).json({ message: 'Failed to add news', error: error.message });
    }
};

const getNewsById = async (req, res) => {
    const newsId = req.params.id;
    console.log(`NewsController (Admin): Menerima permintaan GET berita ID: ${newsId}`);
    try {
        const newsItem = await newsModel.getNewsById(newsId);
        if (newsItem) {
            res.json(newsItem);
        } else {
            res.status(404).json({ message: 'News not found' });
        }
    } catch (error) {
        console.error(`NewsController (Admin): Error fetching news ID ${newsId}:`, error);
        res.status(500).json({ message: 'Failed to fetch news details', error: error.message });
    }
};

const updateNews = async (req, res) => {
    const newsId = req.params.id;
    console.log(`NewsController (Admin): Menerima permintaan PUT berita ID: ${newsId}`);
    console.log('NewsController (Admin): Req.body:', req.body);
    console.log('NewsController (Admin): Req.file:', req.file);

    try {
        // Ambil data berita yang sudah ada untuk cek gambar lama
        const existingNews = await newsModel.getNewsById(newsId);
        if (!existingNews) {
            // Jika berita tidak ditemukan, hapus file baru jika ada dan kirim 404
            if (req.file) {
                deleteFile(req.file.path); // Gunakan fungsi deleteFile
            }
            return res.status(404).json({ message: 'News not found' });
        }

        // Proses status dan published_at untuk update
        const newStatus = req.body.status || existingNews.status; // Gunakan status dari body, default ke status lama
        let published_at = existingNews.published_at; // Mulai dengan tanggal publikasi yang sudah ada

        // Jika status baru adalah 'published'
        if (newStatus === 'published') {
             // Jika tanggal publikasi baru disediakan dari frontend, gunakan itu
             if (req.body.published_at) {
                 published_at = req.body.published_at;
             } else if (existingNews.status !== 'published') {
                 // Jika status berubah dari non-published ke published TAPI tanggal tidak disediakan, gunakan tanggal/waktu saat ini
                  published_at = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format-MM-DD HH:mm:ss
             }
             // Jika status tetap 'published' dan tanggal tidak disediakan, published_at tetap menggunakan nilai existingNews.published_at
        } else { // Jika status baru adalah 'draft' atau lainnya (non-published)
             published_at = null; // Set published_at menjadi null
        }


        const newsData = {
            title: req.body.title,
            author: req.body.author || null, // <-- PERBAIKAN DI SINI: Pastikan null jika undefined
            slug: req.body.slug || null, // Slug bisa diupdate atau null
            content: req.body.content,
            published_at: published_at, // Gunakan nilai published_at yang sudah diproses
            status: newStatus, // Gunakan nilai status yang sudah diproses
        };

        // Logika penanganan gambar:
        if (req.file) {
            // Jika ada file baru diupload
            newsData.image_url = `/uploads/${req.file.filename}`;
            // Hapus gambar lama jika ada dan berbeda dengan yang baru
            if (existingNews.image_url && existingNews.image_url !== newsData.image_url) {
                 deleteFile(existingNews.image_url); // Gunakan fungsi deleteFile dengan path URL
            }
        } else if (req.body.delete_image === 'true') {
             // Jika ada flag delete_image dari frontend (saat tombol hapus gambar diklik)
             newsData.image_url = null; // Set image_url jadi null di database
             // Hapus file gambar lama jika ada
             if (existingNews.image_url) {
                 deleteFile(existingNews.image_url); // Gunakan fungsi deleteFile dengan path URL
             }
        } else {
            // Jika tidak ada file baru dan tidak ada permintaan hapus,
            // JANGAN tambahkan image_url ke newsData agar tidak mengupdate kolom image_url di DB
            // dengan nilai undefined atau null yang salah.
            // Model akan menggunakan nilai lama jika image_url tidak ada di newsData.
        }
        // Log newsData sebelum ke model
        console.log('NewsController (Admin): Prepared newsData for model:', newsData);

        // Panggil model untuk melakukan update
        const result = await newsModel.updateNews(newsId, newsData);

        res.json({
            message: 'News updated successfully',
        });

    } catch (error) {
        console.error(`NewsController (Admin): Error updating news ID ${newsId}:`, error);

         // Hapus file yang baru diupload jika terjadi error database saat update
         if (req.file) {
            const filePath = req.file.path; // Path lengkap dari multer
            deleteFile(filePath); // Gunakan fungsi deleteFile
         }

        res.status(500).json({ message: 'Failed to update news', error: error.message });
    }
};

const deleteNews = async (req, res) => {
    const newsId = req.params.id;
    console.log(`NewsController (Admin): Menerima permintaan DELETE berita ID: ${newsId}`);
    try {
        // Ambil data berita yang sudah ada untuk hapus file gambar
        const existingNews = await newsModel.getNewsById(newsId);

        if (!existingNews) {
            return res.status(404).json({ message: 'News not found' });
        }

        // Hapus file gambar jika ada
        if (existingNews.image_url) {
            deleteFile(existingNews.image_url); // Gunakan fungsi deleteFile dengan path URL
        }

        // Hapus data berita dari database
        const result = await newsModel.deleteNews(newsId);
        res.json({ message: 'News deleted successfully', result: result });
    } catch (error) {
        console.error(`NewsController (Admin): Error deleting news ID ${newsId}:`, error);
        res.status(500).json({ message: 'Failed to delete news', error: error.message });
    }
};

// --- Public News Controllers ---
// Fungsi untuk mengambil SEMUA berita yang dipublikasikan
const getAllNewsPublic = async (req, res) => {
    try {
        // Memanggil model yang hanya mengambil berita 'published'
        const news = await newsModel.getAllPublishedNews();
        res.json(news);
    } catch (error) {
        console.error('NewsController (Public): Error fetching all published news:', error);
        res.status(500).json({ message: 'Failed to fetch published news list', error: error.message });
    }
};

// Fungsi untuk mengambil berita publik berdasarkan ID atau Slug
const getNewsByIdPublic = async (req, res) => {
    // Identifier bisa berupa ID angka atau Slug string dari route params
    const identifier = req.params.identifier; // Nama parameter di route adalah 'identifier'
    console.log(`NewsController (Public): Menerima permintaan GET berita publik identifier: ${identifier}`);
    try {
        // Memanggil model yang bisa mencari berdasarkan ID atau Slug dan status 'published'
        const newsItem = await newsModel.getPublishedNewsByIdOrSlug(identifier); // Menggunakan fungsi model yang diperbaiki

        if (newsItem) {
            res.json(newsItem);
        } else {
            res.status(404).json({ message: 'Published news not found' });
        }
    } catch (error) {
        console.error(`NewsController (Public): Error fetching published news identifier ${identifier}:`, error);
        res.status(500).json({ message: 'Gagal mengambil detail berita publik', error: error.message });
    }
};


module.exports = {
    getAllNews,
    createNews,
    getNewsById,
    updateNews,
    deleteNews,
    getAllNewsPublic,
    getNewsByIdPublic,
};
