// backend/routes/userRoutes.js
import express from "express";
import User from "../models/User.js";
import { clerkAuthMiddleware } from "../middleware/clerkMiddleWare.js";

const router = express.Router();

// 🔹 Create or update user
router.post("/create", async (req, res) => {
  const { userId } = req.auth;

  const data = { ...req.body, clerkId: userId };

  try {
    let user = await User.findOne({ clerkId: userId });

    if (user) {
      user.set(data);
      await user.save();
      return res.status(200).json({ message: "User updated", user });
    }

    const newUser = await User.create(data);
    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    res.status(400).json({ message: "Error", error: err.message });
  }
});

// 🔹 Get current user
router.get("/me", clerkAuthMiddleware, async (req, res) => {
  const { userId } = req.auth;

  try {
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Delete current user
router.delete("/delete", clerkAuthMiddleware, async (req, res) => {
  const { userId } = req.auth;

  try {
    await User.findOneAndDelete({ clerkId: userId });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
