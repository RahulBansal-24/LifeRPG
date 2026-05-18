import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingBag, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MarketplacePage = () => {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const [tempCategory, setTempCategory] = useState('All');
  const [tempStatus, setTempStatus] = useState('All');

  const categories = ['All', 'Books', 'Courses', 'Clothing', 'Sports', 'Food', 'Travel', 'Gaming', 'Electronics', 'Fitness', 'Lifestyle'];

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    filterCoupons();
  }, [coupons, searchTerm, selectedCategory, selectedStatus]);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get('/api/coupons');
      setCoupons(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setLoading(false);
    }
  };

  const filterCoupons = () => {
    let filtered = [...coupons];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(coupon =>
        coupon.couponName.toLowerCase().includes(searchLower) ||
        coupon.brandName.toLowerCase().includes(searchLower) ||
        coupon.category.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(coupon => coupon.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus === 'active') {
      filtered = filtered.filter(coupon => coupon.isActive);
    } else if (selectedStatus === 'expired') {
      filtered = filtered.filter(coupon => !coupon.isActive);
    }

    setFilteredCoupons(filtered);
  };

  const handleApplyFilters = () => {
    setSearchTerm(tempSearchTerm);
    setSelectedCategory(tempCategory);
    setSelectedStatus(tempStatus);
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setTempSearchTerm('');
    setTempCategory('All');
    setTempStatus('All');
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setShowFilterModal(false);
  };

  const handleCouponClick = (coupon) => {
    setSelectedCoupon(coupon);
    setShowDetailModal(true);
  };

  const getRarityColor = (type) => {
    const colors = {
      'Basic': 'bg-gray-500',
      'Smart Save': 'bg-blue-500',
      'Hot Deal': 'bg-orange-500',
      'Premium': 'bg-purple-500',
      'Ultra Premium': 'bg-pink-500',
      'Ultimate Deal': 'bg-yellow-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gaming-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent mb-2">
            Arcane Market
          </h1>
          <p className="text-gray-400">Discover exclusive deals with your LifeRPG coins</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search coupons, brands, categories..."
              value={tempSearchTerm}
              onChange={(e) => setTempSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-purple text-white placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gaming-card border border-gaming-border rounded-lg hover:border-neon-purple transition-all duration-200"
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
          <button
            onClick={fetchCoupons}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gaming-card border border-gaming-border rounded-lg hover:border-neon-purple transition-all duration-200"
          >
            <RefreshCw size={20} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Active Filters Display */}
        {(selectedCategory !== 'All' || selectedStatus !== 'All') && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategory !== 'All' && (
              <span className="px-3 py-1 bg-neon-purple bg-opacity-20 text-neon-purple rounded-full text-sm">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="ml-2 hover:text-white"
                >
                  ×
                </button>
              </span>
            )}
            {selectedStatus !== 'All' && (
              <span className="px-3 py-1 bg-neon-purple bg-opacity-20 text-neon-purple rounded-full text-sm">
                Status: {selectedStatus}
                <button
                  onClick={() => setSelectedStatus('All')}
                  className="ml-2 hover:text-white"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400">Loading coupons...</div>
          </div>
        ) : (
          /* Coupon Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCoupons.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <ShoppingBag size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400 text-lg">No coupons found</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredCoupons.map((coupon) => (
                <motion.div
                  key={coupon._id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleCouponClick(coupon)}
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
                    {coupon.image ? (
                      <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                        <img src={coupon.image} alt={coupon.couponName} className="w-full h-full object-cover" />
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

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gaming-card border border-gaming-border rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-xl font-bold mb-4">Filter Coupons</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={tempCategory}
                onChange={(e) => setTempCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg focus:outline-none focus:border-neon-purple text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Availability</label>
              <select
                value={tempStatus}
                onChange={(e) => setTempStatus(e.target.value)}
                className="w-full px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg focus:outline-none focus:border-neon-purple text-white"
              >
                <option value="All">All</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleResetFilters}
                className="flex-1 px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg hover:bg-gaming-border transition-all duration-200"
              >
                Reset
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 px-4 py-2 bg-neon-purple border border-neon-purple rounded-lg hover:bg-neon-purple hover:bg-opacity-80 transition-all duration-200"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Coupon Detail Modal */}
      {showDetailModal && selectedCoupon && (
        <CouponDetailModal
          coupon={selectedCoupon}
          user={user}
          onClose={() => setShowDetailModal(false)}
          onRedeem={fetchCoupons}
        />
      )}
    </div>
  );
};

const CouponDetailModal = ({ coupon, user, onClose, onRedeem }) => {
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  const handleRedeem = async () => {
    if (!user || user.coins < coupon.cost) {
      alert('Insufficient coins!');
      return;
    }

    setRedeeming(true);
    try {
      const response = await axios.post(`/api/coupons/${coupon._id}/redeem`);
      if (response.data.success) {
        setRedeemed(true);
        setCouponCode(response.data.data.couponCode);
        onRedeem();
      }
    } catch (error) {
      console.error('Error redeeming coupon:', error);
      alert(error.response?.data?.message || 'Failed to redeem coupon');
    }
    setRedeeming(false);
  };

  const getRarityColor = (type) => {
    const colors = {
      'Basic': 'bg-gray-500',
      'Smart Save': 'bg-blue-500',
      'Hot Deal': 'bg-orange-500',
      'Premium': 'bg-purple-500',
      'Ultra Premium': 'bg-pink-500',
      'Ultimate Deal': 'bg-yellow-500'
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
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Image */}
        {coupon.image ? (
          <img src={coupon.image} alt={coupon.couponName} className="w-full h-48 object-cover rounded-lg mb-4" />
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

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Details</h3>
          <p className="text-gray-300">{coupon.details}</p>
        </div>

        {redeemed ? (
          <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-4 mb-4">
            <p className="text-green-400 font-semibold mb-2">Coupon Redeemed!</p>
            <div className="bg-white bg-opacity-10 border-2 border-dashed border-green-400 rounded-lg p-4 text-center">
              <p className="text-green-400 text-xl font-mono font-bold">{couponCode}</p>
            </div>
          </div>
        ) : (
          <button
            onClick={handleRedeem}
            disabled={!coupon.isActive || redeeming || !user || user.coins < coupon.cost}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
              !coupon.isActive
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : redeeming
                ? 'bg-gray-600 text-gray-400 cursor-wait'
                : !user || user.coins < coupon.cost
                ? 'bg-red-600 text-gray-300 cursor-not-allowed'
                : 'bg-neon-purple hover:bg-neon-purple hover:bg-opacity-80 text-white'
            }`}
          >
            {!coupon.isActive
              ? 'Expired'
              : redeeming
              ? 'Redeeming...'
              : !user || user.coins < coupon.cost
              ? `Insufficient Coins (Need ${coupon.cost})`
              : `Redeem for ${coupon.cost} Coins`}
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default MarketplacePage;
