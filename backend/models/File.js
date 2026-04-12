const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    path: { type: String, select: false, required: true },
    size: { type: Number, required: true },
    mimetype: { type: String, required: true },
    code: { type: String, required: true, unique: true }, // The 6-digit OTP
    createdAt: { type: Date, default: Date.now, expires: 86400 } // Auto delete from DB after 24 hours
});

module.exports = mongoose.model('File', FileSchema);
