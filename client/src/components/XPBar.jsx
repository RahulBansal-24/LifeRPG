import React from 'react';
import { motion } from 'framer-motion';
import { calculateXPProgress, formatXP, getLevelTitle } from '../utils/helpers';
import { Sparkles, TrendingUp } from 'lucide-react';

const XPBar = ({ currentXP, level, showDetails = true, animated = true }) => {
  const xpProgress = calculateXPProgress(currentXP, level);
  const levelTitle = getLevelTitle(level);

  return (
    <div className="w-full space-y-2">
      {/* Level and Title */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="level-badge font-orbitron">
              LVL {level}
            </span>
            <span className="text-sm text-gray-400 font-medium">
              {levelTitle}
            </span>
          </div>
        </div>
        
        {showDetails && (
          <div className="flex items-center space-x-2 text-sm">
            <Sparkles size={16} className="text-xp-gold" />
            <span className="text-xp-gold font-semibold">
              {formatXP(currentXP)} XP
            </span>
          </div>
        )}
      </div>

      {/* XP Progress Bar */}
      <div className="relative">
        <div className="xp-bar">
          <motion.div
            className="xp-fill relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress.percentage}%` }}
            transition={{ 
              duration: animated ? 1.5 : 0, 
              ease: 'easeOut',
              delay: animated ? 0.2 : 0 
            }}
          >
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: 'linear',
                repeatDelay: 1
              }}
            />
          </motion.div>
        </div>

        {/* Progress text */}
        {showDetails && (
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-400">
              {formatXP(xpProgress.current)} / {formatXP(xpProgress.total)} XP
            </span>
            <span className="text-xs text-gray-400">
              {formatXP(xpProgress.needed - xpProgress.current)} to next level
            </span>
          </div>
        )}
      </div>

      {/* Level up indicator */}
      {xpProgress.percentage >= 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center space-x-2 text-neon-green font-semibold text-sm"
        >
          <TrendingUp size={16} />
          <span>Ready to Level Up! 🎉</span>
        </motion.div>
      )}
    </div>
  );
};

export default XPBar;
