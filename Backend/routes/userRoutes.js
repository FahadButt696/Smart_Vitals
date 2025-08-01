// backend/routes/userRoutes.js
import express from "express";
import User from "../models/User.js";
import { clerkAuthMiddleware } from "../middleware/clerkMiddleWare.js";

const router = express.Router();

// 🔹 Create or update user
router.post("/create", clerkAuthMiddleware, async (req, res) => {
  try {
    const { userId } = req.auth; // Clerk sets this
    console.log("✅ Clerk ID:", userId);
    console.log("📦 Request body:", req.body);

    // Check if user already exists
    let user = await User.findOne({ clerkId: userId });
    
    if (user) {
      // Update existing user
      user.set(req.body);
      await user.save();
      console.log("✅ User updated:", user);
      return res.status(200).json({ message: "User updated", user });
    }

    // Create new user
    const userData = { ...req.body, clerkId: userId };
    console.log("📤 Creating new user with data:", userData);
    
    const newUser = await User.create(userData);
    console.log("✅ New user created:", newUser);
    
    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    console.error("❌ Error in /create:", err);
    res.status(400).json({ message: "Error creating user", error: err.message });
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
