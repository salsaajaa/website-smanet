const db = require('../config/db');

const getUser = async () => {
    try {
        const query = 'SELECT id, username, email, role, created_at, updated_at FROM users';
        const [rows] = await db.execute(query);
        return rows;
    } catch (error) {
        console.error('UserModel: Error saat mengambil semua user:', error);
        throw error;
    }
};

const findByUsername = async (username) => {
    try {
        const query = 'SELECT id, username, password, role, email, created_at, updated_at FROM users WHERE username = ? LIMIT 1';
        const [rows] = await db.execute(query, [username]);
        return rows[0] || null;
    } catch (error) {
        console.error('UserModel: Error saat mencari user berdasarkan username:', error);
        throw error;
    }
};

const findByEmail = async (email) => {
    try {
        const query = 'SELECT id, username, email, password, role, created_at, updated_at FROM users WHERE email = ? LIMIT 1';
        const [rows] = await db.execute(query, [email]);
        return rows[0] || null;
    } catch (error) {
        console.error(`UserModel: Error mencari user by email ${email}:`, error);
        throw error;
    }
};

const hapusUser = async (id) => {
    try {
        const query = 'DELETE FROM users WHERE id = ?';
        const [results] = await db.execute(query, [id]);
        return results;
    } catch (error) {
        console.error('UserModel: Error saat menghapus user:', error);
        throw error;
    }
};

const findById = async (id) => {
    try {
        const query = 'SELECT id, username, role, email, created_at, updated_at FROM users WHERE id = ? LIMIT 1';
        const [rows] = await db.execute(query, [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('UserModel: Error saat mencari user berdasarkan ID:', error);
        throw error;
    }
};

const createUser = async (username, hashedPassword, email, role = 'user') => {
    try {
        const query = 'INSERT INTO users (username, password, email, role, created_at, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';
        const values = [username, hashedPassword, email, role];
        const [results] = await db.execute(query, values);
        return { id: results.insertId, affectedRows: results.affectedRows };
    } catch (error) {
        console.error('UserModel: Error saat menyimpan user baru ke database:', error);
        throw error;
    }
};

// Tambahkan fungsi updatePassword
const updatePassword = async (userId, hashedPassword) => {
    try {
        const query = 'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const [results] = await db.execute(query, [hashedPassword, userId]);
        return results;
    } catch (error) {
        console.error(`UserModel: Error saat mengupdate password user ID ${userId}:`, error);
        throw error;
    }
};


module.exports = {
    getUser,
    findByUsername,
    findByEmail,
    hapusUser,
    findById,
    createUser,
    updatePassword, // Export fungsi updatePassword
};
