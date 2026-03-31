const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const Quest = require('../models/Quest');
const User = require('../models/User');

const router = express.Router();

// All quest routes are protected
router.use(protect);

// @route   GET /api/quests
// @desc    Get all quests for the current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, status } = req.query;
    
    // Build filter object
    let filter = { userId };
    
    if (type && ['daily', 'main'].includes(type)) {
      filter.type = type;
    }
    
    if (status && ['pending', 'completed'].includes(status)) {
      filter.status = status;
    }
    
    const quests = await Quest.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: quests,
      count: quests.length
    });
  } catch (error) {
    console.error('Get quests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/quests
// @desc    Create a new quest
// @access  Private
router.post('/', [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Quest title must be between 1 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Quest description must be between 1 and 500 characters'),
  body('xpReward')
    .isInt({ min: 10, max: 500 })
    .withMessage('XP reward must be between 10 and 500'),
  body('type')
    .optional()
    .isIn(['daily', 'main'])
    .withMessage('Quest type must be either daily or main'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, xpReward, type = 'main', difficulty = 'medium' } = req.body;
    const userId = req.user._id;

    // Create quest
    const quest = await Quest.create({
      userId,
      title,
      description,
      xpReward,
      type,
      difficulty
    });

    res.status(201).json({
      success: true,
      message: 'Quest created successfully!',
      data: quest
    });
  } catch (error) {
    console.error('Create quest error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating quest',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/quests/:id
// @desc    Update quest (complete or modify)
// @access  Private
router.put('/:id', [
  body('status')
    .optional()
    .isIn(['pending', 'completed'])
    .withMessage('Status must be either pending or completed')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const questId = req.params.id;
    const userId = req.user._id;
    const { status } = req.body;

    // Find quest
    const quest = await Quest.findOne({ _id: questId, userId });

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found'
      });
    }

    // Check if quest is already completed
    if (quest.status === 'completed' && status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Quest is already completed'
      });
    }

    let userUpdate = null;
    let leveledUp = false;

    // If completing quest, award XP and stats
    if (status === 'completed' && quest.status === 'pending') {
      // Complete the quest
      await quest.complete();
      
      // Get user and award XP
      const user = await User.findById(userId);
      const result = user.addXP(quest.xpReward);
      userUpdate = result;
      leveledUp = result.leveledUp;
      
      // Award stats if they exist
      if (quest.statsReward) {
        user.updateStats(quest.statsReward);
      }
      
      await user.save();
    } else {
      // Just update status
      quest.status = status || quest.status;
      await quest.save();
    }

    res.status(200).json({
      success: true,
      message: status === 'completed' 
        ? `Quest completed! You earned ${quest.xpReward} XP! ${leveledUp ? '🎉 LEVEL UP! 🎉' : ''}`
        : 'Quest updated successfully',
      data: {
        quest,
        userUpdate: userUpdate ? {
          xp: userUpdate.xp,
          level: userUpdate.level,
          leveledUp: userUpdate.leveledUp,
          xpToNextLevel: userUpdate.xpToNextLevel
        } : null
      }
    });
  } catch (error) {
    console.error('Update quest error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating quest',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/quests/:id
// @desc    Delete a quest
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const questId = req.params.id;
    const userId = req.user._id;

    // Find and delete quest
    const quest = await Quest.findOneAndDelete({ _id: questId, userId });

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quest deleted successfully'
    });
  } catch (error) {
    console.error('Delete quest error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting quest',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/quests/generate-daily
// @desc    Generate daily quests for the user
// @access  Private
router.post('/generate-daily', async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if daily quests already exist for today
    const existingDailyQuests = await Quest.getDailyQuests(userId);
    
    if (existingDailyQuests.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Daily quests already exist for today'
      });
    }

    // Create default daily quests
    const dailyQuests = await Quest.createDefaultDailyQuests(userId);

    res.status(201).json({
      success: true,
      message: 'Daily quests generated successfully!',
      data: dailyQuests
    });
  } catch (error) {
    console.error('Generate daily quests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating daily quests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
