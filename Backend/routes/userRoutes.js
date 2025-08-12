// backend/routes/userRoutes.js
import express from "express";
import User from "../models/User.js";
import { clerkAuthMiddleware } from "../middleware/clerkMiddleWare.js";

const router = express.Router();

// 🔹 Create or update user (protected route)
router.post("/create", clerkAuthMiddleware, async (req, res) => {
  try {
    const clerkId = req.auth.userId; // Get Clerk ID from authenticated request
    console.log("✅ Clerk User ID:", clerkId);
    console.log("📦 Request body:", req.body);

    // Check if user already exists
    let user = await User.findOne({ clerkId });
    
    if (user) {
      // Update existing user
      user.set(req.body);
      await user.save();
      console.log("✅ User updated:", user);
      return res.status(200).json({ message: "User updated", user });
    }

    // Create new user
    const userData = { ...req.body, clerkId };
    console.log("📤 Creating new user with data:", userData);
    
    const newUser = await User.create(userData);
    console.log("✅ New user created:", newUser);
    
    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    console.error("❌ Error in /create:", err);
    res.status(400).json({ message: "Error creating user", error: err.message });
  }
});

// 🔹 Get current user (protected route)
router.get("/me", clerkAuthMiddleware, async (req, res) => {
  try {
    const clerkId = req.auth.userId; // Get Clerk ID from authenticated request
    
    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get user profile by userId (protected route)
router.get("/profile", clerkAuthMiddleware, async (req, res) => {
  try {
    const { userId } = req.query;
    const authenticatedUserId = req.auth.userId;
    
    // First get the user to check if they own this profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Ensure user can only access their own data
    if (user.clerkId !== authenticatedUserId) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    res.status(200).json({ user });
  } catch (err) {
    console.error("Error getting user profile:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Update user (protected route)
// In your backend route
router.put("/update", clerkAuthMiddleware, async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    console.log("Updating user with Clerk ID:", clerkId);

    // Find and update user in one operation
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User updated successfully:", updatedUser);
    res.status(200).json(updatedUser); // Send back the updated user
    
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(400).json({ 
      success: false,
      message: "Error updating user", 
      error: err.message 
    });
  }
});

// 🔹 Update sleep goal (protected route)
router.put("/sleepGoal", clerkAuthMiddleware, async (req, res) => {
  try {
    const { userId, sleepGoal } = req.body;
    const authenticatedUserId = req.auth.userId;
    
    // First get the user to check if they own this profile
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Ensure user can only update their own profile
    if (userToUpdate.clerkId !== authenticatedUserId) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    // Validate sleep goal
    if (sleepGoal < 4 || sleepGoal > 12) {
      return res.status(400).json({ error: "Sleep goal must be between 4 and 12 hours" });
    }
    
    const user = await User.findByIdAndUpdate(
      userId, 
      { sleepGoal }, 
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ 
      success: true,
      message: "Sleep goal updated successfully", 
      user 
    });
  } catch (err) {
    console.error("Error updating sleep goal:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Delete current user (protected route)
router.delete("/delete", clerkAuthMiddleware, async (req, res) => {
  try {
    const clerkId = req.auth.userId; // Get Clerk ID from authenticated request
    
    await User.findOneAndDelete({ clerkId });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get user by clerk ID (protected route) - MOVED TO END
router.get("/clerk/:clerkId", clerkAuthMiddleware, async (req, res) => {
  try {
    const { clerkId } = req.params;
    const authenticatedUserId = req.auth.userId;
    
    // Ensure user can only access their own data
    if (clerkId !== authenticatedUserId) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get user by clerk ID (protected route) - MOVED TO END
router.get("/:clerkId", clerkAuthMiddleware, async (req, res) => {
  try {
    const { clerkId } = req.params;
    const authenticatedUserId = req.auth.userId;
    
    // Ensure user can only access their own data
    if (clerkId !== authenticatedUserId) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Update user by ID (protected route) - MOVED TO END
router.put("/:userId", clerkAuthMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    const authenticatedUserId = req.auth.userId;
    
    // First get the user to check if they own this profile
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Ensure user can only update their own profile
    if (userToUpdate.clerkId !== authenticatedUserId) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const user = await User.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ 
      success: true,
      message: "User updated successfully", 
      user 
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
