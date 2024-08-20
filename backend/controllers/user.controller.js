// controllers/user.controller.js
import User from "../models/user.model.js";
import { canInitiateChat } from "../utils/rolePermissions.js"; // Import the canInitiateChat function

export const getUsersForSidebar = async (req, res) => {
    try {
        // Access current user ID and role from req.user (assuming authentication middleware sets this)
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

        // Group users by role
        const groupedUsers = filteredUsers.reduce((acc, user) => {
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
