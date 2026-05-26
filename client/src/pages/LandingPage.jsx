import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sword, 
  Trophy, 
  Target, 
  BookOpen, 
  ShoppingBag, 
  TrendingUp,
  Building2,
  Sparkles
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gaming-dark text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gaming-dark via-gaming-darker to-gaming-dark opacity-90" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-neon-purple opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-pink opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="text-8xl mb-6"
          >
            🎮
          </motion.div>
          <h1 className="text-6xl md:text-7xl font-orbitron font-bold bg-gradient-to-r from-neon-purple via-neon-pink to-neon-purple bg-clip-text text-transparent mb-4">
            LifeRPG
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 mb-6 font-light">
            Gamify Your Life, Level Up Your Reality
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            LifeRPG transforms productivity and personal growth into an epic adventure. 
            Complete quests, earn XP and coins, build skills, share chronicles, 
            compete on leaderboards, and purchase exclusive rewards.
          </p>
        </motion.div>

        {/* Main Choice Section */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Personal Portal Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -10 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple to-neon-pink opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all duration-500" />
            <div className="relative bg-gaming-card border-2 border-gaming-border group-hover:border-neon-purple rounded-2xl p-8 h-full transition-all duration-300">
              <div className="text-center mb-6">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                  className="text-6xl mb-4 inline-block"
                >
                  ⚔️
                </motion.div>
                <h2 className="text-3xl font-orbitron font-bold text-white mb-2">
                  Personal Realm
                </h2>
                <p className="text-gray-400">Embark on your adventure</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Target className="text-neon-purple" size={20} />
                  <span>Complete quests</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Trophy className="text-neon-purple" size={20} />
                  <span>Earn XP & coins</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Sword className="text-neon-purple" size={20} />
                  <span>Build skills</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <BookOpen className="text-neon-purple" size={20} />
                  <span>Post chronicles</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Trophy className="text-neon-purple" size={20} />
                  <span>Compete on leaderboard</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <ShoppingBag className="text-neon-purple" size={20} />
                  <span>Purchase rewards</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full py-4 bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-pink hover:to-neon-purple border border-neon-purple rounded-xl font-bold text-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-neon-purple/50"
              >
                <span className="flex items-center justify-center space-x-2">
                  <Sparkles size={20} />
                  <span>Enter Realm</span>
                </span>
              </button>
            </div>
          </motion.div>

          {/* Enterprise Portal Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -10 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-pink to-neon-purple opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all duration-500" />
            <div className="relative bg-gaming-card border-2 border-gaming-border group-hover:border-neon-pink rounded-2xl p-8 h-full transition-all duration-300">
              <div className="text-center mb-6">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                  className="text-6xl mb-4 inline-block"
                >
                  ⚒️
                </motion.div>
                <h2 className="text-3xl font-orbitron font-bold text-white mb-2">
                  Merchant Portal
                </h2>
                <p className="text-gray-400">Engage and reward users</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-gray-300">
                  <ShoppingBag className="text-neon-pink" size={20} />
                  <span>Create reward coupons</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <TrendingUp className="text-neon-pink" size={20} />
                  <span>Track purchases</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Building2 className="text-neon-pink" size={20} />
                  <span>View analytics</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Target className="text-neon-pink" size={20} />
                  <span>Engage users</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Sparkles className="text-neon-pink" size={20} />
                  <span>Build brand presence</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Trophy className="text-neon-pink" size={20} />
                  <span>Drive user growth</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/enterprise/login')}
                className="w-full py-4 bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-purple hover:to-neon-pink border border-neon-pink rounded-xl font-bold text-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-neon-pink/50"
              >
                <span className="flex items-center justify-center space-x-2">
                  <Building2 size={20} />
                  <span>Open Merchant Portal</span>
                </span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-20 text-gray-500"
        >
          <p className="text-sm">
            Choose your path and begin your journey
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
