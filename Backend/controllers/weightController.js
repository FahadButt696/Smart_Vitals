import Weight from "../models/Weight.js";

// Validation constants
const WEIGHT_LIMITS = {
  MIN_KG: 20,
  MAX_KG: 500,
  MIN_LBS: 44,
  MAX_LBS: 1100
};

const DATE_LIMITS = {
  MAX_FUTURE_DAYS: 7,
  MAX_PAST_DAYS: 365
};

// Validation functions
const validateWeight = (weight, unit) => {
  const numWeight = parseFloat(weight);
  
  if (isNaN(numWeight) || numWeight <= 0) {
    return 'Weight must be a positive number';
  }
  
  if (unit === 'kg') {
    if (numWeight < WEIGHT_LIMITS.MIN_KG) {
      return `Weight must be at least ${WEIGHT_LIMITS.MIN_KG} kg`;
    }
    if (numWeight > WEIGHT_LIMITS.MAX_KG) {
      return `Weight cannot exceed ${WEIGHT_LIMITS.MAX_KG} kg`;
    }
  } else if (unit === 'lbs') {
    if (numWeight < WEIGHT_LIMITS.MIN_LBS) {
      return `Weight must be at least ${WEIGHT_LIMITS.MIN_LBS} lbs`;
    }
    if (numWeight > WEIGHT_LIMITS.MAX_LBS) {
      return `Weight cannot exceed ${WEIGHT_LIMITS.MAX_LBS} lbs`;
    }
  }
  
  return null;
};

const validateDate = (dateString) => {
  const selectedDate = new Date(dateString);
  const today = new Date();
  const maxFuture = new Date();
  const maxPast = new Date();
  
  maxFuture.setDate(today.getDate() + DATE_LIMITS.MAX_FUTURE_DAYS);
  maxPast.setDate(today.getDate() - DATE_LIMITS.MAX_PAST_DAYS);
  
  if (selectedDate > maxFuture) {
    return `Cannot log weight more than ${DATE_LIMITS.MAX_FUTURE_DAYS} days in the future`;
  }
  
  if (selectedDate < maxPast) {
    return `Cannot log weight more than ${DATE_LIMITS.MAX_PAST_DAYS} days in the past`;
  }
  
  return null;
};

export const addWeight = async (req, res) => {
  try {
    const { userId, weight, unit, timestamp, notes } = req.body;
    
    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (!weight) {
      return res.status(400).json({ error: 'Weight is required' });
    }
    
    // Validate weight
    const weightError = validateWeight(weight, unit || 'kg');
    if (weightError) {
      return res.status(400).json({ error: weightError });
    }
    
    // Validate date
    if (timestamp) {
      const dateError = validateDate(timestamp);
      if (dateError) {
        return res.status(400).json({ error: dateError });
      }
    }
    
    // Validate notes length
    if (notes && notes.length > 500) {
      return res.status(400).json({ error: 'Notes cannot exceed 500 characters' });
    }
    
    const weightLog = new Weight({
      userId,
      weight: parseFloat(weight),
      unit: unit || "kg",
      timestamp: timestamp || new Date(),
      notes: notes || ""
    });
    
    await weightLog.save();
    res.status(201).json({ success: true, weight: weightLog });
  } catch (err) {
    console.error('Error adding weight:', err);
    res.status(500).json({ error: 'Failed to add weight log' });
  }
};

export const getWeight = async (req, res) => {
  try {
    const { userId, startDate, endDate, limit } = req.query;
    
    let query = { userId };
    
    // Add date filtering if provided
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    const logs = await Weight.find(query)
      .sort({ timestamp: -1 })
      .limit(limit ? parseInt(limit) : 100);
    
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateWeight = async (req, res) => {
  try {
    const { id } = req.params;
    const { weight, unit, timestamp, notes } = req.body;
    
    // Check if weight log exists
    const existingLog = await Weight.findById(id);
    if (!existingLog) {
      return res.status(404).json({ error: "Weight log not found" });
    }
    
    // Validate weight if provided
    if (weight !== undefined) {
      const weightError = validateWeight(weight, unit || existingLog.unit);
      if (weightError) {
        return res.status(400).json({ error: weightError });
      }
    }
    
    // Validate date if provided
    if (timestamp) {
      const dateError = validateDate(timestamp);
      if (dateError) {
        return res.status(400).json({ error: dateError });
      }
    }
    
    // Validate notes length if provided
    if (notes && notes.length > 500) {
      return res.status(400).json({ error: 'Notes cannot exceed 500 characters' });
    }
    
    const updateData = {};
    if (weight !== undefined) updateData.weight = parseFloat(weight);
    if (unit !== undefined) updateData.unit = unit;
    if (timestamp !== undefined) updateData.timestamp = timestamp;
    if (notes !== undefined) updateData.notes = notes;
    
    const weightLog = await Weight.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, weight: weightLog });
  } catch (err) {
    console.error('Error updating weight:', err);
    res.status(500).json({ error: 'Failed to update weight log' });
  }
};

export const deleteWeight = async (req, res) => {
  try {
    const { id } = req.params;
    
    const weightLog = await Weight.findByIdAndDelete(id);
    
    if (!weightLog) {
      return res.status(404).json({ error: "Weight log not found" });
    }
    
    res.json({ success: true, message: "Weight log deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWeightStats = async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Get all weight logs for the user
    const logs = await Weight.find({ userId }).sort({ timestamp: 1 });
    
    if (logs.length === 0) {
      return res.json({
        success: true,
        stats: {
          current: null,
          starting: null,
          totalChange: 0,
          averageChange: 0,
          trend: "stable",
          totalEntries: 0,
          thisWeek: [],
          thisMonth: [],
          goalProgress: 0
        }
      });
    }
    
    const currentWeight = logs[logs.length - 1];
    const startingWeight = logs[0];
    const totalChange = currentWeight.weight - startingWeight.weight;
    const averageChange = totalChange / (logs.length - 1);
    
    // Determine trend
    let trend = "stable";
    if (totalChange > 0) trend = "gaining";
    else if (totalChange < 0) trend = "losing";
    
    // Get this week's data
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeek = logs.filter(log => log.timestamp >= oneWeekAgo);
    
    // Get this month's data
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const thisMonth = logs.filter(log => log.timestamp >= oneMonthAgo);
    
    res.json({
      success: true,
      stats: {
        current: currentWeight,
        starting: startingWeight,
        totalChange: parseFloat(totalChange.toFixed(2)),
        averageChange: parseFloat(averageChange.toFixed(2)),
        trend,
        totalEntries: logs.length,
        thisWeek: thisWeek.length,
        thisMonth: thisMonth.length,
        goalProgress: 0 // Will be calculated based on user goals
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWeightProgress = async (req, res) => {
  try {
    const { userId, period = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    const logs = await Weight.find({
      userId,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: 1 });
    
    // Group by date for chart data
    const chartData = logs.map(log => ({
      date: log.timestamp.toISOString().split('T')[0],
      weight: log.weight,
      unit: log.unit
    }));
    
    res.json({
      success: true,
      progress: {
        logs: chartData,
        period: parseInt(period),
        totalEntries: logs.length
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
