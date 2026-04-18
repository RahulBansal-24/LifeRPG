import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mageImage from '../assets/mage.png';
import { useAuth } from '../context/AuthContext';
import { useMage } from '../context/MageContext';

// Message categories for the mage guide
const CATEGORIES = {
  questExamples: [
    // Study / Intelligence
    'Try a "Revise notes for 20 minutes" quest to strengthen your understanding',
    'Complete a "Solve 5 DSA problems" quest to boost your intelligence',
    'Start a "Watch an educational video" quest and learn something new',
    'Take on a "Practice coding for 30 minutes" quest to sharpen your skills',
    'Attempt a "Read 10 pages of a book" quest to gain knowledge',
    'Complete a "Revise one subject/topic" quest to strengthen memory',
    'Try a "Solve 3 logical puzzles" quest to sharpen your thinking',
    'Start a "Learn a new concept online" quest today',
    'Take a "Write notes for 20 minutes" quest to reinforce learning',
    'Attempt a "Practice coding problem-solving" quest',
    'Watch and summarize an educational video in a "Learning quest"',

    // Discipline / Productivity
    'Set a "No distractions for 25 minutes" quest and test your discipline',
    'Try a "Complete pending task" quest and clear your backlog',
    'Create a "Follow your routine strictly today" quest to build consistency',
    'Take a "Wake up early and start your day strong" quest',
    'Begin a "Pomodoro focus session (25 min)" quest',
    'Complete a "Finish one important pending task" quest',
    'Take a "No social media for 1 hour" challenge quest',
    'Attempt a "Plan tomorrow in advance" quest',
    'Do a "Clean your workspace" productivity quest',
    'Start a "Stick to schedule for 3 hours" quest',

    // Fitness / Strength
    'Begin a "30-minute workout" quest and build your strength',
    'Try a "10 push-ups × 3 sets" quest to stay active',
    'Go for a "Morning walk or run" quest and energize yourself',
    'Complete a "Stretching session" quest to improve flexibility',
    'Take on a "15-minute cardio session" quest to boost stamina',
    'Complete a "20 squats + 20 push-ups" quest challenge',
    'Start a "Drink 2L water today" wellness quest',
    'Try a "Evening walk for 20 minutes" quest',
    'Do a "Core workout session" quest to build strength',
    'Attempt a "No junk food today" discipline quest',

    // Charisma / Social
    'Start a "Talk to someone new" quest to boost your charisma',
    'Try a "Help a friend or teammate" quest and build connections',
    'Complete a "Practice public speaking for 10 minutes" quest',
    'Take on an "Express gratitude to someone" quest today',
    'Take a "Start a meaningful conversation" quest',
    'Complete a "Help someone without expecting return" quest',
    'Try a "Practice speaking confidently" quest',
    'Attempt a "Give a genuine compliment" quest',
    'Start a "Network or connect with someone new" quest',
    'Take a "Listen actively in a conversation" quest'
  ],
  
  featureTips: [
    'Complete daily quests to earn XP faster',
    'Check your stats to track your progress',
    'Did you know? you can customize your avatar in dashboard',
    'Explore new features in dashboard, traveller!',
    'Discover hidden achievements and rare items, traveller!',
    'Finding quests too difficult? Try easier ones first!',
    'Your journey map reveals your true progress, check it often, traveller!',
    'Each level you gain unlocks new potential, keep advancing!',
    'Balance your skills to become a well-rounded adventurer',
    'Track your XP and plan your next quest wisely',
    'Your avatar represents you, choose one that matches your spirit',
    'Revisit incomplete quests and finish what you started',
    'Use journey map to visualize how far you\'ve come'
  ],
  
  leaderboardReminders: [
    'Climb the leaderboard to show your skills, traveller!',
    'Visit the leaderboard to see how you rank against other players',
    'Top travellers get special recognition',
    'Challenge yourself to reach higher ranks',
    'Compete in daily quests for glory',
    'Tales of your adventure inspire other travellers',
    'The leaderboard remembers only the consistent'
  ],
  
  skillBoostingAdvice: [
    'Complete brain quests to boost your intelligence stat, and become a genius',
    'Physical activities enhance your strength skill, and get you in shape',
    'Creative tasks improve your creativity stat, and inspire new ideas',
    'Social quests boost your charisma skill, and make you a people person',
    'Learning activities enhance your intelligence stat, and grant you insight',
    'Physical training increases your strength skills, and makes you a warrior',
    'Daily practice strengthens your discipline stat, and makes you a skilled traveller!',
    'Intelligence grows with learning, feed your mind daily',
    'Strength is built through action, not intention',
    'Discipline is forged through consistency, not motivation',
    'Charisma grows when you connect with others',
    'Neglect no skill, balance creates true power',
    'Focus on one skill today, master it step by step',
    'Your weakest skill defines your next challenge'
  ],
  
  motivation: [
    'Every great journey starts with a single step, so take first step today, traveller!',
    'Your dedication builds legendary status, so keep pushing yourself, traveller!',
    'Keep going, greatness awaits, and don\'t give up on your dreams',
    'Small steps create massive results, so don\'t underestimate power of small actions',
    'Consistency is key to success, so stay focused and keep moving forward',
    'Your courage inspires other adventurers, so be brave and take the lead, traveller!',
    'The path of a true adventurer is never easy, but the rewards are worth it',
    'Embrace challenges as opportunities to grow, and don\'t be afraid to take risks',
    'Your legend grows with each completed quest, so keep questing and make your mark',
    'Focus on your goals and you will achieve them, so stay focused and motivated',
    'Believe in yourself and your abilities, and you will be unstoppable',
    'The journey of a thousand miles begins with a single step, so take that first step today, traveller!'
  ]
};

// Flatten all messages for backward compatibility
const mageMessages = [
  ...CATEGORIES.questExamples,
  ...CATEGORIES.featureTips,
  ...CATEGORIES.leaderboardReminders,
  ...CATEGORIES.skillBoostingAdvice,
  ...CATEGORIES.motivation
];

const MageGuide = () => {
  // Always call useAuth first - before any other hooks
  const { isAuthenticated } = useAuth();
  const { isMageVisible } = useMage();
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [lastMessageIndex, setLastMessageIndex] = useState(-1);
  const [imageError, setImageError] = useState(false);
  const [isEntering, setIsEntering] = useState(true); // Track entrance animation
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  // Get random message with category chance-based selection
  const getRandomMessage = () => {
    const categoryNames = Object.keys(CATEGORIES);
    const randomCategory = categoryNames[Math.floor(Math.random() * categoryNames.length)];
    const categoryMessages = CATEGORIES[randomCategory];
    const randomMessage = categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
    
    let newIndex;
    do {
      newIndex = mageMessages.indexOf(randomMessage);
    } while (newIndex === lastMessageIndex && mageMessages.length > 1);
    
    setLastMessageIndex(newIndex);
    return randomMessage;
  };

  // Show message function
  const showMessage = () => {
    const message = getRandomMessage();
    setCurrentMessage(message);
    setShowBubble(true);
    
    // Hide message after 5-8 seconds
    const hideDelay = 5000 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      setShowBubble(false);
    }, hideDelay);
  };

  // Setup message timing
  useEffect(() => {
    // Only setup timing if mage is visible and authenticated
    if (!isAuthenticated || !isMageVisible) return;

    // Show first message after 5-10 seconds
    const initialDelay = 5000 + Math.random() * 5000;
    const initialTimeout = setTimeout(() => {
      showMessage();
      
      // Then set up recurring messages
      const scheduleNext = () => {
        const nextDelay = 18000 + Math.random() * 22000; // 18-40 seconds
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
  }, [isAuthenticated, isMageVisible]); // Reset on both auth and visibility changes

  // Reset entrance animation when authentication changes (login) or mage becomes visible
  useEffect(() => {
    if (isAuthenticated && isMageVisible) {
      setIsEntering(true);
      // Reset entrance animation after it completes
      const resetTimer = setTimeout(() => setIsEntering(false), 1000);
      return () => clearTimeout(resetTimer);
    }
  }, [isAuthenticated, isMageVisible]); // Trigger on both auth and visibility changes

  return (
    // Only render if authenticated and mage is visible
    (isAuthenticated && isMageVisible) && (
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
        <AnimatePresence mode="wait">
          <motion.div
            className="relative"
            initial={isEntering ? { opacity: 0, scale: 0.5, y: 50 } : false}
            animate={isEntering ? { opacity: 1, scale: 1, y: 0 } : { y: [0, -4, 0] }}
            exit={{ opacity: 0, scale: 0.8, y: -30 }}
            transition={{ 
              duration: isEntering ? 1.2 : 0.8, 
              ease: "easeOut" 
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
        </AnimatePresence>
      </div>
    )
  );
};
export default MageGuide;
