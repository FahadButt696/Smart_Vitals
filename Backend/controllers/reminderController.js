import Reminder from '../models/Reminder.js';

// Get all reminders for a user
export const getReminders = async (req, res) => {
  try {
    const { userId } = req.auth;
    const reminders = await Reminder.find({ userId }).sort({ time: 1 });
    
    res.json({
      success: true,
      data: reminders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reminders',
      error: error.message
    });
  }
};

// Create a new reminder
export const createReminder = async (req, res) => {
  try {
    const { userId } = req.auth;
    const reminderData = {
      ...req.body,
      userId
    };

    // Calculate next trigger time
    if (reminderData.frequency === 'daily') {
      reminderData.nextTrigger = new Date(reminderData.time);
    } else if (reminderData.frequency === 'weekly') {
      reminderData.nextTrigger = new Date(reminderData.time);
    } else {
      reminderData.nextTrigger = new Date(reminderData.time);
    }

    const reminder = new Reminder(reminderData);
    await reminder.save();

    res.status(201).json({
      success: true,
      data: reminder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating reminder',
      error: error.message
    });
  }
};

// Update a reminder
export const updateReminder = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const reminder = await Reminder.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    res.json({
      success: true,
      data: reminder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating reminder',
      error: error.message
    });
  }
};

// Delete a reminder
export const deleteReminder = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const reminder = await Reminder.findOneAndDelete({ _id: id, userId });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    res.json({
      success: true,
      message: 'Reminder deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting reminder',
      error: error.message
    });
  }
};

// Toggle reminder active status
export const toggleReminder = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const reminder = await Reminder.findOne({ _id: id, userId });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    reminder.isActive = !reminder.isActive;
    await reminder.save();

    res.json({
      success: true,
      data: reminder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling reminder',
      error: error.message
    });
  }
};

// Get reminders due soon
export const getDueReminders = async (req, res) => {
  try {
    const { userId } = req.auth;
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    const dueReminders = await Reminder.find({
      userId,
      isActive: true,
      nextTrigger: { $lte: oneHourFromNow }
    }).sort({ nextTrigger: 1 });

    res.json({
      success: true,
      data: dueReminders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching due reminders',
      error: error.message
    });
  }
}; 