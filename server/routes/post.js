const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const Post = require('../models/Post');
const Quest = require('../models/Quest');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const router = express.Router();

// Configure multer for image uploads (memory storage for database)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Public image endpoint - no authentication required
router.get('/:id/image', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Handle database storage (all posts now use this)
    if (post.imageData && post.imageContentType) {
      res.set('Content-Type', post.imageContentType);
      res.send(post.imageData);
    }
    // No image found
    else {
      return res.status(404).json({
        success: false,
        message: 'Post has no image'
      });
    }
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching image'
    });
  }
});

// All other post routes are protected
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

    // Debug: Check if file exists and has buffer
    console.log('File received:', req.file ? 'Yes' : 'No');
    if (req.file) {
      console.log('File details:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        buffer: req.file.buffer ? 'Yes' : 'No'
      });
    }

    // Resize image and convert to buffer
    let resizedImageBuffer;
    try {
      if (req.file.buffer) {
        resizedImageBuffer = await sharp(req.file.buffer)
          .resize(1200, 675, { 
            fit: 'cover',
            position: 'center',
            withoutEnlargement: true
          })
          .jpeg({ quality: 80 })
          .toBuffer();
      } else {
        throw new Error('No file buffer available');
      }
      console.log('Image processed successfully, buffer size:', resizedImageBuffer.length);
    } catch (error) {
      console.error('Image processing error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to process image: ' + error.message
      });
    }

    // Create post with image data in database
    const post = await Post.create({
      userId,
      questId,
      title: quest.title,
      description: quest.description,
      imageData: resizedImageBuffer,
      imageContentType: 'image/jpeg',
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
router.post('/:id/comment', protect, [
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

// @route   DELETE /api/posts/:id/comment/:commentId
// @desc    Delete a comment (by comment author or post author)
// @access  Private
router.delete('/:id/comment/:commentId', protect, async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.params.commentId;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is the comment author or post author
    if (comment.userId.toString() !== userId.toString() && post.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments or comments on your posts'
      });
    }

    // Remove the comment
    post.comments.pull(commentId);
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully!'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting comment',
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

    // Image data is stored in database, no file cleanup needed

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
  if (!canPost) {
    return res.status(200).json({
      success: true,
      data: {
        canPost: false,
        reason: 'Already posted for this quest'
      }
    });
  }

  res.status(200).json({
    success: true,
    data: {
      canPost: true
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

// @route   POST /api/posts/:postId/comments/:commentId/reply
// @desc    Add a reply to a comment
// @access  Private
router.post('/:postId/comments/:commentId/reply', protect, async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const userId = req.user._id;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reply text is required'
      });
    }

    // Find the parent comment
    const parentComment = await Post.findOne(
      { _id: postId, 'comments._id': commentId },
      'comments.userId username avatar'
    );

    if (!parentComment) {
      return res.status(404).json({
        success: false,
        message: 'Parent comment not found'
      });
    }

    // Extract username from text for @mention
    const mentionMatch = text.match(/@(\w+)/);
    let replyToUserId = null;
    if (mentionMatch) {
      const mentionedUser = await User.findOne({ username: mentionMatch[1] });
      if (mentionedUser) {
        replyToUserId = mentionedUser._id;
      }
    }

    // Create the reply
    const reply = {
      userId,
      text,
      replyToUserId,
      createdAt: new Date()
    };

    // Add the reply to the parent comment
    await Post.updateOne(
      { _id: postId, 'comments._id': commentId },
      { 
        $push: { 
          'comments.$.replies': reply 
        } 
      }
    );

    // Get the updated post with populated user data
    const updatedPost = await Post.findById(postId)
      .populate('comments.userId', 'username avatar')
      .populate('comments.replies.userId', 'username avatar');

    // Find the newly added reply with populated user data
    const updatedParentComment = updatedPost.comments.find(c => c._id.toString() === commentId);
    const newReply = updatedParentComment.replies[updatedParentComment.replies.length - 1];

    res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      data: newReply
    });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding reply',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/posts/:postId/comments/:commentId/replies/:replyId
// @desc    Delete a specific reply (by reply author or post author)
// @access  Private
router.delete('/:postId/comments/:commentId/replies/:replyId', protect, async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Find the parent comment
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Parent comment not found'
      });
    }

    // Find the reply
    const reply = comment.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }

    // Check if user is the reply author or post author
    if (reply.userId.toString() !== userId.toString() && post.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own replies or replies on your posts'
      });
    }

    // Remove only the specific reply (sub-replies will remain as they are separate replies)
    comment.replies.pull(replyId);
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Reply deleted successfully!'
    });
  } catch (error) {
    console.error('Delete reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting reply',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
