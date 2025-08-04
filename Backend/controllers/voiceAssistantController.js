import VoiceAssistantLog from '../models/VoiceAssistantLog.js';

// Process voice command
export const processVoiceCommand = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { command, deviceInfo } = req.body;

    const startTime = Date.now();

    // Parse command and determine action
    const parsedCommand = parseVoiceCommand(command);
    
    // Simulate processing time
    const processingTime = Date.now() - startTime;

    // Create log entry
    const logEntry = new VoiceAssistantLog({
      userId,
      command,
      action: parsedCommand.action,
      success: parsedCommand.success,
      response: parsedCommand.response,
      confidence: parsedCommand.confidence,
      processingTime,
      deviceInfo
    });

    await logEntry.save();

    res.json({
      success: true,
      data: {
        action: parsedCommand.action,
        response: parsedCommand.response,
        confidence: parsedCommand.confidence,
        processingTime
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing voice command',
      error: error.message
    });
  }
};

// Get voice assistant logs
export const getVoiceLogs = async (req, res) => {
  try {
    const { userId } = req.auth;
    const logs = await VoiceAssistantLog.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching voice logs',
      error: error.message
    });
  }
};

// Get voice assistant statistics
export const getVoiceStats = async (req, res) => {
  try {
    const { userId } = req.auth;

    const totalCommands = await VoiceAssistantLog.countDocuments({ userId });
    const successfulCommands = await VoiceAssistantLog.countDocuments({ userId, success: true });
    const averageConfidence = await VoiceAssistantLog.aggregate([
      { $match: { userId } },
      { $group: { _id: null, avgConfidence: { $avg: '$confidence' } } }
    ]);

    const actionStats = await VoiceAssistantLog.aggregate([
      { $match: { userId } },
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalCommands,
        successfulCommands,
        successRate: totalCommands > 0 ? (successfulCommands / totalCommands * 100).toFixed(1) : 0,
        averageConfidence: averageConfidence[0]?.avgConfidence?.toFixed(1) || 0,
        actionStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching voice statistics',
      error: error.message
    });
  }
};

// Parse voice command (simulated)
const parseVoiceCommand = (command) => {
  const lowerCommand = command.toLowerCase();
  
  // Meal logging commands
  if (lowerCommand.includes('log meal') || lowerCommand.includes('add meal') || lowerCommand.includes('ate')) {
    return {
      action: 'log_meal',
      success: true,
      response: 'I\'ll help you log your meal. What did you eat?',
      confidence: 85
    };
  }
  
  // Calorie checking commands
  if (lowerCommand.includes('calories') || lowerCommand.includes('calorie') || lowerCommand.includes('nutrition')) {
    return {
      action: 'check_calories',
      success: true,
      response: 'Let me check your calorie intake for today.',
      confidence: 90
    };
  }
  
  // Workout logging commands
  if (lowerCommand.includes('workout') || lowerCommand.includes('exercise') || lowerCommand.includes('gym')) {
    return {
      action: 'log_workout',
      success: true,
      response: 'Great! Let\'s log your workout. What type of exercise did you do?',
      confidence: 88
    };
  }
  
  // Water logging commands
  if (lowerCommand.includes('water') || lowerCommand.includes('drink') || lowerCommand.includes('hydrate')) {
    return {
      action: 'log_water',
      success: true,
      response: 'I\'ll log your water intake. How much did you drink?',
      confidence: 92
    };
  }
  
  // Sleep logging commands
  if (lowerCommand.includes('sleep') || lowerCommand.includes('bed') || lowerCommand.includes('rest')) {
    return {
      action: 'log_sleep',
      success: true,
      response: 'Let\'s track your sleep. When did you go to bed?',
      confidence: 87
    };
  }
  
  // Weight logging commands
  if (lowerCommand.includes('weight') || lowerCommand.includes('scale') || lowerCommand.includes('weigh')) {
    return {
      action: 'log_weight',
      success: true,
      response: 'I\'ll help you log your weight. What\'s your current weight?',
      confidence: 89
    };
  }
  
  // Reminder commands
  if (lowerCommand.includes('remind') || lowerCommand.includes('reminder') || lowerCommand.includes('set')) {
    return {
      action: 'set_reminder',
      success: true,
      response: 'I\'ll set a reminder for you. What should I remind you about?',
      confidence: 85
    };
  }
  
  // Default response
  return {
    action: 'other',
    success: false,
    response: 'I didn\'t understand that command. Could you please repeat?',
    confidence: 30
  };
}; 