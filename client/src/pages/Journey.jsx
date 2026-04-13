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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            🗺️ Journey Map
          </h1>
          <p className="text-purple-200 text-lg">
            Track your adventure across {userLevel} levels
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-purple-500/20"
        >
          <JourneyMap currentLevel={userLevel} userAvatar={user?.avatar || '🎮'} />
        </motion.div>
      </div>
    </div>
  );
};

export default Journey;
