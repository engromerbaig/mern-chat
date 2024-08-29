// backend/controllers/admin.controller.js

import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { io } from '../socket/socket.js'; // Import the Socket.IO instance


export const createSuperAdmin = async (req, res) => {
  try {
    const { fullName, username, email, password, gender } = req.body;

    // Check for missing required fields
    if (!fullName || !username || !email || !password || !gender) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email validation (using the same regex as the model)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    // Check if a Super Admin already exists
    const existingAdmin = await User.findOne({ role: 'Super Admin' });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Super Admin already exists' });
    }

    // Check if username or email is already in use
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already exists.' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already exists.' });
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set the profile picture based on gender
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
    const profilePic = gender === 'male' ? boyProfilePic : girlProfilePic;

    // Create the new Super Admin
    const newSuperAdmin = new User({
      fullName,
      username,
      email,  // Include the email field
      password: hashedPassword,
      gender,
      profilePic,
      role: 'Super Admin',
      roleRequestStatus: 'approved',
    });

    // Save to database
    await newSuperAdmin.save();

    // Respond with success
    res.status(201).json({
      _id: newSuperAdmin._id,
      fullName: newSuperAdmin.fullName,
      username: newSuperAdmin.username,
      email: newSuperAdmin.email,  // Include the email in the response
      profilePic: newSuperAdmin.profilePic,
      role: newSuperAdmin.role,
      message: 'Super Admin created successfully',
    });
  } catch (error) {
    console.log('Error in createSuperAdmin controller:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



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
    user.approvedAt = new Date();

    const superAdmin = await User.findOne({ role: 'Super Admin' });
    if (!superAdmin) {
      return res.status(404).json({ error: "Super Admin not found" });
    }

    superAdmin.approvedRequests.push(user._id);
    await superAdmin.save();
    await user.save();

    // Emit event to update stats
    io.emit("requestStatusChange", { action: 'approved' });

    res.status(200).json({ message: 'Role request approved', approvedAt: user.approvedAt });
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
    user.rejectedAt = new Date();

    const superAdmin = await User.findOne({ role: 'Super Admin' });
    if (!superAdmin) {
      return res.status(404).json({ error: "Super Admin not found" });
    }

    superAdmin.rejectedRequests.push(user._id);
    await superAdmin.save();
    await user.save();

    // Emit event to update stats
    io.emit("requestStatusChange", { action: 'rejected' });

    res.status(200).json({ message: 'Role request rejected', rejectedAt: user.rejectedAt });
  } catch (error) {
    console.log('Error rejecting role request:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getPendingRoleRequests = async (req, res) => {
  try {
    const users = await User.find({ roleRequestStatus: 'pending' })
      .select('fullName username profilePic role roleRequestStatus createdAt');
    res.status(200).json(users);
  } catch (error) {
    console.log('Error fetching pending role requests:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getRequestHistory = async (req, res) => {
  try {
    const superAdmin = await User.findOne({ role: 'Super Admin' })
      .populate('approvedRequests', 'fullName username role createdAt approvedAt')
      .populate('rejectedRequests', 'fullName username role createdAt rejectedAt');
    
    if (!superAdmin) {
      return res.status(404).json({ error: "Super Admin not found" });
    }

    res.status(200).json({
      approvedRequests: superAdmin.approvedRequests.map(req => ({
        _id: req._id,  // Add this line
        fullName: req.fullName,
        username: req.username,
        role: req.role,
        approvedAt: req.approvedAt
      })),
      rejectedRequests: superAdmin.rejectedRequests.map(req => ({
        _id: req._id,  // Add this line
        fullName: req.fullName,
        username: req.username,
        role: req.role,
        rejectedAt: req.rejectedAt
      }))
    });
  } catch (error) {
    console.log('Error fetching request history:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
