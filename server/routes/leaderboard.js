const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/leaderboard
// @desc    Get leaderboard of top users by XP
// @access  Public (but can be protected if needed)
router.get('/', async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    
    // Parse query parameters
    const limitNum = Math.min(parseInt(limit) || 10, 50); // Max 50 users
    const offsetNum = Math.max(parseInt(offset) || 0, 0);
    
    // Get top users by XP, sorted by XP descending, then by level
    const topUsers = await User.find({})
      .select('username xp level avatar stats createdAt')
      .sort({ xp: -1, level: -1 })
      .limit(limitNum)
      .skip(offsetNum)
      .lean();
    
    // Get total count for pagination
    const totalCount = await User.countDocuments({});
    
    // Add rank to each user
    const usersWithRank = topUsers.map((user, index) => ({
      ...user,
      rank: offsetNum + index + 1
    }));
    
    res.status(200).json({
      success: true,
      data: {
        users: usersWithRank,
        pagination: {
          total: totalCount,
          limit: limitNum,
          offset: offsetNum,
          hasMore: offsetNum + limitNum < totalCount
        }
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaderboard',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/leaderboard/my-rank
// @desc    Get current user's rank on leaderboard
// @access  Private
router.get('/my-rank', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all users sorted by XP to find user's rank
    const users = await User.find({})
      .select('_id xp level')
      .sort({ xp: -1, level: -1 })
      .lean();
    
    // Find current user's rank
    const userRank = users.findIndex(user => user._id.toString() === userId.toString()) + 1;
    
    if (userRank === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found in leaderboard'
      });
    }
    
    // Get nearby users for context
    const startIndex = Math.max(0, userRank - 3);
    const endIndex = Math.min(users.length, userRank + 2);
    const nearbyUsers = users.slice(startIndex, endIndex);
    
    // Get full user details for nearby users
    const nearbyUsersDetails = await User.find({
      _id: { $in: nearbyUsers.map(u => u._id) }
    })
      .select('username xp level avatar stats')
      .sort({ xp: -1, level: -1 })
      .lean();
    
    // Add rank to nearby users
    const nearbyUsersWithRank = nearbyUsersDetails.map((user, index) => ({
      ...user,
      rank: startIndex + index + 1,
      isCurrentUser: user._id.toString() === userId.toString()
    }));
    
    res.status(200).json({
      success: true,
      data: {
        userRank,
        user: {
          id: req.user._id,
          username: req.user.username,
          xp: req.user.xp,
          level: req.user.level,
          avatar: req.user.avatar
        },
        nearbyUsers: nearbyUsersWithRank
      }
    });
  } catch (error) {
    console.error('Get user rank error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user rank',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
