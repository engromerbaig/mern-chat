// controllers/message.controller.js
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { uploadOnCloudinary } from '../utils/uploadOnCloudinary.js';
import axios from "axios";


export const downloadFile = async (req, res) => {
  try {
    const { messageId } = req.params;

    // Fetch the message by ID
    const message = await Message.findById(messageId);
    if (!message || !message.fileUrl) {
      return res.status(404).json({ error: "File not found" });
    }

    const fileUrl = message.fileUrl;
    const originalFileName = message.originalFileName || "download";

    // Fetch the file from Cloudinary (use axios or any other method to stream the file)
    const response = await axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'stream',  // This is important for streaming the file
    });

    // Set headers to force download with the original file name
    res.setHeader('Content-Disposition', `attachment; filename="${originalFileName}"`);
    res.setHeader('Content-Type', response.headers['content-type']);

    // Pipe the file stream to the response
    response.data.pipe(res);
  } catch (error) {
    console.error("Error downloading file: ", error.message);
    res.status(500).json({ error: "Failed to download file" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let fileUrl = null;
    let originalFileName = null;  // New field for original file name

    if (req.file) {
      const fileBuffer = req.file.buffer;  // Get file buffer from multer
      const cloudinaryResult = await uploadOnCloudinary(fileBuffer);  // Upload to Cloudinary
      if (cloudinaryResult) {
        fileUrl = cloudinaryResult;  // Get Cloudinary URL
        originalFileName = req.file.originalname;  // Capture original file name from Multer
      }
    }

    // Check if a conversation exists or create a new one
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create a new message
    const newMessage = new Message({
      senderId,
      receiverId,
      message: message || "",  // Text message
      fileUrl,                 // Cloudinary URL
      originalFileName,        // Original file name from Multer
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    // Emit the message to both sender and receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    io.to(receiverSocketId).emit("newMessage", newMessage);
    io.to(req.user.socketId).emit("newMessage", newMessage);

    // Send response to the sender
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};



  

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
