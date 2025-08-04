import SleepLog from '../models/SleepLog.js';

// Get all sleep logs for a user
export const getSleepLogs = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { days = 7 } = req.query;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const sleepLogs = await SleepLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    res.json({
      success: true,
      data: sleepLogs
    });
  } catch (error) {
    console.error('Error getting sleep logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving sleep logs'
    });
  }
};

// Add a new sleep log
export const addSleepLog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const sleepData = {
      ...req.body,
      userId,
      date: req.body.date || new Date()
    };

    const sleepLog = new SleepLog(sleepData);
    await sleepLog.save();

    res.status(201).json({
      success: true,
      data: sleepLog
    });
  } catch (error) {
    console.error('Error adding sleep log:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding sleep log'
    });
  }
};

// Update a sleep log
export const updateSleepLog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const sleepLog = await SleepLog.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!sleepLog) {
      return res.status(404).json({
        success: false,
        message: 'Sleep log not found'
      });
    }

    res.json({
      success: true,
      data: sleepLog
    });
  } catch (error) {
    console.error('Error updating sleep log:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating sleep log'
    });
  }
};

// Delete a sleep log
export const deleteSleepLog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const sleepLog = await SleepLog.findOneAndDelete({ _id: id, userId });

    if (!sleepLog) {
      return res.status(404).json({
        success: false,
        message: 'Sleep log not found'
      });
    }

    res.json({
      success: true,
      message: 'Sleep log deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting sleep log:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting sleep log'
    });
  }
};

// Get sleep statistics
export const getSleepStats = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { days = 7 } = req.query;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const sleepLogs = await SleepLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    if (sleepLogs.length === 0) {
      return res.json({
        success: true,
        data: {
          message: 'No sleep data available for the specified period'
        }
      });
    }

    // Calculate statistics
    const sleepDurations = sleepLogs.map(log => log.duration);
    const avgSleepDuration = sleepDurations.reduce((sum, duration) => sum + duration, 0) / sleepDurations.length;
    const minSleepDuration = Math.min(...sleepDurations);
    const maxSleepDuration = Math.max(...sleepDurations);

    // Calculate sleep quality
    const qualityScores = sleepLogs.map(log => log.quality || 5);
    const avgQuality = qualityScores.reduce((sum, quality) => sum + quality, 0) / qualityScores.length;

    // Calculate sleep efficiency
    const efficiencyScores = sleepLogs.map(log => log.efficiency || 80);
    const avgEfficiency = efficiencyScores.reduce((sum, efficiency) => sum + efficiency, 0) / efficiencyScores.length;

    // Generate insights
    const insights = [];
    if (avgSleepDuration < 7) {
      insights.push('You\'re getting less than the recommended 7-9 hours of sleep. Consider going to bed earlier.');
    } else if (avgSleepDuration > 9) {
      insights.push('You\'re sleeping more than recommended. This might affect your daytime energy levels.');
    } else {
      insights.push('Great job! You\'re getting the recommended amount of sleep.');
    }

    if (avgQuality < 6) {
      insights.push('Your sleep quality could be improved. Consider creating a better sleep environment.');
    }

    res.json({
      success: true,
      data: {
        avgSleepDuration: Math.round(avgSleepDuration * 10) / 10,
        minSleepDuration,
        maxSleepDuration,
        avgQuality: Math.round(avgQuality * 10) / 10,
        avgEfficiency: Math.round(avgEfficiency * 10) / 10,
        totalEntries: sleepLogs.length,
        insights,
        period: `${days} days`
      }
    });
  } catch (error) {
    console.error('Error getting sleep stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving sleep statistics'
    });
  }
};

 