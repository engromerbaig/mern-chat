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
    
    if (userId !== "undefined") userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    socket.on("markMessageAsRead", async ({ conversationId, messageId }) => {
        try {
            if (messageId) {
                // Mark a single message as read
                await Message.findByIdAndUpdate(messageId, { isRead: true });
                socket.broadcast.emit("messageRead", { conversationId, messageId });
            } else {
                // Mark all messages in the conversation as read
                await Message.updateMany(
                    { conversationId, isRead: false },
                    { $set: { isRead: true } }
                );
                socket.broadcast.emit("messageRead", { conversationId });
            }
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    });

    socket.on("newMessage", async ({ senderId, receiverId, message }) => {
        try {
            // Create new message and mark as unread
            const newMessage = await Message.create({ senderId, receiverId, message, isRead: false });
            
            // Emit event to update both sender's and receiver's sidebars
            io.to([senderId, receiverId]).emit("updateSidebar", { senderId, receiverId, message: newMessage });
        } catch (error) {
            console.error("Error sending new message:", error);
        }
    });

    // Existing events for role request status changes
    socket.on("requestStatusChange", (changeType) => {
        io.emit("requestStatusChange", changeType);
    });
});

export { app, io, server };
