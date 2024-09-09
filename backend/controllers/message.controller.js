// backend/controllers/message.controller.js
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { uploadOnCloudinary } from '../utils/uploadOnCloudinary.js';

export const sendMessage = async (req, res) => {
	try {
	  const { message } = req.body;
	  const { id: receiverId } = req.params;
	  const senderId = req.user._id;
  
	  let fileUrl = null;
	  if (req.file) {
		const fileBuffer = req.file.buffer;  // Get file buffer
		const cloudinaryResult = await uploadOnCloudinary(fileBuffer);  // Upload to Cloudinary
		if (cloudinaryResult) {
		  fileUrl = cloudinaryResult;  // Get secure URL from Cloudinary
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
		fileUrl,                 // Media file URL from Cloudinary
	  });
  
	  if (newMessage) {
		conversation.messages.push(newMessage._id);
	  }
  
	  await Promise.all([conversation.save(), newMessage.save()]);
  
	  // Send proper JSON response
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
