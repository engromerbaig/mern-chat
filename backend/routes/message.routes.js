// backend\routes\message.routes.js
import express from "express";
import { getMessages, sendMessage, downloadFile } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import { upload } from "../middleware/multer.js";  // Import multer for file uploads

const router = express.Router();

// Get messages for a specific conversation (protected)
router.get("/:id", protectRoute, getMessages);

// Send message with optional media (protected)
// Use multer's upload middleware to handle file uploads (single file per request)
router.post("/send/:id", protectRoute, upload.single('file'), sendMessage);


// Route to download the file
router.get('/download/:messageId', downloadFile);

export default router;
