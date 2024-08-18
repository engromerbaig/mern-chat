import User from '../models/user.model.js';

export const getPendingRoleRequests = async (req, res) => {
  try {
    const pendingRequests = await User.find({ roleRequestStatus: 'pending' });
    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error('Error fetching role requests:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const approveRoleRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(userId, { roleRequestStatus: 'approved' }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Role request approved', user });
  } catch (error) {
    console.error('Error approving role request:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const rejectRoleRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(userId, { roleRequestStatus: 'rejected' }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Role request rejected', user });
  } catch (error) {
    console.error('Error rejecting role request:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
