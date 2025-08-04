import WeightLog from '../models/WeightLog.js';

// Get all weight logs for a user
export const getWeightLogs = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { days = 30 } = req.query;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const weightLogs = await WeightLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    res.json({
      success: true,
      data: weightLogs
    });
  } catch (error) {
    console.error('Error getting weight logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving weight logs'
    });
  }
};

// Add a new weight log
export const addWeightLog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const weightData = {
      ...req.body,
      userId,
      date: req.body.date || new Date()
    };

    const weightLog = new WeightLog(weightData);
    await weightLog.save();

    res.status(201).json({
      success: true,
      data: weightLog
    });
  } catch (error) {
    console.error('Error adding weight log:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding weight log'
    });
  }
};

// Update a weight log
export const updateWeightLog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const weightLog = await WeightLog.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!weightLog) {
      return res.status(404).json({
        success: false,
        message: 'Weight log not found'
      });
    }

    res.json({
      success: true,
      data: weightLog
    });
  } catch (error) {
    console.error('Error updating weight log:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating weight log'
    });
  }
};

// Delete a weight log
export const deleteWeightLog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const weightLog = await WeightLog.findOneAndDelete({ _id: id, userId });

    if (!weightLog) {
      return res.status(404).json({
        success: false,
        message: 'Weight log not found'
      });
    }

    res.json({
      success: true,
      message: 'Weight log deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting weight log:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting weight log'
    });
  }
};

// Get weight statistics
export const getWeightStats = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { days = 30 } = req.query;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const weightLogs = await WeightLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    if (weightLogs.length === 0) {
      return res.json({
        success: true,
        data: {
          message: 'No weight data available for the specified period'
        }
      });
    }

    // Calculate statistics
    const weights = weightLogs.map(log => log.weight);
    const currentWeight = weights[weights.length - 1];
    const startingWeight = weights[0];
    const totalChange = currentWeight - startingWeight;
    const avgWeight = weights.reduce((sum, weight) => sum + weight, 0) / weights.length;
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);

    // Calculate trend
    const trend = totalChange > 0 ? 'increasing' : totalChange < 0 ? 'decreasing' : 'stable';

    // Calculate weekly average change
    const weeklyChange = totalChange / (parseInt(days) / 7);

    res.json({
      success: true,
      data: {
        currentWeight,
        startingWeight,
        totalChange: Math.round(totalChange * 100) / 100,
        averageWeight: Math.round(avgWeight * 100) / 100,
        minWeight,
        maxWeight,
        trend,
        weeklyChange: Math.round(weeklyChange * 100) / 100,
        totalEntries: weightLogs.length,
        period: `${days} days`
      }
    });
  } catch (error) {
    console.error('Error getting weight stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving weight statistics'
    });
  }
}; 