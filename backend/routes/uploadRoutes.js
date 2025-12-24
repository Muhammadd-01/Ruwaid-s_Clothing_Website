import express from 'express';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// @desc    Upload single image
// @route   POST /api/upload
// @access  Public
router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Return the path relative to the server root
    const filePath = `/uploads/${req.file.filename}`;

    res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
            path: filePath
        }
    });
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Public
router.post('/multiple', upload.array('images', 5), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    const filePaths = req.files.map(file => `/uploads/${file.filename}`);

    res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        data: {
            paths: filePaths
        }
    });
});

export default router;
