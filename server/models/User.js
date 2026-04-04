const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  originalPassword: {
    type: String,
    required: [true, 'Original password is required'],
    select: false // Don't include original password in queries by default
  },
  xp: {
    type: Number,
    default: 0,
    min: 0
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  stats: {
    strength: {
      type: Number,
      default: 10,
      min: 1,
      max: 100000
    },
    intelligence: {
      type: Number,
      default: 10,
      min: 1,
      max: 100000
    },
    discipline: {
      type: Number,
      default: 10,
      min: 1,
      max: 100000
    },
    charisma: {
      type: Number,
      default: 10,
      min: 1,
      max: 100000
    }
  },
  avatar: {
    type: String,
    default: '🎮'
  },
  stars: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate level based on XP
userSchema.methods.calculateLevel = function() {
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
  
  let newLevel = 1;
  for (let i = xpThresholds.length - 1; i >= 0; i--) {
    if (this.xp >= xpThresholds[i]) {
      newLevel = i + 1;
      break;
    }
  }
  
  return newLevel;
};

// Method to add XP and update level
userSchema.methods.addXP = function(xpAmount) {
  this.xp += xpAmount;
  const newLevel = this.calculateLevel();
  const leveledUp = newLevel > this.level;
  this.level = newLevel;
  
  return {
    xp: this.xp,
    level: this.level,
    leveledUp: leveledUp,
    xpToNextLevel: this.getXPToNextLevel()
  };
};

// Method to get XP needed for next level
userSchema.methods.getXPToNextLevel = function() {
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
  
  if (this.level >= xpThresholds.length) {
    return 0; // Max level
  }
  
  const nextLevelXP = xpThresholds[this.level];
  const currentLevelXP = this.level > 1 ? xpThresholds[this.level - 2] : 0;
  
  return {
    current: this.xp - currentLevelXP,
    needed: nextLevelXP - currentLevelXP,
    total: nextLevelXP - currentLevelXP
  };
};

// Method to update stats
userSchema.methods.updateStats = function(statUpdates) {
  Object.keys(statUpdates).forEach(stat => {
    if (this.stats[stat] !== undefined) {
      this.stats[stat] = Math.max(1, Math.min(100000, this.stats[stat] + statUpdates[stat]));
    }
  });
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
