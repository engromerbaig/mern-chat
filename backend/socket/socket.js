// backend/socket/socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
    },
});

const userSocketMap = {}; // {userId: socketId}

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    const userId = socket.handshake.query.userId;
    
    if (userId != "undefined") userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    socket.on("markMessageAsRead", async ({ conversationId, messageId }) => {
        try {
            await Message.findByIdAndUpdate(messageId, { read: true });
            socket.broadcast.emit("messageRead", { conversationId, messageId });
        } catch (error) {
            console.error("Error marking message as read:", error);
        }
    });

    // New event for updating sidebar
    socket.on("newMessage", ({ senderId, receiverId, message }) => {
        io.emit("updateSidebar", { senderId, receiverId, message });
    });

    // Existing events for role request status changes
    socket.on("requestStatusChange", (changeType) => {
        io.emit("requestStatusChange", changeType);
    });

	socket.on("markMessageAsRead", async ({ conversationId }) => {
		try {
			// Assuming you're marking all messages in the conversation as read
			await Message.updateMany(
				{ conversationId, read: false },
				{ $set: { read: true } }
			);
	
			// Broadcast to all clients that the messages in this conversation are read
			socket.broadcast.emit("messageRead", { conversationId });
		} catch (error) {
			console.error("Error marking messages as read:", error);
		}
	});

	// Backend Socket Handling

// When a new message is sent, emit 'updateSidebar' for both sender and receiver
socket.on("newMessage", ({ senderId, receiverId, message }) => {
    io.to([senderId, receiverId]).emit("updateSidebar", { senderId, receiverId, message });
});

	
});

export { app, io, server };