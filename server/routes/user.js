const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Quest = require('../models/Quest');

const router = express.Router();

// All user routes are protected
router.use(protect);

// @route   GET /api/user/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = req.user;
    
    // Get XP progress information
    const xpProgress = user.getXPToNextLevel();
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        level: user.level,
        xp: user.xp,
        stats: user.stats,
        avatar: user.avatar,
        xpProgress: xpProgress,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/user/stats
// @desc    Update user stats (for future use)
// @access  Private
router.put('/stats', async (req, res) => {
  try {
    const { statUpdates } = req.body;
    
    if (!statUpdates || typeof statUpdates !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid stat updates provided'
      });
    }
    
    const user = req.user;
    user.updateStats(statUpdates);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Stats updated successfully',
      data: {
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/user/avatar
// @desc    Update user avatar
// @access  Private
router.put('/avatar', async (req, res) => {
  try {
    const { avatar } = req.body;
    
    if (!avatar || typeof avatar !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid avatar provided'
      });
    }
    
    const user = req.user;
    user.avatar = avatar;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Avatar updated successfully',
      data: {
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating avatar',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/user/delete-account
// @desc    Delete user account and all associated data
// @access  Private
router.delete('/delete-account', async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find and delete user
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Delete all quests associated with this user
    await Quest.deleteMany({ userId: userId });
    
    res.status(200).json({
      success: true,
      message: 'Account and all associated data deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting account',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
