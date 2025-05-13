// Import modul yang dibutuhkan
const express = require('express');
const router = express.Router();

// --- PENTING: PASTIKAN PATH INI BENAR ---
// Mengimpor pool koneksi database dari file konfigurasi kamu (db.js)
const pool = require('../config/db');

// Sekarang kita akan menggunakan 'pool' untuk menjalankan query.
// --- AKHIR BAGIAN KONEKSI DATABASE ---

// --- KONSTANTA UNTUK KATEGORI DAN TABEL ---
const ASSIGNMENT_CATEGORIES = [
    'PIKET',
    'PARKIRAN',
    'DUTA KARAKTER',
    'JADWAL PEMBERSIHAN AREA PARKIRAN',
    'Jadwal Buang Sampah'
];

const CATEGORY_TABLE_MAP = {
    'PIKET': 'dashboard_piket',
    'PARKIRAN': 'dashboard_parkiran',
    'DUTA KARAKTER': 'dashboard_duta',
    'JADWAL PEMBERSIHAN AREA PARKIRAN': 'cleaning_assignments',
    'Jadwal Buang Sampah': 'dashboard_buang_sampah'
};

const TABLE_CATEGORY_MAP = {
     'dashboard_piket': 'PIKET',
     'dashboard_parkiran': 'PARKIRAN',
     'dashboard_duta': 'DUTA KARAKTER',
     'cleaning_assignments': 'JADWAL PEMBERSIHAN AREA PARKIRAN',
     'dashboard_buang_sampah': 'Jadwal Buang Sampah'
};

const TABLE_COLUMN_MAP = {
    'dashboard_piket': {
        id: 'id',
        task_group: 'task_group',
        class: 'class_name',
        students: 'assigned_students'
    },
    'dashboard_parkiran': {
        id: 'id',
        task_group: 'task_group',
        class: 'class_name',
        students: 'assigned_to'
    },
    'dashboard_duta': {
        id: 'id',
        task_group: 'task_group',
        class: 'class_name',
        students: 'assigned_student'
    },
    'cleaning_assignments': {
        id: 'id',
        task_group: 'task_group',
        class: 'class_name',
        students: 'assigned_students'
    },
    'dashboard_buang_sampah': {
        id: 'id',
        class: 'class_name',
        students: 'description' // Menggunakan 'description' sebagai 'students' di frontend
    }
};
// --- AKHIR KONSTANTA ---


// Fungsi helper untuk memetakan kategori ke nama tabel database
const getTableNameFromCategory = (category) => {
    return CATEGORY_TABLE_MAP[category] || null;
};

// Fungsi helper untuk mendapatkan nama kategori dari nama tabel
const getCategoryFromTableName = (tableName) => {
    return TABLE_CATEGORY_MAP[tableName] || 'Lainnya';
}

// Fungsi helper untuk mendapatkan nama kolom yang sesuai berdasarkan nama tabel
const getColumnNamesForTable = (tableName) => {
    return TABLE_COLUMN_MAP[tableName] || null;
};


// Endpoint untuk mengambil semua penugasan untuk dashboard admin (dan publik)
// Method: GET
// Path: /api/daily-assignments/admin
router.get('/admin', async (req, res) => {
    console.log("Menerima permintaan GET /api/daily-assignments/admin");
    let connection;

    try {
        connection = await pool.getConnection();
        console.log("Koneksi database berhasil didapatkan dari pool.");

        // Mengambil data dari setiap tabel yang terdaftar dalam konstanta
        const fetchPromises = ASSIGNMENT_CATEGORIES.map(async (category) => {
            const tableName = getTableNameFromCategory(category);
            const columnNames = getColumnNamesForTable(tableName);

            if (!tableName || !columnNames) {
                console.warn(`Skipping fetch for unsupported category: ${category}`);
                return []; // Lewati kategori yang tidak didukung atau tidak ada mapping tabel/kolom
            }

            try {
                let sql;
                // Sesuaikan query berdasarkan apakah tabel memiliki kolom task_group
                if (tableName === CATEGORY_TABLE_MAP['Jadwal Buang Sampah']) {
                     sql = `SELECT ${columnNames.id} AS id, ${columnNames.class} AS class, ${columnNames.students} AS students FROM ??`;
                } else {
                     sql = `SELECT ${columnNames.id} AS id, ${columnNames.class} AS class, ${columnNames.students} AS students, ${columnNames.task_group} AS task_group FROM ??`;
                }

                const [rows] = await connection.query(sql, [tableName]);

                if (!Array.isArray(rows)) {
                     console.error(`Query for table ${tableName} did not return an array:`, rows);
                     return [];
                }

                // Memformat data dan menambahkan metadata
                const formattedAssignments = rows.map(assignment => {
                    let studentsArray = [];
                    // Mengubah string siswa menjadi array di backend jika masih string
                    if (assignment.students) {
                         if (typeof assignment.students === 'string') {
                             studentsArray = assignment.students.split(/[\n,]/).map(s => s.trim()).filter(s => s.length > 0);
                         } else if (Array.isArray(assignment.students)) {
                             studentsArray = assignment.students.map(s => String(s).trim()).filter(s => s.length > 0);
                         } else {
                              console.warn(`Unexpected format for students data in table ${tableName} (ID: ${assignment.id}):`, assignment.students);
                              studentsArray = []; // Default ke array kosong jika format tidak dikenali
                         }
                    }

                    return {
                        _id: assignment.id, // ID untuk keperluan frontend (jika dibutuhkan)
                        id: assignment.id,
                        class: assignment.class,
                        students: studentsArray,
                        task_group: assignment.task_group || '', // Pastikan task_group ada atau default ke string kosong
                        table_name: tableName,
                        category: category, // Menggunakan nama kategori dari iterasi
                    };
                });
                 console.log(`Fetched ${formattedAssignments.length} items from ${tableName} (${category})`);
                 return formattedAssignments;

            } catch (err) {
                console.error(`Error fetching data from table ${tableName} (${category}):`, err);
                // Mengembalikan array kosong dan log error spesifik
                return [];
            }
        });

        // Menunggu semua promise selesai dan menggabungkan hasilnya
        const resultsFromTables = await Promise.all(fetchPromises);
        let allAssignmentsFlat = resultsFromTables.flat(); // Menggabungkan semua array hasil

        console.log(`Berhasil mengambil ${allAssignmentsFlat.length} penugasan dari semua tabel (flat data).`);
        // console.log('Flat data:', allAssignmentsFlat); // Uncomment untuk debugging data mentah

        // --- LOGIKA TRANSFORMASI DATA FLAT MENJADI STRUKTUR BERSARANG UNTUK FRONTEND ---

        // Definisikan STRUKTUR BERSARANG YANG DIHARAPKAN FRONTEND
        // Struktur ini harus sesuai dengan yang diharapkan komponen frontend
        const nestedDashboardStructure = [
            {
                title: 'PIKET', emoji: '🧹', introText: null,
                staticNotes: ['Jadi, yang ada namanya di atas, mohon datang pagi-pagi, jam 06.30 sudah ada di lokasi masing masing🙏'],
                subtitles: [
                    { subtitle: 'YANG AKAN MEMBERSIHKAN DI RUANG GURU', classes: [], backend_task_group: 'RUANG GURU' },
                    { subtitle: 'YANG AKAN MEMBERSIHKAN DI AULA', classes: [], backend_task_group: 'AULA' },
                    { subtitle: 'YANG AKAN MEMBERSIHKAN DI GASEBO', classes: [], backend_task_group: 'GASEBO' },
                ], backend_category: 'PIKET',
            },
            {
                title: 'JADWAL BUANG SAMPAH', emoji: '🗑️', subtitles: [], staticNotes: [],
                introText: 'Sepulang sekolah supaya ke POS Lapor Sampah dikoordinir oleh ketua kelas dan didampingi wali kelas',
                currentClass: null, backend_category: 'Jadwal Buang Sampah', id: null
            },
            {
                title: 'PARKIRAN', emoji: '🅿️', introText: null, staticNotes: [],
                subtitles: [
                    { subtitle: 'JAGA PARKIRAN CEWEK', classes: [], backend_task_group: 'JAGA PARKIRAN CEWEK' },
                    { subtitle: 'JAGA PARKIRAN COWOK', classes: [], backend_task_group: 'JAGA PARKIRAN COWOK' },
                    { subtitle: 'JAGA PARKIRAN DIBELAKANG RUANG GURU', classes: [], backend_task_group: 'JAGA PARKIRAN DIBELAKANG RUANG GURU' },
                    { subtitle: 'JAGA PARKIRAN SEBELAH BARAT', classes: [], backend_task_group: 'JAGA PARKIRAN SEBELAH BARAT' },
                ], backend_category: 'PARKIRAN',
            },
             {
             title: 'JADWAL PEMBERSIHAN AREA PARKIRAN', emoji: '🅿️✨', introText: null, staticNotes: [],
             subtitles: [
                { subtitle: 'AREA PARKIRAN COWOK', classes: [], backend_task_group: 'AREA PARKIRAN COWOK' },
                { subtitle: 'AREA PARKIRAN DI BELAKANG RUANG GURU', classes: [], backend_task_group: 'AREA PARKIRAN DI BELAKANG RUANG GURU' },
             ], backend_category: 'JADWAL PEMBERSIHAN AREA PARKIRAN',
            },
            {
                title: 'DUTA KARAKTER', emoji: '✨', introText: null,
                staticNotes: ['NOTE: AMBIL SELEMPANG DUTA DI SEKRET OSIS, DAN APABILA TELAH DIGUNAKAN MOHON UNTUK DIKEMBALIKAN KE TEMPATNYA SEMULA'],
                subtitles: [
                    { subtitle: 'GERBANG UTAMA', classes: [], backend_task_group: 'GERBANG UTAMA' },
                    { subtitle: 'GERBANG CEWEK', classes: [], backend_task_group: 'GERBANG CEWEK' },
                ], backend_category: 'DUTA KARAKTER',
            },
        ];

        // Iterasi data flat dan masukkan ke struktur bersarang
        allAssignmentsFlat.forEach(assignment => {
            const backendCategory = assignment.category;
            const backendTaskGroup = assignment.task_group;
            const className = assignment.class;
            const studentsArray = assignment.students;

            const targetSection = nestedDashboardStructure.find(section => section.backend_category === backendCategory);

            if (targetSection) {
                // Logika khusus untuk JADWAL BUANG SAMPAH
                if (targetSection.backend_category === 'Jadwal Buang Sampah') {
                    targetSection.currentClass = className;
                    // Untuk Buang Sampah, 'students' dari backend adalah 'description'
                    // Kita gunakan sebagai introText
                    if (studentsArray.length > 0) {
                       targetSection.introText = studentsArray.join(', '); // Menggabungkan deskripsi jika berupa array (meskipun seharusnya string tunggal)
                    } else if (typeof assignment.students === 'string') {
                         targetSection.introText = assignment.students; // Menggunakan string asli jika tidak dipecah
                    }
                    // SALIN ID dari data mentah ke objek section Buang Sampah
                    if (assignment.id) {
                         targetSection.id = assignment.id;
                    }

                } else {
                    const targetSubtitle = targetSection.subtitles.find(subtitle => subtitle.backend_task_group === backendTaskGroup);

                    if (targetSubtitle) {
                         const existingClass = targetSubtitle.classes.find(cls => cls.className === className);
                         if (existingClass) {
                             // Menambahkan siswa ke kelas yang sudah ada (menghindari duplikasi jika data datang terpisah)
                             studentsArray.forEach(student => {
                                if (!existingClass.students.includes(student)) {
                                     existingClass.students.push(student);
                                }
                             });
                         } else {
                             // Menambahkan objek kelas baru ke subtitle
                             targetSubtitle.classes.push({
                                 id: assignment.id,
                                 className: className,
                                 students: studentsArray,
                                 category: backendCategory, // Sertakan category dan task_group untuk referensi
                                 task_group: backendTaskGroup
                             });
                         }
                    } else {
                         console.warn(`Data dari backend dengan task_group "${backendTaskGroup}" (Kategori: ${backendCategory}) tidak bisa dimapping ke subtitle di struktur frontend. Pastikan backend_task_group di frontend sesuai dengan nilai task_group dari backend. Data:`, assignment);
                    }
                }
            } else {
               console.warn(`Data dari backend dengan kategori "${backendCategory}" tidak bisa dimapping ke section manapun di struktur frontend. Pastikan backend_category di frontend sesuai dengan nilai category dari backend. Data:`, assignment);
            }
        });

        console.log('Transformed nested data for frontend:', nestedDashboardStructure);
        res.json(nestedDashboardStructure); // Mengirimkan array dengan struktur bersarang

    } catch (err) {
        console.error("Error fetching and transforming daily assignments:", err);
        // Mengembalikan error yang lebih detail di lingkungan pengembangan, tapi tetap aman di produksi
        const errorMessage = process.env.NODE_ENV === 'production' ?
                           'Gagal mengambil data penugasan.' :
                           `Gagal mengambil data penugasan: ${err.message}`;
        res.status(500).json({
            message: errorMessage,
            // Hanya sertakan detail error database di lingkungan non-produksi
            ...(process.env.NODE_ENV !== 'production' && {
                 dbError: {
                    code: err.code,
                    errno: err.errno,
                    sqlState: err.sqlState,
                    sqlMessage: err.sqlMessage,
                    sql: err.sql
                 }
            })
        });
    } finally {
        if (connection) {
            connection.release();
             console.log("Koneksi database dikembalikan ke pool.");
        }
    }
});


// Endpoint untuk menambahkan penugasan baru
// Method: POST
// Path: /api/daily-assignments
router.post('/', async (req, res) => {
    console.log("Menerima permintaan POST /api/daily-assignments", req.body);
    const { category, task_group, class: assignmentClass, students } = req.body;
    let connection;

    try {
        connection = await pool.getConnection();
        console.log("Koneksi database berhasil didapatkan dari pool.");

        // --- Validasi Input ---
        if (!category || !assignmentClass || !students) {
            console.warn("Validasi gagal: Kategori, kelas, atau siswa/deskripsi kosong.");
            return res.status(400).json({ message: "Kategori, kelas, dan nama siswa/deskripsi harus diisi." });
        }

        const tableName = getTableNameFromCategory(category);
        const columnNames = getColumnNamesForTable(tableName);

        if (!tableName || !columnNames) {
            console.warn(`Kategori tidak didukung: ${category}`);
            return res.status(400).json({ message: `Kategori tidak didukung: ${category}` });
        }

        // Validasi task_group hanya jika kategori memerlukannya
        if (category !== 'Jadwal Buang Sampah' && !task_group) {
             console.warn("Validasi gagal: task_group kosong untuk kategori yang membutuhkannya.");
             return res.status(400).json({ message: "Sub-judul / Kelompok tugas harus diisi untuk kategori ini." });
        }
        // --- Akhir Validasi Input ---


        let sql;
        let params;

        if (category === 'Jadwal Buang Sampah') {
            // Untuk dashboard_buang_sampah, hanya insert class_name dan description
            sql = `INSERT INTO ?? (${columnNames.class}, ${columnNames.students}) VALUES (?, ?)`;
            params = [tableName, assignmentClass, students]; // students di sini adalah string deskripsi
        } else {
            // Untuk kategori lain, insert task_group, class_name, dan assigned_students/assigned_to/assigned_student
            sql = `INSERT INTO ?? (${columnNames.task_group}, ${columnNames.class}, ${columnNames.students}) VALUES (?, ?, ?)`;
            params = [tableName, task_group, assignmentClass, students]; // students di sini adalah string nama siswa
        }

        console.log(`Executing INSERT query into ${tableName}:`, sql, params);

        const [result] = await connection.query(sql, params);

        console.log(`Berhasil menambahkan penugasan ke ${tableName}. InsertId: ${result.insertId}`);
        res.status(201).json({
            message: "Penugasan berhasil ditambahkan.",
            insertId: result.insertId,
            category: category, // Mengembalikan kategori dari request
            task_group: task_group || null, // Mengembalikan task_group dari request atau null
            class: assignmentClass, // Mengembalikan kelas dari request
            students: students, // Mengembalikan data students/deskripsi dari request
            table_name: tableName // Mengembalikan nama tabel
        });

    } catch (err) {
        console.error("Error saat menambahkan penugasan:", err);
        // Mengembalikan error yang lebih detail
        const errorMessage = process.env.NODE_ENV === 'production' ?
                           'Gagal menambahkan penugasan.' :
                           `Gagal menambahkan penugasan: ${err.message}`;
        res.status(500).json({
            message: errorMessage,
            ...(process.env.NODE_ENV !== 'production' && {
                 dbError: {
                    code: err.code,
                    errno: err.errno,
                    sqlState: err.sqlState,
                    sqlMessage: err.sqlMessage,
                    sql: err.sql
                 }
            })
        });
    } finally {
        if (connection) {
            connection.release();
            console.log("Koneksi database dikembalikan ke pool.");
        }
    }
});

// Endpoint untuk memperbarui penugasan
// Method: PUT
// Path: /api/daily-assignments/:category/:id
router.put('/:category/:id', async (req, res) => {
    const assignmentId = req.params.id;
    const category = req.params.category; // Mengambil kategori dari URL params
    const { class: assignmentClass, students } = req.body; // Mengambil kelas dan siswa/deskripsi dari body
    let connection;

    console.log(`Menerima permintaan PUT /api/daily-assignments/${category}/${assignmentId}`, req.body);

    try {
        connection = await pool.getConnection();
        console.log("Koneksi database berhasil didapatkan dari pool.");

        // --- Validasi Input dan Kategori ---
        if (!assignmentClass || !students) {
            console.warn("Validasi gagal: Kelas atau siswa/deskripsi kosong saat update.");
            return res.status(400).json({ message: "Kelas dan nama siswa/deskripsi harus diisi." });
        }

        const tableName = getTableNameFromCategory(category);
        const columnNames = getColumnNamesForTable(tableName);

        if (!tableName || !columnNames) {
             console.warn(`Kategori tidak didukung untuk update: ${category}`);
             return res.status(400).json({ message: `Kategori tidak didukung: ${category}` });
        }
        // --- Akhir Validasi ---

        // Query UPDATE disesuaikan berdasarkan kolom yang ada di tabel
        let sql;
        let params;

        // Untuk semua tabel, kita hanya mengupdate class_name dan kolom siswa/deskripsi
        // ID dan task_group (jika ada) digunakan di klausa WHERE
        sql = `UPDATE ?? SET ${columnNames.class} = ?, ${columnNames.students} = ? WHERE ${columnNames.id} = ?`;
        params = [tableName, assignmentClass, students, assignmentId];


        console.log(`Executing UPDATE query into ${tableName} for id ${assignmentId}:`, sql, params);

        const [result] = await connection.query(sql, params);

        if (result.affectedRows === 0) {
            console.warn(`Tidak ada penugasan ditemukan dengan id ${assignmentId} di tabel ${tableName}.`);
            res.status(404).json({ message: "Penugasan tidak ditemukan." });
        } else {
            console.log(`Berhasil memperbarui penugasan dengan id ${assignmentId} di ${tableName}. Affected Rows: ${result.affectedRows}`);
            res.json({ message: "Penugasan berhasil diperbarui!" });
        }

    } catch (err) {
        console.error(`Error updating data in ${tableName} with id ${assignmentId}:`, err);
        // Mengembalikan error yang lebih detail
        const errorMessage = process.env.NODE_ENV === 'production' ?
                           'Gagal memperbarui penugasan.' :
                           `Gagal memperbarui penugasan: ${err.message}`;
        res.status(500).json({
            message: errorMessage,
            ...(process.env.NODE_ENV !== 'production' && {
                 dbError: {
                    code: err.code,
                    errno: err.errno,
                    sqlState: err.sqlState,
                    sqlMessage: err.sqlMessage,
                    sql: err.sql
                 }
            })
        });
    } finally {
        if (connection) {
            connection.release();
             console.log("Koneksi database dikembalikan ke pool.");
        }
    }
});

// Endpoint untuk menghapus penugasan
// Method: DELETE
// Path: /api/daily-assignments/:category/:id
router.delete('/:category/:id', async (req, res) => {
    const assignmentId = req.params.id;
    const category = req.params.category; // Mengambil kategori dari URL params
    let connection;

    console.log(`Menerima permintaan DELETE /api/daily-assignments/${category}/${assignmentId}`);

    try {
        connection = await pool.getConnection();
        console.log("Koneksi database berhasil didapatkan dari pool.");

        // --- Validasi Kategori ---
        const tableName = getTableNameFromCategory(category);
        const columnNames = getColumnNamesForTable(tableName);

         if (!tableName || !columnNames) {
              console.warn(`Kategori tidak didukung untuk delete: ${category}`);
              return res.status(400).json({ message: `Kategori tidak didukung: ${category}` });
         }
        // --- Akhir Validasi ---


        const sql = `DELETE FROM ?? WHERE ${columnNames.id} = ?`;
        const params = [tableName, assignmentId];

        console.log(`Executing DELETE query from ${tableName} for id ${assignmentId}:`, sql, params);

        const [result] = await connection.query(sql, params);

        if (result.affectedRows === 0) {
            console.warn(`Tidak ada penugasan ditemukan dengan id ${assignmentId} di tabel ${tableName}.`);
            res.status(404).json({ message: "Penugasan tidak ditemukan." });
        } else {
            console.log(`Berhasil menghapus penugasan dengan id ${assignmentId} dari ${tableName}. Affected Rows: ${result.affectedRows}`);
            res.json({ message: "Penugasan berhasil dihapus!" });
        }

    } catch (err) {
        console.error(`Error deleting data from ${tableName} with id ${assignmentId}:`, err);
        // Mengembalikan error yang lebih detail
        const errorMessage = process.env.NODE_ENV === 'production' ?
                           'Gagal menghapus penugasan.' :
                           `Gagal menghapus penugasan: ${err.message}`;
        res.status(500).json({
            message: errorMessage,
            ...(process.env.NODE_ENV !== 'production' && {
                 dbError: {
                    code: err.code,
                    errno: err.errno,
                    sqlState: err.sqlState,
                    sqlMessage: err.sqlMessage,
                    sql: err.sql
                 }
            })
        });
    } finally {
        if (connection) {
            connection.release();
             console.log("Koneksi database dikembalikan ke pool.");
        }
    }
});


// Export router agar bisa digunakan di file server utama
module.exports = router;
