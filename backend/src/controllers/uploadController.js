// src/controllers/uploadController.js

const multer = require('multer');
const path = require('path'); // Modul bawaan Node.js untuk path
const fs = require('fs'); // Modul bawaan Node.js untuk file system (opsional, jika perlu cek folder dll)

// --- Konfigurasi Storage Multer ---
// Menentukan di mana file akan disimpan dan bagaimana nama filenya
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Folder tujuan penyimpanan file, relatif dari root backend
    // Kita sudah buat folder 'uploads' di root backend
    const uploadDir = path.join(__dirname, '../../uploads'); // path dari src/controllers ke root backend/uploads

    // Cek apakah folder tujuan ada, jika tidak buat
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir); // Simpan ke folder 'uploads'
  },
  filename: (req, file, cb) => {
    // Menentukan nama file setelah disimpan
    // Contoh: namafileasli-timestamp.ekstensi
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Ambil ekstensi file asli
    const fileExtension = path.extname(file.originalname);
    // Buat nama file baru yang unik
    const newFilename = file.fieldname + '-' + uniqueSuffix + fileExtension; // Contoh: image-1678888888888-123456789.jpg

    cb(null, newFilename);
  }
});

// --- Konfigurasi Filter File Multer (Opsional) ---
// Untuk membatasi jenis file yang diizinkan di-upload
const fileFilter = (req, file, cb) => {
    // Cek tipe file berdasarkan mimetype atau ekstensi
    if (file.mimetype.startsWith('image/')) { // Izinkan hanya file gambar
        cb(null, true); // Terima file
    } else {
        // Tolak file dan berikan error
        cb(new Error('Hanya file gambar yang diizinkan!'), false);
    }
};

// --- Inisialisasi Upload Middleware dengan Konfigurasi ---
const upload = multer({
  storage: storage, // Gunakan konfigurasi storage yang dibuat di atas
  fileFilter: fileFilter, // Gunakan filter file (opsional)
  limits: {
    fileSize: 1024 * 1024 * 5 // Contoh: Batasi ukuran file maksimal 5MB (dalam bytes)
  }
});

// --- Handler Controller untuk Proses Upload File ---
// Ini adalah handler yang akan dipanggil setelah Multer selesai memproses file
exports.uploadImage = (req, res) => {
  console.log('UploadController: Menerima request upload file.');

  // req.file akan berisi informasi file yang berhasil di-upload (jika menggunakan single file)
  if (req.file) {
    console.log('UploadController: File berhasil di-upload.', req.file);

    // Berikan respon sukses dengan informasi file yang di-upload
    // field 'path' di req.file berisi path lengkap file di server
    // field 'filename' berisi nama file yang dibuat oleh Multer
    // field 'destination' berisi folder tujuan
    // field 'originalname' berisi nama file asli dari client

    // Kita bisa kirim kembali URL untuk mengakses file ini dari front end
    // URL dasar static serving kita di index.js adalah '/uploads'
    const fileUrl = `/uploads/${req.file.filename}`; // URL yang bisa diakses front end

    res.status(200).json({
      message: 'File berhasil di-upload.',
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: req.file.path, // Path fisik di server
      url: fileUrl // URL untuk diakses dari front end
    });

  } else {
    // Jika tidak ada file, berarti ada error dari Multer (misal file size, file filter, dll)
    // Error dari Multer biasanya sudah dihandle oleh middleware error di index.js
    // Tapi kita bisa tambahkan logika spesifik jika ingin respon error khusus upload
    console.error('UploadController: Gagal mengupload file atau tidak ada file terpilih.');
    // Middleware error global akan menangani error dari Multer
    // Jika Anda ingin error spesifik di sini, Anda bisa menambahkan try/catch di sekitar upload.single
    // atau tambahkan middleware penanganan error setelah Multer di route.
    res.status(400).json({ message: 'Gagal mengupload file.' });
  }
};


// --- Middleware Multer yang akan digunakan di Route ---
// Gunakan ini di definisi route Anda.
// 'image' adalah nama field di FormData dari front end yang berisi file (nama di submitData.append('image', selectedImage.value))
exports.uploadMiddleware = upload.single('image'); // 'single' berarti hanya 1 file, 'image' nama field


// --- Export handler controller ---
// module.exports = {
//     uploadImage: exports.uploadImage,
//     uploadMiddleware: exports.uploadMiddleware // Export middleware juga jika mau dipakai di route file
// };
// Atau cukup export middleware dan gunakan handler langsung di route file

