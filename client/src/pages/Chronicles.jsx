import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import { 
  BookOpen, 
  Plus, 
  Heart,
  MessageCircle,
  Users,
  TrendingUp,
  Filter,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const Chronicles = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);

  // Load posts
  const loadPosts = async (reset = false) => {
    try {
      if (reset) {
        setSkip(0);
        setHasMore(true);
        setIsLoading(true);
      }
      
      const currentSkip = reset ? 0 : skip;
      const response = await postAPI.getAllPosts(20, currentSkip);
      const newPosts = response.data.data;
      
      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setSkip(currentSkip + newPosts.length);
      setHasMore(newPosts.length === 20);
    } catch (error) {
      console.error('Failed to load posts:', error);
      toast.error('Failed to load chronicles');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Load more posts
  const loadMore = () => {
    if (!hasMore || isLoading) return;
    loadPosts(false);
  };

  // Refresh posts
  const refreshPosts = () => {
    setRefreshing(true);
    loadPosts(true);
  };

  // Handle create post
  const handleCreatePost = (quest) => {
    setSelectedQuest(quest);
    setShowCreateModal(true);
  };

  // Handle post created
  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setShowCreateModal(false);
    setSelectedQuest(null);
    toast.success('Post created successfully! Chronicle added! ');
  };

  // Handle post deleted
  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
    toast.success('Post deleted successfully');
  };

  // Handle post liked
  const handlePostLiked = (postId, likeData) => {
    setPosts(prev => prev.map(post => 
      post._id === postId 
        ? { ...post, likes: likeData.liked ? [...post.likes, user._id] : post.likes.filter(id => id !== user._id) }
        : post
    ));
  };

  // Handle comment added
  const handleCommentAdded = (postId, comment) => {
    setPosts(prev => prev.map(post => 
      post._id === postId 
        ? { ...post, comments: [...post.comments, comment] }
        : post
    ));
  };

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      loadPosts(true);
    }
  }, [isAuthenticated]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated && !showCreateModal && !isLoading) {
        refreshPosts();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, showCreateModal, isLoading]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gaming-dark flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-neon-purple mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Chronicles</h1>
          <p className="text-gray-400 mb-4">Share your quest achievements with the community</p>
          <p className="text-gray-500">Please login to view chronicles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-dark relative">
      {/* Header */}
      <div className="bg-gaming-card border-b border-gaming-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-neon-purple" />
              <div>
                <h1 className="text-2xl font-bold text-white">Chronicles</h1>
                <p className="text-gray-400 text-sm">Share your quest achievements with fellow adventurers</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={refreshPosts}
                disabled={refreshing}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                  refreshing 
                    ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-gaming-darker border-gaming-border text-white hover:border-neon-purple transition-colors'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Chronicle</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gaming-card border border-gaming-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-neon-blue" />
              <div>
                <p className="text-gray-400 text-sm">Total Chronicles</p>
                <p className="text-xl font-bold text-white">{posts.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gaming-card border border-gaming-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Heart className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-gray-400 text-sm">Total Likes</p>
                <p className="text-xl font-bold text-white">
                  {posts.reduce((total, post) => total + post.likes.length, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gaming-card border border-gaming-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-neon-green" />
              <div>
                <p className="text-gray-400 text-sm">Total Comments</p>
                <p className="text-xl font-bold text-white">
                  {posts.reduce((total, post) => total + post.comments.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        {isLoading && posts.length === 0 ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading chronicles..." />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Chronicles Yet</h3>
            <p className="text-gray-400 mb-6">Be the first to share your quest achievements!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create First Chronicle</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={user}
                onLike={handlePostLiked}
                onComment={handleCommentAdded}
                onDelete={handlePostDeleted}
                onPostQuest={handleCreatePost}
              />
            ))}
            
            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center py-8">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-6 py-3 bg-gaming-card border border-gaming-border text-white rounded-lg hover:border-neon-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{isLoading ? 'Loading...' : 'Load More Chronicles'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => {
            setShowCreateModal(false);
            setSelectedQuest(null);
          }}
          onPostCreated={handlePostCreated}
          selectedQuest={selectedQuest}
        />
      )}
    </div>
  );
};

export default Chronicles;
