import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShoppingBag, RefreshCw, Copy, Check } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { playSound } from '../utils/sounds';
import './MarketplacePage.css';

const MarketplacePage = () => {
  const { user, updateUser } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRedemption, setSelectedRedemption] = useState('All');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const [tempCategory, setTempCategory] = useState('All');
  const [tempStatus, setTempStatus] = useState('All');
  const [tempRedemption, setTempRedemption] = useState('All');
  const [redeemedCoupons, setRedeemedCoupons] = useState([]);
  const [redeemedCouponsLoaded, setRedeemedCouponsLoaded] = useState(false);

  const categories = ['All', 'Books', 'Courses', 'Clothing', 'Sports', 'Food', 'Travel', 'Gaming', 'Electronics', 'Fitness', 'Lifestyle'];

  useEffect(() => {
    fetchCoupons();
    fetchRedeemedCoupons();
  }, []);

  useEffect(() => {
    filterCoupons();
  }, [coupons, searchTerm, selectedCategory, selectedStatus, selectedRedemption, redeemedCoupons]);

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

  const fetchRedeemedCoupons = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/coupons/redeemed', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRedeemedCoupons(response.data.data || []);
      setRedeemedCouponsLoaded(true);
    } catch (error) {
      console.error('Error fetching redeemed coupons:', error);
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

    // Redemption filter
    if (selectedRedemption === 'redeemed') {
      filtered = filtered.filter(coupon => redeemedCoupons.find(rc => rc._id === coupon._id));
    } else if (selectedRedemption === 'not_redeemed') {
      filtered = filtered.filter(coupon => !redeemedCoupons.find(rc => rc._id === coupon._id));
    }

    setFilteredCoupons(filtered);
  };

  const handleApplyFilters = () => {
    setSearchTerm(tempSearchTerm);
    setSelectedCategory(tempCategory);
    setSelectedStatus(tempStatus);
    setSelectedRedemption(tempRedemption);
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setTempSearchTerm('');
    setTempCategory('All');
    setTempStatus('All');
    setTempRedemption('All');
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedRedemption('All');
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
      'Ultra Premium': 'ultra-premium-tag',
      'Ultimate Deal': 'ultimate-deal-tag'
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
            {selectedRedemption !== 'All' && (
              <span className="px-3 py-1 bg-neon-purple bg-opacity-20 text-neon-purple rounded-full text-sm">
                Purchase: {selectedRedemption === 'redeemed' ? 'Purchased' : 'Not Purchased'}
                <button
                  onClick={() => setSelectedRedemption('All')}
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
              filteredCoupons.map((coupon) => {
                const isRedeemed = redeemedCoupons.find(rc => rc._id === coupon._id);
                return (
                <motion.div
                  key={coupon._id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleCouponClick(coupon)}
                  className="bg-gaming-card border border-gaming-border rounded-xl overflow-hidden cursor-pointer hover:border-neon-purple transition-all duration-200 relative"
                >
                  {/* Rarity Badge */}
                  <div className="relative">
                    <div className={`absolute top-3 left-3 px-2 py-1 ${getRarityColor(coupon.type)} text-white text-xs font-semibold rounded-md z-10`}>
                      {coupon.type}
                    </div>
                    <div className="absolute top-3 right-3 flex items-center space-x-1 bg-gaming-darker px-2 py-1 rounded-md z-10">
                      <span className="text-yellow-400">🪙</span>
                      <span className="text-yellow-400 font-bold text-sm">{coupon.cost}</span>
                    </div>

                    {/* Image or Placeholder */}
                    {coupon.imageData ? (
                      <div className="w-full h-48 bg-gray-800 flex items-center justify-center relative">
                        <img src={`/api/company/coupons/${coupon._id}/image`} alt={coupon.couponName} className="w-full h-full object-cover" />
                        {/* Redeemed Sash */}
                        {isRedeemed && (
                          <div className="absolute bottom-0 right-0 pointer-events-none z-10">
                            <div className="relative w-44 h-8">
                              {/* Single continuous ribbon */}
                              <div className="absolute inset-0 rounded-2xl shadow-2xl transform -rotate-45 origin-bottom-right backdrop-blur-xl translate-y-0 translate-x-5">
                                {/* Layer 1: Uniform bright ruby jelly base - single consistent color */}
                                <div className="absolute inset-0 rounded-2xl" style={{ background: 'rgba(255, 48, 72, 0.35)' }}></div>
                                
                                {/* Layer 2: Uniform ruby tint - luminous color inside gel */}
                                <div className="absolute inset-0 rounded-2xl" style={{ background: 'rgba(255, 48, 72, 0.18)' }}></div>
                                
                                {/* Layer 3: Large swollen glossy highlight - bulbous wet reflection */}
                                <div className="absolute inset-0 rounded-2xl" style={{ background: 'radial-gradient(ellipse at 25% 15%, rgba(255, 255, 255, 0.28), transparent 60%)' }}></div>
                                
                                {/* Layer 4: Soft inflated depth - thick volumetric gel */}
                                <div className="absolute inset-0 rounded-2xl" style={{ background: 'radial-gradient(ellipse at 75% 85%, rgba(255, 48, 72, 0.12), transparent 65%)' }}></div>
                                
                                {/* Layer 5: Curved wet highlight streak - flowing liquid reflection */}
                                <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(50deg, transparent 15%, rgba(255, 179, 188, 0.10) 30%, rgba(255, 255, 255, 0.16) 42%, rgba(255, 179, 188, 0.10) 54%, transparent 85%)' }}></div>
                                
                                {/* Layer 6: Internal ruby glow - glowing inside gel material */}
                                <div className="absolute inset-0 rounded-2xl" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255, 48, 72, 0.18), transparent 70%)' }}></div>
                                
                                {/* Layer 7: Soft edge glow - jelly-filled glowing edges */}
                                <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.22), transparent 45%, transparent 55%, rgba(0, 0, 0, 0.02))' }}></div>
                                
                                {/* Layer 8: Inner shadow - thick gel depth */}
                                <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: 'inset 0 3px 6px rgba(0, 0, 0, 0.08), inset 0 -3px 6px rgba(255, 255, 255, 0.08)' }}></div>
                                
                                {/* Layer 9: Liquid shimmer - flowing wet internal light */}
                                <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(105deg, transparent 10%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.08) 40%, rgba(255, 255, 255, 0.05) 55%, transparent 90%)' }}></div>
                                
                                {/* Layer 10: Soft gel border - rounded inflated edges */}
                                <div className="absolute inset-0 rounded-2xl" style={{ border: '1px solid rgba(255, 255, 255, 0.20)', boxShadow: 'inset 0 1px 3px rgba(255, 255, 255, 0.22), inset 0 -1px 3px rgba(0, 0, 0, 0.02)' }}></div>
                                
                                {/* Layer 11: Top highlight line - soft wet glossy */}
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/38 to-transparent"></div>
                                
                                {/* Layer 12: Bottom shadow line - soft */}
                                <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-black/08 rounded-b-2xl blur-[0.5px]"></div>
                                
                                {/* Text - inside sash, diagonal matching sash */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-white font-bold text-xs tracking-wider uppercase" style={{ textShadow: '0 0 16px rgba(255, 255, 255, 0.92), 0 0 32px rgba(255, 255, 255, 0.72), 0 1px 2px rgba(0, 0, 0, 0.18)' }}>Purchased</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gaming-darker to-gaming-card flex items-center justify-center relative">
                        <ShoppingBag size={48} className="text-gray-600" />
                        {/* Redeemed Sash */}
                        {isRedeemed && (
                          <div className="absolute bottom-0 right-0 pointer-events-none z-10">
                            <div className="relative w-44 h-8">
                              {/* Single continuous ribbon */}
                              <div className="absolute inset-0 rounded-2xl shadow-2xl transform -rotate-45 origin-bottom-right backdrop-blur-xl translate-y-0 translate-x-5">
                                {/* Layer 1: Uniform bright ruby jelly base - single consistent color */}
                                <div className="absolute inset-0 rounded-2xl" style={{ background: 'rgba(255, 48, 72, 0.35)' }}></div>
                                
                                {/* Layer 2: Uniform ruby tint - luminous color inside gel */}
                                <div className="absolute inset-0 rounded-2xl" style={{ background: 'rgba(255, 48, 72, 0.18)' }}></div>
                                
                                {/* Layer 3: Large swollen glossy highlight - bulbous wet reflection */}
                                <div className="absolute inset-0 rounded-2xl" style={{ background: 'radial-gradient(ellipse at 25% 15%, rgba(255, 255, 255, 0.28), transparent 60%)' }}></div>
                                
                                {/* Layer 4: Soft inflated depth - thick volumetric gel */}
                                <div className="absolute inset-0 rounded-2xl" style={{ background: 'radial-gradient(ellipse at 75% 85%, rgba(255, 48, 72, 0.12), transparent 65%)' }}></div>
                                
                                {/* Layer 5: Curved wet highlight streak - flowing liquid reflection */}
                                <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(50deg, transparent 15%, rgba(255, 179, 188, 0.10) 30%, rgba(255, 255, 255, 0.16) 42%, rgba(255, 179, 188, 0.10) 54%, transparent 85%)' }}></div>
                                
                                {/* Layer 6: Internal ruby glow - glowing inside gel material */}
                                <div className="absolute inset-0 rounded-2xl" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255, 48, 72, 0.18), transparent 70%)' }}></div>
                                
                                {/* Layer 7: Soft edge glow - jelly-filled glowing edges */}
                                <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.22), transparent 45%, transparent 55%, rgba(0, 0, 0, 0.02))' }}></div>
                                
                                {/* Layer 8: Inner shadow - thick gel depth */}
                                <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: 'inset 0 3px 6px rgba(0, 0, 0, 0.08), inset 0 -3px 6px rgba(255, 255, 255, 0.08)' }}></div>
                                
                                {/* Layer 9: Liquid shimmer - flowing wet internal light */}
                                <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(105deg, transparent 10%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.08) 40%, rgba(255, 255, 255, 0.05) 55%, transparent 90%)' }}></div>
                                
                                {/* Layer 10: Soft gel border - rounded inflated edges */}
                                <div className="absolute inset-0 rounded-2xl" style={{ border: '1px solid rgba(255, 255, 255, 0.20)', boxShadow: 'inset 0 1px 3px rgba(255, 255, 255, 0.22), inset 0 -1px 3px rgba(0, 0, 0, 0.02)' }}></div>
                                
                                {/* Layer 11: Top highlight line - soft wet glossy */}
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/38 to-transparent"></div>
                                
                                {/* Layer 12: Bottom shadow line - soft */}
                                <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-black/08 rounded-b-2xl blur-[0.5px]"></div>
                                
                                {/* Text - inside sash, diagonal matching sash */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-white font-bold text-xs tracking-wider uppercase" style={{ textShadow: '0 0 16px rgba(255, 255, 255, 0.92), 0 0 32px rgba(255, 255, 255, 0.72), 0 1px 2px rgba(0, 0, 0, 0.18)' }}>Purchased</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1 truncate">{coupon.couponName}</h3>
                    <p className="text-sm text-gray-400 mb-2">{coupon.brandName}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{coupon.category}</span>
                      {!coupon.isActive && redeemedCouponsLoaded && !redeemedCoupons.find(rc => rc._id === coupon._id) && (
                        <span className="text-xs text-red-400">Expired</span>
                      )}
                    </div>
                  </div>
                </motion.div>
                );
              })
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

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Purchase Status</label>
              <select
                value={tempRedemption}
                onChange={(e) => setTempRedemption(e.target.value)}
                className="w-full px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg focus:outline-none focus:border-neon-purple text-white"
              >
                <option value="All">All</option>
                <option value="redeemed">Purchased</option>
                <option value="not_redeemed">Not Purchased</option>
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
          redeemedCoupons={redeemedCoupons}
          onClose={() => setShowDetailModal(false)}
          onRedeem={() => {
            fetchCoupons();
            fetchRedeemedCoupons();
          }}
        />
      )}
    </div>
  );
};

const CouponDetailModal = ({ coupon, user, redeemedCoupons, onClose, onRedeem }) => {
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [copied, setCopied] = useState(false);
  const { updateUser } = useAuth();
  const [currentUser, setCurrentUser] = useState(user);

  // Update local user state when prop changes
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  // Check if coupon is already redeemed when modal opens
  useEffect(() => {
    const alreadyRedeemed = redeemedCoupons.find(rc => rc._id === coupon._id);
    if (alreadyRedeemed) {
      setRedeemed(true);
      setCouponCode(alreadyRedeemed.couponCode);
    }
  }, [coupon._id, redeemedCoupons]);

  const handleRedeem = async () => {
    if (!currentUser || currentUser.coins < coupon.cost) {
      alert('Insufficient coins!');
      return;
    }

    setRedeeming(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/coupons/${coupon._id}/redeem`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        playSound('complete');
        setRedeemed(true);
        setCouponCode(response.data.data.couponCode);
        
        // Fetch updated user profile to refresh coin balance
        try {
          const userResponse = await axios.get('/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          updateUser(userResponse.data.data);
          setCurrentUser(userResponse.data.data);
        } catch (error) {
          console.error('Failed to fetch updated user data:', error);
        }
        
        onRedeem();
      }
    } catch (error) {
      console.error('Error redeeming coupon:', error);
      alert(error.response?.data?.message || 'Failed to redeem coupon');
    }
    setRedeeming(false);
  };

  // Update local user state when context user changes
  useEffect(() => {
    if (user) {
      // Force re-render when user data changes
    }
  }, [user]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    toast.success('Coupon code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
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

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Details</h3>
          <p className="text-gray-300">{coupon.details}</p>
        </div>

        {redeemed ? (
          <div className="bg-gray-500 bg-opacity-20 border border-gray-500 rounded-lg p-4 mb-4">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Coupon Code</h3>
              <div className="bg-white bg-opacity-10 border-2 border-dashed border-neon-purple rounded-lg p-4 flex items-center justify-between">
                <p className="text-neon-purple text-xl font-mono font-bold">{couponCode}</p>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center space-x-2 px-3 py-2 bg-neon-purple hover:bg-neon-purple hover:bg-opacity-80 rounded-lg transition-all duration-200"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={handleRedeem}
            disabled={!coupon.isActive || redeeming || !currentUser || currentUser.coins < coupon.cost}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
              !coupon.isActive
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : redeeming
                ? 'bg-gray-600 text-gray-400 cursor-wait'
                : !currentUser || currentUser.coins < coupon.cost
                ? 'bg-red-600 text-gray-300 cursor-not-allowed'
                : 'bg-neon-purple hover:bg-neon-purple hover:bg-opacity-80 text-white'
            }`}
          >
            {!coupon.isActive && redeemedCouponsLoaded && !redeemed
              ? 'Expired'
              : redeeming
              ? 'Purchasing...'
              : !currentUser || currentUser.coins < coupon.cost
              ? `Insufficient Coins (Need ${coupon.cost})`
              : `Purchase for ${coupon.cost} Coins`}
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default MarketplacePage;
