import express from 'express';
import { upload } from '../middleware/multer.js';  // Multer middleware for handling file uploads
import { uploadOnCloudinary } from '../utils/uploadOnCloudinary.js';  // Cloudinary utility

const router = express.Router();

// Route to upload a file via Multer and directly to Cloudinary
router.post('/test-upload-cloudinary', upload.single('file'), async (req, res) => {
  try {
    // Check if the file is provided
    if (!req.file) {
      console.error('No file provided');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Log file details for debugging
    console.log('File received:', req.file.originalname, req.file.mimetype);

    // Upload the file to Cloudinary
    const cloudinaryUrl = await uploadOnCloudinary(req.file.buffer); // Use the file buffer

    // Return success response with Cloudinary URL
    res.status(200).json({
      message: 'File uploaded to Cloudinary successfully',
      cloudinaryUrl,
    });
  } catch (error) {
    console.error('Error during Cloudinary upload:', error.message);
    res.status(500).json({ error: 'Failed to upload file to Cloudinary' });
  }
});

export default router;
