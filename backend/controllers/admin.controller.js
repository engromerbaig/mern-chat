// backend\controllers\admin.controller.js
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

export const createSuperAdmin = async (req, res) => {
  try {
    const { fullName, username, password, gender } = req.body;

    // Validate input
    if (!fullName || !username || !password || !gender) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if Super Admin already exists
    const existingAdmin = await User.findOne({ role: 'Super Admin' });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Super Admin already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Profile picture logic based on gender
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
    const profilePic = gender === 'male' ? boyProfilePic : girlProfilePic;

    // Create Super Admin
    const newSuperAdmin = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic,
      role: 'Super Admin',
      roleRequestStatus: 'approved',
    });

    await newSuperAdmin.save();

    res.status(201).json({
      _id: newSuperAdmin._id,
      fullName: newSuperAdmin.fullName,
      username: newSuperAdmin.username,
      profilePic: newSuperAdmin.profilePic,
      role: newSuperAdmin.role, // Include role in response
      message: 'Super Admin created successfully',
    });
  } catch (error) {
    console.log('Error in createSuperAdmin controller:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




// controllers/admin.controller.js

export const approveRoleRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.roleRequestStatus !== 'pending') {
      return res.status(400).json({ error: 'Role request is not pending' });
    }

    user.roleRequestStatus = 'approved';
    
    // Add the approved user to the Super Admin's approvedRequests array
    const superAdmin = await User.findOne({ role: 'Super Admin' });
    if (!superAdmin) {
      return res.status(404).json({ error: "Super Admin not found" });
    }
    superAdmin.approvedRequests.push(user._id);
    await superAdmin.save();

    await user.save();
    res.status(200).json({ message: 'Role request approved' });
  } catch (error) {
    console.log('Error approving role request:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const rejectRoleRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.roleRequestStatus !== 'pending') {
      return res.status(400).json({ error: 'Role request is not pending' });
    }

    user.roleRequestStatus = 'rejected';
    
    // Add the rejected user to the Super Admin's rejectedRequests array
    const superAdmin = await User.findOne({ role: 'Super Admin' });
    if (!superAdmin) {
      return res.status(404).json({ error: "Super Admin not found" });
    }
    superAdmin.rejectedRequests.push(user._id);
    await superAdmin.save();

    await user.save();
    res.status(200).json({ message: 'Role request rejected' });
  } catch (error) {
    console.log('Error rejecting role request:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// New function to get approved and rejected requests
export const getRequestHistory = async (req, res) => {
  try {
    const superAdmin = await User.findOne({ role: 'Super Admin' })
      .populate('approvedRequests', 'fullName username')
      .populate('rejectedRequests', 'fullName username');
    
    if (!superAdmin) {
      return res.status(404).json({ error: "Super Admin not found" });
    }

    res.status(200).json({
      approvedRequests: superAdmin.approvedRequests,
      rejectedRequests: superAdmin.rejectedRequests
    });
  } catch (error) {
    console.log('Error fetching request history:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const getPendingRoleRequests = async (req, res) => {
  try {
    const users = await User.find({ roleRequestStatus: 'pending' })
      .select('fullName username profilePic role roleRequestStatus');  // Only select these fields
    res.status(200).json(users);
  } catch (error) {
    console.log('Error fetching pending role requests:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};