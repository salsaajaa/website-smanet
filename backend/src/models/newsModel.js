// backend/src/models/newsModel.js
const db = require('../config/db'); // Pastikan path ke koneksi database benar
// Hapus import slugify jika hanya digunakan untuk news/announcements
// const slugify = require('slugify');

// Hapus fungsi createSlug jika hanya digunakan untuk news/announcements
// const createSlug = (title) => { ... };

// --- Fungsi Model Berita (Umum/Admin) ---

// Fungsi untuk mengambil SEMUA berita (untuk admin)
const getAllNews = async () => {
    console.log('NewsModel: Fetching all news...');
    try {
        // Pastikan query hanya mengambil kolom yang Anda butuhkan, tanpa slug
        const query = 'SELECT id, title, content, status, published_at, image_url, author_id, created_at, updated_at FROM news ORDER BY created_at DESC';
        const [rows] = await db.execute(query);
        console.log('NewsModel: Fetched all news.', rows.length);
        return rows;
    } catch (error) {
        console.error('NewsModel: Error fetching all news:', error);
        throw error;
    }
};

// Fungsi untuk mengambil berita berdasarkan ID (untuk admin edit)
const getNewsById = async (id) => {
    console.log(`NewsModel: Fetching news by ID ${id}...`);
    try {
        // Pastikan query hanya mengambil kolom yang Anda butuhkan, tanpa slug
        const query = 'SELECT id, title, content, status, published_at, image_url, author_id, created_at, updated_at FROM news WHERE id = ? LIMIT 1';
        const [rows] = await db.execute(query, [id]);
        console.log(`NewsModel: Fetched news by ID ${id}. Found: ${rows.length > 0}`);
        return rows[0] || null;
    } catch (error) {
        console.error(`NewsModel: Error fetching news by ID ${id}:`, error);
        throw error;
    }
};

// Fungsi untuk membuat berita baru
const createNews = async (newsData) => {
    console.log('NewsModel: Creating news item...');
    try {
        if (!newsData.title || !newsData.content) {
            throw new Error('Title and content are required for creating news');
        }

        // Hapus logika pembuatan/penyimpanan slug
        // const slug = newsData.slug && newsData.slug !== '' ? newsData.slug : createSlug(newsData.title);

        // Perbaiki query INSERT - hapus kolom slug dan placeholder (?) untuk slug
        const query = `INSERT INTO news (title, content, status, published_at, image_url, author_id, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

        const values = [
            newsData.title,
            newsData.content,
            newsData.status || 'draft',
            newsData.published_at || null,
            // Hapus nilai slug dari values
            // slug,
            newsData.image_url || null,
            newsData.author_id || 1
        ];

        console.log('NewsModel: Executing INSERT query.', { query, values });
        const [result] = await db.execute(query, values);
        console.log('NewsModel: News item created successfully. Insert ID:', result.insertId);
        return { id: result.insertId };
    } catch (error) {
        console.error('NewsModel: Error creating news:', error);
        throw error;
    }
};

// Fungsi untuk memperbarui data berita
const updateNews = async (id, newsData) => {
    console.log(`NewsModel: Updating news item with ID ${id}.`, newsData);
    try {
        if (typeof newsData !== 'object' || newsData === null) {
            throw new TypeError("Expected newsData to be an object");
        }

        const fieldsToUpdate = [];
        const values = [];

        // Gunakan Object.prototype.hasOwnProperty.call untuk memeriksa properti dengan aman
        if (Object.prototype.hasOwnProperty.call(newsData, 'title')) {
            fieldsToUpdate.push('title = ?');
            values.push(newsData.title ?? null);
        }
        if (Object.prototype.hasOwnProperty.call(newsData, 'author_id')) {
            fieldsToUpdate.push('author_id = ?');
            values.push(newsData.author_id ?? null);
        }
        if (Object.prototype.hasOwnProperty.call(newsData, 'content')) {
            fieldsToUpdate.push('content = ?');
            values.push(newsData.content ?? null);
        }
        if (Object.prototype.hasOwnProperty.call(newsData, 'published_at')) {
            fieldsToUpdate.push('published_at = ?');
            values.push(newsData.published_at ?? null);
        }
        if (Object.prototype.hasOwnProperty.call(newsData, 'status')) {
            fieldsToUpdate.push('status = ?');
            values.push(newsData.status ?? 'draft');
        }

        // Hapus logika slug saat update
        // if (Object.prototype.hasOwnProperty.call(newsData, 'title') && (!Object.prototype.hasOwnProperty.call(newsData, 'slug') || newsData.slug === '' || newsData.slug === null)) { ... }
        // else if (Object.prototype.hasOwnProperty.call(newsData, 'slug')) { ... }

         if (Object.prototype.hasOwnProperty.call(newsData, 'image_url')) {
            fieldsToUpdate.push('image_url = ?');
            values.push(newsData.image_url ?? null);
        }

        fieldsToUpdate.push('updated_at = CURRENT_TIMESTAMP');

        if (fieldsToUpdate.length === 0) {
            console.log('NewsModel: No fields to update for news item with ID', id);
            return { affectedRows: 0 };
        }

        // Perbaiki string query - pastikan dimulai tanpa spasi/newline
        const query = `UPDATE news
SET ${fieldsToUpdate.join(', ')}
WHERE id = ?`;

        values.push(id);

        console.log('NewsModel: Executing UPDATE query.', { query, values });
        const [result] = await db.execute(query, values);
        console.log('NewsModel: News item updated.', result);
        return { affectedRows: result.affectedRows };
    } catch (error) {
        console.error(`NewsModel: Error updating news item with ID ${id}:`, error);
        throw error;
    }
};

// Fungsi untuk menghapus berita
const deleteNews = async (id) => {
    console.log(`NewsModel: Deleting news item with ID ${id}.`);
    try {
        // Perbaiki string query
        const query = 'DELETE FROM news WHERE id = ?';
        console.log('NewsModel: Executing DELETE query.', { query, values: [id] });
        const [result] = await db.execute(query, [id]);
        console.log('NewsModel: News item deleted.', result);
        return { affectedRows: result.affectedRows };
    } catch (error) {
        console.error(`NewsModel: Error deleting news item with ID ${id}:`, error);
        throw error;
    }
};

// --- Fungsi Model untuk Public ---

// Fungsi untuk mengambil SEMUA berita yang statusnya 'published'
const getAllPublishedNews = async () => {
    console.log('NewsModel: Fetching all published news...');
    try {
        // Pastikan query hanya mengambil kolom yang Anda butuhkan, tanpa slug
        const query = 'SELECT id, title, content, status, published_at, image_url, author_id, created_at, updated_at FROM news WHERE status = "published" ORDER BY published_at DESC';
        const [rows] = await db.execute(query);
        console.log('NewsModel: Fetched all published news.', rows.length);
        return rows;
    } catch (error) {
        console.error('NewsModel: Error fetching all published news:', error);
        throw error;
    }
};

// Fungsi untuk mengambil berita PUBLIK berdasarkan ID atau Slug
// Hapus fungsi ini jika tidak ada kebutuhan mencari berita publik berdasarkan slug
// Jika ingin tetap bisa mencari berdasarkan ID, sesuaikan fungsi ini atau buat fungsi baru
const getPublishedNewsByIdOrSlug = async (identifier) => {
    console.log(`NewsModel: Fetching published news by identifier: ${identifier}...`);
    try {
        // Jika Anda menghapus kolom slug, fungsi ini mungkin perlu diubah atau dihapus
        // Jika masih ingin bisa mencari berdasarkan ID, logika di sini perlu disesuaikan
        // Atau buat fungsi getPublishedNewsById saja
        // Untuk sementara, anggap fungsi ini dihapus atau disesuaikan
        console.warn('NewsModel: getPublishedNewsByIdOrSlug is called but slug feature is being removed. This function might need adjustment or removal.');

        // Contoh jika hanya ingin mencari berdasarkan ID saja (setelah slug dihapus)
        const query = `SELECT id, title, content, status, published_at, image_url, author_id, created_at, updated_at FROM news
                       WHERE id = ? AND status = 'published' LIMIT 1`;
        const values = [identifier]; // Asumsikan identifier sekarang hanya ID

        const [rows] = await db.execute(query, values);
        console.log(`NewsModel: Fetched published news by identifier ${identifier}. Found: ${rows.length > 0}`);
        return rows[0] || null;

    } catch (error) {
        console.error(`NewsModel: Error fetching published news by identifier ${identifier}:`, error);
        throw error;
    }
};


// Ekspor semua fungsi model yang dibutuhkan oleh controller lain
module.exports = {
    // Hapus createSlug dari ekspor
    // createSlug,
    getAllNews,
    getNewsById,
    createNews,
    updateNews, // <-- Fungsi ini sudah diperbaiki
    deleteNews,
    getAllPublishedNews,
    // Hapus getPublishedNewsByIdOrSlug dari ekspor jika dihapus/diubah di atas
    getPublishedNewsByIdOrSlug, // Jika fungsi di atas diubah/dihapus, sesuaikan ekspor ini
};