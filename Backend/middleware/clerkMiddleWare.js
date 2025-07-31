import { requireAuth } from '@clerk/express';

// Middleware to protect routes using Clerk session (modern version)
export const clerkAuthMiddleware = requireAuth({
  unauthorized: (req, res) => {
    return res.status(401).json({ message: 'Unauthorized' });
  },
});
