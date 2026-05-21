const express = require('express');
const { body, validationResult } = require('express-validator');
const Company = require('../models/Company');
const Coupon = require('../models/Coupon');
const CouponRedemption = require('../models/CouponRedemption');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const router = express.Router();

// Configure multer for image uploads (memory storage for database)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Company middleware for JWT authentication
const companyAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token, access denied'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const company = await Company.findById(decoded.id);
    
    if (!company) {
      return res.status(401).json({
        success: false,
        message: 'Company not found, authentication failed'
      });
    }
    
    req.company = company;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

// @route   POST /api/company/signup
// @desc    Register a new company
// @access  Public
router.post('/signup', [
  body('companyName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
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

    const { companyName, email, password, logo } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Company with this email already exists'
      });
    }

    // Create company
    const company = await Company.create({
      companyName,
      email,
      password,
      originalPassword: password,
      logo: logo || '🏢'
    });

    // Generate JWT token
    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      success: true,
      message: 'Company registered successfully!',
      data: {
        company,
        token
      }
    });
  } catch (error) {
    console.error('Company signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while registering company',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/company/login
// @desc    Login company
// @access  Public
router.post('/login', [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email'),
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

    // Find company and include password
    const company = await Company.findOne({ email }).select('+password');
    if (!company) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await company.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: {
        company,
        token
      }
    });
  } catch (error) {
    console.error('Company login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while logging in',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/company/dashboard
// @desc    Get company dashboard stats
// @access  Private (Company)
router.get('/dashboard', companyAuth, async (req, res) => {
  try {
    const companyId = req.company._id;
    
    // Get coupon stats - exclude deleted coupons
    const totalCoupons = await Coupon.countDocuments({ companyId, isDeleted: false });
    const activeCoupons = await Coupon.countDocuments({ companyId, isActive: true, isDeleted: false });
    const expiredCoupons = await Coupon.countDocuments({ companyId, isActive: false, isDeleted: false });
    
    // Get total redemptions
    const totalRedemptions = await CouponRedemption.countDocuments({ companyId });
    
    // Get redemption timeline data
    const redemptionsByDate = await CouponRedemption.aggregate([
      { $match: { companyId } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalCoupons,
        activeCoupons,
        expiredCoupons,
        totalRedemptions,
        timeline: redemptionsByDate.map(item => ({
          date: item._id,
          count: item.count
        }))
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/company/coupons
// @desc    Get all coupons for company
// @access  Private (Company)
router.get('/coupons', companyAuth, async (req, res) => {
  try {
    const companyId = req.company._id;
    const { search, status } = req.query;
    
    // Build filter object - exclude deleted coupons
    let filter = { companyId, isDeleted: false };
    
    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'expired') {
      filter.isActive = false;
    }
    
    // Search functionality
    let coupons;
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      coupons = await Coupon.find({
        ...filter,
        $or: [
          { couponName: searchRegex },
          { brandName: searchRegex }
        ]
      }).sort({ createdAt: -1 });
    } else {
      coupons = await Coupon.find(filter).sort({ createdAt: -1 });
    }
    
    res.status(200).json({
      success: true,
      data: coupons,
      count: coupons.length
    });
  } catch (error) {
    console.error('Get company coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching coupons',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/company/coupons
// @desc    Create new coupon
// @access  Private (Company)
router.post('/coupons', companyAuth, upload.single('image'), async (req, res) => {
  try {
    const { couponName, type, category, details, couponCode } = req.body;
    const companyId = req.company._id;
    const brandName = req.company.companyName;
    
    // Validation
    if (!couponName || couponName.length < 2 || couponName.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Coupon name must be between 2 and 100 characters'
      });
    }
    
    if (!['Basic', 'Smart Save', 'Hot Deal', 'Premium', 'Ultra Premium', 'Ultimate Deal'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon type'
      });
    }
    
    if (!['Books', 'Courses', 'Clothing', 'Sports', 'Food', 'Travel', 'Gaming', 'Electronics', 'Fitness', 'Lifestyle'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }
    
    if (!details || details.length < 10 || details.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Details must be between 10 and 500 characters'
      });
    }
    
    if (!couponCode || couponCode.length < 4 || couponCode.length > 20) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code must be between 4 and 20 characters'
      });
    }
    
    // Auto-assign cost based on type
    const costMap = {
      'Basic': 2000,
      'Smart Save': 3000,
      'Hot Deal': 4000,
      'Premium': 6000,
      'Ultra Premium': 8000,
      'Ultimate Deal': 10000
    };
    
    const cost = costMap[type] || 2000;
    
    // Handle image if provided
    let imageData = null;
    let imageContentType = null;
    
    if (req.file) {
      imageData = req.file.buffer;
      imageContentType = req.file.mimetype;
      console.log('Coupon image received:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        buffer: 'Yes'
      });
      console.log('Image stored successfully, buffer size:', imageData.length);
    }
    
    // Create coupon
    const coupon = await Coupon.create({
      companyId,
      couponName,
      type,
      category,
      cost,
      details,
      couponCode: couponCode.toUpperCase(),
      brandName,
      imageData,
      imageContentType,
      isActive: true
    });
    
    res.status(201).json({
      success: true,
      message: 'Coupon created successfully!',
      data: coupon
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating coupon',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/company/coupons/:id/expire
// @desc    Mark coupon as expired
// @access  Private (Company)
router.put('/coupons/:id/expire', companyAuth, async (req, res) => {
  try {
    const couponId = req.params.id;
    const companyId = req.company._id;
    
    // Find coupon
    const coupon = await Coupon.findOne({ _id: couponId, companyId });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    // Mark as expired
    coupon.isActive = false;
    await coupon.save();
    
    res.status(200).json({
      success: true,
      message: 'Coupon marked as expired',
      data: coupon
    });
  } catch (error) {
    console.error('Expire coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while expiring coupon',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/company/coupons/:id
// @desc    Delete coupon (soft delete - keeps for redeemed users)
// @access  Private (Company)
router.delete('/coupons/:id', companyAuth, async (req, res) => {
  try {
    const couponId = req.params.id;
    const companyId = req.company._id;
    
    // Find coupon
    const coupon = await Coupon.findOne({ _id: couponId, companyId });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    // Soft delete - mark as deleted instead of removing
    // This keeps the coupon for users who have already redeemed it
    coupon.isDeleted = true;
    await coupon.save();
    
    console.log(`Coupon ${couponId} soft deleted, kept for redeemed users`);
    
    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting coupon',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/company/coupons/:id/image
// @desc    Get coupon image
// @access  Public
router.get('/coupons/:id/image', async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Handle database storage
    if (coupon.imageData && coupon.imageContentType) {
      res.set('Content-Type', coupon.imageContentType);
      res.send(coupon.imageData);
    }
    // No image found
    else {
      return res.status(404).json({
        success: false,
        message: 'Coupon has no image'
      });
    }
  } catch (error) {
    console.error('Get coupon image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
