require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const fileRoutes = require('./routes/fileRoutes');
const fs = require('fs');

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

connectDB();

app.use(cors());
app.use(express.json());

// Static folder
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/files', fileRoutes);

// Base routes
app.get('/', (req, res) => {
    res.send('🚀 File Sharing Backend Running');
});

app.get('/api', (req, res) => {
    res.send('📂 API is working');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
