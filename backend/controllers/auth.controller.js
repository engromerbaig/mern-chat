import User from '../models/user.model.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

// Updated login controller
export const login = async (req, res) => {
  try {
    const { username, email } = req.body;

    // Step 1: Validate incoming data
    if (!username && !email) {
      return res.status(400).json({ error: "Please provide either a username or an email." });
    }

    // Step 2: Find the user in the database by username or email
    let user;
    if (username) {
      user = await User.findOne({ username });
    } else if (email) {
      user = await User.findOne({ email });
    }

    // Step 3: If user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Step 4: Generate token and set it as a cookie
    generateTokenAndSetCookie(user._id, res);

    // Step 5: Return user data without token in the response body (token is in the cookie)
    return res.status(200).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    // Step 6: Log the error and return a generic error message
    console.log("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error. Please check server logs for details." });
  }
};


// Updated logout controller with redirection
export const logout = (req, res) => {
  try {
    // Clear the JWT cookie
    res.cookie("jwt", "", { maxAge: 0 });

    // Redirect the user to the login page after logout
    res.status(200).redirect("https://portai.voxaccess.net/login");
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
