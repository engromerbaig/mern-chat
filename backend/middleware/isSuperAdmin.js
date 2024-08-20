// auth.middleware.js

import User from '../models/user.model.js';

export const isSuperAdmin = async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming the user ID is available in req.user
    const user = await User.findById(userId);

    if (user && user.role === 'Super Admin') {
      next(); // User is a Super Admin, allow access
    } else {
      res.status(403).json({ error: 'Access denied' }); // Not authorized
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
