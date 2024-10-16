


// Updated login controller without database validation
import User from '../models/user.model.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

// Updated login controller without database validation
export const login = async (req, res) => {
  try {
    const { fullName, username, email, role_id, role } = req.body;

    // Step 1: Ensure that the exact payload structure is provided
    if (
      !fullName || 
      !username || 
      !email || 
      !role_id || 
      !role ||
      role_id !== 1 || 
      role !== "SuperAdmin"
    ) {
      return res.status(400).json({ error: "Invalid payload. Ensure all required fields are provided with correct values." });
    }

    // Step 2: Skip user lookup and directly generate a token
    const userId = username || email; // You can replace this with the identifier as needed

    // Step 3: Generate token and set it as a cookie
    generateTokenAndSetCookie(userId, res);

    // Step 4: Return a success response (no user data needed as per the new flow)
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    // Step 5: Log the error and return a generic error message
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
