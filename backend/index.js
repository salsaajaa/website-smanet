const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./src/config/db');

const dailyAssignmentsApi = require('./src/routes/dailyAssignmentsApi');
const adminRoutes = require('./src/routes/adminRoute');
const authRoutes = require('./src/routes/authRoute');
const newsRouter = require('./src/routes/newsRoute');
const announcementRouter = require('./src/routes/announcementRoute');
const contactRoutes = require('./src/routes/contactRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/daily-assignments', dailyAssignmentsApi);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRouter);
app.use('/api/announcements', announcementRouter);
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
  res.send('Backend SMANET API is running!');
});

app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Backend API listening at http://localhost:${port}`);
});

db.on('error', (err) => {
  console.error('Database connection error:', err);
});

db.once('open', () => {
    console.log('Database connection successful!');
});