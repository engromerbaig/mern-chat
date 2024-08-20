// controllers/user.controller.js
import User from "../models/user.model.js";
export const getUsersForSidebar = async (req, res) => {
    try {
        // Fetch only approved users
        const approvedUsers = await User.find({ roleRequestStatus: 'approved' });

        // Group users by role
        const groupedUsers = approvedUsers.reduce((acc, user) => {
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
