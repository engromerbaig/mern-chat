// backend/routes/uploadTest.routes.js
import express from 'express';
import multer from 'multer';
import path from 'path';

// Define simple multer setup for testing
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Use a simple folder for testing
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);  // Unique file name
  }
});

const upload = multer({ storage });

const router = express.Router();

// Simple file upload route for testing
router.post('/test-upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded G' });
  }
  res.status(200).json({
    message: 'File uploaded successfully',
    file: req.file
  });
});

export default router;
