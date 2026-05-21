const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const Coupon = require('../models/Coupon');
const CouponRedemption = require('../models/CouponRedemption');
const User = require('../models/User');
const Company = require('../models/Company');

const router = express.Router();

// @route   GET /api/coupons
// @desc    Get all coupons for marketplace (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, status } = req.query;
    
    // Build filter object - exclude deleted coupons
    let filter = { isDeleted: false };
    
    if (category) {
      filter.category = category;
    }
    
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
          { brandName: searchRegex },
          { category: searchRegex }
        ]
      }).populate('companyId', 'companyName logo').sort({ isActive: -1, createdAt: -1 });
    } else {
      coupons = await Coupon.find(filter)
        .populate('companyId', 'companyName logo')
        .sort({ isActive: -1, createdAt: -1 });
    }
    
    res.status(200).json({
      success: true,
      data: coupons,
      count: coupons.length
    });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching coupons',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/coupons/:id
// @desc    Get single coupon details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate('companyId', 'companyName logo');
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    // Check if user has already redeemed this coupon
    const userId = req.user._id;
    const redemption = await CouponRedemption.findOne({ userId, couponId: req.params.id });
    const isRedeemed = !!redemption;
    
    res.status(200).json({
      success: true,
      data: {
        ...coupon.toObject(),
        isRedeemed,
        redeemedCode: isRedeemed ? redemption.couponCode : null
      }
    });
  } catch (error) {
    console.error('Get coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching coupon',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/coupons/:id/redeem
// @desc    Redeem a coupon
// @access  Private
router.post('/:id/redeem', protect, async (req, res) => {
  try {
    const couponId = req.params.id;
    const userId = req.user._id;
    
    // Get coupon
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    // Check if coupon is active
    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has expired'
      });
    }
    
    // Check if user has already redeemed this coupon
    const existingRedemption = await CouponRedemption.findOne({ userId, couponId });
    if (existingRedemption) {
      return res.status(400).json({
        success: false,
        message: 'You have already redeemed this coupon'
      });
    }
    
    // Get user and check coin balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (user.coins < coupon.cost) {
      return res.status(400).json({
        success: false,
        message: `Insufficient coins. You need ${coupon.cost} coins but have ${user.coins}`,
        required: coupon.cost,
        current: user.coins
      });
    }
    
    // Deduct coins and create redemption record
    user.coins -= coupon.cost;
    await user.save();
    
    const redemption = await CouponRedemption.create({
      userId,
      couponId,
      companyId: coupon.companyId,
      coinsSpent: coupon.cost,
      couponCode: coupon.couponCode
    });
    
    // Increment coupon redemption count
    coupon.redemptionCount += 1;
    await coupon.save();
    
    res.status(200).json({
      success: true,
      message: `Coupon redeemed successfully! You spent ${coupon.cost} coins.`,
      data: {
        couponCode: coupon.couponCode,
        coinsRemaining: user.coins
      }
    });
  } catch (error) {
    console.error('Redeem coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while redeeming coupon',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/coupons/meta/categories
// @desc    Get all coupon categories
// @access  Private
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = ['Books', 'Courses', 'Clothing', 'Sports', 'Food', 'Travel', 'Gaming', 'Electronics', 'Fitness', 'Lifestyle'];
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/coupons/redeemed
// @desc    Get user's redeemed coupons (including deleted ones)
// @access  Private
router.get('/redeemed', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all redemptions for this user
    const redemptions = await CouponRedemption.find({ userId })
      .populate('couponId')
      .sort({ createdAt: -1 });
    
    // Extract coupon details from redemptions
    const redeemedCoupons = redemptions.map(redemption => {
      const coupon = redemption.couponId;
      return {
        _id: coupon._id,
        couponName: coupon.couponName,
        type: coupon.type,
        category: coupon.category,
        cost: coupon.cost,
        details: coupon.details,
        couponCode: redemption.couponCode,
        brandName: coupon.brandName,
        imageData: coupon.imageData,
        imageContentType: coupon.imageContentType,
        isActive: coupon.isActive,
        isDeleted: coupon.isDeleted || false,
        redeemedAt: redemption.createdAt,
        coinsSpent: redemption.coinsSpent
      };
    });
    
    res.status(200).json({
      success: true,
      data: redeemedCoupons,
      count: redeemedCoupons.length
    });
  } catch (error) {
    console.error('Get redeemed coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching redeemed coupons',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
