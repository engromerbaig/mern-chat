import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender, role } = req.body;

    // Validate passwords
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Handle role validation
    const validRoles = [
      "Manager", "Agent", "R&D Role", "R&D Admin Role", "FE Role",
      "Staff Access Control Role", "Closer Role", "Team Lead Role",
      "RNA Specialist Role", "CB Specialist Role", "Decline Specialist Role"
    ];

    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role selected.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Profile picture logic
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // Set roleRequestStatus to pending for non-Super Admin roles
    const roleRequestStatus = role ? 'pending' : 'approved';

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === 'male' ? boyProfilePic : girlProfilePic,
      role,
      roleRequestStatus,
    });

    // Save user to database
    await newUser.save();

    // Generate token and set cookie only if the role request is approved
    if (roleRequestStatus === 'approved') {
      generateTokenAndSetCookie(newUser._id, res);
    }

    // Respond to client
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      profilePic: newUser.profilePic,
      message: role ? 'Signup successful. Your role request is pending approval.' : 'Signup successful.',
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });

		if (!user) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		if (user.roleRequestStatus !== 'approved') {
			return res.status(403).json({ error: 'Your role request is pending approval.' });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			role: user.role, // Ensure this line includes the role

			profilePic: user.profilePic,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully!" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
