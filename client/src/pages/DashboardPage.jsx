import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { questAPI } from '../services/api';
import XPBar from '../components/XPBar';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Zap, 
  Award,
  Activity,
  Gamepad2,
  Star
} from 'lucide-react';
import { formatRelativeTime, getLevelTitle } from '../utils/helpers';

const DashboardPage = () => {
  const { user, updateUser } = useAuth();
  const [recentQuests, setRecentQuests] = useState([]);
  const [stats, setStats] = useState({
    totalQuests: 0,
    completedQuests: 0,
    dailyQuestsCompleted: 0,
    totalXP: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch recent quests
      const questsResponse = await questAPI.getQuests({ limit: 5 });
      const quests = questsResponse.data.data || [];
      
      // Calculate stats
      const completedQuests = quests.filter(q => q.status === 'completed');
      const dailyCompleted = quests.filter(q => q.type === 'daily' && q.status === 'completed');
      const totalXP = completedQuests.reduce((sum, quest) => sum + quest.xpReward, 0);

      setRecentQuests(quests.slice(0, 5));
      setStats({
        totalQuests: quests.length,
        completedQuests: completedQuests.length,
        dailyQuestsCompleted: dailyCompleted.length,
        totalXP: totalXP,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLevelUp = () => {
    setShowLevelUpAnimation(true);
    setTimeout(() => setShowLevelUpAnimation(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-dark p-4 md:p-8">
      {/* Level Up Animation */}
      {showLevelUpAnimation && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 pointer-events-none"
        >
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="text-center"
          >
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="font-orbitron text-4xl font-bold text-neon-green mb-2">
              LEVEL UP!
            </h2>
            <p className="text-2xl text-white">
              You are now Level {user?.level}
            </p>
          </motion.div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-orbitron text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Welcome back, {user?.username}! Ready for today's adventures?
          </p>
        </motion.div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="gaming-card border-2 border-neon-purple"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-center space-x-4">
              <div className="text-6xl animate-float">
                {user?.avatar || '🎮'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
                <p className="text-neon-green font-semibold">
                  {getLevelTitle(user?.level)}
                </p>
                <p className="text-gray-400 text-sm">
                  Member since {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* XP Progress */}
            <div className="flex-1 w-full">
              <XPBar 
                currentXP={user?.xp || 0} 
                level={user?.level || 1}
                showDetails={true}
                animated={true}
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="stat-card group"
          >
            <div className="flex items-center justify-between mb-3">
              <Target className="text-neon-blue" size={24} />
              <span className="text-2xl font-bold text-white">{stats.totalQuests}</span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Total Quests</h3>
            <div className="mt-2 text-xs text-neon-blue">
              Active: {stats.totalQuests - stats.completedQuests}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="stat-card group"
          >
            <div className="flex items-center justify-between mb-3">
              <Award className="text-neon-green" size={24} />
              <span className="text-2xl font-bold text-white">{stats.completedQuests}</span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Completed</h3>
            <div className="mt-2 text-xs text-neon-green">
              {stats.totalQuests > 0 ? Math.round((stats.completedQuests / stats.totalQuests) * 100) : 0}% completion rate
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="stat-card group"
          >
            <div className="flex items-center justify-between mb-3">
              <Calendar className="text-neon-cyan" size={24} />
              <span className="text-2xl font-bold text-white">{stats.dailyQuestsCompleted}</span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Daily Quests</h3>
            <div className="mt-2 text-xs text-neon-cyan">
              Completed today
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="stat-card group"
          >
            <div className="flex items-center justify-between mb-3">
              <Zap className="text-xp-gold" size={24} />
              <span className="text-2xl font-bold text-white">{stats.totalXP}</span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Total XP Earned</h3>
            <div className="mt-2 text-xs text-xp-gold">
              From completed quests
            </div>
          </motion.div>
        </div>

        {/* Character Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Activity size={24} className="text-neon-purple" />
            <span>Character Stats</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(user?.stats || {}).map(([stat, value]) => (
              <StatCard
                key={stat}
                stat={stat}
                value={value}
                level={user?.level || 1}
              />
            ))}
          </div>
        </motion.div>

        {/* Recent Quests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Gamepad2 size={24} className="text-neon-pink" />
              <span>Recent Quests</span>
            </h3>
            <button
              onClick={() => window.location.href = '/quests'}
              className="text-neon-pink hover:text-neon-purple transition-colors duration-200 text-sm font-semibold"
            >
              View All →
            </button>
          </div>
          
          <div className="space-y-3">
            {recentQuests.length > 0 ? (
              recentQuests.map((quest, index) => (
                <motion.div
                  key={quest._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="quest-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-white">{quest.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          quest.status === 'completed' 
                            ? 'bg-neon-green bg-opacity-20 text-neon-green border border-neon-green'
                            : 'bg-gaming-border text-gray-400 border border-gaming-border'
                        }`}>
                          {quest.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          quest.type === 'daily' 
                            ? 'bg-neon-cyan bg-opacity-20 text-neon-cyan'
                            : 'bg-neon-purple bg-opacity-20 text-neon-purple'
                        }`}>
                          {quest.type === 'daily' ? 'Daily' : 'Main'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{quest.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-xp-gold">
                          <Star size={16} />
                          <span className="font-bold">{quest.xpReward}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatRelativeTime(quest.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="gaming-card text-center py-8">
                <Gamepad2 size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No quests yet. Start your adventure!</p>
                <button
                  onClick={() => window.location.href = '/quests'}
                  className="mt-4 neon-button-blue"
                >
                  Create Your First Quest
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
