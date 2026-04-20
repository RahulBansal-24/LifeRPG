import React, { useState } from 'react';
import { User, MessageCircle, Trash2, Reply } from 'lucide-react';
import toast from 'react-hot-toast';
import { postAPI } from '../services/api';

const CommentItem = ({ 
  comment, 
  currentUser, 
  level = 0, 
  onReplyAdded, 
  onDelete,
  onReplyClick 
}) => {
  const [showReplies, setShowReplies] = useState(false);


  const handleDeleteComment = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      let response;
      // Check if this is a reply (level > 0) or a main comment (level = 0)
      if (level > 0) {
        // This is a reply, use the reply deletion endpoint
        response = await postAPI.deleteReply(comment.postId, comment.parentCommentId, comment._id);
      } else {
        // This is a main comment, use the comment deletion endpoint
        response = await postAPI.deleteComment(comment.postId, comment._id);
      }
      
      if (response.data.success) {
        onDelete && onDelete(comment.postId, comment._id);
        toast.success(level > 0 ? 'Reply deleted successfully!' : 'Comment deleted successfully!');
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className={`space-y-3 ${level > 0 ? 'ml-6' : ''}`} style={{ marginLeft: `${level * 16}px` }}>
      {/* Comment Header */}
      <div className="flex items-start space-x-3">
        {/* User Avatar */}
        {comment.userId.avatar && !comment.userId.avatar.startsWith('http') && !comment.userId.avatar.startsWith('/uploads/') ? (
          <span className="text-sm">{comment.userId.avatar}</span>
        ) : (
          <User className="w-3 h-3 text-white" />
        )}
        
        <div className="flex-1">
          {/* Username and Time */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-white text-sm">{comment.userId.username}</span>
            <span className="text-gray-400 text-xs">{formatTimeAgo(comment.createdAt)}</span>
          </div>
          
          {/* Comment Text */}
          <p className="text-gray-300 text-sm">{comment.text}</p>
        </div>
        
        {/* Reply and Delete Buttons */}
        {currentUser && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                const mentionText = `@${comment.userId.username} `;
                onReplyClick && onReplyClick(comment.postId, comment._id, mentionText);
              }}
              className="p-1 text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10 rounded transition-all duration-200 group"
              title="Reply to comment"
            >
              <Reply className="w-3 h-3 group-hover:scale-110 transition-transform" />
            </button>
            {/* Only show delete button for comment author */}
            {(comment.userId === currentUser._id || 
              comment.userId === currentUser.id ||
              (comment.userId._id && comment.userId._id === currentUser._id) ||
              (comment.userId._id && comment.userId._id === currentUser.id)) && (
              <button
                onClick={handleDeleteComment}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-all duration-200 group"
                title="Delete comment"
              >
                <Trash2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Show Replies Button */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-neon-purple hover:text-neon-purple/80 text-sm font-medium transition-colors"
          >
            {showReplies ? 'Hide replies' : `View replies (${comment.replies.length})`}
          </button>
        </div>
      )}

      {/* Replies Section */}
      {showReplies && comment.replies.length > 0 && (
        <div className={`mt-3 space-y-2 ${level > 0 ? 'border-l-2 border-gaming-border pl-4' : ''}`}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={{...reply, parentCommentId: comment._id, postId: comment.postId}}
              currentUser={currentUser}
              level={level + 1}
              onReplyAdded={onReplyAdded}
              onDelete={onDelete}
              onReplyClick={onReplyClick}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default CommentItem;
