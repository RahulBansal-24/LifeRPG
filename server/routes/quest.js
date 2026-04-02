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
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
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

    const { title, description, type = 'main', difficulty = 'medium', selectedSkills = [] } = req.body;
    const userId = req.user._id;

    // Auto-calculate XP based on difficulty and number of selected skills
    const skillCount = Array.isArray(selectedSkills) ? selectedSkills.length : 0;
    let xpReward;
    
    if (difficulty === 'easy') {
      xpReward = skillCount === 1 ? 20 : 25;
    } else if (difficulty === 'medium') {
      xpReward = skillCount === 1 ? 25 : 30;
    } else if (difficulty === 'hard') {
      xpReward = skillCount === 1 ? 35 : 40;
    } else {
      xpReward = 25; // default
    }

    // Calculate stats reward based on difficulty
    const statsReward = {
      strength: 0,
      intelligence: 0,
      discipline: 0,
      charisma: 0
    };
    
    const skillPoints = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    
    if (Array.isArray(selectedSkills)) {
      selectedSkills.forEach(skill => {
        if (statsReward[skill] !== undefined) {
          statsReward[skill] = skillPoints;
        }
      });
    }

    // Create quest
    const quest = await Quest.create({
      userId,
      title,
      description,
      xpReward,
      type,
      difficulty,
      statsReward,
      selectedSkills
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
      try {
        // Complete the quest
        quest.status = 'completed';
        quest.completedAt = new Date();
        await quest.save();
        console.log('Quest saved with status:', quest.status);
        
        // Get user and award XP
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }
        
        console.log('User before update:', { stars: user.stars, xp: user.xp, stats: user.stats });
        
        const result = user.addXP(quest.xpReward);
        userUpdate = result;
        leveledUp = result.leveledUp;
        
        // Award stats if they exist
        if (quest.statsReward) {
          console.log('Awarding stats:', quest.statsReward);
          user.updateStats(quest.statsReward);
        }
        
        // Award star for main quests only
        if (quest.type === 'main') {
          console.log('Awarding star for main quest');
          user.stars += 1;
        }
        
        console.log('User before save:', { stars: user.stars, xp: user.xp, stats: user.stats });
        
        await user.save();
        console.log('User saved with new stats:', user.stars, user.xp);
        
        // Update userUpdate with latest user data
        userUpdate = {
          ...userUpdate,
          stars: user.stars,
          stats: user.stats
        };
        
        console.log('Final userUpdate object:', userUpdate);
      } catch (error) {
        console.error('Error during quest completion:', error);
        return res.status(500).json({
          success: false,
          message: 'Error completing quest',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
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
        userUpdate: userUpdate || null
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
