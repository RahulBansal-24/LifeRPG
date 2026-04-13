import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mageImage from '../assets/mage.png';

// Message categories for the mage guide
const mageMessages = [
  // Feature tips
  'Complete daily quests to earn XP faster!',
  'Check your stats to track your progress!',
  'Customize your avatar in your profile!',
  'Explore new features in the dashboard!',
  
  // Leaderboard reminders
  'Climb the leaderboard to show your skills!',
  'See how you rank against other players!',
  'Top players get special recognition!',
  'Challenge yourself to reach higher ranks!',
  
  // Quest advice (specific examples)
  'Try completing a "Study for 30 minutes" quest!',
  'Learn a new language with daily practice quests!',
  'Go for a run and track your fitness journey!',
  'Reading quests boost your knowledge skills!',
  'Meditation quests enhance your focus skills!',
  'Creative projects boost your problem-solving skills!',
  
  // Skill boosting advice
  'Complete quests to boost your intelligence stat!',
  'Physical activities enhance your strength skill!',
  'Creative tasks improve your creativity stat!',
  'Social quests boost your charisma skill!',
  'Learning activities enhance your wisdom stat!',
  
  // Motivation
  'Every great journey starts with a single step!',
  'Your dedication builds legendary status!',
  'Keep going, greatness awaits!',
  'Small steps create massive results!',
  'Consistency is the key to success!'
];

const MageGuide = () => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [lastMessageIndex, setLastMessageIndex] = useState(-1);
  const [imageError, setImageError] = useState(false);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  // Get random message (avoiding repeats)
  const getRandomMessage = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * mageMessages.length);
    } while (newIndex === lastMessageIndex && mageMessages.length > 1);
    
    setLastMessageIndex(newIndex);
    return mageMessages[newIndex];
  };

  // Show message with animation
  const showMessage = () => {
    const message = getRandomMessage();
    setCurrentMessage(message);
    setShowBubble(true);
    
    // Hide message after 5-8 seconds
    const hideDelay = 5000 + Math.random() * 3000; // 5-8 seconds
    timeoutRef.current = setTimeout(() => {
      setShowBubble(false);
    }, hideDelay);
  };

  // Set up random message intervals
  useEffect(() => {
    // Show first message after 5-10 seconds
    const initialDelay = 5000 + Math.random() * 5000;
    const initialTimeout = setTimeout(() => {
      showMessage();
      
      // Then set up recurring messages
      const scheduleNext = () => {
        const nextDelay = 20000 + Math.random() * 40000; // 20-60 seconds
        intervalRef.current = setTimeout(() => {
          showMessage();
          scheduleNext();
        }, nextDelay);
      };
      scheduleNext();
    }, initialDelay);

    return () => {
      clearTimeout(initialTimeout);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, []);

  return (
    <div className="fixed bottom-0 right-4 z-50 pointer-events-none">
      {/* Chat Bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-56 right-0 mb-2 max-w-xs"
          >
            <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-purple-500/30 backdrop-blur-sm">
              <div className="text-sm font-medium leading-relaxed">
                {currentMessage}
              </div>
              {/* Chat bubble tail */}
              <div className="absolute bottom-0 right-14 transform translate-y-2">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-purple-900/95"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mage Character */}
      <motion.div
        className="relative"
        animate={{
          y: [0, -4, 0], // Smaller floating motion
        }}
        transition={{
          duration: 4, // 4 second loop
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/30 via-orange-500/30 to-blue-500/30 blur-xl animate-pulse" />
        
        {/* Secondary Glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/20 to-orange-600/20 blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Mage Image - Direct display on webpage */}
          <img
            src={mageImage}
            alt="Mage Guide"
            className="w-56 h-56 object-contain"
            style={{
              filter: 'drop-shadow(0 0 40px rgba(147, 51, 234, 0.4))'
            }}
            onError={(e) => {
              // Fallback to emoji if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          {/* Fallback emoji if image fails to load */}
          <div 
            className="text-9xl animate-pulse filter drop-shadow-lg hidden" 
            style={{ display: 'none' }}
          >
            {'\ud83e\uddd9\u200d\u2642\ufe0f'}
          </div>
        
        {/* Floating particles around mage */}
        <div className="absolute -inset-4 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/60 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MageGuide;
