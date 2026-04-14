import React from 'react';
import { motion } from 'framer-motion';
import { useMage } from '../context/MageContext';

const MageToggle = () => {
  const { isMageVisible, toggleMage } = useMage();

  return (
    <button
      onClick={toggleMage}
      className="relative inline-flex items-center justify-center p-2 rounded-lg bg-gradient-to-r from-purple-900/50 to-indigo-900/50 hover:from-purple-900/70 hover:to-indigo-900/70 border border-purple-500/30 transition-all duration-300 group"
      title="Mage Guide Toggle"
    >
      {/* Toggle Switch */}
      <div className="relative w-12 h-6 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 transition-all duration-300 mr-2">
        <motion.div
          className="absolute top-1 left-1 w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 shadow-lg"
          animate={{
            x: isMageVisible ? 24 : 0,
            backgroundColor: isMageVisible ? ['#a855f7', '#6366f1'] : ['#6b7280', '#4b5563']
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
      </div>
      
      {/* Mage Icon */}
      <motion.div
        className="text-xl"
        animate={{
          scale: isMageVisible ? [1, 1.1, 1] : [1, 0.9, 1],
          opacity: isMageVisible ? 1 : 0.6
        }}
        transition={{
          duration: 0.3,
          repeat: isMageVisible ? Infinity : 0,
          repeatDelay: 2
        }}
      >
        <div className="filter drop-shadow-lg">
          {isMageVisible ? 'ð§' : 'ð§'}
        </div>
      </motion.div>
      
      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-md"
        animate={{
          opacity: isMageVisible ? [0.5, 0.8, 0.5] : [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Enhanced Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900/95 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-purple-500/30">
        <div className="font-semibold">Mage Guide Toggle</div>
        <div className="text-xs text-gray-300">
          {isMageVisible ? "Click to hide mage" : "Click to show mage"}
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900/95 rotate-45 border border-purple-500/30 border-t-0 border-l-0"></div>
      </div>
    </button>
  );
};

export default MageToggle;
