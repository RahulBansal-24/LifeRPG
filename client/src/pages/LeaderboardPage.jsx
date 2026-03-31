import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { leaderboardAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Award, 
  User, 
  TrendingUp,
  Star,
  Zap,
  Target,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getLevelTitle, formatXP } from '../utils/helpers';

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMyRank, setShowMyRank] = useState(false);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchLeaderboard();
    if (user) {
      fetchMyRank();
    }
  }, [user, limit]);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const response = await leaderboardAPI.getLeaderboard({ limit });
      setLeaderboard(response.data.data.users || []);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyRank = async () => {
    try {
      const response = await leaderboardAPI.getMyRank();
      setMyRank(response.data.data);
    } catch (error) {
      console.error('Failed to fetch my rank:', error);
    }
  };

  const loadMore = () => {
    setLimit(prev => Math.min(prev + 10, 50));
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="text-yellow-400" size={24} />;
    if (rank === 2) return <Medal className="text-gray-300" size={24} />;
    if (rank === 3) return <Award className="text-orange-600" size={24} />;
    return <span className="text-gray-400 font-bold">#{rank}</span>;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'border-yellow-400 bg-yellow-400 bg-opacity-10';
    if (rank === 2) return 'border-gray-300 bg-gray-300 bg-opacity-10';
    if (rank === 3) return 'border-orange-600 bg-orange-600 bg-opacity-10';
    return 'border-gaming-border';
  };

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'bg-yellow-400 text-black';
    if (rank === 2) return 'bg-gray-300 text-black';
    if (rank === 3) return 'bg-orange-600 text-white';
    return 'bg-gaming-card text-white';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading leaderboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-dark p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-orbitron text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent mb-2">
            Leaderboard
          </h1>
          <p className="text-gray-400 text-lg">
            Top heroes of LifeRPG - Compete, climb, and conquer!
          </p>
        </motion.div>

        {/* My Rank Card */}
        {myRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="gaming-card border-2 border-neon-purple relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-neon-purple text-white text-xs px-3 py-1 rounded-bl-lg">
              Your Rank
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getRankColor(myRank.userRank)}`}>
                  {getRankIcon(myRank.userRank)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{myRank.user.username}</h3>
                  <p className="text-gray-400">{getLevelTitle(myRank.user.level)}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-neon-purple">#{myRank.userRank}</div>
                <div className="text-sm text-gray-400">Rank</div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Trophy className="text-xp-gold" size={20} />
                  <span className="text-2xl font-bold text-xp-gold">{formatXP(myRank.user.xp)}</span>
                </div>
                <div className="text-sm text-gray-400">Total XP</div>
              </div>
              
              <div className="text-center">
                <div className="level-badge">{myRank.user.level}</div>
                <div className="text-sm text-gray-400 mt-1">Level</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="gaming-card border-2 border-gray-300 text-center relative"
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gray-300 text-black px-4 py-2 rounded-full font-bold">
                  2nd
                </div>
              </div>
              <div className="mt-4">
                <div className="text-6xl mb-4">{leaderboard[1]?.avatar || '🎮'}</div>
                <h3 className="text-xl font-bold text-white">{leaderboard[1]?.username}</h3>
                <p className="text-gray-400">{getLevelTitle(leaderboard[1]?.level)}</p>
                <div className="mt-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Trophy className="text-gray-300" size={20} />
                    <span className="text-xl font-bold text-gray-300">{formatXP(leaderboard[1]?.xp)}</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">XP</div>
                </div>
              </div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="gaming-card border-2 border-yellow-400 text-center relative transform md:scale-105"
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold flex items-center space-x-2">
                  <Crown size={16} />
                  <span>1st</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-6xl mb-4 animate-float">{leaderboard[0]?.avatar || '🎮'}</div>
                <h3 className="text-xl font-bold text-white">{leaderboard[0]?.username}</h3>
                <p className="text-gray-400">{getLevelTitle(leaderboard[0]?.level)}</p>
                <div className="mt-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Trophy className="text-yellow-400" size={20} />
                    <span className="text-xl font-bold text-yellow-400">{formatXP(leaderboard[0]?.xp)}</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">XP</div>
                </div>
              </div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="gaming-card border-2 border-orange-600 text-center relative"
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-orange-600 text-white px-4 py-2 rounded-full font-bold">
                  3rd
                </div>
              </div>
              <div className="mt-4">
                <div className="text-6xl mb-4">{leaderboard[2]?.avatar || '🎮'}</div>
                <h3 className="text-xl font-bold text-white">{leaderboard[2]?.username}</h3>
                <p className="text-gray-400">{getLevelTitle(leaderboard[2]?.level)}</p>
                <div className="mt-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Trophy className="text-orange-600" size={20} />
                    <span className="text-xl font-bold text-orange-600">{formatXP(leaderboard[2]?.xp)}</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">XP</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="gaming-card"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Trophy size={24} className="text-xp-gold" />
              <span>Global Rankings</span>
            </h3>
            <div className="text-sm text-gray-400">
              Showing {Math.min(limit, leaderboard.length)} of {leaderboard.length} heroes
            </div>
          </div>

          <div className="space-y-3">
            {leaderboard.map((player, index) => {
              const isCurrentUser = user && player._id === user.id;
              
              return (
                <motion.div
                  key={player._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 hover:shadow-card-glow ${
                    isCurrentUser 
                      ? 'border-neon-purple bg-neon-purple bg-opacity-10' 
                      : getRankColor(player.rank)
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${getRankColor(player.rank)}`}>
                      {getRankIcon(player.rank)}
                    </div>

                    {/* Avatar and Name */}
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{player.avatar || '🎮'}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-white">
                            {player.username}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-neon-purple font-bold">(YOU)</span>
                            )}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-400">{getLevelTitle(player.level)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6">
                    {/* Level */}
                    <div className="text-center">
                      <div className="level-badge">{player.level}</div>
                      <div className="text-xs text-gray-400 mt-1">Level</div>
                    </div>

                    {/* XP */}
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Zap className="text-xp-gold" size={16} />
                        <span className="text-lg font-bold text-xp-gold">{formatXP(player.xp)}</span>
                      </div>
                      <div className="text-xs text-gray-400">Total XP</div>
                    </div>

                    {/* Stats Summary */}
                    <div className="hidden md:flex items-center space-x-3 text-sm">
                      <div className="flex items-center space-x-1">
                        <Target size={14} className="text-red-400" />
                        <span className="text-red-400">{player.stats?.strength || 10}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star size={14} className="text-blue-400" />
                        <span className="text-blue-400">{player.stats?.intelligence || 10}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap size={14} className="text-yellow-400" />
                        <span className="text-yellow-400">{player.stats?.discipline || 10}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy size={14} className="text-pink-400" />
                        <span className="text-pink-400">{player.stats?.charisma || 10}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Load More Button */}
          {leaderboard.length >= limit && limit < 50 && (
            <div className="mt-6 text-center">
              <button
                onClick={loadMore}
                className="neon-button-blue flex items-center space-x-2 mx-auto"
              >
                <ChevronDown size={20} />
                <span>Load More Heroes</span>
              </button>
            </div>
          )}
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="stat-card text-center">
            <Trophy className="text-yellow-400 mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-white">{leaderboard.length}</div>
            <div className="text-sm text-gray-400">Total Heroes</div>
          </div>
          
          <div className="stat-card text-center">
            <Zap className="text-xp-gold mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-xp-gold">
              {formatXP(leaderboard.reduce((sum, p) => sum + p.xp, 0))}
            </div>
            <div className="text-sm text-gray-400">Total XP Earned</div>
          </div>
          
          <div className="stat-card text-center">
            <TrendingUp className="text-neon-green mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-neon-green">
              {leaderboard.length > 0 ? Math.round(leaderboard.reduce((sum, p) => sum + p.level, 0) / leaderboard.length) : 0}
            </div>
            <div className="text-sm text-gray-400">Average Level</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
