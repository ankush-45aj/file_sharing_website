require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const fileRoutes = require('./routes/fileRoutes');
const fs = require('fs');
const path = require('path');

const app = express();

// Create uploads directory if it doesn't exist
// Note: On Render, this folder is temporary and will be wiped on restarts.
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// Connect to MongoDB
connectDB();

// Updated CORS Configuration
// Using "*" and adding OPTIONS helps bypass the Vercel-to-Render communication blocks.
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

// Static folder for file access
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
// Your frontend api.js should point to: https://your-url.onrender.com/api/files
app.use('/api/files', fileRoutes);

// Base Health Check Routes
app.get('/', (req, res) => {
    res.send('🚀 File Sharing Backend Running');
});

app.get('/api', (req, res) => {
    res.send('📂 API is working');
});

// Port handling for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
