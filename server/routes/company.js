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

// Helper function to generate purchase timeline based on filter
async function generatePurchaseTimeline(companyId, filter, companyCreatedAt) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();
  
  let timelineData = [];
  
  if (filter === 'daily') {
    // Daily view: Current month only, days 1 to current date
    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth, currentDate, 23, 59, 59, 999);
    
    // Get actual purchase data for current month
    const purchaseData = await CouponRedemption.aggregate([
      { 
        $match: { 
          companyId,
          createdAt: { $gte: startDate, $lte: endDate }
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const purchaseMap = new Map(purchaseData.map(p => [p._id, p.count]));
    
    // Generate timeline for days 1 to current date
    for (let day = 1; day <= currentDate; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const value = purchaseMap.get(dateStr) ?? 0; // Use 0 for no events, no forward-fill
      timelineData.push({ date: dateStr, count: value });
    }
    
  } else if (filter === 'monthly') {
    // Monthly view: January to current month
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, currentMonth, currentDate, 23, 59, 59, 999);
    
    // Get actual purchase data for all months
    const purchaseData = await CouponRedemption.aggregate([
      { 
        $match: { 
          companyId,
          createdAt: { $gte: startDate, $lte: endDate }
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const purchaseMap = new Map(purchaseData.map(p => [p._id, p.count]));
    
    // Generate timeline for January to current month
    for (let month = 0; month <= currentMonth; month++) {
      const monthStr = `${currentYear}-${String(month + 1).padStart(2, '0')}`;
      const value = purchaseMap.get(monthStr) ?? 0; // Use 0 for no events, no forward-fill
      timelineData.push({ date: monthStr, count: value });
    }
    
  } else if (filter === 'yearly') {
    // Yearly view: Company creation year to current year
    const startYear = companyCreatedAt.getFullYear();
    const startDate = new Date(startYear, 0, 1);
    const endDate = new Date(currentYear, currentMonth, currentDate, 23, 59, 59, 999);
    
    // Get actual purchase data for all years
    const purchaseData = await CouponRedemption.aggregate([
      { 
        $match: { 
          companyId,
          createdAt: { $gte: startDate, $lte: endDate }
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const purchaseMap = new Map(purchaseData.map(p => [p._id, p.count]));
    
    // Generate timeline from creation year to current year
    for (let year = startYear; year <= currentYear; year++) {
      const yearStr = year.toString();
      const value = purchaseMap.get(yearStr) ?? 0; // Use 0 for no events, no forward-fill
      timelineData.push({ date: yearStr, count: value });
    }
  }
  
  return timelineData;
}

// Helper function to generate coupon analytics based on filter
async function generateCouponAnalytics(companyId, filter, companyCreatedAt) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();
  
  let analyticsData = [];
  
  // Get all coupons with their status and creation dates
  const allCoupons = await Coupon.find({ companyId, isDeleted: false })
    .select('createdAt isActive expiredAt')
    .lean();
  
  if (filter === 'daily') {
    // Daily view: Current month only, days 1 to current date
    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth, currentDate, 23, 59, 59, 999);
    
    // Aggregate purchases by day
    const purchaseData = await CouponRedemption.aggregate([
      { 
        $match: { 
          companyId,
          createdAt: { $gte: startDate, $lte: endDate }
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          purchases: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const purchaseMap = new Map(purchaseData.map(p => [p._id, p.purchases]));
    
    // Generate timeline for days 1 to current date
    for (let day = 1; day <= currentDate; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dateStartOfDay = new Date(currentYear, currentMonth, day, 0, 0, 0, 0);
      const dateEndOfDay = new Date(currentYear, currentMonth, day, 23, 59, 59, 999);
      
      // Count active coupons on this day (coupons that were active during this day)
      let activeCount = 0;
      let expiredCount = 0;
      
      for (const coupon of allCoupons) {
        const createdDate = new Date(coupon.createdAt);
        
        // Count expired coupons that expired on this day (event-based)
        if (coupon.expiredAt) {
          const expiredDate = new Date(coupon.expiredAt);
          if (expiredDate >= dateStartOfDay && expiredDate <= dateEndOfDay) {
            expiredCount++;
          }
        }
        
        // Count active coupons on this day (state-based)
        // Coupon was active on this day if:
        // - It was created before or on this day
        // - AND (it's currently active OR it expired after this day)
        if (createdDate <= dateEndOfDay) {
          if (coupon.isActive || (coupon.expiredAt && new Date(coupon.expiredAt) > dateEndOfDay)) {
            activeCount++;
          }
        }
      }
      
      // Get purchases for this day (event-based, no forward-fill)
      const purchases = purchaseMap.get(dateStr) ?? 0;
      
      analyticsData.push({
        date: dateStr,
        active: activeCount,
        expired: expiredCount,
        purchases: purchases
      });
    }
    
  } else if (filter === 'monthly') {
    // Monthly view: January to current month
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, currentMonth, currentDate, 23, 59, 59, 999);
    
    // Aggregate purchases by month
    const purchaseData = await CouponRedemption.aggregate([
      { 
        $match: { 
          companyId,
          createdAt: { $gte: startDate, $lte: endDate }
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' }
          },
          purchases: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const purchaseMap = new Map(purchaseData.map(p => [p._id, p.purchases]));
    
    // Generate timeline for January to current month
    for (let month = 0; month <= currentMonth; month++) {
      const monthStr = `${currentYear}-${String(month + 1).padStart(2, '0')}`;
      const monthStart = new Date(currentYear, month, 1, 0, 0, 0, 0);
      const monthEnd = new Date(currentYear, month + 1, 0, 23, 59, 59, 999);
      
      // Count active and expired coupons during this month
      let activeCount = 0;
      let expiredCount = 0;
      
      for (const coupon of allCoupons) {
        const createdDate = new Date(coupon.createdAt);
        
        // Count expired coupons that expired during this month (event-based)
        if (coupon.expiredAt) {
          const expiredDate = new Date(coupon.expiredAt);
          if (expiredDate >= monthStart && expiredDate <= monthEnd) {
            expiredCount++;
          }
        }
        
        // Count active coupons during this month (state-based)
        // Coupon was active during this month if:
        // - It was created before end of month
        // - AND (it's currently active OR it expired after end of month)
        if (createdDate <= monthEnd) {
          if (coupon.isActive || (coupon.expiredAt && new Date(coupon.expiredAt) > monthEnd)) {
            activeCount++;
          }
        }
      }
      
      // Get purchases for this month (event-based, no forward-fill)
      const purchases = purchaseMap.get(monthStr) ?? 0;
      
      analyticsData.push({
        date: monthStr,
        active: activeCount,
        expired: expiredCount,
        purchases: purchases
      });
    }
    
  } else if (filter === 'yearly') {
    // Yearly view: Company creation year to current year
    const startYear = companyCreatedAt.getFullYear();
    const startDate = new Date(startYear, 0, 1);
    const endDate = new Date(currentYear, currentMonth, currentDate, 23, 59, 59, 999);
    
    // Aggregate purchases by year
    const purchaseData = await CouponRedemption.aggregate([
      { 
        $match: { 
          companyId,
          createdAt: { $gte: startDate, $lte: endDate }
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y', date: '$createdAt' }
          },
          purchases: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const purchaseMap = new Map(purchaseData.map(p => [p._id, p.purchases]));
    
    // Generate timeline from creation year to current year
    for (let year = startYear; year <= currentYear; year++) {
      const yearStr = year.toString();
      const yearStart = new Date(year, 0, 1, 0, 0, 0, 0);
      const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);
      
      // Count active and expired coupons during this year
      let activeCount = 0;
      let expiredCount = 0;
      
      for (const coupon of allCoupons) {
        const createdDate = new Date(coupon.createdAt);
        
        // Count expired coupons that expired during this year (event-based)
        if (coupon.expiredAt) {
          const expiredDate = new Date(coupon.expiredAt);
          if (expiredDate >= yearStart && expiredDate <= yearEnd) {
            expiredCount++;
          }
        }
        
        // Count active coupons during this year (state-based)
        // Coupon was active during this year if:
        // - It was created before end of year
        // - AND (it's currently active OR it expired after end of year)
        if (createdDate <= yearEnd) {
          if (coupon.isActive || (coupon.expiredAt && new Date(coupon.expiredAt) > yearEnd)) {
            activeCount++;
          }
        }
      }
      
      // Get purchases for this year (event-based, no forward-fill)
      const purchases = purchaseMap.get(yearStr) ?? 0;
      
      analyticsData.push({
        date: yearStr,
        active: activeCount,
        expired: expiredCount,
        purchases: purchases
      });
    }
  }
  
  return analyticsData;
}

// @route   GET /api/company/dashboard
// @desc    Get company dashboard stats
// @access  Private (Company)
router.get('/dashboard', companyAuth, async (req, res) => {
  try {
    const companyId = req.company._id;
    const timelineFilter = req.query.timelineFilter || 'daily';
    const couponFilter = req.query.couponFilter || 'daily';
    
    // Get coupon stats - exclude deleted coupons
    const totalCoupons = await Coupon.countDocuments({ companyId, isDeleted: false });
    const activeCoupons = await Coupon.countDocuments({ companyId, isActive: true, isDeleted: false });
    const expiredCoupons = await Coupon.countDocuments({ companyId, isActive: false, isDeleted: false });
    
    // Get total redemptions
    const totalRedemptions = await CouponRedemption.countDocuments({ companyId });
    
    // Get company creation date
    const company = await Company.findById(companyId);
    const companyCreatedAt = company.createdAt;
    
    // Get purchase timeline data based on filter
    const timeline = await generatePurchaseTimeline(companyId, timelineFilter, companyCreatedAt);
    
    // Get coupon analytics data based on filter
    const couponAnalytics = await generateCouponAnalytics(companyId, couponFilter, companyCreatedAt);
    
    // Get top performing coupons (sorted by purchase count)
    const topCoupons = await Coupon.aggregate([
      { $match: { companyId, isDeleted: false } },
      {
        $lookup: {
          from: 'couponredemptions',
          localField: '_id',
          foreignField: 'couponId',
          as: 'redemptions'
        }
      },
      {
        $addFields: {
          purchaseCount: { $size: '$redemptions' },
          isActive: '$isActive'
        }
      },
      { $sort: { purchaseCount: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          couponName: 1,
          category: 1,
          purchaseCount: 1,
          isActive: 1
        }
      }
    ]);
    
    // Get recent purchases
    const recentPurchases = await CouponRedemption.aggregate([
      { $match: { companyId } },
      {
        $lookup: {
          from: 'coupons',
          localField: 'couponId',
          foreignField: '_id',
          as: 'coupon'
        }
      },
      { $unwind: '$coupon' },
      {
        $project: {
          _id: 1,
          couponName: '$coupon.couponName',
          createdAt: 1
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 10 }
    ]);
    
    // Format recent purchases with timestamps
    const formattedRecentPurchases = recentPurchases.map(purchase => ({
      _id: purchase._id,
      couponName: purchase.couponName,
      timestamp: formatTimestamp(purchase.createdAt)
    }));
    
    res.status(200).json({
      success: true,
      data: {
        totalCoupons,
        activeCoupons,
        expiredCoupons,
        totalRedemptions,
        timeline,
        topCoupons,
        recentPurchases: formattedRecentPurchases,
        couponAnalytics
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

// Helper function to format timestamp
function formatTimestamp(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(date).toLocaleDateString();
}

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
    
    // Mark as expired and set expiration timestamp
    coupon.isActive = false;
    coupon.expiredAt = new Date();
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

// @route   DELETE /api/company/delete
// @desc    Delete company account and all data (except purchased coupons)
// @access  Private (Company)
router.delete('/delete', companyAuth, async (req, res) => {
  try {
    const companyId = req.company._id;
    
    // Find all coupons for this company
    const coupons = await Coupon.find({ companyId });
    
    // For each coupon, check if it has been purchased
    for (const coupon of coupons) {
      const redemptionCount = await CouponRedemption.countDocuments({ couponId: coupon._id });
      
      if (redemptionCount > 0) {
        // Coupon has been purchased - soft delete it (mark as deleted but keep for users who purchased it)
        coupon.isDeleted = true;
        await coupon.save();
      } else {
        // Coupon has never been purchased - hard delete it
        await Coupon.findByIdAndDelete(coupon._id);
      }
    }
    
    // Delete the company account
    await Company.findByIdAndDelete(companyId);
    
    res.status(200).json({
      success: true,
      message: 'Enterprise account deleted successfully. All data has been removed except purchased coupons which remain accessible to users.'
    });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting enterprise account',
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
