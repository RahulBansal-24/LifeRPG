const mongoose = require('mongoose');

const couponRedemptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: [true, 'Coupon ID is required']
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required']
  },
  coinsSpent: {
    type: Number,
    required: [true, 'Coins spent is required'],
    min: 0
  },
  couponCode: {
    type: String,
    required: [true, 'Coupon code is required']
  }
}, {
  timestamps: true
});

// Ensure unique combination of user and coupon (prevent duplicate redemptions)
couponRedemptionSchema.index({ userId: 1, couponId: 1 }, { unique: true });

module.exports = mongoose.model('CouponRedemption', couponRedemptionSchema);
