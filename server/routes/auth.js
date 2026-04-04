const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Quest = require('../models/Quest');
const nodemailer = require('nodemailer');

const router = express.Router();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('avatar')
    .optional()
    .isLength({ min: 1, max: 2 })
    .withMessage('Avatar must be a valid emoji')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, email, password, avatar } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      originalPassword: password, // Store original password for recovery
      avatar: avatar || '🎮'
    });

    // Create default daily quests for new user
    await Quest.createDefaultDailyQuests(user._id);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully! Welcome to LifeRPG! 🎮',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          level: user.level,
          xp: user.xp,
          stats: user.stats,
          avatar: avatar || '🎮',
          stars: user.stars,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if password matches
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Check and create daily quests if needed
    const existingDailyQuests = await Quest.getDailyQuests(user._id);
    if (existingDailyQuests.length === 0) {
      await Quest.createDefaultDailyQuests(user._id);
    } else {
      // Update existing daily quests to include selectedSkills if missing or empty
      for (const quest of existingDailyQuests) {
        if (!quest.selectedSkills || quest.selectedSkills.length === 0) {
          // Derive selectedSkills from statsReward
          const selectedSkills = [];
          if (quest.statsReward) {
            Object.keys(quest.statsReward).forEach(stat => {
              if (quest.statsReward[stat] > 0) {
                selectedSkills.push(stat);
              }
            });
          }
          
          if (selectedSkills.length > 0) {
            await Quest.findByIdAndUpdate(quest._id, { 
              selectedSkills: selectedSkills 
            });
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back to LifeRPG! 🎮',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          level: user.level,
          xp: user.xp,
          stars: user.stars,
          stats: user.stats,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send original password via email
// @access  Public
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { email } = req.body;
    
    // Find user by email (include originalPassword field)
    const user = await User.findOne({ email }).select('+originalPassword');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with that email address'
      });
    }

    // Send email with original password
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'LifeRPG - Your Password Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a;">
          <div style="background-color: #2d2d2d; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #9333ea; font-size: 24px; margin-bottom: 20px;">🎮 LifeRPG</h1>
            <h2 style="color: #ffffff; font-size: 20px; margin-bottom: 20px;">Password Recovery</h2>
            <p style="color: #b8b8b8; font-size: 16px; line-height: 1.5;">
              Hi ${user.username},<br><br>
              You requested your password for LifeRPG. Your current password is:<br><br>
              <div style="background-color: #1a1a1a; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 18px; color: #00ff00; border: 2px solid #00ff00; display: inline-block; margin: 10px 0;">
                ${user.originalPassword}
              </div>
              <br><br>
              <strong style="color: #ff6b6b;">Please keep this password secure and do not share it with anyone.</strong>
            </p>
            <p style="color: #666666; font-size: 14px; margin-top: 30px;">
              If you didn't request this, please secure your account immediately.
            </p>
            <p style="color: #9333ea; font-size: 16px; margin-top: 20px;">
              🎯 Keep leveling up your life!<br>
              🚀 The LifeRPG Team
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Your password has been sent to your email address'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password recovery',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
