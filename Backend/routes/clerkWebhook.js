import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/webhook', express.json(), async (req, res) => {
  const event = req.body;

  if (event.type === 'user.created') {
    const clerkUser = event.data;
    const existingUser = await User.findOne({ clerkId: clerkUser.id });

    if (!existingUser) {
      const newUser = new User({
        clerkId: clerkUser.id,
        email: clerkUser.email_addresses[0].email_address,
        firstName: clerkUser.first_name,
        lastName: clerkUser.last_name,
      });
      await newUser.save();
    }

    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: 'Unhandled event' });
});

export default router;
