// XP calculation utilities
export const calculateXPProgress = (currentXP, level) => {
  const xpThresholds = [
    0,      // Level 1
    100,    // Level 2
    250,    // Level 3
    500,    // Level 4
    1000,   // Level 5
    1750,   // Level 6
    3000,   // Level 7
    5000,   // Level 8
    8000,   // Level 9
    12000,  // Level 10
    17500,  // Level 11
    25000,  // Level 12
    35000,  // Level 13
    50000,  // Level 14
    70000,  // Level 15
    100000, // Level 16
    140000, // Level 17
    190000, // Level 18
    250000, // Level 19
    330000, // Level 20
    430000, // Level 21
    550000, // Level 22
    700000, // Level 23
    880000, // Level 24
    1100000,// Level 25
    1350000,// Level 26
    1650000,// Level 27
    2000000,// Level 28
    2400000,// Level 29
    2850000,// Level 30
    3350000,// Level 31
    3900000,// Level 32
    4500000,// Level 33
    5150000,// Level 34
    5850000,// Level 35
    6600000,// Level 36
    7400000,// Level 37
    8250000,// Level 38
    9150000,// Level 39
    10100000,// Level 40
    11100000,// Level 41
    12150000,// Level 42
    13250000,// Level 43
    14400000,// Level 44
    15600000,// Level 45
    16850000,// Level 46
    18150000,// Level 47
    19500000,// Level 48
    20900000,// Level 49
    22500000 // Level 50
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
      return '🎯';
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
  '🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎰',
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
    'Novice',        // Level 1
    'Apprentice',    // Level 2
    'Adventurer',    // Level 3
    'Warrior',       // Level 4
    'Hero',          // Level 5
    'Champion',      // Level 6
    'Legend',        // Level 7
    'Master',        // Level 8
    'Grandmaster',   // Level 9
    'Immortal',      // Level 10
    'Demigod',       // Level 11
    'Ascendant',     // Level 12
    'Celestial',     // Level 13
    'Divine',        // Level 14
    'Ethereal',      // Level 15
    'Transcendent',  // Level 16
    'Cosmic',        // Level 17
    'Stellar',       // Level 18
    'Galactic',      // Level 19
    'Universal',     // Level 20
    'Omnipotent',    // Level 21
    'Eternal',       // Level 22
    'Infinite',      // Level 23
    'Boundless',     // Level 24
    'Limitless',     // Level 25
    'Supreme',       // Level 26
    'Ultimate',      // Level 27
    'Absolute',      // Level 28
    'Perfected',     // Level 29
    'Enlightened',   // Level 30
    'Awakened',      // Level 31
    'Ascended',      // Level 32
    'Exalted',       // Level 33
    'Venerated',     // Level 34
    'Revered',       // Level 35
    'Worshipped',     // Level 36
    'Deified',       // Level 37
    'Glorified',     // Level 38
    'Sanctified',    // Level 39
    'Consecrated',   // Level 40
    'Anointed',      // Level 41
    'Blessed',       // Level 42
    'Favored',       // Level 43
    'Chosen',        // Level 44
    'Destined',      // Level 45
    'Foretold',      // Level 46
    'Prophesied',     // Level 47
    'Legendary',     // Level 48
    'Mythical',      // Level 49
    'Godlike'        // Level 50
  ];

  if (level <= 0) return 'Novice';
  if (level >= titles.length) return 'Godlike';
  return titles[level - 1];
};

// Calculate stat bonus based on level with tiered system
export const calculateStatBonus = (baseStat, level) => {
  let boostPercentage = 0;
  
  if (level >= 1 && level <= 5) {
    boostPercentage = 0;
  } else if (level >= 6 && level <= 15) {
    boostPercentage = 5;
  } else if (level >= 16 && level <= 25) {
    boostPercentage = 10;
  } else if (level >= 26 && level <= 35) {
    boostPercentage = 15;
  } else if (level >= 36 && level <= 45) {
    boostPercentage = 20;
  } else if (level >= 46 && level <= 50) {
    boostPercentage = 25;
  } else if (level > 50) {
    boostPercentage = 25; // Cap at 25% after level 50
  }
  
  // Formula: skill stat value = original + original * level boost
  const bonusMultiplier = 1 + (boostPercentage / 100);
  return Math.floor(baseStat * bonusMultiplier); // Return integer only
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
