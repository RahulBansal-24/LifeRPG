import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import journeyMap from '../assets/maps/journey-map.png';

// ============================================================
// TEMPORARY COORDINATE CAPTURE MODE
// Set to true to enable coordinate capture tool
// Set to false to disable and return to normal behavior
// ============================================================
const COORDINATE_CAPTURE_MODE = false;

// ============================================================
// CAPTURED COORDINATES (Levels 1-50)
// These are the precise coordinates captured from the map image
// Adjusted to fix bottom-right offset
// ============================================================
const CAPTURED_COORDINATES = {
  1: { x: 11.43, y: 19.15 },
  2: { x: 7.93, y: 23.86 },
  3: { x: 11.21, y: 30.14 },
  4: { x: 16.12, y: 30.73 },
  5: { x: 20.15, y: 24.64 },
  6: { x: 25.06, y: 22.49 },
  7: { x: 30.19, y: 25.23 },
  8: { x: 33.89, y: 30.53 },
  9: { x: 38.8, y: 36.62 },
  10: { x: 43.71, y: 35.63 },
  11: { x: 46.87, y: 34.46 },
  12: { x: 49.71, y: 32.69 },
  13: { x: 52.55, y: 34.85 },
  14: { x: 55.71, y: 36.62 },
  15: { x: 57.35, y: 41.13 },
  16: { x: 57.13, y: 47.02 },
  17: { x: 53.96, y: 50.16 },
  18: { x: 50.04, y: 49.96 },
  19: { x: 40.88, y: 55.45 },
  20: { x: 34.77, y: 59.97 },
  21: { x: 31.28, y: 62.32 },
  22: { x: 25.6, y: 62.71 },
  23: { x: 18.08, y: 67.82 },
  24: { x: 15.79, y: 75.67 },
  25: { x: 19.06, y: 83.32 },
  26: { x: 25.06, y: 86.07 },
  27: { x: 30.51, y: 85.67 },
  28: { x: 36.08, y: 84.5 },
  29: { x: 40.88, y: 85.87 },
  30: { x: 45.57, y: 85.48 },
  31: { x: 49.49, y: 79.59 },
  32: { x: 52.44, y: 74.29 },
  33: { x: 55.6, y: 81.16 },
  34: { x: 60.95, y: 85.67 },
  35: { x: 65.64, y: 83.71 },
  36: { x: 69.23, y: 79.4 },
  37: { x: 73.92, y: 74.1 },
  38: { x: 77.52, y: 81.36 },
  39: { x: 82.0, y: 76.06 },
  40: { x: 86.58, y: 71.35 },
  41: { x: 89.09, y: 64.09 },
  42: { x: 90.83, y: 56.83 },
  43: { x: 84.83, y: 52.51 },
  44: { x: 79.49, y: 52.31 },
  45: { x: 74.91, y: 50.94 },
  46: { x: 71.63, y: 45.84 },
  47: { x: 71.42, y: 38.97 },
  48: { x: 74.25, y: 33.67 },
  49: { x: 78.29, y: 30.53 },
  50: { x: 84.57, y: 26.5 }
};

// Level titles from existing system (matching helpers.js)
const levelTitles = [
  { level: 1, title: "Novice" },
  { level: 2, title: "Apprentice" },
  { level: 3, title: "Adventurer" },
  { level: 4, title: "Warrior" },
  { level: 5, title: "Hero" },
  { level: 6, title: "Champion" },
  { level: 7, title: "Legend" },
  { level: 8, title: "Master" },
  { level: 9, title: "Grandmaster" },
  { level: 10, title: "Immortal" },
  { level: 11, title: "Demigod" },
  { level: 12, title: "Ascendant" },
  { level: 13, title: "Celestial" },
  { level: 14, title: "Divine" },
  { level: 15, title: "Ethereal" },
  { level: 16, title: "Transcendent" },
  { level: 17, title: "Cosmic" },
  { level: 18, title: "Stellar" },
  { level: 19, title: "Galactic" },
  { level: 20, title: "Universal" },
  { level: 21, title: "Omnipotent" },
  { level: 22, title: "Eternal" },
  { level: 23, title: "Infinite" },
  { level: 24, title: "Boundless" },
  { level: 25, title: "Limitless" },
  { level: 26, title: "Supreme" },
  { level: 27, title: "Ultimate" },
  { level: 28, title: "Absolute" },
  { level: 29, title: "Perfected" },
  { level: 30, title: "Enlightened" },
  { level: 31, title: "Awakened" },
  { level: 32, title: "Ascended" },
  { level: 33, title: "Exalted" },
  { level: 34, title: "Venerated" },
  { level: 35, title: "Revered" },
  { level: 36, title: "Worshipped" },
  { level: 37, title: "Deified" },
  { level: 38, title: "Glorified" },
  { level: 39, title: "Sanctified" },
  { level: 40, title: "Consecrated" },
  { level: 41, title: "Anointed" },
  { level: 42, title: "Blessed" },
  { level: 43, title: "Favored" },
  { level: 44, title: "Chosen" },
  { level: 45, title: "Destined" },
  { level: 46, title: "Foretold" },
  { level: 47, title: "Prophesied" },
  { level: 48, title: "Legendary" },
  { level: 49, title: "Mythical" },
  { level: 50, title: "Godlike" }
];

// Coordinates aligned to the numbered circles on the PNG map
// These coordinates are percentage-based (0-100) to work with responsive scaling
const generateMapCoordinates = () => {
  return Object.entries(CAPTURED_COORDINATES).map(([level, coord]) => ({
    level: parseInt(level),
    x: coord.x,
    y: coord.y,
    title: levelTitles[parseInt(level) - 1].title
  }));
};

const JourneyMap = ({ currentLevel, userAvatar }) => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const mapCoordinates = useMemo(() => generateMapCoordinates(), []);
  
  // Coordinate capture mode state
  const [captureCurrentLevel, setCaptureCurrentLevel] = useState(1);
  const [capturedCoordinates, setCapturedCoordinates] = useState({});
  const [lastCaptured, setLastCaptured] = useState(null);
  const [imageRef, setImageRef] = useState(null);
  const [captureMarkers, setCaptureMarkers] = useState([]);

  const handleMapClick = (e) => {
    if (!COORDINATE_CAPTURE_MODE || !imageRef) return;

    const rect = imageRef.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert to percentage coordinates
    const xPercent = ((clickX / rect.width) * 100).toFixed(2);
    const yPercent = ((clickY / rect.height) * 100).toFixed(2);

    // Save coordinate for current level
    const newCoordinate = {
      level: captureCurrentLevel,
      x: parseFloat(xPercent),
      y: parseFloat(yPercent)
    };

    setCapturedCoordinates(prev => ({
      ...prev,
      [captureCurrentLevel]: newCoordinate
    }));

    setLastCaptured(newCoordinate);

    // Add visual marker
    setCaptureMarkers(prev => [
      ...prev.filter(m => m.level !== captureCurrentLevel),
      { level: captureCurrentLevel, x: parseFloat(xPercent), y: parseFloat(yPercent) }
    ]);

    // Console output
    console.log(`Level ${captureCurrentLevel}: { x: ${xPercent}, y: ${yPercent} }`);

    // Auto-advance to next level
    if (captureCurrentLevel < 50) {
      setCaptureCurrentLevel(prev => prev + 1);
    }
  };

  const handlePreviousLevel = () => {
    setCaptureCurrentLevel(prev => Math.max(1, prev - 1));
  };

  const handleNextLevel = () => {
    setCaptureCurrentLevel(prev => Math.min(50, prev + 1));
  };

  const handleCopyLastCoordinate = () => {
    if (!lastCaptured) return;
    const text = `{ level: ${lastCaptured.level}, x: ${lastCaptured.x}, y: ${lastCaptured.y} }`;
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard: ' + text);
  };

  const handleExportAllCoordinates = () => {
    const exportText = `const levelCoordinates = {
${Object.entries(capturedCoordinates).map(([level, coord]) => 
  `  ${level}: { x: ${coord.x}, y: ${coord.y} }`
).join(',\n')}
};`;

    console.log(exportText);
    navigator.clipboard.writeText(exportText);
    alert('All coordinates exported to clipboard and console!');
  };

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
    <div className="relative inline-block bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl overflow-hidden border border-purple-500/30 p-4 mx-auto">
      {/* Map Wrapper - inherits dimensions from image */}
      <div className="relative">
        {/* RPG Map Background Image - determines wrapper dimensions */}
        <img 
          ref={COORDINATE_CAPTURE_MODE ? (el => setImageRef(el)) : null}
          src={journeyMap} 
          alt="Journey Map" 
          className="max-w-full max-h-[65vh] object-contain rounded-xl border border-purple-500/40 shadow-2xl cursor-crosshair"
          onClick={handleMapClick}
        />

        {/* Overlay Layer - positioned relative to image wrapper */}
        <div className={`absolute inset-0 ${COORDINATE_CAPTURE_MODE ? 'pointer-events-none' : ''}`}>
          {/* Coordinate Capture Markers */}
          {COORDINATE_CAPTURE_MODE && captureMarkers.map((marker) => (
            <div
              key={marker.level}
              className="absolute w-6 h-6 rounded-full bg-yellow-400 border-2 border-yellow-600 flex items-center justify-center text-xs font-bold text-black pointer-events-none"
              style={{
                left: `${marker.x}%`,
                top: `${marker.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              L{marker.level}
            </div>
          ))}
          {/* Level Nodes Overlay */}
          {mapCoordinates.map((node) => {
            const status = getNodeStatus(node.level);
            const isHovered = hoveredNode === node.level;
            
            return (
              <motion.div
                key={node.level}
                className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center text-white font-bold text-xs cursor-pointer transition-all duration-300 ${getNodeColor(status)} ${getNodeGlow(status)}`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)'
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
                className="absolute text-lg pointer-events-none z-20"
                style={{
                  left: `${mapCoordinates.find(node => node.level === currentLevel).x}%`,
                  top: `${mapCoordinates.find(node => node.level === currentLevel).y}%`,
                  transform: 'translate(-50%, -50%)'
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
                  left: `${mapCoordinates.find(node => node.level === hoveredNode).x}%`,
                  top: `${mapCoordinates.find(node => node.level === hoveredNode).y - 5}%`,
                  transform: 'translate(-50%, -100%)'
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

      {/* Coordinate Capture Debug Panel */}
      {COORDINATE_CAPTURE_MODE && (
        <div className="fixed top-4 left-4 bg-gray-900/95 backdrop-blur-sm rounded-xl border-2 border-yellow-500/50 p-4 shadow-2xl z-50 w-72">
          <div className="text-yellow-400 font-bold text-lg mb-3 border-b border-yellow-500/30 pb-2">
            🎯 Coordinate Capture Mode
          </div>
          
          <div className="mb-3">
            <div className="text-gray-300 text-sm mb-1">Current Level:</div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousLevel}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
              >
                ←
              </button>
              <span className="bg-yellow-500/20 text-yellow-400 px-4 py-1 rounded font-bold text-lg">
                {captureCurrentLevel}
              </span>
              <button
                onClick={handleNextLevel}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
              >
                →
              </button>
            </div>
          </div>

          <div className="mb-3">
            <div className="text-gray-300 text-sm mb-1">Captured:</div>
            <div className="bg-gray-800 rounded p-2 font-mono text-sm">
              <div className="text-green-400">
                X: {lastCaptured ? lastCaptured.x.toFixed(2) + '%' : '--'}
              </div>
              <div className="text-green-400">
                Y: {lastCaptured ? lastCaptured.y.toFixed(2) + '%' : '--'}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopyLastCoordinate}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium"
            >
              Copy Last
            </button>
            <button
              onClick={handleExportAllCoordinates}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded text-sm font-medium"
            >
              Export All
            </button>
          </div>

          <div className="mt-3 text-xs text-gray-400 border-t border-gray-700 pt-2">
            Progress: {Object.keys(capturedCoordinates).length} / 50
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyMap;
