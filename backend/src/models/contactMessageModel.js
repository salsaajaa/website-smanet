const db = require('../config/db');

const createContactMessage = async (name, email, message) => {
    console.log('ContactMessageModel: Creating new contact message.');
    try {
        const query = 'INSERT INTO contact_messages (name, email, message, is_read) VALUES (?, ?, ?, FALSE)';
        const [result] = await db.execute(query, [name, email, message]);
        console.log('ContactMessageModel: New contact message created with ID:', result.insertId);
        return { id: result.insertId, name, email, message, is_read: false, created_at: new Date() }; // Tambahkan created_at default
    } catch (error) {
        console.error('ContactMessageModel: Error creating new contact message:', error);
        throw error;
    }
};

const getAllContactMessages = async () => {
    console.log('ContactMessageModel: Fetching all contact messages.');
    try {
        const query = 'SELECT id, name, email, message, is_read, created_at FROM contact_messages ORDER BY created_at DESC';
        const [rows] = await db.execute(query);
        const messages = rows.map(row => ({
            id: row.id,
            name: row.name,
            email: row.email,
            message: row.message,
            is_read: !!row.is_read,
            created_at: row.created_at
        }));
        console.log('ContactMessageModel: Found', messages.length, 'contact messages.');
        return messages;
    } catch (error) {
        console.error('ContactMessageModel: Error fetching all contact messages:', error);
        throw error;
    }
};

const markMessageAsReadInDb = async (id) => {
    console.log(`ContactMessageModel: Marking message ID ${id} as read in DB.`);
    try {
        // PERIKSA BAIK-BAIK NAMA TABEL (contact_messages) DAN KOLOM (is_read) DI SINI
        const query = 'UPDATE contact_messages SET is_read = TRUE WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        console.log(`ContactMessageModel: Message ID ${id} marked as read. Affected rows: ${result.affectedRows}`);
        return { success: result.affectedRows > 0, affectedRows: result.affectedRows };
    } catch (error) {
        console.error(`ContactMessageModel: Error marking message ID ${id} as read in DB:`, error);
        throw error;
    }
};

const deleteContactMessageInDb = async (id) => {
    console.log(`ContactMessageModel: Deleting contact message with ID ${id} from DB.`);
    try {
        // PERIKSA BAIK-BAIK NAMA TABEL (contact_messages) DI SINI
        const query = 'DELETE FROM contact_messages WHERE id = ?';
        const [result] = await db.execute(query, [id]);
         console.log(`ContactMessageModel: Contact message ID ${id} deleted. Affected rows: ${result.affectedRows}`);
        return { success: result.affectedRows > 0, affectedRows: result.affectedRows };
    } catch (error) {
        console.error(`ContactMessageModel: Error deleting contact message with ID ${id} from DB:`, error);
        throw error;
    }
};

module.exports = {
    createContactMessage,
    getAllContactMessages,
    markMessageAsReadInDb,
    deleteContactMessageInDb,
};