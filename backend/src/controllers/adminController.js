const dashboardModel = require('../models/dashboardModel');
const newsModel = require('../models/newsModel');
const announcementModel = require('../models/announcementModel');
const contactMessageModel = require('../models/contactMessageModel');
const uploadHelper = require('../utils/uploadHelper');
const path = require('path');

// --- Dashboard Summary ---
const getDashboardSummary = async (req, res) => {
    try {
        const summary = await dashboardModel.getDashboardSummary();
        res.json(summary);
    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard summary', error: error.message });
    }
};

// --- Buang Sampah ---
const getBuangSampahClass = async (req, res) => {
    try {
        const data = await dashboardModel.getBuangSampahClass();
        res.json(data || null);
    } catch (error) {
        console.error('Error fetching Buang Sampah class data:', error);
        res.status(500).json({ message: 'Failed to fetch Buang Sampah class data', error: error.message });
    }
};

const saveBuangSampahClass = async (req, res) => {
    try {
        const result = await dashboardModel.saveBuangSampahClass(req.body);
        res.json({ message: 'Data saved successfully', result });
    } catch (error) {
        console.error('Error saving Buang Sampah class data:', error);
        res.status(500).json({ message: 'Failed to save data', error: error.message });
    }
};

// --- Parkiran ---
const getParkiranAssignments = async (req, res) => {
    try {
        const data = await dashboardModel.getParkiranAssignments();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch Parkiran assignments', error: error.message });
    }
};

const addParkiranAssignment = async (req, res) => {
    try {
        const result = await dashboardModel.addParkiranAssignment(req.body);
        res.status(201).json({ message: 'Assignment added', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add Parkiran assignment', error: error.message });
    }
};

const updateParkiranAssignment = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await dashboardModel.updateParkiranAssignment(id, req.body);
        result.affectedRows > 0 ?
            res.json({ message: 'Updated', id }) :
            res.status(404).json({ message: 'Not found' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update', error: error.message });
    }
};

const deleteParkiranAssignment = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await dashboardModel.deleteParkiranAssignment(id);
        result.affectedRows > 0 ?
            res.json({ message: 'Deleted', id }) :
            res.status(404).json({ message: 'Not found' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete', error: error.message });
    }
};

// --- Piket ---
const getPiketAssignments = async (req, res) => {
    try {
        const data = await dashboardModel.getPiketAssignments();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch', error: error.message });
    }
};

const addPiketAssignment = async (req, res) => {
    try {
        const result = await dashboardModel.addPiketAssignment(req.body);
        res.status(201).json({ message: 'Added', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add', error: error.message });
    }
};

const updatePiketAssignment = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await dashboardModel.updatePiketAssignment(id, req.body);
        result.affectedRows > 0 ?
            res.json({ message: 'Updated', id }) :
            res.status(404).json({ message: 'Not found' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update', error: error.message });
    }
};

const deletePiketAssignment = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await dashboardModel.deletePiketAssignment(id);
        result.affectedRows > 0 ?
            res.json({ message: 'Deleted', id }) :
            res.status(404).json({ message: 'Not found' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete', error: error.message });
    }
};

// --- Duta Karakter ---
const getDutaAssignments = async (req, res) => {
    try {
        const data = await dashboardModel.getDutaAssignments();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch', error: error.message });
    }
};

const addDutaAssignment = async (req, res) => {
    try {
        const result = await dashboardModel.addDutaAssignment(req.body);
        res.status(201).json({ message: 'Added', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add', error: error.message });
    }
};

const updateDutaAssignment = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await dashboardModel.updateDutaAssignment(id, req.body);
        result.affectedRows > 0 ?
            res.json({ message: 'Updated', id }) :
            res.status(404).json({ message: 'Not found' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update', error: error.message });
    }
};

const deleteDutaAssignment = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await dashboardModel.deleteDutaAssignment(id);
        result.affectedRows > 0 ?
            res.json({ message: 'Deleted', id }) :
            res.status(404).json({ message: 'Not found' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete', error: error.message });
    }
};

// --- News ---
const getAllNews = async (req, res) => {
    try {
        const news = await newsModel.getAllNews();
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch news', error: error.message });
    }
};

const createNews = async (req, res) => {
    try {
        const data = req.body;
        data.image_url = req.file ? `/uploads/${req.file.filename}` : null;
        const result = await newsModel.createNews(data);
        res.status(201).json({ message: 'News created', newsId: result.insertId });
    } catch (error) {
        if (req.file) uploadHelper.deleteFile(req.file.path);
        res.status(500).json({ message: 'Failed to create news', error: error.message });
    }
};

const getNewsById = async (req, res) => {
    try {
        const news = await newsModel.getNewsById(req.params.id);
        news ? res.json(news) : res.status(404).json({ message: 'Not found' });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news', error: error.message });
    }
};

const updateNews = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const existing = await newsModel.getNewsById(id);
        if (!existing) {
            if (req.file) uploadHelper.deleteFile(req.file.path);
            return res.status(404).json({ message: 'Not found' });
        }

        if (req.file) {
            data.image_url = `/uploads/${req.file.filename}`;
            if (existing.image_url) uploadHelper.deleteFile(path.join(__dirname, '..', '..', existing.image_url));
        } else {
            data.image_url = existing.image_url;
        }

        const result = await newsModel.updateNews(id, data);
        res.json({ message: 'Updated', result });
    } catch (error) {
        if (req.file) uploadHelper.deleteFile(req.file.path);
        res.status(500).json({ message: 'Failed to update', error: error.message });
    }
};

const deleteNews = async (req, res) => {
    try {
        const existing = await newsModel.getNewsById(req.params.id);
        if (!existing) return res.status(404).json({ message: 'Not found' });
        if (existing.image_url) uploadHelper.deleteFile(path.join(__dirname, '..', '..', existing.image_url));
        const result = await newsModel.deleteNews(req.params.id);
        res.json({ message: 'Deleted', result });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete', error: error.message });
    }
};

// --- Announcements ---
const getAllAnnouncements = async (req, res) => {
    try {
        const data = await announcementModel.getAllAnnouncements();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch', error: error.message });
    }
};

const createAnnouncement = async (req, res) => {
    try {
        const data = req.body;
        data.image_url = req.file ? `/uploads/${req.file.filename}` : null;
        const result = await announcementModel.createAnnouncement(data);
        res.status(201).json({ message: 'Created', announcementId: result.insertId });
    } catch (error) {
        if (req.file) uploadHelper.deleteFile(req.file.path);
        res.status(500).json({ message: 'Failed to create', error: error.message });
    }
};

const getAnnouncementById = async (req, res) => {
    try {
        const item = await announcementModel.getAnnouncementById(req.params.id);
        item ? res.json(item) : res.status(404).json({ message: 'Not found' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch', error: error.message });
    }
};

const updateAnnouncement = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const existing = await announcementModel.getAnnouncementById(id);

        if (!existing) {
            if (req.file) uploadHelper.deleteFile(req.file.path);
            return res.status(404).json({ message: 'Not found' });
        }

        if (req.file) {
            data.image_url = `/uploads/${req.file.filename}`;
            if (existing.image_url) uploadHelper.deleteFile(path.join(__dirname, '..', '..', existing.image_url));
        } else {
            data.image_url = existing.image_url;
        }

        const result = await announcementModel.updateAnnouncement(id, data);
        res.json({ message: 'Updated', result });
    } catch (error) {
        if (req.file) uploadHelper.deleteFile(req.file.path);
        res.status(500).json({ message: 'Failed to update', error: error.message });
    }
};

const deleteAnnouncement = async (req, res) => {
    try {
        const existing = await announcementModel.getAnnouncementById(req.params.id);
        if (!existing) return res.status(404).json({ message: 'Not found' });
        if (existing.image_url) uploadHelper.deleteFile(path.join(__dirname, '..', '..', existing.image_url));
        const result = await announcementModel.deleteAnnouncement(req.params.id);
        res.json({ message: 'Deleted', result });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete', error: error.message });
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
    getAllNews,
    createNews,
    getNewsById,
    updateNews,
    deleteNews,
    getAllAnnouncements,
    createAnnouncement,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement
};