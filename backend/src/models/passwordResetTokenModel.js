// PERIKSA BARIS INI: Pastikan path ke file db.js Anda benar
const pool = require('../config/db'); // Diubah dari '../db'

// Membuat token reset password baru
const create = async (email, token, expiresAt) => {
  const [result] = await pool.execute(
    'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)',
    [email, token, expiresAt]
  );
  return result;
};

// Mencari token berdasarkan nilai token dan tanggal kedaluwarsa
const findByToken = async (token) => {
  const [rows] = await pool.execute(
    'SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()',
    [token]
  );
  return rows.length > 0 ? rows[0] : null;
};

// Menghapus token berdasarkan email
const deleteByEmail = async (email) => {
  await pool.execute(
    'DELETE FROM password_reset_tokens WHERE email = ?',
    [email]
  );
};

// Menghapus token berdasarkan token itu sendiri
const deleteByToken = async (token) => {
  await pool.execute(
    'DELETE FROM password_reset_tokens WHERE token = ?',
    [token]
  );
};

module.exports = {
  create,
  findByToken,
  deleteByEmail,
  deleteByToken
};