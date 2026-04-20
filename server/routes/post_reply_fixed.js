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
    const parentCommentUpdated = updatedPost.comments.find(c => c._id.toString() === commentId);
    const newReply = parentCommentUpdated.replies[parentCommentUpdated.replies.length - 1];

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
