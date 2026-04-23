// Pool of 25 predefined daily quests for LifeRPG
// Each quest follows the existing quest schema structure

const DAILY_QUEST_POOL = [
  // EASY QUESTS (10 total)
  {
    title: "Morning Exercise",
    description: "Complete 20 minutes of exercise to start your day right!",
    difficulty: "easy",
    statsReward: { strength: 1, discipline: 1 },
    selectedSkills: ["strength", "discipline"]
  },
  {
    title: "Meditate/Relax",
    description: "Take 10 minutes to meditate or practice mindfulness.",
    difficulty: "easy",
    statsReward: { discipline: 1, charisma: 1 },
    selectedSkills: ["discipline", "charisma"]
  },
  {
    title: "Social Connection",
    description: "Reach out to a friend or family member.",
    difficulty: "easy",
    statsReward: { charisma: 1 },
    selectedSkills: ["charisma"]
  },
  {
    title: "Quick Learning",
    description: "Watch a 10-minute educational video or read an article.",
    difficulty: "easy",
    statsReward: { intelligence: 1},
    selectedSkills: ["intelligence"]
  },
  {
    title: "Healthy Snack",
    description: "Prepare and eat a healthy snack instead of junk food.",
    difficulty: "easy",
    statsReward: { strength: 1 },
    selectedSkills: ["strength"]
  },
  {
    title: "Stretch Break",
    description: "Take a 5-minute break to stretch and move your body.",
    difficulty: "easy",
    statsReward: { strength: 1, discipline: 1 },
    selectedSkills: ["strength", "discipline"]
  },
  {
    title: "Gratitude Journal",
    description: "Write down 3 things you're grateful for today.",
    difficulty: "easy",
    statsReward: { charisma: 1, intelligence: 1 },
    selectedSkills: ["charisma", "intelligence"]
  },
  {
    title: "Tidy Up Space",
    description: "Spend 10 minutes organizing your workspace or room.",
    difficulty: "easy",
    statsReward: { discipline: 1 },
    selectedSkills: ["discipline"]
  },
  {
    title: "Hydration Goal",
    description: "Drink 8 glasses of water throughout the day.",
    difficulty: "easy",
    statsReward: { discipline: 1, strength: 1 },
    selectedSkills: ["discipline", "strength"]
  },
  {
    title: "Positive Affirmation",
    description: "Practice 5 positive affirmations to boost confidence.",
    difficulty: "easy",
    statsReward: { charisma: 1, discipline: 1 },
    selectedSkills: ["charisma", "discipline"]
  },

  // MEDIUM QUESTS (10 total)
  {
    title: "Read for 30 Minutes",
    description: "Expand your knowledge by reading for at least 30 minutes.",
    difficulty: "medium",
    statsReward: { intelligence: 1, discipline: 1 },
    selectedSkills: ["intelligence", "discipline"]
  },
  {
    title: "Learn Something New",
    description: "Watch an educational video or learn a new skill.",
    difficulty: "medium",
    statsReward: { intelligence: 2 },
    selectedSkills: ["intelligence"]
  },
  {
    title: "Workout Session",
    description: "Complete a 1 hour workout routine.",
    difficulty: "medium",
    statsReward: { strength: 2, discipline: 1 },
    selectedSkills: ["strength", "discipline"]
  },
  {
    title: "Deep Conversation",
    description: "Have a meaningful conversation with someone.",
    difficulty: "medium",
    statsReward: { charisma: 2, intelligence: 1 },
    selectedSkills: ["charisma", "intelligence"]
  },
  {
    title: "Study Session",
    description: "Focus on learning for 1 hour without distractions.",
    difficulty: "medium",
    statsReward: { intelligence: 2, discipline: 2 },
    selectedSkills: ["intelligence", "discipline"]
  },
  {
    title: "Creative Project",
    description: "Work on a creative project for 30 minutes.",
    difficulty: "medium",
    statsReward: { intelligence: 2, charisma: 1 },
    selectedSkills: ["intelligence", "charisma"]
  },
  {
    title: "Help Someone",
    description: "Offer help to someone who needs it.",
    difficulty: "medium",
    statsReward: { charisma: 2 },
    selectedSkills: ["charisma"]
  },
  {
    title: "Financial Planning",
    description: "Review and organize your finances",
    difficulty: "medium",
    statsReward: { intelligence: 1, discipline: 2 },
    selectedSkills: ["intelligence", "discipline"]
  },
  {
    title: "Skill Practice",
    description: "Practice a specific skill for 30 minutes.",
    difficulty: "medium",
    statsReward: { intelligence: 1, discipline: 2 },
    selectedSkills: ["intelligence", "discipline"]
  },
  {
    title: "Nature Walk",
    description: "Take a 40-minute walk in nature or outdoors.",
    difficulty: "medium",
    statsReward: { strength: 2, charisma: 1 },
    selectedSkills: ["strength", "charisma"]
  },

  // HARD QUESTS (5 total)
  {
    title: "Intensive Workout",
    description: "Complete a challenging 90-minute workout session.",
    difficulty: "hard",
    statsReward: { strength: 3, discipline: 2 },
    selectedSkills: ["strength", "discipline"]
  },
  {
    title: "Deep Learning",
    description: "Study a complex topic for 90 minutes.",
    difficulty: "hard",
    statsReward: { intelligence: 3, discipline: 2 },
    selectedSkills: ["intelligence", "discipline"]
  },
  {
    title: "Public Speaking",
    description: "Prepare and deliver a presentation or speech.",
    difficulty: "hard",
    statsReward: { charisma: 3, intelligence: 2 },
    selectedSkills: ["charisma", "intelligence"]
  },
  {
    title: "Leadership Challenge",
    description: "Take initiative in leading a group or project.",
    difficulty: "hard",
    statsReward: { charisma: 3, discipline: 2, intelligence: 1 },
    selectedSkills: ["charisma", "discipline", "intelligence"]
  },
  {
    title: "Personal Project",
    description: "Complete a significant personal project or goal.",
    difficulty: "hard",
    statsReward: { intelligence: 2, discipline: 3},
    selectedSkills: ["intelligence", "discipline"]
  }
];

// Function to randomly select 5 quests from pool with user and date-based seed
const selectDailyQuests = (userId) => {
  const today = new Date();
  const dateString = today.toDateString(); // e.g., "Mon Apr 21 2026"
  const userString = userId.toString(); // User ID for uniqueness
  
  // Create seeded random using date + user string for user-specific daily quests
  let seed = 0;
  const combinedString = dateString + userString;
  for (let i = 0; i < combinedString.length; i++) {
    seed += combinedString.charCodeAt(i);
  }
  
  // Use seeded random to get different quests each day but same within the day for each user
  const random = (seed) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  
  // Shuffle using seeded random
  const shuffled = [...DAILY_QUEST_POOL].sort(() => random(seed) - 0.5);
  return shuffled.slice(0, 5);
};

// Function to calculate XP reward based on difficulty and skills
const calculateXPReward = (difficulty, skillCount) => {
  if (skillCount === 0) {
    // No skills selected
    if (difficulty === 'easy') return 15;
    if (difficulty === 'medium') return 20;
    if (difficulty === 'hard') return 25;
    return 20; // default
  } else if (skillCount === 1) {
    // One skill selected
    if (difficulty === 'easy') return 20;
    if (difficulty === 'medium') return 25;
    if (difficulty === 'hard') return 35;
    return 25; // default
  } else {
    // Two or more skills selected
    if (difficulty === 'easy') return 25;
    if (difficulty === 'medium') return 30;
    if (difficulty === 'hard') return 40;
    return 30; // default
  }
};

// Function to prepare quests for database insertion
const prepareDailyQuests = (userId) => {
  const selectedQuests = selectDailyQuests(userId);
  
  return selectedQuests.map(quest => {
    const skillCount = quest.selectedSkills.length;
    const xpReward = calculateXPReward(quest.difficulty, skillCount);
    
    return {
      userId,
      title: quest.title,
      description: quest.description,
      xpReward,
      type: 'daily',
      difficulty: quest.difficulty,
      statsReward: quest.statsReward,
      selectedSkills: quest.selectedSkills
    };
  });
};

module.exports = {
  DAILY_QUEST_POOL,
  selectDailyQuests,
  calculateXPReward,
  prepareDailyQuests
};
