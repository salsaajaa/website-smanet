// backend/src/models/announcementModel.js
const db = require('../config/db');
// Hapus import slugify jika ada (di kode Anda tidak ada)
// const slugify = require('slugify');

// Fungsi untuk mengambil SEMUA pengumuman (untuk admin)
const getAllAnnouncements = async () => {
    console.log('AnnouncementModel: Fetching all announcements...');
    try {
        // Hapus kolom slug dari query SELECT
        const query = 'SELECT id, title, content, image_url, status, published_at, created_at, updated_at FROM announcements ORDER BY created_at DESC';
        const [rows] = await db.execute(query);
        console.log('AnnouncementModel: Found', rows.length, 'announcements.');
        return rows;
    } catch (error) {
        console.error('AnnouncementModel: Error fetching all announcements:', error);
        throw error;
    }
};

// Fungsi untuk mengambil pengumuman berdasarkan ID (untuk admin edit)
const getAnnouncementById = async (id) => {
    console.log(`AnnouncementModel: Fetching announcement item with ID ${id}.`);
    try {
        // Hapus kolom slug dari query SELECT
        const query = 'SELECT id, title, content, image_url, status, published_at, created_at, updated_at FROM announcements WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        console.log('AnnouncementModel: Found announcement item:', rows[0]);
        return rows[0];
    } catch (error) {
        console.error(`AnnouncementModel: Error fetching announcement item with ID ${id}:`, error);
        throw error;
    }
};

// Fungsi untuk mengambil pengumuman PUBLIK berdasarkan ID (sebelumnya ID/Slug, sekarang hanya ID)
// Fungsi ini tetap berguna jika Anda punya halaman detail pengumuman publik berdasarkan ID
const getPublishedAnnouncementById = async (id) => { // Parameter diubah menjadi hanya ID jika sebelumnya identifier
    console.log(`AnnouncementModel: Fetching published announcement item with ID ${id}.`);
    try {
        // Hapus kolom slug dari query SELECT dan kondisi WHERE jika sebelumnya berdasarkan slug
        const query = 'SELECT id, title, content, image_url, published_at, created_at FROM announcements WHERE id = ? AND status = "published"';
        const [rows] = await db.execute(query, [id]);
        console.log('AnnouncementModel: Found published announcement item:', rows[0]);
        return rows[0];
    } catch (error) {
        console.error(`AnnouncementModel: Error fetching published announcement item with ID ${id}:`, error);
        throw error;
    }
};

// Fungsi untuk mengambil SEMUA pengumuman yang statusnya 'published'
const getAllPublishedAnnouncements = async () => {
    console.log('AnnouncementModel: Fetching all published announcements...');
    try {
        // Hapus kolom slug dari query SELECT
        const query = 'SELECT id, title, content, image_url, published_at, created_at FROM announcements WHERE status = "published" ORDER BY published_at DESC, created_at DESC';
        const [rows] = await db.execute(query);
        console.log('AnnouncementModel: Found', rows.length, 'published announcements.');
        return rows;
    } catch (error) {
        console.error('AnnouncementModel: Error fetching all published announcements:', error);
        throw error;
    }
};

const createAnnouncement = async (announcementData) => {
    console.log('AnnouncementModel: Creating new announcement item.', announcementData);
    try {
        // Hapus logika pembuatan slug
        // const slug = announcementData.slug || announcementData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        // Hapus kolom slug dan placeholder (?) dari query INSERT
        const query = 'INSERT INTO announcements (title, content, image_url, status, published_at) VALUES (?, ?, ?, ?, ?)'; // Hapus slug

        const values = [
            announcementData.title,
            // Hapus nilai slug
            // slug,
            announcementData.content,
            announcementData.image_url || null,
            announcementData.status || 'draft',
            announcementData.published_at || null,
        ];
        const [result] = await db.execute(query, values);
        console.log('AnnouncementModel: Announcement item created.', result);
        return { insertId: result.insertId }; // Mengembalikan insertId
    } catch (error) {
        console.error('AnnouncementModel: Error creating announcement item:', error);
        throw error;
    }
};

const updateAnnouncement = async (id, announcementData) => {
    console.log(`AnnouncementModel: Updating announcement item with ID ${id}.`, announcementData);
    try {
        // Hapus logika pembuatan/update slug
        // let slug = announcementData.slug;
        // if (!slug && announcementData.title) {
        //      slug = announcementData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        // }

        // Hapus kolom slug dan placeholder (?) dari query UPDATE
        const query = `
            UPDATE announcements
            SET title = ?, content = ?, image_url = ?, status = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `; // Hapus slug = ?
         const values = [
            announcementData.title,
            // Hapus nilai slug
            // slug,
            announcementData.content,
            announcementData.image_url,
            announcementData.status,
            announcementData.published_at,
            id,
        ];
        const [result] = await db.execute(query, values);
        console.log('AnnouncementModel: Announcement item updated.', result);
        return { affectedRows: result.affectedRows };
    } catch (error) {
        console.error(`AnnouncementModel: Error updating announcement item with ID ${id}:`, error);
        throw error;
    }
};

const deleteAnnouncement = async (id) => {
    console.log(`AnnouncementModel: Deleting announcement item with ID ${id}.`);
    try {
        const query = 'DELETE FROM announcements WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        console.log('AnnouncementModel: Announcement item deleted.', result);
        return { affectedRows: result.affectedRows };
    } catch (error) {
        console.error(`AnnouncementModel: Error deleting announcement item with ID ${id}:`, error);
        throw error;
    }
};

module.exports = {
    getAllAnnouncements,
    getAnnouncementById,
    getPublishedAnnouncementById, // <-- Jika ini tetap diperlukan untuk cari publik by ID
    getAllPublishedAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    // Pastikan hanya fungsi yang relevan diekspor setelah menghapus slug
};