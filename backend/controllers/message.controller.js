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

      let conversation = await Conversation.findOne({
          participants: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
          conversation = await Conversation.create({
              participants: [senderId, receiverId],
          });
      }

      const newMessage = new Message({
          senderId,
          receiverId,
          message,
      });

      if (newMessage) {
          conversation.messages.push(newMessage._id);
      }

      await Promise.all([conversation.save(), newMessage.save()]);

      // SOCKET IO FUNCTIONALITY
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
          // Send message to receiver
          io.to(receiverSocketId).emit("newMessage", newMessage);
          
          // Emit an event to update the sidebar for all connected clients
          io.emit("updateSidebar", {
              senderId,
              receiverId,
              message: newMessage,
          });
      }

      res.status(201).json(newMessage);
  } catch (error) {
      console.error("Error in sendMessage controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
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
