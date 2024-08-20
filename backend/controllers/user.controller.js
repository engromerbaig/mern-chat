import User from "../models/user.model.js";

// backend control code for sidebar users
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Fetch users who are not the logged-in user and whose role request status is approved
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
      roleRequestStatus: 'approved'  // Only include users with approved role requests
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
