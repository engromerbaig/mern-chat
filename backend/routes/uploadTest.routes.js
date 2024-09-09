// backend\routes\uploadTest.routes.js
import express from 'express';
import { upload } from '../middleware/multer.js';  // Multer middleware
import { uploadOnCloudinary } from '../utils/uploadOnCloudinary.js';  // Cloudinary utility

const router = express.Router();

// Route to upload a file via Multer and directly to Cloudinary
router.post('/test-upload-cloudinary', upload.single('file'), async (req, res) => {
  try {
    // Check if file is provided
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Access the file buffer
    const fileBuffer = req.file.buffer;

    // Upload the file to Cloudinary
    const cloudinaryUrl = await uploadOnCloudinary(fileBuffer);

    // Return success response with Cloudinary URL
    res.status(200).json({
      message: 'File uploaded to Cloudinary successfully',
      cloudinaryUrl,
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    res.status(500).json({ error: 'Failed to upload file to Cloudinary' });
  }
});

export default router;
