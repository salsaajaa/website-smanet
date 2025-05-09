const db = require('../config/db');

// Fungsi untuk mengambil ringkasan dashboard (total berita, pengumuman, pesan kontak)
const getDashboardSummary = async () => {
    console.log('DashboardModel: Fetching dashboard summary.');
    try {
        // Pastikan nama tabel 'news', 'announcements', 'contact_messages' sesuai di database Anda
        const newsCountQuery = 'SELECT COUNT(*) AS total_news FROM news';
        const announcementsCountQuery = 'SELECT COUNT(*) AS total_announcements FROM announcements';
        // Hitung pesan kontak yang belum dibaca
        const contactMessagesCountQuery = 'SELECT COUNT(*) AS new_contact_messages FROM contact_messages WHERE is_read = 0';

        const [newsCountRows] = await db.execute(newsCountQuery);
        const [announcementsCountRows] = await db.execute(announcementsCountQuery);
        const [contactMessagesCountRows] = await db.execute(contactMessagesCountQuery);

        const summary = {
            total_news: newsCountRows[0].total_news,
            total_announcements: announcementsCountRows[0].total_announcements,
            new_contact_messages: contactMessagesCountRows[0].new_contact_messages,
        };

        console.log('DashboardModel: Fetched dashboard summary:', summary);
        return summary;
    } catch (error) {
        console.error('DashboardModel: Error fetching dashboard summary:', error);
        throw error;
    }
};


const getBuangSampahClass = async () => {
    console.log('DashboardModel: Fetching Buang Sampah class data.');
    try {
        const query = 'SELECT id, class_name, description FROM dashboard_buang_sampah LIMIT 1';
        const [rows] = await db.execute(query);
        console.log('DashboardModel: Found Buang Sampah data:', rows[0]);
        return rows[0];
    } catch (error) {
        console.error('DashboardModel: Error fetching Buang Sampah class data:', error);
        throw error;
    }
};

const saveBuangSampahClass = async (data) => {
    console.log('DashboardModel: Saving Buang Sampah class data.', data);
    try {
        // Menggunakan INSERT ... ON DUPLICATE KEY UPDATE untuk menangani kasus insert pertama atau update
        // Asumsi hanya ada 1 baris dengan ID 1 untuk data konfigurasi Buang Sampah
        const query = `
            INSERT INTO dashboard_buang_sampah (id, class_name, description)
            VALUES (1, ?, ?)
            ON DUPLICATE KEY UPDATE
            class_name = VALUES(class_name), description = VALUES(description), updated_at = CURRENT_TIMESTAMP;
        `;
        const values = [data.class_name, data.description || null];
        const [result] = await db.execute(query, values);
        console.log('DashboardModel: Buang Sampah class data saved/updated.', result);
        return result;
    } catch (error) {
        console.error('DashboardModel: Error saving Buang Sampah class data:', error);
        throw error;
    }
};

const getParkiranAssignments = async () => {
    console.log('DashboardModel: Fetching Parkiran assignments.');
    try {
        const query = 'SELECT id, task_name, assigned_to, status, due_date FROM dashboard_parkiran ORDER BY due_date ASC';
        const [rows] = await db.execute(query);
        console.log('DashboardModel: Found', rows.length, 'Parkiran assignments.');
        return rows;
    } catch (error) {
        console.error('DashboardModel: Error fetching Parkiran assignments:', error);
        throw error;
    }
};

const addParkiranAssignment = async (assignmentData) => {
    console.log('DashboardModel: Adding Parkiran assignment.', assignmentData);
    try {
        const query = 'INSERT INTO dashboard_parkiran (task_name, assigned_to, status, due_date) VALUES (?, ?, ?, ?)';
        const values = [
            assignmentData.task_name,
            assignmentData.assigned_to || null,
            assignmentData.status || 'pending',
            assignmentData.due_date || null,
        ];
        const [result] = await db.execute(query, values);
        console.log('DashboardModel: Parkiran assignment added.', result);
        return result;
    } catch (error) {
        console.error('DashboardModel: Error adding Parkiran assignment:', error);
        throw error;
    }
};

const updateParkiranAssignment = async (id, assignmentData) => {
    console.log(`DashboardModel: Updating Parkiran assignment with ID ${id}.`, assignmentData);
    try {
        const query = `
            UPDATE dashboard_parkiran
            SET task_name = ?, assigned_to = ?, status = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        const values = [
            assignmentData.task_name,
            assignmentData.assigned_to || null,
            assignmentData.status || 'pending',
            assignmentData.due_date || null,
            id,
        ];
        const [result] = await db.execute(query, values);
        console.log(`DashboardModel: Parkiran assignment with ID ${id} updated.`, result);
        return result;
    } catch (error) {
        console.error(`DashboardModel: Error updating Parkiran assignment with ID ${id}:`, error);
        throw error;
    }
};

const deleteParkiranAssignment = async (id) => {
    console.log(`DashboardModel: Deleting Parkiran assignment with ID ${id}.`);
    try {
        const query = 'DELETE FROM dashboard_parkiran WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        console.log(`DashboardModel: Parkiran assignment with ID ${id} deleted.`, result);
        return result;
    } catch (error) {
        console.error(`DashboardModel: Error deleting Parkiran assignment with ID ${id}:`, error);
        throw error;
    }
};


const getPiketAssignments = async () => {
    console.log('DashboardModel: Fetching Piket assignments.');
    try {
        // Mengambil semua data piket, diurutkan berdasarkan hari dalam seminggu
        const query = 'SELECT id, day_of_week, class_name, assigned_students FROM dashboard_piket ORDER BY FIELD(day_of_week, "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu")';
        const [rows] = await db.execute(query);
        console.log('DashboardModel: Found', rows.length, 'Piket assignments.');
        return rows;
    } catch (error) {
        console.error('DashboardModel: Error fetching Piket assignments:', error);
        throw error;
    }
};

const addPiketAssignment = async (assignmentData) => {
     console.log('DashboardModel: Adding Piket assignment.', assignmentData);
     try {
         const query = 'INSERT INTO dashboard_piket (day_of_week, class_name, assigned_students) VALUES (?, ?, ?)';
         const values = [
             assignmentData.day_of_week,
             assignmentData.class_name || null,
             assignmentData.assigned_students || null,
         ];
         const [result] = await db.execute(query, values);
         console.log('DashboardModel: Piket assignment added.', result);
         return result;
     } catch (error) {
         console.error('DashboardModel: Error adding Piket assignment:', error);
         throw error;
     }
};

const updatePiketAssignment = async (id, assignmentData) => {
    console.log(`DashboardModel: Updating Piket assignment with ID ${id}.`, assignmentData);
    try {
        const query = `
            UPDATE dashboard_piket
            SET day_of_week = ?, class_name = ?, assigned_students = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        const values = [
            assignmentData.day_of_week,
            assignmentData.class_name || null,
            assignmentData.assigned_students || null,
            id,
        ];
        const [result] = await db.execute(query, values);
        console.log(`DashboardModel: Piket assignment with ID ${id} updated.`, result);
        return result;
    } catch (error) {
        console.error(`DashboardModel: Error updating Piket assignment with ID ${id}:`, error);
        throw error;
    }
};

const deletePiketAssignment = async (id) => {
     console.log(`DashboardModel: Deleting Piket assignment with ID ${id}.`);
     try {
         const query = 'DELETE FROM dashboard_piket WHERE id = ?';
         const [result] = await db.execute(query, [id]);
         console.log(`DashboardModel: Piket assignment with ID ${id} deleted.`, result);
         return result;
     } catch (error) {
         console.error(`DashboardModel: Error deleting Piket assignment with ID ${id}:`, error);
         throw error;
     }
};


const getDutaAssignments = async () => {
    console.log('DashboardModel: Fetching Duta assignments.');
    try {
        const query = 'SELECT id, duta_name, assigned_student, period FROM dashboard_duta ORDER BY duta_name ASC';
        const [rows] = await db.execute(query);
        console.log('DashboardModel: Found', rows.length, 'Duta assignments.');
        return rows;
    } catch (error) {
        console.error('DashboardModel: Error fetching Duta assignments:', error);
        throw error;
    }
};

const addDutaAssignment = async (assignmentData) => {
     console.log('DashboardModel: Adding Duta assignment.', assignmentData);
     try {
         const query = 'INSERT INTO dashboard_duta (duta_name, assigned_student, period) VALUES (?, ?, ?)';
         const values = [
             assignmentData.duta_name,
             assignmentData.assigned_student || null,
             assignmentData.period || null,
         ];
         const [result] = await db.execute(query, values);
         console.log('DashboardModel: Duta assignment added.', result);
         return result;
     } catch (error) {
         console.error('DashboardModel: Error adding Duta assignment:', error);
         throw error;
     }
};

const updateDutaAssignment = async (id, assignmentData) => {
    console.log(`DashboardModel: Updating Duta assignment with ID ${id}.`, assignmentData);
    try {
        const query = `
            UPDATE dashboard_duta
            SET duta_name = ?, assigned_student = ?, period = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        const values = [
            assignmentData.duta_name,
            assignmentData.assigned_student || null,
            assignmentData.period || null,
            id,
        ];
        const [result] = await db.execute(query, values);
        console.log(`DashboardModel: Duta assignment with ID ${id} updated.`, result);
        return result;
    } catch (error) {
        console.error(`DashboardModel: Error updating Duta assignment with ID ${id}:`, error);
        throw error;
    }
};

const deleteDutaAssignment = async (id) => {
     console.log(`DashboardModel: Deleting Duta assignment with ID ${id}.`);
     try {
         const query = 'DELETE FROM dashboard_duta WHERE id = ?';
         const [result] = await db.execute(query, [id]);
         console.log(`DashboardModel: Duta assignment with ID ${id} deleted.`, result);
         return result;
     } catch (error) {
         console.error(`DashboardModel: Error deleting Duta assignment with ID ${id}:`, error);
         throw error;
     }
};


module.exports = {
    getDashboardSummary,
    getBuangSampahClass,
    saveBuangSampahClass,

    getParkiranAssignments,
    addParkiranAssignment,
    updateParkiranAssignment,
    deleteParkiranAssignment,

    getPiketAssignments,
    addPiketAssignment,
    updatePiketAssignment,
    deletePiketAssignment,

    getDutaAssignments,
    addDutaAssignment,
    updateDutaAssignment,
    deleteDutaAssignment,
};
