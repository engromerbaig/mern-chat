// backend\middleware\multer.js
import multer from 'multer';

// Use memory storage so the file is stored as a buffer in memory
const storage = multer.memoryStorage(); 

// Define a file filter for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp3|wav|csv/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else if (file.originalname.toLowerCase().endsWith('.txt') && file.mimetype === 'text/plain') {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type!'), false);
  }
};

// Multer setup
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter,
});