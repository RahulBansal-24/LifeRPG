import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { toggleMute, getMuteState, playSound } from '../utils/sounds';

const MuteButton = () => {
  const [isMuted, setIsMuted] = useState(getMuteState());

  const handleToggle = () => {
    const currentState = getMuteState();
    const newState = toggleMute();
    setIsMuted(newState);
    
    // Play click sound only when toggling OFF (unmuting)
    if (currentState && !newState) {
      playSound('click');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      className="relative p-2 rounded-lg transition-all duration-300"
      style={{
        backgroundColor: isMuted ? 'rgba(239, 68, 68, 0.1)' : 'rgba(168, 85, 247, 0.1)',
        border: isMuted ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(168, 85, 247, 0.3)',
      }}
      title={isMuted ? 'Unmute Sounds' : 'Mute Sounds'}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isMuted ? 0 : 0,
          scale: isMuted ? 1 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {isMuted ? (
          <VolumeX size={20} className="text-red-400" />
        ) : (
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <Volume2 size={20} className="text-neon-purple" />
          </motion.div>
        )}
      </motion.div>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg blur-sm opacity-0"
        animate={{
          opacity: isMuted ? 0.3 : 0.5,
        }}
        transition={{ duration: 0.3 }}
        style={{
          backgroundColor: isMuted ? 'rgba(239, 68, 68, 0.3)' : 'rgba(168, 85, 247, 0.3)',
        }}
      />
    </motion.button>
  );
};

export default MuteButton;
