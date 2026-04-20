const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quest',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [100, 'Post title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Post description is required'],
    trim: true,
    maxlength: [500, 'Post description cannot exceed 500 characters']
  },
  imageData: {
    type: Buffer,
    required: [true, 'Post image is required']
  },
  imageContentType: {
    type: String,
    required: [true, 'Image content type is required']
  },
  caption: {
    type: String,
    required: [true, 'Post caption is required'],
    trim: true,
    maxlength: [500, 'Post caption cannot exceed 500 characters']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      maxlength: [300, 'Comment cannot exceed 300 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    replies: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      text: {
        type: String,
        required: [true, 'Reply text is required'],
        trim: true,
        maxlength: [300, 'Reply cannot exceed 300 characters']
      },
      replyToUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional - only for @mentions
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
postSchema.index({ userId: 1, questId: 1 }, { unique: true }); // Ensures one post per quest per user
postSchema.index({ createdAt: -1 }); // For sorting by newest first

// Static method to check if user can post for a quest
postSchema.statics.canUserPost = async function(userId, questId) {
  // Check if post already exists for this quest
  const existingPost = await this.findOne({ userId, questId });
  return !existingPost;
};

// Static method to get all posts with populated user data
postSchema.statics.getAllPosts = function(limit = 20, skip = 0) {
  return this.find({})
    .populate('userId', 'username avatar')
    .populate('questId', 'title difficulty xpReward')
    .populate('comments.userId', 'username avatar')
    .populate('comments.replies.userId', 'username avatar')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get posts by user
postSchema.statics.getUserPosts = function(userId, limit = 10, skip = 0) {
  return this.find({ userId })
    .populate('userId', 'username avatar')
    .populate('questId', 'title difficulty xpReward')
    .populate('comments.userId', 'username avatar')
    .populate('comments.replies.userId', 'username avatar')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Instance method to toggle like
postSchema.methods.toggleLike = function(userId) {
  const likeIndex = this.likes.indexOf(userId);
  if (likeIndex === -1) {
    this.likes.push(userId);
    return { liked: true, likeCount: this.likes.length };
  } else {
    this.likes.splice(likeIndex, 1);
    return { liked: false, likeCount: this.likes.length };
  }
};

// Instance method to add comment
postSchema.methods.addComment = function(userId, text) {
  this.comments.push({ userId, text });
  return this.comments[this.comments.length - 1];
};

// Pre-remove middleware to clean up references
postSchema.pre('remove', async function(next) {
  // Add any cleanup logic here if needed
  next();
});

module.exports = mongoose.model('Post', postSchema);
