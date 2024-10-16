import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';
import { validRoles } from '../utils/validRoles.js';

// Existing signup controller
export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, email, gender, role } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: "Username already exists." });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Email already exists." });
      }
    }
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role selected.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
    const roleRequestStatus = role && role !== 'Super Admin' ? 'pending' : 'approved';
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      gender,
      profilePic: gender === 'male' ? boyProfilePic : girlProfilePic,
      role,
      roleRequestStatus,
    });
    await newUser.save();
    if (roleRequestStatus === 'approved') {
      generateTokenAndSetCookie(newUser._id, res);
    }
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      profilePic: newUser.profilePic,
      createdAt: newUser.createdAt,
      message: role && role !== 'Super Admin' ? 'Signup successful. Your role request is pending approval.' : 'Signup successful.',
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Existing login controller
export const login = async (req, res) => {
  try {
    const { username, email, password, token } = req.body;

    if (token) {
      // Handle direct login with token (Hasham's app)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id);
      if (!user) {
        return res.status(400).json({ error: "User not found." });
      }
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      });
    } else if ((username || email) && password) {
      // Handle standard login with username/email and password
      let user;
      if (username) {
        user = await User.findOne({ username });
      } else if (email) {
        user = await User.findOne({ email });
      }

      if (!user) {
        return res.status(400).json({ error: "Invalid username/email or password." });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ error: "Invalid username/email or password." });
      }

      if (user.roleRequestStatus !== 'approved') {
        return res.status(403).json({ error: 'Your role request is pending approval.' });
      }

      generateTokenAndSetCookie(user._id, res);

      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      });
    } else {
      return res.status(400).json({ error: "Please provide either a username/email and password, or a token." });
    }
  } catch (error) {
    console.log("Error in login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Existing logout controller
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
