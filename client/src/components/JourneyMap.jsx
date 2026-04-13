import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import rpgMap from '../assets/rpg-map.svg';

// Level titles from existing system
const levelTitles = [
  { level: 1, title: "Novice" },
  { level: 2, title: "Apprentice" },
  { level: 3, title: "Adept" },
  { level: 4, title: "Skilled" },
  { level: 5, title: "Hero" },
  { level: 6, title: "Champion" },
  { level: 7, title: "Warrior" },
  { level: 8, title: "Knight" },
  { level: 9, title: "Guardian" },
  { level: 10, title: "Immortal" },
  { level: 11, title: "Legend" },
  { level: 12, title: "Mythic" },
  { level: 13, title: "Titan" },
  { level: 14, title: "Colossus" },
  { level: 15, title: "Ethereal" },
  { level: 16, title: "Transcendent" },
  { level: 17, title: "Celestial" },
  { level: 18, title: "Divine" },
  { level: 19, title: "Supreme" },
  { level: 20, title: "Revered" },
  { level: 21, title: "Venerated" },
  { level: 22, title: "Exalted" },
  { level: 23, title: "Sublime" },
  { level: 24, title: "Limitless" },
  { level: 25, title: "Infinite" },
  { level: 26, title: "Ascendant" },
  { level: 27, title: "Zenith" },
  { level: 28, title: "Apex" },
  { level: 29, title: "Pinnacle" },
  { level: 30, title: "Summit" },
  { level: 31, title: "Cosmic" },
  { level: 32, title: "Stellar" },
  { level: 33, title: "Galactic" },
  { level: 34, title: "Universal" },
  { level: 35, title: "Omnipotent" },
  { level: 36, title: "Worshipped" },
  { level: 37, title: "Sacred" },
  { level: 38, title: "Hallowed" },
  { level: 39, title: "Consecrated" },
  { level: 40, title: "Anointed" },
  { level: 41, title: "Blessed" },
  { level: 42, title: "Sanctified" },
  { level: 43, title: "Hallowed" },
  { level: 44, title: "Venerated" },
  { level: 45, title: "Revered" },
  { level: 46, title: "Anointed" },
  { level: 47, title: "Chosen" },
  { level: 48, title: "Elected" },
  { level: 49, title: "Destined" },
  { level: 50, title: "Godlike" }
];

// Properly distributed level coordinates across the map
const generateDistributedCoordinates = () => {
  const coordinates = [];
  
  // Define regions for different areas of the map
  const regions = [
    // Starting area (bottom left)
    { x: 80, y: 550 },   // Level 1
    { x: 120, y: 520 },  // Level 2
    { x: 100, y: 480 },  // Level 3
    { x: 140, y: 460 },  // Level 4
    { x: 80, y: 430 },   // Level 5
    
    // Forest area (left middle)
    { x: 120, y: 200 },  // Level 6
    { x: 100, y: 180 },  // Level 7
    { x: 140, y: 220 },  // Level 8
    { x: 80, y: 230 },   // Level 9
    { x: 160, y: 190 },  // Level 10
    
    // River crossing (middle left)
    { x: 200, y: 100 },  // Level 11
    { x: 250, y: 150 },  // Level 12
    { x: 300, y: 200 },  // Level 13
    { x: 350, y: 250 },  // Level 14
    { x: 400, y: 300 },  // Level 15
    
    // Village area (center)
    { x: 450, y: 300 },  // Level 16
    { x: 480, y: 280 },  // Level 17
    { x: 420, y: 320 },  // Level 18
    { x: 500, y: 320 },  // Level 19
    { x: 460, y: 260 },  // Level 20
    
    // Lake area (center right)
    { x: 400, y: 400 },  // Level 21
    { x: 450, y: 420 },  // Level 22
    { x: 350, y: 430 },  // Level 23
    { x: 500, y: 450 },  // Level 24
    { x: 380, y: 460 },  // Level 25
    
    // Mountain path (right middle)
    { x: 650, y: 50 },   // Level 26
    { x: 700, y: 80 },   // Level 27
    { x: 750, y: 100 },  // Level 28
    { x: 680, y: 120 },  // Level 29
    { x: 720, y: 140 },  // Level 30
    
    // Castle area (top right)
    { x: 790, y: 90 },   // Level 31
    { x: 770, y: 120 },  // Level 32
    { x: 810, y: 110 },  // Level 33
    { x: 750, y: 150 },  // Level 34
    { x: 780, y: 180 },  // Level 35
    
    // Beach area (bottom right)
    { x: 700, y: 550 },  // Level 36
    { x: 650, y: 530 },  // Level 37
    { x: 750, y: 570 },  // Level 38
    { x: 680, y: 580 },  // Level 39
    { x: 720, y: 520 },  // Level 40
    
    // Merchant area (bottom left)
    { x: 170, y: 480 },  // Level 41
    { x: 150, y: 500 },  // Level 42
    { x: 190, y: 510 },  // Level 43
    { x: 130, y: 520 },  // Level 44
    { x: 210, y: 490 },  // Level 45
    
    // Final journey area (center bottom)
    { x: 300, y: 500 },  // Level 46
    { x: 350, y: 520 },  // Level 47
    { x: 400, y: 540 },  // Level 48
    { x: 450, y: 560 },  // Level 49
    { x: 500, y: 580 },  // Level 50 - Final destination
  ];
  
  // Create coordinates array
  for (let i = 0; i < 50; i++) {
    coordinates.push({
      level: i + 1,
      x: regions[i].x,
      y: regions[i].y,
      title: levelTitles[i].title
    });
  }
  
  return coordinates;
};

const JourneyMap = ({ currentLevel, userAvatar }) => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const mapCoordinates = useMemo(() => generateDistributedCoordinates(), []);

  const getNodeStatus = (level) => {
    if (level < currentLevel) return 'completed';
    if (level === currentLevel) return 'current';
    return 'locked';
  };

  const getNodeColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-br from-green-600 to-green-400 border-green-300';
      case 'current': return 'bg-gradient-to-br from-purple-600 to-purple-400 border-purple-300';
      case 'locked': return 'bg-gradient-to-br from-gray-600 to-gray-500 border-gray-400';
      default: return 'bg-gradient-to-br from-gray-600 to-gray-500 border-gray-400';
    }
  };

  const getNodeGlow = (status) => {
    switch (status) {
      case 'completed': return 'shadow-green-400/50 shadow-lg';
      case 'current': return 'shadow-purple-400/70 shadow-xl';
      default: return 'shadow-gray-500/30';
    }
  };

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl overflow-hidden border border-purple-500/30">
      {/* RPG Map Background Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src={rpgMap} 
          alt="RPG Map" 
          className="w-full h-full object-contain"
          style={{ maxWidth: '900px', maxHeight: '650px' }}
        />
      </div>

      {/* Map Container */}
      <div className="relative w-full h-full">
        {/* Level Nodes */}
        {mapCoordinates.map((node) => {
          const status = getNodeStatus(node.level);
          const isHovered = hoveredNode === node.level;
          
          return (
            <motion.div
              key={node.level}
              className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center text-white font-bold text-xs cursor-pointer transition-all duration-300 ${getNodeColor(status)} ${getNodeGlow(status)}`}
              style={{
                left: `${node.x - 24}px`,
                top: `${node.y - 24}px`
              }}
              whileHover={{ scale: 1.15 }}
              onHoverStart={() => setHoveredNode(node.level)}
              onHoverEnd={() => setHoveredNode(null)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: node.level * 0.02 }}
            >
              <span className="relative z-10">{node.level}</span>
              
              {/* Current Level Enhanced Animation */}
              {status === 'current' && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full bg-purple-400/40"
                    animate={{ scale: [1, 1.8, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -inset-2 rounded-full border-2 border-purple-300/60"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                </>
              )}
              
              {/* Completed Level Glow */}
              {status === 'completed' && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-green-400/30"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}

        {/* Player Avatar Marker */}
        <AnimatePresence>
          {mapCoordinates.find(node => node.level === currentLevel) && (
            <motion.div
              key="player-marker"
              className="absolute text-2xl pointer-events-none z-20"
              style={{
                left: `${mapCoordinates.find(node => node.level === currentLevel).x - 16}px`,
                top: `${mapCoordinates.find(node => node.level === currentLevel).y - 16}px`
              }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {userAvatar}
              </motion.div>
              <motion.div
                className="absolute inset-0 rounded-full bg-purple-400/50"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <motion.div
                className="absolute -inset-4 rounded-full border-2 border-purple-300/80"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Tooltip */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              key="tooltip"
              className="absolute bg-gray-900/95 text-white px-4 py-3 rounded-xl text-sm pointer-events-none z-30 border border-purple-500/40 shadow-2xl"
              style={{
                left: `${mapCoordinates.find(node => node.level === hoveredNode).x}px`,
                top: `${mapCoordinates.find(node => node.level === hoveredNode).y - 70}px`,
                transform: 'translateX(-50%)'
              }}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="font-bold text-purple-300 text-base mb-1">Level {hoveredNode}</div>
              <div className="text-gray-300 text-xs">{mapCoordinates.find(node => node.level === hoveredNode).title}</div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-purple-500/40" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default JourneyMap;
