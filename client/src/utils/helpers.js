// XP calculation utilities
export const calculateXPProgress = (currentXP, level) => {
  const xpThresholds = [
    0,    // Level 1
    100,  // Level 2
    250,  // Level 3
    500,  // Level 4
    1000, // Level 5
    1750, // Level 6
    3000, // Level 7
    5000, // Level 8
    8000, // Level 9
    12000 // Level 10
  ];

  if (level >= xpThresholds.length) {
    return {
      current: 0,
      needed: 0,
      total: 0,
      percentage: 100,
    };
  }

  const nextLevelXP = xpThresholds[level];
  const currentLevelXP = level > 1 ? xpThresholds[level - 1] : 0;
  const xpInCurrentLevel = currentXP - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;

  return {
    current: xpInCurrentLevel,
    needed: xpNeededForNextLevel,
    total: xpNeededForNextLevel,
    percentage: Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100),
  };
};

// Format XP display
export const formatXP = (xp) => {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}k`;
  }
  return xp.toString();
};

// Get difficulty color
export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'easy':
      return 'text-neon-green';
    case 'medium':
      return 'text-xp-gold';
    case 'hard':
      return 'text-neon-pink';
    default:
      return 'text-gray-400';
  }
};

// Get quest type color
export const getQuestTypeColor = (type) => {
  switch (type) {
    case 'daily':
      return 'text-neon-cyan';
    case 'main':
      return 'text-neon-purple';
    default:
      return 'text-gray-400';
  }
};

// Get stat icon
export const getStatIcon = (stat) => {
  switch (stat) {
    case 'strength':
      return '💪';
    case 'intelligence':
      return '🧠';
    case 'discipline':
      return '⚡';
    case 'charisma':
      return '✨';
    default:
      return '📊';
  }
};

// Get stat color
export const getStatColor = (stat) => {
  switch (stat) {
    case 'strength':
      return 'text-red-400';
    case 'intelligence':
      return 'text-blue-400';
    case 'discipline':
      return 'text-yellow-400';
    case 'charisma':
      return 'text-pink-400';
    default:
      return 'text-gray-400';
  }
};

// Format date
export const formatDate = (date) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

// Format relative time
export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  return formatDate(date);
};

// Generate random avatar options
export const avatarOptions = [
  '🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '',
  '🦸', '🦹', '🧙', '🧚', '🧞', '🧜', '🧝', '🧟',
  '🗡️', '⚔️', '🛡️', '🏹', '🪄', '🔮', '💎', '👑',
  '🌟', '⭐', '✨', '💫', '🌙', '☀️', '🔥', '⚡',
  '🐉', '🦅', '🦊', '🦁', '🐺', '🦅', '🦉', '🦇',
];

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate password
export const validatePassword = (password) => {
  return password.length >= 6;
};

// Validate username
export const validateUsername = (username) => {
  return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);
};

// Get level title
export const getLevelTitle = (level) => {
  const titles = [
    'Novice',     // Level 1
    'Apprentice', // Level 2
    'Adventurer', // Level 3
    'Warrior',    // Level 4
    'Hero',       // Level 5
    'Champion',   // Level 6
    'Legend',     // Level 7
    'Master',     // Level 8
    'Grandmaster', // Level 9
    'Immortal',   // Level 10+
  ];

  if (level <= 0) return 'Novice';
  if (level >= titles.length) return 'Immortal';
  return titles[level - 1];
};

// Calculate stat bonus based on level
export const calculateStatBonus = (baseStat, level) => {
  const bonusMultiplier = 1 + (level - 1) * 0.05; // 5% bonus per level
  return Math.floor(baseStat * bonusMultiplier);
};

// Generate random quest suggestions
export const generateQuestSuggestions = () => {
  const suggestions = [
    { title: 'Morning Workout', description: 'Complete a 20-minute workout session', xpReward: 30, type: 'daily', difficulty: 'medium' },
    { title: 'Read a Book', description: 'Read at least 10 pages of a book', xpReward: 25, type: 'daily', difficulty: 'easy' },
    { title: 'Learn Something New', description: 'Watch an educational video or take an online course', xpReward: 35, type: 'daily', difficulty: 'medium' },
    { title: 'Meditate', description: 'Practice meditation for 15 minutes', xpReward: 20, type: 'daily', difficulty: 'easy' },
    { title: 'Clean Your Space', description: 'Organize and clean your living/working space', xpReward: 40, type: 'main', difficulty: 'medium' },
    { title: 'Side Project', description: 'Work on your personal project for 1 hour', xpReward: 50, type: 'main', difficulty: 'hard' },
    { title: 'Social Connection', description: 'Reach out to a friend or family member', xpReward: 25, type: 'daily', difficulty: 'easy' },
    { title: 'Healthy Meal', description: 'Prepare and eat a nutritious meal', xpReward: 20, type: 'daily', difficulty: 'easy' },
  ];

  return suggestions.sort(() => Math.random() - 0.5).slice(0, 4);
};
