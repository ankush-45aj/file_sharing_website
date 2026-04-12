const File = require('../models/File');
const fs = require('fs');
const path = require('path');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded or file type not supported/too large' });
        }
        
        // Generate a unique 6-digit code
        let code;
        let isUnique = false;
        while (!isUnique) {
            code = generateOTP();
            const existing = await File.findOne({ code });
            if (!existing) isUnique = true;
        }
        
        const newFile = new File({
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
            code: code
        });
        
        await newFile.save();
        res.status(201).json({ msg: 'File uploaded successfully', code: newFile.code });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.downloadFile = async (req, res) => {
    try {
        const { code } = req.params;
        const file = await File.findOne({ code }).select('+path');
        
        if (!file) {
            return res.status(404).json({ msg: 'Invalid code or file expired' });
        }
        
        if (fs.existsSync(file.path)) {
            res.download(file.path, file.originalName);
        } else {
            res.status(404).json({ msg: 'File not found on server' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getFileInfo = async (req, res) => {
    try {
        const { code } = req.params;
        const file = await File.findOne({ code });
        
        if (!file) {
            return res.status(404).json({ msg: 'Invalid code or file expired' });
        }
        
        res.json({ originalName: file.originalName, size: file.size });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
