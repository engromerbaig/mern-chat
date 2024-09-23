import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { canInitiateChat } from "../utils/rolePermissions.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const currentUser = await User.findById(currentUserId);

        if (!currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const currentUserRole = currentUser.role;

        // Fetch approved users excluding the current user
        const approvedUsers = await User.find({
            roleRequestStatus: 'approved',
            _id: { $ne: currentUserId }
        });

        // Filter users based on chat initiation rules
        const filteredUsers = approvedUsers.filter(user =>
            canInitiateChat(currentUserRole, user.role)
        );

        // Fetch existing conversations where the current user is a participant
        const existingConversations = await Conversation.find({
            participants: currentUserId
        })
        .populate('participants', '_id role fullName profilePic') // Only populate necessary fields
        .populate({
            path: 'messages',
            options: { sort: { createdAt: -1 }, limit: 1 }, // Get the latest message only
            select: 'createdAt senderId receiverId isRead'
        });

        // Extract participants from conversations, excluding the current user
        const conversationParticipants = existingConversations.flatMap(conversation => {
            // Get the latest message in the conversation
            const latestMessage = conversation.messages[0] || null;

            const otherParticipants = conversation.participants.filter(
                participant => participant._id.toString() !== currentUserId.toString()
            );

            return otherParticipants.map(participant => ({
                ...participant.toObject(),
                lastMessageTimestamp: latestMessage ? latestMessage.createdAt : conversation.updatedAt,
                unreadMessages: latestMessage && latestMessage.receiverId.toString() === currentUserId.toString() && !latestMessage.isRead ? 1 : 0
            }));
        });

        // Use a Map to ensure uniqueness based on user _id
        const uniqueUsersMap = new Map();

        // Add filtered users to the map
        filteredUsers.forEach(user => uniqueUsersMap.set(user._id.toString(), { 
            ...user.toObject(), 
            lastMessageTimestamp: null, 
            unreadMessages: 0 
        }));

        // Add conversation participants to the map (will overwrite duplicates)
        conversationParticipants.forEach(user => uniqueUsersMap.set(user._id.toString(), user));

        // Convert the Map values back into an array (unique users)
        const mergedUsers = Array.from(uniqueUsersMap.values());

        // Sort users by lastMessageTimestamp (most recent first)
        const sortedUsers = mergedUsers.sort((a, b) => {
            const aTimestamp = a.lastMessageTimestamp ? new Date(a.lastMessageTimestamp).getTime() : 0;
            const bTimestamp = b.lastMessageTimestamp ? new Date(b.lastMessageTimestamp).getTime() : 0;
            return bTimestamp - aTimestamp; // Most recent first
        });

        // Group users by role
        const groupedUsers = sortedUsers.reduce((acc, user) => {
            const role = user.role;
            if (!acc[role]) {
                acc[role] = [];
            }
            acc[role].push(user);
            return acc;
        }, {});

        // Send grouped users as response
        res.status(200).json(groupedUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
