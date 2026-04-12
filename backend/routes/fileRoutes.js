const express = require('express');
const router = express.Router();
const { uploadFile, downloadFile, getFileInfo } = require('../controllers/fileController');
const upload = require('../middlewares/uploadMiddleware');

router.post('/upload', upload.single('file'), uploadFile);
router.get('/info/:code', getFileInfo);
router.get('/download/:code', downloadFile);

module.exports = router;
