// controllers/user.controller.js
import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import { canInitiateChat } from "../utils/rolePermissions.js"; 

export const getUsersForSidebar = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const currentUser = await User.findById(currentUserId);

        if (!currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const currentUserRole = currentUser.role;

        // Fetch only approved users excluding the current user
        const approvedUsers = await User.find({
            roleRequestStatus: 'approved',
            _id: { $ne: currentUserId } // Exclude the current user
        });

        // Filter users based on chat initiation rules
        const filteredUsers = approvedUsers.filter(user =>
            canInitiateChat(currentUserRole, user.role)
        );

        // Fetch existing conversations where the current user is a participant
        const existingConversations = await Conversation.find({
            participants: currentUserId
        }).populate('participants'); // Populate participants to get user details

        // Extract participants from conversations, excluding the current user
        const conversationParticipants = existingConversations.flatMap(conversation =>
            conversation.participants.filter(participant => participant._id.toString() !== currentUserId.toString())
        );

        // Use a Map to ensure uniqueness based on user _id
        const uniqueUsersMap = new Map();

        // Add filtered users to the map
        filteredUsers.forEach(user => uniqueUsersMap.set(user._id.toString(), user));

        // Add conversation participants to the map (will overwrite duplicates)
        conversationParticipants.forEach(user => uniqueUsersMap.set(user._id.toString(), user));

        // Convert the Map values back into an array (unique users)
        const mergedUsers = Array.from(uniqueUsersMap.values());

        // Group users by role
        const groupedUsers = mergedUsers.reduce((acc, user) => {
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
