const jwt = require('jsonwebtoken');

// Ganti ini dengan secret key milikmu sendiri (gunakan .env di produksi)
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_super_aman';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Cek apakah header Authorization tersedia dan diawali dengan "Bearer"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  const token = authHeader.split(' ')[1]; // Ambil token setelah 'Bearer'

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verifikasi token

    req.user = decoded; // Simpan data user di request untuk akses controller
    next(); // Lanjut ke route berikutnya
  } catch (err) {
    return res.status(403).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
};

module.exports = authMiddleware;