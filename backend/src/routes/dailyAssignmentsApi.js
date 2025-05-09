// Import modul yang dibutuhkan
const express = require('express');
const router = express.Router();

// --- PENTING: PASTIKAN PATH INI BENAR ---
// Mengimpor pool koneksi database dari file konfigurasi kamu (db.js)
// PASTIKAN PATH '../config/db' SESUAI DENGAN LOKASI FILE db.js KAMU
// Jika db.js ada di folder yang berbeda, sesuaikan path-nya.
const pool = require('../config/db');

// Sekarang kita akan menggunakan 'pool' untuk menjalankan query.
// --- AKHIR BAGIAN KONEKSI DATABASE ---


// Fungsi helper untuk memetakan kategori ke nama tabel database
const getTableNameFromCategory = (category) => {
    switch (category) {
        case 'PIKET': return 'dashboard_piket';
        case 'PARKIRAN': return 'dashboard_parkiran';
        case 'DUTA KARAKTER': return 'dashboard_duta';
        case 'JADWAL PEMBERSIHAN AREA PARKIRAN': return 'cleaning_assignments';
        case 'Jadwal Buang Sampah': return 'dashboard_buang_sampah';
        default: return null; // Kategori tidak didukung
    }
};

// Fungsi helper untuk mendapatkan nama kategori dari nama tabel
const getCategoryFromTableName = (tableName) => {
      switch (tableName) {
        case 'dashboard_piket': return 'PIKET';
        case 'dashboard_parkiran': return 'PARKIRAN';
        case 'dashboard_duta': return 'DUTA KARAKTER';
        case 'cleaning_assignments': return 'JADWAL PEMBERSIHAN AREA PARKIRAN';
        case 'dashboard_buang_sampah': return 'Jadwal Buang Sampah';
        default: return 'Lainnya'; // Tabel tidak dikenal
    }
}

// Fungsi helper untuk mendapatkan nama kolom yang sesuai berdasarkan nama tabel
const getColumnNamesForTable = (tableName) => {
    switch (tableName) {
        case 'dashboard_piket':
            return {
                id: 'id',
                task_group: 'task_group', // Nama kolom task_group di DB
                class: 'class_name', // Nama kolom kelas di DB
                students: 'assigned_students' // Nama kolom siswa di DB
            };
        case 'dashboard_parkiran':
             return {
                id: 'id',
                task_group: 'task_group', // Nama kolom task_group di DB
                class: 'class_name', // Nama kolom kelas di DB
                students: 'assigned_to' // Nama kolom siswa di DB
            };
        case 'dashboard_duta':
             return {
                id: 'id',
                task_group: 'task_group', // Nama kolom task_group di DB
                class: 'class_name', // Nama kolom kelas di DB
                students: 'assigned_student' // Nama kolom siswa di DB (sesuai screenshot)
            };
        case 'cleaning_assignments':
             return {
                id: 'id',
                task_group: 'task_group', // Nama kolom task_group di DB
                class: 'class_name', // Nama kolom kelas di DB
                students: 'assigned_students' // Nama kolom siswa di DB
            };
        case 'dashboard_buang_sampah':
             return {
                id: 'id',
                // task_group tidak ada di tabel ini
                class: 'class_name', // Nama kolom kelas di DB
                students: 'description' // Nama kolom deskripsi di DB (digunakan sebagai students di frontend)
            };
        default:
            return null; // Tabel tidak didukung
    }
};


// Endpoint untuk mengambil semua penugasan untuk dashboard admin (dan publik)
// Method: GET
// Path: /api/daily-assignments/admin
router.get('/admin', async (req, res) => {
    console.log("Menerima permintaan GET /api/daily-assignments/admin");
    let connection; // Deklarasikan variabel connection di luar try

    try {
        // Mendapatkan koneksi dari pool
        connection = await pool.getConnection();
        console.log("Koneksi database berhasil didapatkan dari pool.");

        // Daftar semua tabel yang ingin diambil datanya
        const tablesToFetch = [
            'dashboard_piket',
            'dashboard_parkiran',
            'dashboard_duta',
            'cleaning_assignments',
            'dashboard_buang_sampah'
        ];

        let allAssignmentsFlat = []; // Data mentah dari semua tabel

        // Mengambil data dari setiap tabel secara paralel
        const fetchPromises = tablesToFetch.map(async (tableName) => {
            try {
                const columnNames = getColumnNamesForTable(tableName);
                if (!columnNames) {
                    console.warn(`Skipping fetch for unsupported table: ${tableName}`);
                    return [];
                }

                // Query SQL untuk mengambil data dari tabel menggunakan nama kolom yang benar
                // Menggunakan alias agar nama properti di hasil konsisten (id, class, students, task_group)
                let sql;
                if (tableName === 'dashboard_buang_sampah') {
                     // Tabel buang sampah tidak punya task_group
                     // Menggunakan alias 'students' untuk kolom 'description'
                     sql = `SELECT ${columnNames.id} AS id, ${columnNames.class} AS class, ${columnNames.students} AS students FROM ??`;
                } else {
                     // Tabel lain punya task_group
                     sql = `SELECT ${columnNames.id} AS id, ${columnNames.class} AS class, ${columnNames.students} AS students, ${columnNames.task_group} AS task_group FROM ??`;
                }


                const [rows] = await connection.query(sql, [tableName]); // Gunakan connection.query dengan await

                // Pastikan rows adalah array sebelum menggunakan map
                if (!Array.isArray(rows)) {
                     console.error(`Query for table ${tableName} did not return an array:`, rows);
                     return []; // Kembalikan array kosong jika format tidak sesuai
                }

                // Menambahkan nama tabel dan kategori ke setiap hasil
                const assignmentsWithMeta = rows.map(assignment => {
                    // Mengubah string siswa menjadi array di backend jika masih string
                    let studentsArray = [];
                    if (assignment.students) {
                        if (typeof assignment.students === 'string') {
                            studentsArray = assignment.students.split(/[\n,]/).map(s => s.trim()).filter(s => s.length > 0);
                        } else if (Array.isArray(assignment.students)) {
                            studentsArray = assignment.students.map(s => String(s).trim()).filter(s => s.length > 0);
                        } else {
                             console.warn(`Unexpected format for students data in table ${tableName}:`, assignment.students);
                             studentsArray = [];
                        }
                    }


                    return {
                        _id: assignment.id,
                        id: assignment.id, // Pastikan ID disertakan
                        class: assignment.class,
                        students: studentsArray,
                        task_group: assignment.task_group || '',
                        table_name: tableName,
                        category: getCategoryFromTableName(tableName),
                    };
                });
                 console.log(`Fetched ${assignmentsWithMeta.length} items from ${tableName}`);
                 return assignmentsWithMeta;

            } catch (err) {
                console.error(`Error fetching data from table ${tableName}:`, err);
                return [];
            }
        });

        const resultsFromTables = await Promise.all(fetchPromises);

        resultsFromTables.forEach(results => {
            allAssignmentsFlat = allAssignmentsFlat.concat(results);
        });

        console.log(`Berhasil mengambil ${allAssignmentsFlat.length} penugasan dari semua tabel (flat data).`);
        console.log('Flat data:', allAssignmentsFlat);

        // --- LOGIKA TRANSFORMASI DATA FLAT MENJADI STRUKTUR BERSARANG UNTUK FRONTEND ---

        // Definisikan STRUKTUR BERSARANG YANG DIHARAPKAN FRONTEND
        const nestedDashboardStructure = [
            {
                title: 'PIKET',
                emoji: '🧹',
                introText: null,
                staticNotes: [
                    'Jadi, yang ada namanya di atas, mohon datang pagi-pagi, jam 06.30 sudah ada di lokasi masing masing🙏',
                ],
                subtitles: [
                    { subtitle: 'YANG AKAN MEMBERSIHKAN DI RUANG GURU', classes: [], backend_task_group: 'RUANG GURU' },
                    { subtitle: 'YANG AKAN MEMBERSIHKAN DI AULA', classes: [], backend_task_group: 'AULA' },
                    { subtitle: 'YANG AKAN MEMBERSIHKAN DI GASEBO', classes: [], backend_task_group: 'GASEBO' },
                ],
                 backend_category: 'PIKET',
            },
            {
                title: 'JADWAL BUANG SAMPAH',
                emoji: '🗑️',
                subtitles: [],
                staticNotes: [],
                introText: 'Sepulang sekolah supaya ke POS Lapor Sampah dikoordinir oleh ketua kelas dan didampingi wali kelas',
                currentClass: null,
                backend_category: 'Jadwal Buang Sampah',
                id: null // Tambahkan properti ID di sini
            },
            {
                title: 'PARKIRAN',
                emoji: '🅿️',
                introText: null,
                staticNotes: [],
                subtitles: [
                    { subtitle: 'JAGA PARKIRAN CEWEK', classes: [], backend_task_group: 'JAGA PARKIRAN CEWEK' },
                    { subtitle: 'JAGA PARKIRAN COWOK', classes: [], backend_task_group: 'JAGA PARKIRAN COWOK' },
                    { subtitle: 'JAGA PARKIRAN DIBELAKANG RUANG GURU', classes: [], backend_task_group: 'JAGA PARKIRAN DIBELAKANG RUANG GURU' },
                    { subtitle: 'JAGA PARKIRAN SEBELAH BARAT', classes: [], backend_task_group: 'JAGA PARKIRAN SEBELAH BARAT' },
                ],
                 backend_category: 'PARKIRAN',
            },
             { // SECTION JADWAL PEMBERSIHAN AREA PARKIRAN
              title: 'JADWAL PEMBERSIHAN AREA PARKIRAN',
              emoji: '🅿️✨',
              introText: null,
              staticNotes: [],
              subtitles: [
                { subtitle: 'AREA PARKIRAN COWOK', classes: [], backend_task_group: 'AREA PARKIRAN COWOK' },
                { subtitle: 'AREA PARKIRAN DI BELAKANG RUANG GURU', classes: [], backend_task_group: 'AREA PARKIRAN DI BELAKANG RUANG GURU' },
              ],
               backend_category: 'JADWAL PEMBERSIHAN AREA PARKIRAN',
            },
            {
                title: 'DUTA KARAKTER',
                emoji: '✨',
                introText: null,
                staticNotes: [
                    'NOTE: AMBIL SELEMPANG DUTA DI SEKRET OSIS, DAN APABILA TELAH DIGUNAKAN MOHON UNTUK DIKEMBALIKAN KE TEMPATNYA SEMULA',
                ],
                subtitles: [
                    { subtitle: 'GERBANG UTAMA', classes: [], backend_task_group: 'GERBANG UTAMA' },
                    { subtitle: 'GERBANG CEWEK', classes: [], backend_task_group: 'GERBANG CEWEK' },
                ],
                 backend_category: 'DUTA KARAKTER',
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
                if (targetSection.title === 'JADWAL BUANG SAMPAH') {
                    targetSection.currentClass = className;
                    if (studentsArray.length > 0) {
                       targetSection.introText = studentsArray.join(', ');
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
                            studentsArray.forEach(student => {
                               if (!existingClass.students.includes(student)) {
                                  existingClass.students.push(student);
                               }
                            });
                         } else {
                            targetSubtitle.classes.push({
                              // SERTAKAN ID di objek kelas
                              id: assignment.id,
                              className: className,
                              students: studentsArray,
                              // Sertakan juga category dan task_group di objek kelas untuk referensi di frontend admin
                              category: backendCategory,
                              task_group: backendTaskGroup
                            });
                         }
                    } else {
                        console.warn(`Data dari backend dengan task_group "${backendTaskGroup}" tidak bisa dimapping ke subtitle di section "${backendCategory}". Pastikan backend_task_group di frontend sesuai dengan nilai task_group dari backend. Data:`, assignment);
                    }
                }
            } else {
               console.warn(`Data dari backend dengan kategori "${backendCategory}" tidak bisa dimapping ke section manapun. Pastikan backend_category di frontend sesuai dengan nilai category dari backend. Data:`, assignment);
            }
        });

        console.log('Transformed nested data:', nestedDashboardStructure);
        res.json(nestedDashboardStructure); // Mengirimkan array dengan struktur bersarang

    } catch (err) {
        console.error("Error fetching and transforming daily assignments:", err);
        res.status(500).json({ message: "Gagal mengambil data penugasan.", error: err.message });
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

        let sql;
        let params;

        if (category === 'Jadwal Buang Sampah') {
            sql = `INSERT INTO ?? (${columnNames.class}, ${columnNames.students}) VALUES (?, ?)`;
            params = [tableName, assignmentClass, students];
        } else {
             if (!task_group) {
                 console.warn("Validasi gagal: task_group kosong untuk kategori yang membutuhkannya.");
                 return res.status(400).json({ message: "Sub-judul / Kelompok tugas harus diisi untuk kategori ini." });
             }
            sql = `INSERT INTO ?? (${columnNames.task_group}, ${columnNames.class}, ${columnNames.students}) VALUES (?, ?, ?)`;
            params = [tableName, task_group, assignmentClass, students];
        }

        console.log(`Executing INSERT query into ${tableName}:`, sql, params);

        const [result] = await connection.query(sql, params);

        console.log(`Berhasil menambahkan penugasan ke ${tableName}. InsertId: ${result.insertId}`);
        res.status(201).json({
            message: "Penugasan berhasil ditambahkan!",
            id: result.insertId,
            _id: result.insertId,
            category: category,
            task_group: task_group,
            class: assignmentClass,
            students: students,
            table_name: tableName
        });

    } catch (err) {
        console.error("Error saving assignment:", err);
        // Mengembalikan error database secara detail ke frontend untuk debugging
        res.status(500).json({
            message: "Gagal menambahkan penugasan.",
            error: err.message,
            dbError: {
                code: err.code,
                errno: err.errno,
                sqlState: err.sqlState,
                sqlMessage: err.sqlMessage,
                sql: err.sql
            }
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
    const category = req.params.category;
    const { class: assignmentClass, students } = req.body;
    let connection;

    console.log(`Menerima permintaan PUT /api/daily-assignments/${category}/${assignmentId}`, req.body);

    try {
        connection = await pool.getConnection();
        console.log("Koneksi database berhasil didapatkan dari pool.");

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

        // Query UPDATE disesuaikan berdasarkan kolom yang ada di tabel
        let sql;
        let params;

        if (category === 'Jadwal Buang Sampah') {
             // Untuk dashboard_buang_sampah, hanya update class_name dan description
             sql = `UPDATE ?? SET ${columnNames.class} = ?, ${columnNames.students} = ? WHERE ${columnNames.id} = ?`;
             params = [tableName, assignmentClass, students, assignmentId];
        } else {
             // Untuk kategori lain, update class_name dan assigned_students/assigned_to/assigned_student
             // task_group tidak diupdate di sini karena sudah terkait dengan ID penugasan
             sql = `UPDATE ?? SET ${columnNames.class} = ?, ${columnNames.students} = ? WHERE ${columnNames.id} = ?`;
             params = [tableName, assignmentClass, students, assignmentId];
        }


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
        // Mengembalikan error database secara detail ke frontend untuk debugging
        res.status(500).json({
            message: "Gagal memperbarui penugasan.",
            error: err.message,
            dbError: {
                code: err.code,
                errno: err.errno,
                sqlState: err.sqlState,
                sqlMessage: err.sqlMessage,
                sql: err.sql
            }
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
    const category = req.params.category;
    let connection;

    console.log(`Menerima permintaan DELETE /api/daily-assignments/${category}/${assignmentId}`);

    try {
        connection = await pool.getConnection();
        console.log("Koneksi database berhasil didapatkan dari pool.");

        const tableName = getTableNameFromCategory(category);
        const columnNames = getColumnNamesForTable(tableName);

         if (!tableName || !columnNames) {
             console.warn(`Kategori tidak didukung untuk delete: ${category}`);
             return res.status(400).json({ message: `Kategori tidak didukung: ${category}` });
         }

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
        // Mengembalikan error database secara detail ke frontend untuk debugging
        res.status(500).json({
            message: "Gagal menghapus penugasan.",
            error: err.message,
            dbError: {
                code: err.code,
                errno: err.errno,
                sqlState: err.sqlState,
                sqlMessage: err.sqlMessage,
                sql: err.sql
            }
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
