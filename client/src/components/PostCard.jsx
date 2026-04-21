import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  MoreHorizontal,
  Star,
  Target,
  Calendar,
  User,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import CommentItem from './CommentItem';
import { postAPI } from '../services/api';

const PostCard = ({ post, currentUser, onLike, onComment, onCommentDeleted, onDelete, onPostQuest }) => {
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser._id) || post.likes.includes(currentUser.id));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const commentInputRef = useRef(null);

  // Simple check if user is post owner
  const isPostOwner = currentUser && post.userId && (
    post.userId === currentUser._id || 
    post.userId === currentUser.id ||
    (post.userId._id && post.userId._id === currentUser._id) ||
    (post.userId._id && post.userId._id === currentUser.id)
  );

  // Simple check if user can delete comment
  const canDeleteComment = (comment) => {
    if (!currentUser) return false;
    const isCommentAuthor = comment.userId === currentUser._id || 
                           comment.userId === currentUser.id ||
                           (comment.userId._id && comment.userId._id === currentUser._id) ||
                           (comment.userId._id && comment.userId._id === currentUser.id);
    return isCommentAuthor || isPostOwner;
  };

  // Sync like state with post data
  useEffect(() => {
    const currentUserId = currentUser._id || currentUser.id;
    setIsLiked(post.likes.includes(currentUserId));
    setLikeCount(post.likes.length);
  }, [post.likes, currentUser._id, currentUser.id]);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingLike, setIsSubmittingLike] = useState(false);
  const [replyingToComment, setReplyingToComment] = useState(null);

  // Handle like/unlike
  const handleLike = async () => {
    if (isSubmittingLike) return;
    
    try {
      setIsSubmittingLike(true);
      const response = await postAPI.toggleLike(post._id);
      const { liked, likeCount: newLikeCount } = response.data.data;
      
      setIsLiked(liked);
      setLikeCount(newLikeCount);
      onLike(post._id, { liked, likeCount: newLikeCount });
      
      toast.success(liked ? 'Post liked! ' : 'Post unliked');
    } catch (error) {
      console.error('Failed to toggle like:', error);
      toast.error('Failed to like post');
    } finally {
      setIsSubmittingLike(false);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);
      
      let response;
      if (replyingToComment) {
        // This is a reply to a comment
        const mentionMatch = commentText.match(/@(\w+)/);
        let replyToUserId = null;
        if (mentionMatch) {
          replyToUserId = mentionMatch[1];
        }
        response = await postAPI.addReply(post._id, replyingToComment.commentId, commentText, replyToUserId);
      } else {
        // This is a new comment
        response = await postAPI.addComment(post._id, commentText);
      }
      
      if (response.data.success) {
        const newComment = response.data.data;
        setCommentText('');
        setReplyingToComment(null);
        // Pass additional context for replies
        onComment(post._id, newComment, replyingToComment);
        toast.success(replyingToComment ? 'Reply added!' : 'Comment added!');
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle delete post
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this chronicle?')) return;

    try {
      await postAPI.deletePost(post._id);
      onDelete(post._id);
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error('Failed to delete post');
    }
  };

  // Handle delete comment
  const handleDeleteComment = (postId, commentId) => {
    // Just pass through to parent component - CommentItem handles the actual API call
    onCommentDeleted && onCommentDeleted(postId, commentId);
  };

  // Format time
  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // Count all comments including replies
  const getTotalCommentCount = (post) => {
    let totalComments = post.comments.length;
    post.comments.forEach(comment => {
      if (comment.replies && comment.replies.length > 0) {
        totalComments += comment.replies.length;
      }
    });
    return totalComments;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gaming-card border border-gaming-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="p-4 border-b border-gaming-border">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {post.userId.avatar && (post.userId.avatar.startsWith('http') || post.userId.avatar.startsWith('/uploads/')) ? (
              <img 
                src={post.userId.avatar} 
                alt={post.userId.username}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="w-10 h-10 flex items-center justify-center" style={{display: (post.userId.avatar && (post.userId.avatar.startsWith('http') || post.userId.avatar.startsWith('/uploads/'))) ? 'none' : 'flex'}}>
              {post.userId.avatar && !post.userId.avatar.startsWith('http') && !post.userId.avatar.startsWith('/uploads/') ? (
                <span className="text-2xl">{post.userId.avatar}</span>
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-white">{post.userId.username}</h3>
                <span className="text-gray-400 text-sm">·</span>
                <span className="text-gray-400 text-sm">{formatTimeAgo(post.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Target className="w-3 h-3 text-neon-purple" />
                <span className="text-sm text-gray-300">{post.questId.title}</span>
                <span className={`text-xs font-semibold ${getDifficultyColor(post.questId.difficulty)}`}>
                  {post.questId.difficulty}
                </span>
                <span className="text-xs text-neon-green">+{post.questId.xpReward} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Quest Info */}
        <div className="mb-4">
          <h4 className="font-semibold text-white mb-2">{post.title}</h4>
          <p className="text-gray-400 text-sm mb-3">{post.description}</p>
        </div>

        {/* Image */}
        <div className="mb-4 rounded-lg overflow-hidden bg-gaming-darker">
          <img
            src={`/api/posts/${post._id}/image`}
            alt={post.title}
            className="w-full"
            style={{ 
              aspectRatio: '16/9', 
              maxHeight: '400px',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            onError={(e) => {
              // Create a simple fallback instead of external placeholder
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
            onLoad={(e) => {
              e.target.nextElementSibling.style.display = 'none';
            }} />
          <div className="w-full bg-gaming-darker flex items-center justify-center" style={{ aspectRatio: '16/9', minHeight: '300px', display: 'none' }}>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <ImageIcon className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400 text-sm">Image not available</p>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="mb-4">
          <p className="text-gray-300 whitespace-pre-wrap">{post.caption}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              disabled={isSubmittingLike}
              className={`flex items-center space-x-1 transition-colors ${
                isLiked 
                  ? 'text-red-500 hover:text-red-400' 
                  : 'text-gray-400 hover:text-red-500'
              } ${isSubmittingLike ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likeCount}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-gray-400 hover:text-neon-blue transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{getTotalCommentCount(post)}</span>
            </button>
          </div>
          {isPostOwner && (
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 group"
              title="Delete post"
            >
              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gaming-border">
            {/* Comments List */}
            {post.comments.length > 0 && (
              <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
                {post.comments.map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={{...comment, postId: post._id}}
                    currentUser={currentUser}
                    level={0}
                    isPostOwner={isPostOwner}
                    onReplyAdded={onComment}
                    onDelete={handleDeleteComment}
                    onReplyClick={(postId, commentId, mentionText) => {
                      // Focus on the specific comment input for this post
                      if (commentInputRef.current) {
                        commentInputRef.current.focus();
                        commentInputRef.current.value = mentionText;
                        setCommentText(mentionText);
                        setReplyingToComment({ postId, commentId });
                      }
                    }}
                  />
                ))}
              </div>
            )}
            <form onSubmit={handleCommentSubmit}>
              <div className="flex items-center space-x-2">
                <input
                  ref={commentInputRef}
                  type="text"
                  value={commentText}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setCommentText(newValue);
                    // If user clears the input, cancel reply state
                    if (!newValue.trim()) {
                      setReplyingToComment(null);
                    }
                  }}
                  placeholder="Add a comment..."
                  className="flex-1 bg-gaming-darker border border-gaming-border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple"
                  maxLength={300}
                />
                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="px-4 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 disabled:opacity-50 transition-colors"
                >
                  {isSubmittingComment ? (replyingToComment ? 'Replying...' : 'Commenting...') : (replyingToComment ? 'Reply' : 'Comment')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </motion.div>
);
};

export default PostCard;
