import MentalHealthLog from '../models/MentalHealthLog.js';

// Get all mental health logs for a user
export const getMentalHealthLogs = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { days = 7 } = req.query;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const mentalHealthLogs = await MentalHealthLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    res.json({
      success: true,
      data: mentalHealthLogs
    });
  } catch (error) {
    console.error('Error getting mental health logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving mental health logs'
    });
  }
};

// Add a new mental health log
export const addMentalHealthLog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const mentalHealthData = {
      ...req.body,
      userId,
      date: req.body.date || new Date()
    };

    const mentalHealthLog = new MentalHealthLog(mentalHealthData);
    await mentalHealthLog.save();

    res.status(201).json({
      success: true,
      data: mentalHealthLog
    });
  } catch (error) {
    console.error('Error adding mental health log:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding mental health log'
    });
  }
};

// Update a mental health log
export const updateMentalHealthLog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const mentalHealthLog = await MentalHealthLog.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!mentalHealthLog) {
      return res.status(404).json({
        success: false,
        message: 'Mental health log not found'
      });
    }

    res.json({
      success: true,
      data: mentalHealthLog
    });
  } catch (error) {
    console.error('Error updating mental health log:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating mental health log'
    });
  }
};

// Delete a mental health log
export const deleteMentalHealthLog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const mentalHealthLog = await MentalHealthLog.findOneAndDelete({ _id: id, userId });

    if (!mentalHealthLog) {
      return res.status(404).json({
        success: false,
        message: 'Mental health log not found'
      });
    }

    res.json({
      success: true,
      message: 'Mental health log deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting mental health log:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting mental health log'
    });
  }
};

// Get mental health statistics
export const getMentalHealthStats = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { days = 7 } = req.query;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const mentalHealthLogs = await MentalHealthLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    if (mentalHealthLogs.length === 0) {
      return res.json({
        success: true,
        data: {
          message: 'No mental health data available for the specified period'
        }
      });
    }

    // Calculate statistics
    const moodScores = mentalHealthLogs.map(log => log.moodScore || 5);
    const avgMoodScore = moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length;
    const minMoodScore = Math.min(...moodScores);
    const maxMoodScore = Math.max(...moodScores);

    // Stress level analysis
    const stressScores = mentalHealthLogs.map(log => log.stressLevel || 3);
    const avgStressLevel = stressScores.reduce((sum, level) => sum + level, 0) / stressScores.length;

    // Anxiety level analysis
    const anxietyScores = mentalHealthLogs.map(log => log.anxietyLevel || 3);
    const avgAnxietyLevel = anxietyScores.reduce((sum, level) => sum + level, 0) / anxietyScores.length;

    // Mood distribution
    const moodDistribution = {};
    mentalHealthLogs.forEach(log => {
      const mood = log.mood || 'neutral';
      moodDistribution[mood] = (moodDistribution[mood] || 0) + 1;
    });

    // Generate insights
    const insights = [];
    if (avgMoodScore < 4) {
      insights.push('Your mood has been lower than average. Consider activities that boost your mood.');
    } else if (avgMoodScore >= 7) {
      insights.push('Great job! You\'ve been maintaining a positive mood.');
    }

    if (avgStressLevel > 6) {
      insights.push('Your stress levels are high. Consider stress-reduction techniques like meditation or exercise.');
    }

    if (avgAnxietyLevel > 6) {
      insights.push('Your anxiety levels are elevated. Consider talking to a professional or practicing relaxation techniques.');
    }

    res.json({
      success: true,
      data: {
        avgMoodScore: Math.round(avgMoodScore * 10) / 10,
        minMoodScore,
        maxMoodScore,
        avgStressLevel: Math.round(avgStressLevel * 10) / 10,
        avgAnxietyLevel: Math.round(avgAnxietyLevel * 10) / 10,
        moodDistribution,
        totalEntries: mentalHealthLogs.length,
        insights,
        period: `${days} days`
      }
    });
  } catch (error) {
    console.error('Error getting mental health stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving mental health statistics'
    });
  }
};

 