const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const Post = require('../models/Post');
const Quest = require('../models/Quest');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/posts';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// All post routes are protected
router.use(protect);

// @route   POST /api/posts/create
// @desc    Create a new post (only after completing a quest)
// @access  Private
router.post('/create', upload.single('image'), [
  body('questId')
    .notEmpty()
    .withMessage('Quest ID is required'),
  body('caption')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Caption must be between 1 and 500 characters')
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

    const { questId, caption } = req.body;
    const userId = req.user._id;

    // Check if quest exists and is completed by user
    const quest = await Quest.findOne({ _id: questId, userId, status: 'completed' });
    if (!quest) {
      return res.status(400).json({
        success: false,
        message: 'You can only create posts for completed quests'
      });
    }

    // Check if user already posted for this quest
    const canPost = await Post.canUserPost(userId, questId);
    if (!canPost) {
      return res.status(400).json({
        success: false,
        message: 'You have already created a post for this quest'
      });
    }

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    // Create post
    const post = await Post.create({
      userId,
      questId,
      title: quest.title,
      description: quest.description,
      imageUrl: `/uploads/posts/${req.file.filename}`,
      caption
    });

    // Populate post data
    await post.populate('userId', 'username avatar');
    await post.populate('questId', 'title difficulty xpReward');

    res.status(201).json({
      success: true,
      message: 'Post created successfully!',
      data: post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/posts/all
// @desc    Get all posts (chronicles feed)
// @access  Private
router.get('/all', async (req, res) => {
  try {
    const { limit = 20, skip = 0 } = req.query;
    
    const posts = await Post.getAllPosts(parseInt(limit), parseInt(skip));
    
    res.status(200).json({
      success: true,
      data: posts,
      count: posts.length
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching posts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/posts/my
// @desc    Get current user's posts
// @access  Private
router.get('/my', async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query;
    const userId = req.user._id;
    
    const posts = await Post.getUserPosts(userId, parseInt(limit), parseInt(skip));
    
    res.status(200).json({
      success: true,
      data: posts,
      count: posts.length
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user posts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Toggle like on a post
// @access  Private
router.post('/:id/like', async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const likeResult = post.toggleLike(userId);
    await post.save();

    res.status(200).json({
      success: true,
      message: likeResult.liked ? 'Post liked!' : 'Post unliked!',
      data: {
        liked: likeResult.liked,
        likeCount: likeResult.likeCount
      }
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling like',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add comment to a post
// @access  Private
router.post('/:id/comment', [
  body('text')
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage('Comment must be between 1 and 300 characters')
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

    const postId = req.params.id;
    const { text } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = post.addComment(userId, text);
    await post.save();

    // Populate comment with user data
    await post.populate('comments.userId', 'username avatar');

    const populatedComment = post.comments.id(comment._id);

    res.status(201).json({
      success: true,
      message: 'Comment added successfully!',
      data: populatedComment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post (only by owner)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the owner
    if (post.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts'
      });
    }

    // Delete image file
    if (post.imageUrl) {
      const imagePath = path.join(__dirname, '..', post.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/posts/check/:questId
// @desc    Check if user can post for a specific quest
// @access  Private
router.get('/check/:questId', async (req, res) => {
  try {
    const questId = req.params.questId;
    const userId = req.user._id;

    // Check if quest exists and is completed by user
    const quest = await Quest.findOne({ _id: questId, userId, status: 'completed' });
    if (!quest) {
      return res.status(200).json({
        success: true,
        data: {
          canPost: false,
          reason: 'Quest not completed'
        }
      });
    }

    // Check if user already posted for this quest
    const canPost = await Post.canUserPost(userId, questId);

    res.status(200).json({
      success: true,
      data: {
        canPost,
        quest: {
          title: quest.title,
          description: quest.description
        }
      }
    });
  } catch (error) {
    console.error('Check post eligibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking post eligibility',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
