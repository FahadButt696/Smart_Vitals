import User from '../models/User.js';

export const loadUser = async (req, res, next) => {
  try {
    const clerkId = req.auth.userId;
    if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    req.user = user; // You can now access req.user in routes
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
