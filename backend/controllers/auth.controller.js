import User from '../models/user.model.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

// Updated login controller without database validation
export const login = async (req, res) => {
  try {
    const { fullName, username, email, role_id, role } = req.body;

    // Step 1: Ensure that the required fields are provided
    if (!fullName || !username || !email) {
      return res.status(400).json({ error: "Invalid payload. Ensure 'fullName', 'username', and 'email' are provided." });
    }

    // Step 2: Validate 'role_id' (must be a number) and 'role' (must be a string)
    if (typeof role_id !== 'number') {
      return res.status(400).json({ error: "'role_id' should be a number." });
    }

    if (typeof role !== 'string') {
      return res.status(400).json({ error: "'role' should be a string." });
    }

    // Step 3: Skip user lookup and directly generate a token
    const userId = username || email; // You can replace this with the identifier as needed

    // Step 4: Generate token and set it as a cookie
    generateTokenAndSetCookie(userId, res);

    // Step 5: Return a success response (no user data needed as per the new flow)
    return res.status(200).json({ message: "Login successful" });
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
