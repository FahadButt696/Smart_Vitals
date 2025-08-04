import WaterIntake from '../models/WaterIntake.js';

// Get all water logs for a user
export const getWaterLogs = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { date } = req.query;

    let query = { userId };

    // Filter by date if provided
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
      query.timestamp = { $gte: startDate, $lte: endDate };
    }

    const waterLogs = await WaterIntake.find(query).sort({ timestamp: -1 });

    res.json({
      success: true,
      data: waterLogs
    });
  } catch (error) {
    console.error('Error getting water logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving water logs'
    });
  }
};

// Add a new water log
export const addWaterLog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const waterData = {
      ...req.body,
      userId,
      timestamp: req.body.timestamp || new Date()
    };

    const waterLog = new WaterIntake(waterData);
    await waterLog.save();

    res.status(201).json({
      success: true,
      data: waterLog
    });
  } catch (error) {
    console.error('Error adding water log:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding water log'
    });
  }
};

// Update a water log
export const updateWaterLog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const waterLog = await WaterIntake.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!waterLog) {
      return res.status(404).json({
        success: false,
        message: 'Water log not found'
      });
    }

    res.json({
      success: true,
      data: waterLog
    });
  } catch (error) {
    console.error('Error updating water log:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating water log'
    });
  }
};

// Delete a water log
export const deleteWaterLog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const waterLog = await WaterIntake.findOneAndDelete({ _id: id, userId });

    if (!waterLog) {
      return res.status(404).json({
        success: false,
        message: 'Water log not found'
      });
    }

    res.json({
      success: true,
      message: 'Water log deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting water log:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting water log'
    });
  }
};

// Get water statistics
export const getWaterStats = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { days = 7 } = req.query;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const waterLogs = await WaterIntake.find({
      userId,
      timestamp: { $gte: startDate, $lte: endDate }
    });

    // Calculate daily totals
    const dailyTotals = {};
    waterLogs.forEach(log => {
      const date = log.timestamp.toDateString();
      dailyTotals[date] = (dailyTotals[date] || 0) + log.amount;
    });

    // Calculate statistics
    const totalIntake = waterLogs.reduce((sum, log) => sum + log.amount, 0);
    const avgDailyIntake = Object.values(dailyTotals).reduce((sum, daily) => sum + daily, 0) / Object.keys(dailyTotals).length || 0;
    const targetDailyIntake = 2000; // ml, can be made configurable
    const daysWithData = Object.keys(dailyTotals).length;
    const avgIntakePercentage = (avgDailyIntake / targetDailyIntake) * 100;

    // Generate insights
    const insights = [];
    if (avgDailyIntake < targetDailyIntake * 0.8) {
      insights.push('You\'re drinking less water than recommended. Try to increase your intake.');
    } else if (avgDailyIntake >= targetDailyIntake) {
      insights.push('Great job! You\'re meeting your daily water intake goals.');
    }

    if (daysWithData < parseInt(days) * 0.7) {
      insights.push('Try to log your water intake more consistently for better tracking.');
    }

    res.json({
      success: true,
      data: {
        totalIntake,
        avgDailyIntake: Math.round(avgDailyIntake),
        targetDailyIntake,
        avgIntakePercentage: Math.round(avgIntakePercentage),
        daysWithData,
        totalDays: parseInt(days),
        dailyTotals,
        insights,
        period: `${days} days`
      }
    });
  } catch (error) {
    console.error('Error getting water stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving water statistics'
    });
  }
}; 