import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import JourneyMap from '../components/JourneyMap';
import { useAuth } from '../context/AuthContext';

const Journey = () => {
  const { user } = useAuth();
  const [userLevel, setUserLevel] = useState(1);

  useEffect(() => {
    if (user?.level) {
      setUserLevel(user.level);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gaming-dark">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 overflow-visible"
        >
          <h1 className="font-orbitron text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent mb-2 leading-tight pb-2">
            Journey
          </h1>
          <p className="text-gray-400 text-lg">
            Track your adventure across 50 levels
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-block bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-500/20"
        >
          <JourneyMap currentLevel={userLevel} userAvatar={user?.avatar || '🎮'} />
        </motion.div>
      </div>
    </div>
  );
};

export default Journey;
