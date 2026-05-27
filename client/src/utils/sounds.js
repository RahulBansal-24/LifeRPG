// Lightweight sound utility for LifeRPG
// Only 3 sounds: create, complete, click

// Sound state management
let globalMuteState = false;
let lastSoundTime = 0;
const SOUND_COOLDOWN = 100; // Prevent sound spam

// Initialize global mute state from localStorage
if (typeof window !== 'undefined') {
  globalMuteState = localStorage.getItem('liferpg_muted') === 'true';
}

// Volume levels for different sound types
const VOLUME_LEVELS = {
  create: 0.4,
  complete: 0.4,
  click: 0.6  // Increased volume for click sounds
};

// Main sound function
export const playSound = (type) => {
  // Only play if not muted and cooldown has passed
  if (globalMuteState) return;
  
  const now = Date.now();
  if (now - lastSoundTime < SOUND_COOLDOWN) return;
  
  try {
    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.volume = VOLUME_LEVELS[type] || 0.4; // Use specific volume or default
    audio.play().catch(() => {
      // Silently handle autoplay errors
    });
    lastSoundTime = now;
  } catch (error) {
    // Silently handle any errors
  }
};

// Toggle mute function
export const toggleMute = () => {
  globalMuteState = !globalMuteState;
  localStorage.setItem('liferpg_muted', globalMuteState.toString());
  return globalMuteState;
};

// Get mute state
export const getMuteState = () => {
  return globalMuteState;
};
