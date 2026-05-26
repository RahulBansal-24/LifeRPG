import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, ShoppingBag, Clock, Upload, Image as ImageIcon, X, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useCompanyAuth } from '../../context/CompanyAuthContext';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import toast from 'react-hot-toast';
import { playSound } from '../../utils/sounds';
import '../MarketplacePage.css';

const CompanyCouponsPage = () => {
  const { company } = useCompanyAuth();
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    filterCoupons();
  }, [coupons, searchTerm, selectedStatus]);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('companyToken');
      const response = await axios.get('/api/company/coupons', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoupons(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setLoading(false);
    }
  };

  const filterCoupons = () => {
    let filtered = [...coupons];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(coupon =>
        coupon.couponName.toLowerCase().includes(searchLower) ||
        coupon.brandName.toLowerCase().includes(searchLower)
      );
    }

    if (selectedStatus === 'active') {
      filtered = filtered.filter(coupon => coupon.isActive);
    } else if (selectedStatus === 'expired') {
      filtered = filtered.filter(coupon => !coupon.isActive);
    }

    setFilteredCoupons(filtered);
  };

  const handleExpireCoupon = async (couponId) => {
    try {
      const token = localStorage.getItem('companyToken');
      await axios.put(`/api/company/coupons/${couponId}/expire`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCoupons();
    } catch (error) {
      console.error('Error expiring coupon:', error);
      alert('Failed to expire coupon');
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      const token = localStorage.getItem('companyToken');
      await axios.delete(`/api/company/coupons/${couponId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCoupons();
      toast.success('Coupon deleted successfully');
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon');
    }
  };

  const getRarityColor = (type) => {
    const colors = {
      'Basic': 'bg-gray-500',
      'Smart Save': 'bg-blue-500',
      'Hot Deal': 'bg-orange-500',
      'Premium': 'bg-purple-500',
      'Ultra Premium': 'ultra-premium-tag',
      'Ultimate Deal': 'ultimate-deal-tag'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gaming-dark text-white">
      {/* Header */}
      <div className="bg-gaming-card border-b border-gaming-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="text-3xl"
              >
                💰
              </motion.div>
              <div>
                <h1 className="text-xl font-orbitron font-bold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
                  Enterprise Portal
                </h1>
                <p className="text-sm text-gray-400">{company?.companyName}</p>
              </div>
            </div>
            <button
              onClick={() => {
                playSound('click');
                navigate('/enterprise/dashboard');
              }}
              className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gaming-border rounded-lg transition-all duration-200"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Coupon Management</h2>
          <button
            onClick={() => {
              playSound('click');
              setShowAddModal(true);
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-neon-purple hover:bg-neon-purple hover:bg-opacity-80 border border-neon-purple rounded-lg transition-all duration-200"
          >
            <Plus size={20} />
            <span>Add Coupon</span>
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-purple text-white placeholder-gray-400"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-purple text-white"
          >
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Coupon Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400">Loading coupons...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCoupons.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <ShoppingBag size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400 text-lg">No coupons found</p>
                <button
                  onClick={() => {
                    playSound('click');
                    setShowAddModal(true);
                  }}
                  className="mt-4 px-6 py-3 bg-neon-purple hover:bg-neon-purple hover:bg-opacity-80 border border-neon-purple rounded-lg transition-all duration-200"
                >
                  Create Your First Coupon
                </button>
              </div>
            ) : (
              filteredCoupons.map((coupon) => (
                <motion.div
                  key={coupon._id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    playSound('click');
                    setSelectedCoupon(coupon);
                    setShowDetailModal(true);
                  }}
                  className="bg-gaming-card border border-gaming-border rounded-xl overflow-hidden cursor-pointer hover:border-neon-purple transition-all duration-200"
                >
                  {/* Rarity Badge */}
                  <div className="relative">
                    <div className={`absolute top-3 left-3 px-2 py-1 ${getRarityColor(coupon.type)} text-white text-xs font-semibold rounded-md`}>
                      {coupon.type}
                    </div>
                    <div className="absolute top-3 right-3 flex items-center space-x-1 bg-gaming-darker px-2 py-1 rounded-md">
                      <span className="text-yellow-400">🪙</span>
                      <span className="text-yellow-400 font-bold text-sm">{coupon.cost}</span>
                    </div>
                    
                    {/* Image or Placeholder */}
                    {coupon.imageData ? (
                      <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                        <img src={`/api/company/coupons/${coupon._id}/image`} alt={coupon.couponName} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gaming-darker to-gaming-card flex items-center justify-center">
                        <ShoppingBag size={48} className="text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1 truncate">{coupon.couponName}</h3>
                    <p className="text-sm text-gray-400 mb-2">{coupon.brandName}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{coupon.category}</span>
                      {!coupon.isActive && (
                        <span className="text-xs text-red-400">Expired</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Coupon Modal */}
      {showAddModal && (
        <AddCouponModal
          onClose={() => setShowAddModal(false)}
          onCouponAdded={fetchCoupons}
        />
      )}

      {/* Coupon Detail Modal */}
      {showDetailModal && selectedCoupon && (
        <CouponDetailModal
          coupon={selectedCoupon}
          onClose={() => setShowDetailModal(false)}
          onExpire={handleExpireCoupon}
          onDelete={handleDeleteCoupon}
        />
      )}
    </div>
  );
};

const AddCouponModal = ({ onClose, onCouponAdded }) => {
  const [formData, setFormData] = useState({
    couponName: '',
    type: 'Basic',
    category: 'Books',
    details: '',
    couponCode: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [processedImage, setProcessedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Create cropped image using canvas
  const createCroppedImage = useCallback(async (imageSrc, croppedAreaPixels) => {
    const image = new Image();
    image.src = imageSrc;
    
    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas to exact final dimensions (16:9 ratio)
        canvas.width = 1200;
        canvas.height = 675;
        
        // Calculate scale factor between displayed image and original image
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        
        // Map cropped area coordinates to original image dimensions
        const originalX = croppedAreaPixels.x * scaleX;
        const originalY = croppedAreaPixels.y * scaleY;
        const originalWidth = croppedAreaPixels.width * scaleX;
        const originalHeight = croppedAreaPixels.height * scaleY;
        
        // Draw cropped area from original image to final dimensions
        ctx.drawImage(
          image,
          originalX,
          originalY,
          originalWidth,
          originalHeight,
          0,
          0,
          1200,
          675
        );
        
        // Convert to blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.8);
      };
    });
  }, []);

  // Handle crop complete
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Generate processed image when crop changes
  useEffect(() => {
    if (imagePreview && croppedAreaPixels) {
      createCroppedImage(imagePreview, croppedAreaPixels).then((blob) => {
        setProcessedImage(blob);
      });
    }
  }, [imagePreview, croppedAreaPixels, createCroppedImage]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    setImageFile(file);
    setProcessedImage(null);
    setCrop({ x: 0, y: 0 });
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('companyToken');
      const formDataToSend = new FormData();
      formDataToSend.append('couponName', formData.couponName);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('details', formData.details);
      formDataToSend.append('couponCode', formData.couponCode);
      
      if (processedImage) {
        const processedFile = new File([processedImage], 'cropped-image.jpg', {
          type: 'image/jpeg'
        });
        formDataToSend.append('image', processedFile);
      }

      await axios.post('/api/company/coupons', formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      onCouponAdded();
      onClose();
      toast.success('Coupon created successfully!');
      playSound('create');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gaming-card border border-gaming-border rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Coupon</h2>
          <button onClick={() => {
            playSound('click');
            onClose();
          }} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Coupon Name</label>
            <input
              type="text"
              value={formData.couponName}
              onChange={(e) => setFormData({ ...formData, couponName: e.target.value })}
              required
              className="w-full px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg focus:outline-none focus:border-neon-purple text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Coupon Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg focus:outline-none focus:border-neon-purple text-white"
            >
              <option value="Basic">Basic (2000 coins)</option>
              <option value="Smart Save">Smart Save (3000 coins)</option>
              <option value="Hot Deal">Hot Deal (4000 coins)</option>
              <option value="Premium">Premium (6000 coins)</option>
              <option value="Ultra Premium">Ultra Premium (8000 coins)</option>
              <option value="Ultimate Deal">Ultimate Deal (10000 coins)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg focus:outline-none focus:border-neon-purple text-white"
            >
              <option value="Books">Books</option>
              <option value="Courses">Courses</option>
              <option value="Clothing">Clothing</option>
              <option value="Sports">Sports</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Gaming">Gaming</option>
              <option value="Electronics">Electronics</option>
              <option value="Fitness">Fitness</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Details</label>
            <textarea
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg focus:outline-none focus:border-neon-purple text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Coupon Code</label>
            <input
              type="text"
              value={formData.couponCode}
              onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
              required
              className="w-full px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg focus:outline-none focus:border-neon-purple text-white"
              placeholder="ENTERCODE"
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium mb-2">Coupon Image (Optional)</label>
            {!imagePreview ? (
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="couponImageUpload"
                />
                <label
                  htmlFor="couponImageUpload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gaming-border rounded-lg cursor-pointer hover:border-neon-purple transition-all duration-200 bg-gaming-darker"
                >
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <span className="text-gray-400 text-sm">Click to upload image</span>
                  <span className="text-gray-500 text-xs mt-1">Optional - Max 5MB</span>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative h-64 bg-gaming-darker rounded-lg overflow-hidden">
                  <Cropper
                    image={imagePreview}
                    crop={crop}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    aspect={16 / 9}
                    cropShape="rect"
                    showGrid={false}
                    style={{ containerStyle: { height: '100%' } }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setImageFile(null);
                    setImagePreview('');
                    setProcessedImage(null);
                    setCrop({ x: 0, y: 0 });
                    setCroppedAreaPixels(null);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-600 hover:bg-opacity-80 border border-red-600 rounded-lg transition-all duration-200"
                >
                  <X size={16} />
                  <span>Remove Image</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => {
                playSound('click');
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg hover:bg-gaming-border transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-neon-purple hover:bg-neon-purple hover:bg-opacity-80 border border-neon-purple rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const CouponDetailModal = ({ coupon, onClose, onExpire, onDelete }) => {
  const getRarityColor = (type) => {
    const colors = {
      'Basic': 'bg-gray-500',
      'Smart Save': 'bg-blue-500',
      'Hot Deal': 'bg-orange-500',
      'Premium': 'bg-purple-500',
      'Ultra Premium': 'ultra-premium-tag',
      'Ultimate Deal': 'ultimate-deal-tag'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gaming-card border border-gaming-border rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-4">
          <div className={`px-3 py-1 ${getRarityColor(coupon.type)} text-white text-sm font-semibold rounded-md`}>
            {coupon.type}
          </div>
          <button onClick={() => {
            playSound('click');
            onClose();
          }} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {/* Image */}
        {coupon.imageData ? (
          <img src={`/api/company/coupons/${coupon._id}/image`} alt={coupon.couponName} className="w-full h-48 object-cover rounded-lg mb-4" />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gaming-darker to-gaming-card rounded-lg mb-4 flex items-center justify-center">
            <ShoppingBag size={48} className="text-gray-600" />
          </div>
        )}

        <h2 className="text-2xl font-bold mb-2">{coupon.couponName}</h2>
        <p className="text-gray-400 mb-4">{coupon.brandName}</p>

        <div className="flex items-center space-x-2 mb-4">
          <span className="text-yellow-400 text-2xl">🪙</span>
          <span className="text-yellow-400 text-2xl font-bold">{coupon.cost}</span>
        </div>

        <div className="mb-4">
          <span className="text-sm text-gray-400">Category: {coupon.category}</span>
        </div>

        <div className="mb-4">
          <span className="text-sm text-gray-400">Purchases: {coupon.redemptionCount}</span>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Details</h3>
          <p className="text-gray-300">{coupon.details}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Coupon Code</h3>
          <div className="bg-white bg-opacity-10 border-2 border-dashed border-neon-purple rounded-lg p-4 text-center">
            <p className="text-neon-purple text-xl font-mono font-bold">{coupon.couponCode}</p>
          </div>
        </div>

        {coupon.isActive && (
          <button
            onClick={() => {
              playSound('click');
              if (confirm('Are you sure you want to mark this coupon as expired?')) {
                onExpire(coupon._id);
                onClose();
              }
            }}
            className="w-full py-3 bg-red-600 hover:bg-red-600 hover:bg-opacity-80 border border-red-600 rounded-lg font-semibold transition-all duration-200"
          >
            Mark as Expired
          </button>
        )}

        <button
          onClick={() => {
            playSound('click');
            if (confirm('Are you sure you want to delete this coupon? This action cannot be undone.')) {
              onDelete(coupon._id);
              onClose();
            }
          }}
          className="w-full py-3 mt-3 bg-gray-700 hover:bg-gray-700 hover:bg-opacity-80 border border-gray-600 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Trash2 size={16} />
          <span>Delete Coupon</span>
        </button>
      </motion.div>
    </div>
  );
};

export default CompanyCouponsPage;
