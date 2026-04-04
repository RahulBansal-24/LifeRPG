import React from 'react';
import { motion } from 'framer-motion';
import { getStatIcon, getStatColor, calculateStatBonus } from '../utils/helpers';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ stat, value, maxValue = 100, showBonus = true, level = 1 }) => {
  const statIcon = getStatIcon(stat);
  const statColor = getStatColor(stat);
  const percentage = (value / maxValue) * 100;
  const bonusValue = showBonus ? calculateStatBonus(value, level) : value;
  const hasBonus = bonusValue > value;
  
  const getStatLabel = (stat) => {
    return stat.charAt(0).toUpperCase() + stat.slice(1);
  };

  const getBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-gradient-to-r from-neon-green to-green-400';
    if (percentage >= 60) return 'bg-gradient-to-r from-xp-gold to-yellow-400';
    if (percentage >= 40) return 'bg-gradient-to-r from-neon-blue to-blue-400';
    return 'bg-gradient-to-r from-gray-600 to-gray-500';
  };

  return (
    <motion.div
      className="stat-card group hover:scale-105 transition-transform duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
            {statIcon}
          </span>
          <div>
            <h3 className={`font-semibold ${statColor}`}>
              {getStatLabel(stat)}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">
                {value}
              </span>
              {hasBonus && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-1 text-xs text-neon-green"
                >
                  <TrendingUp size={12} />
                  <span>+{bonusValue - value}</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-xs text-gray-400">
            {percentage.toFixed(3)}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="w-full bg-gaming-darker rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${getBarColor(percentage)} relative overflow-hidden`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {/* Animated glow effect - constrained to progress bar */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: 'linear',
                repeatDelay: 3
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Bonus indicator */}
      {hasBonus && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-xs text-neon-green flex items-center space-x-1"
        >
          <span>Effective: {bonusValue}</span>
          <span className="text-gray-400">(with level bonus)</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StatCard;
