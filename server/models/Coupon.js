const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required']
  },
  couponName: {
    type: String,
    required: [true, 'Coupon name is required'],
    trim: true,
    minlength: [2, 'Coupon name must be at least 2 characters long'],
    maxlength: [100, 'Coupon name cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Coupon type is required'],
    enum: ['Basic', 'Smart Save', 'Hot Deal', 'Premium', 'Ultra Premium', 'Ultimate Deal']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Books', 'Courses', 'Clothing', 'Sports', 'Food', 'Travel', 'Gaming', 'Electronics', 'Fitness', 'Lifestyle']
  },
  cost: {
    type: Number,
    required: [true, 'Cost is required'],
    min: 0
  },
  details: {
    type: String,
    required: [true, 'Coupon details are required'],
    trim: true,
    maxlength: [500, 'Details cannot exceed 500 characters']
  },
  couponCode: {
    type: String,
    required: [true, 'Coupon code is required'],
    trim: true,
    uppercase: true,
    minlength: [4, 'Coupon code must be at least 4 characters long'],
    maxlength: [20, 'Coupon code cannot exceed 20 characters']
  },
  brandName: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true
  },
  imageData: {
    type: Buffer,
    default: null
  },
  imageContentType: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  redemptionCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Auto-assign cost based on type
couponSchema.pre('save', function(next) {
  const costMap = {
    'Basic': 2000,
    'Smart Save': 3000,
    'Hot Deal': 4000,
    'Premium': 6000,
    'Ultra Premium': 8000,
    'Ultimate Deal': 10000
  };
  
  // Only auto-assign cost if not explicitly set
  if (this.isModified('type') && !this.isModified('cost')) {
    this.cost = costMap[this.type] || 2000;
  }
  
  next();
});

module.exports = mongoose.model('Coupon', couponSchema);
