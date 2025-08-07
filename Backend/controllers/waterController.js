import Water from "../models/Water.js";

// Add water intake
export const addWater = async (req, res) => {
  try {
    const { amount, userId } = req.body;

    if (!amount || !userId) {
      return res.status(400).json({ 
        error: "Missing required fields: amount and userId" 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ 
        error: "Water amount must be greater than 0" 
      });
    }

    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Calculate daily total for this date
    const todayLogs = await Water.find({
      userId,
      date: date
    });
    const dailyTotal = todayLogs.reduce((sum, log) => sum + log.amount, 0) + amount;

    const water = new Water({
      userId,
      amount,
      date,
      dailyTotal,
      timestamp: now
    });

    await water.save();
    res.status(201).json({ 
      success: true, 
      water,
      message: "Water intake logged successfully" 
    });
  } catch (err) {
    console.error("Error adding water:", err.message);
    res.status(500).json({ error: "Failed to add water intake" });
  }
};

// Get water logs for a user
export const getWater = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ 
        error: "userId is required" 
      });
    }

    const waterLogs = await Water.find({ userId })
      .sort({ timestamp: -1 })
      .limit(100); // Limit to last 100 entries

    // Calculate today's total
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayLogs = await Water.find({
      userId,
      timestamp: { $gte: today }
    });

    const todayTotal = todayLogs.reduce((sum, log) => sum + log.amount, 0);

    // Calculate weekly data
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyLogs = await Water.find({
      userId,
      timestamp: { $gte: weekAgo }
    });

    // Group by day
    const dailyTotals = {};
    weeklyLogs.forEach(log => {
      const date = log.timestamp.toISOString().split('T')[0];
      dailyTotals[date] = (dailyTotals[date] || 0) + log.amount;
    });

    res.json({ 
      success: true, 
      waterLogs,
      todayTotal,
      weeklyData: dailyTotals
    });
  } catch (err) {
    console.error("Error fetching water logs:", err.message);
    res.status(500).json({ error: "Failed to fetch water logs" });
  }
};

// Get water statistics
export const getWaterStats = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ 
        error: "userId is required" 
      });
    }

    // Today's total
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLogs = await Water.find({
      userId,
      timestamp: { $gte: today }
    });
    const todayTotal = todayLogs.reduce((sum, log) => sum + log.amount, 0);

    // This week's total
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekLogs = await Water.find({
      userId,
      timestamp: { $gte: weekAgo }
    });
    const weekTotal = weekLogs.reduce((sum, log) => sum + log.amount, 0);

    // This month's total
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthLogs = await Water.find({
      userId,
      timestamp: { $gte: monthAgo }
    });
    const monthTotal = monthLogs.reduce((sum, log) => sum + log.amount, 0);

    // Average daily intake (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDayLogs = await Water.find({
      userId,
      timestamp: { $gte: thirtyDaysAgo }
    });

    const dailyTotals = {};
    thirtyDayLogs.forEach(log => {
      const date = log.timestamp.toISOString().split('T')[0];
      dailyTotals[date] = (dailyTotals[date] || 0) + log.amount;
    });

    const averageDaily = Object.values(dailyTotals).length > 0 
      ? Object.values(dailyTotals).reduce((sum, total) => sum + total, 0) / Object.values(dailyTotals).length
      : 0;

    res.json({
      success: true,
      stats: {
        todayTotal,
        weekTotal,
        monthTotal,
        averageDaily: Math.round(averageDaily),
        dailyBreakdown: dailyTotals
      }
    });
  } catch (err) {
    console.error("Error fetching water stats:", err.message);
    res.status(500).json({ error: "Failed to fetch water statistics" });
  }
};

// Delete water log
export const deleteWater = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        error: "Water log ID is required" 
      });
    }

    const deletedWater = await Water.findByIdAndDelete(id);
    
    if (!deletedWater) {
      return res.status(404).json({ 
        error: "Water log not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Water log deleted successfully" 
    });
  } catch (err) {
    console.error("Error deleting water log:", err.message);
    res.status(500).json({ error: "Failed to delete water log" });
  }
};

// Update water log
export const updateWater = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!id || !amount) {
      return res.status(400).json({ 
        error: "Water log ID and amount are required" 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ 
        error: "Water amount must be greater than 0" 
      });
    }

    // Get the existing water log to find the date
    const existingWater = await Water.findById(id);
    if (!existingWater) {
      return res.status(404).json({ 
        error: "Water log not found" 
      });
    }

    const now = new Date();
    const date = existingWater.date; // Keep the same date

    // Recalculate daily total for this date
    const todayLogs = await Water.find({
      userId: existingWater.userId,
      date: date
    });
    
    // Remove the old amount and add the new amount
    const oldAmount = existingWater.amount;
    const dailyTotal = todayLogs.reduce((sum, log) => sum + log.amount, 0) - oldAmount + parseInt(amount);

    const updatedWater = await Water.findByIdAndUpdate(
      id, 
      { 
        amount: parseInt(amount), 
        dailyTotal,
        timestamp: now 
      }, 
      { new: true }
    );

    res.json({ 
      success: true, 
      water: updatedWater,
      message: "Water log updated successfully" 
    });
  } catch (err) {
    console.error("Error updating water log:", err.message);
    res.status(500).json({ error: "Failed to update water log" });
  }
};

// Get water log by ID
export const getWaterById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        error: "Water log ID is required" 
      });
    }

    const water = await Water.findById(id);
    
    if (!water) {
      return res.status(404).json({ 
        error: "Water log not found" 
      });
    }

    res.json({ 
      success: true, 
      water 
    });
  } catch (err) {
    console.error("Error fetching water log:", err.message);
    res.status(500).json({ error: "Failed to fetch water log" });
  }
};
