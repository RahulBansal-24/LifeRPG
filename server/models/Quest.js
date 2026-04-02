const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Quest title is required'],
    trim: true,
    maxlength: [100, 'Quest title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Quest description is required'],
    trim: true,
    maxlength: [500, 'Quest description cannot exceed 500 characters']
  },
  xpReward: {
    type: Number,
    required: [true, 'XP reward is required'],
    min: [10, 'XP reward must be at least 10'],
    max: [500, 'XP reward cannot exceed 500']
  },
  type: {
    type: String,
    required: true,
    enum: ['daily', 'main'],
    default: 'main'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  completedAt: {
    type: Date
  },
  statsReward: {
    strength: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 },
    discipline: { type: Number, default: 0 },
    charisma: { type: Number, default: 0 }
  },
  selectedSkills: [{
    type: String,
    enum: ['strength', 'intelligence', 'discipline', 'charisma']
  }]
}, {
  timestamps: true
});

// Method to complete quest
questSchema.methods.complete = function() {
  this.status = 'completed';
  this.completedAt = new Date();
};

// Static method to get daily quests for user
questSchema.statics.getDailyQuests = function(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.find({
    userId: userId,
    type: 'daily',
    createdAt: { $gte: today }
  });
};

// Static method to create default daily quests
questSchema.statics.createDefaultDailyQuests = function(userId) {
  const defaultDailyQuests = [
    {
      title: 'Morning Exercise',
      description: 'Complete 15 minutes of exercise to start your day right!',
      xpReward: 25,
      type: 'daily',
      difficulty: 'easy',
      statsReward: { strength: 2, discipline: 1 }
    },
    {
      title: 'Read for 30 Minutes',
      description: 'Expand your knowledge by reading for at least 30 minutes.',
      xpReward: 30,
      type: 'daily',
      difficulty: 'medium',
      statsReward: { intelligence: 3, discipline: 2 }
    },
    {
      title: 'Meditate/Relax',
      description: 'Take 10 minutes to meditate or practice mindfulness.',
      xpReward: 20,
      type: 'daily',
      difficulty: 'easy',
      statsReward: { discipline: 2, charisma: 1 }
    },
    {
      title: 'Learn Something New',
      description: 'Watch an educational video or learn a new skill.',
      xpReward: 35,
      type: 'daily',
      difficulty: 'medium',
      statsReward: { intelligence: 4, discipline: 1 }
    },
    {
      title: 'Social Connection',
      description: 'Reach out to a friend or family member.',
      xpReward: 25,
      type: 'daily',
      difficulty: 'easy',
      statsReward: { charisma: 3, discipline: 1 }
    }
  ];

  const quests = defaultDailyQuests.map(quest => ({
    ...quest,
    userId: userId
  }));

  return this.insertMany(quests);
};

// Pre-remove middleware to clean up user references
questSchema.pre('remove', async function(next) {
  // Add any cleanup logic here if needed
  next();
});

module.exports = mongoose.model('Quest', questSchema);
