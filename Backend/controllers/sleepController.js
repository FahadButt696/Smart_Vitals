import Sleep from "../models/Sleep.js";

// Add new sleep log
export const addSleep = async (req, res) => {
  try {
    const { userId, startTime, endTime, quality, notes } = req.body;

    // Validate required fields
    if (!userId || !startTime || !endTime) {
      return res.status(400).json({ error: "userId, startTime, and endTime are required" });
    }

    // Validate that end time is after start time
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (end <= start) {
      return res.status(400).json({ error: "End time must be after start time" });
    }

    // Calculate date (use the date when sleep started)
    const date = start.toISOString().split('T')[0];

    const sleepData = {
      userId,
      startTime: start,
      endTime: end,
      quality: quality || "good",
      notes: notes || "",
      date
    };

    const sleep = new Sleep(sleepData);
    await sleep.save();

    res.status(201).json({ 
      success: true, 
      message: "Sleep log added successfully",
      sleep 
    });
  } catch (err) {
    console.error('Error adding sleep:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get sleep logs for a user
export const getSleep = async (req, res) => {
  try {
    const { userId, startDate, endDate, limit = 50 } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    let query = { userId };

    // Add date filtering if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const logs = await Sleep.find(query)
      .sort({ startTime: -1 })
      .limit(parseInt(limit));

    res.json({ 
      success: true, 
      logs,
      count: logs.length
    });
  } catch (err) {
    console.error('Error fetching sleep logs:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get sleep statistics
export const getSleepStats = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Today's sleep
    const todaySleep = await Sleep.findOne({ userId, date: today });

    // Last 7 days
    const weeklyLogs = await Sleep.find({
      userId,
      date: { $gte: sevenDaysAgo, $lte: today }
    }).sort({ date: 1 });

    // Last 30 days
    const monthlyLogs = await Sleep.find({
      userId,
      date: { $gte: thirtyDaysAgo, $lte: today }
    });

    // Calculate statistics
    const weeklyTotal = weeklyLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const monthlyTotal = monthlyLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const weeklyAverage = weeklyLogs.length > 0 ? weeklyTotal / weeklyLogs.length : 0;
    const monthlyAverage = monthlyLogs.length > 0 ? monthlyTotal / monthlyLogs.length : 0;

    // Daily breakdown for the last 7 days
    const dailyBreakdown = {};
    weeklyLogs.forEach(log => {
      dailyBreakdown[log.date] = log.duration || 0;
    });

    // Quality distribution
    const qualityDistribution = monthlyLogs.reduce((acc, log) => {
      acc[log.quality] = (acc[log.quality] || 0) + 1;
      return acc;
    }, {});

    const stats = {
      today: {
        duration: todaySleep?.duration || 0,
        quality: todaySleep?.quality || null,
        startTime: todaySleep?.startTime || null,
        endTime: todaySleep?.endTime || null
      },
      weekly: {
        total: Math.round(weeklyTotal * 100) / 100,
        average: Math.round(weeklyAverage * 100) / 100,
        count: weeklyLogs.length
      },
      monthly: {
        total: Math.round(monthlyTotal * 100) / 100,
        average: Math.round(monthlyAverage * 100) / 100,
        count: monthlyLogs.length
      },
      dailyBreakdown,
      qualityDistribution
    };

    res.json({ success: true, stats });
  } catch (err) {
    console.error('Error fetching sleep stats:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update sleep log
export const updateSleep = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, quality, notes } = req.body;

    const sleep = await Sleep.findById(id);
    if (!sleep) {
      return res.status(404).json({ error: "Sleep log not found" });
    }

    // Update fields if provided
    if (startTime) sleep.startTime = new Date(startTime);
    if (endTime) sleep.endTime = new Date(endTime);
    if (quality) sleep.quality = quality;
    if (notes !== undefined) sleep.notes = notes;

    // Recalculate date if start time changed
    if (startTime) {
      sleep.date = new Date(startTime).toISOString().split('T')[0];
    }

    await sleep.save();

    res.json({ 
      success: true, 
      message: "Sleep log updated successfully",
      sleep 
    });
  } catch (err) {
    console.error('Error updating sleep:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete sleep log
export const deleteSleep = async (req, res) => {
  try {
    const { id } = req.params;

    const sleep = await Sleep.findByIdAndDelete(id);
    if (!sleep) {
      return res.status(404).json({ error: "Sleep log not found" });
    }

    res.json({ 
      success: true, 
      message: "Sleep log deleted successfully" 
    });
  } catch (err) {
    console.error('Error deleting sleep:', err);
    res.status(500).json({ error: err.message });
  }
};
