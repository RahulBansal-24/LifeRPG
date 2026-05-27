import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ShoppingBag, TrendingUp, Clock, LogOut, BarChart3, Activity, Target, Zap, Filter, Calendar, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useCompanyAuth } from '../../context/CompanyAuthContext';
import { useNavigate } from 'react-router-dom';
import { playSound } from '../../utils/sounds';
import MuteButton from '../../components/MuteButton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const CompanyDashboard = () => {
  const { company, logout, startLogout, deleteAccount } = useCompanyAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    expiredCoupons: 0,
    totalRedemptions: 0,
    timeline: [],
    topCoupons: [],
    recentPurchases: [],
    couponAnalytics: []
  });
  const [loading, setLoading] = useState(true);
  const [timelineFilter, setTimelineFilter] = useState('daily');
  const [showActive, setShowActive] = useState(true);
  const [showExpired, setShowExpired] = useState(true);
  const [showPurchases, setShowPurchases] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('companyToken');
      const response = await axios.get('/api/company/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  };

  const getFilteredTimeline = () => {
    if (!stats.timeline || stats.timeline.length === 0) return [];
    
    // Return timeline as-is for now - backend should handle aggregation
    // Future enhancement: frontend aggregation based on timelineFilter
    return stats.timeline;
  };

  const getFilteredCouponAnalytics = () => {
    if (!stats.couponAnalytics || stats.couponAnalytics.length === 0) return [];
    
    return stats.couponAnalytics;
  };

  const handleLogout = () => {
    // Set logout flag to prevent CompanyProtectedRoute redirect
    startLogout();
    // Clear auth state immediately
    logout();
    // Navigate to landing page
    window.location.href = '/';
  };

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();
    if (result.success) {
      // Navigate to home page after successful deletion
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gaming-dark text-white">
      {/* Enhanced Header */}
      <div className="bg-gaming-card/80 backdrop-blur-xl border-b border-gaming-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.15 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="text-4xl drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              >
                💰
              </motion.div>
              <div>
                <h1 className="text-2xl font-orbitron font-bold bg-gradient-to-r from-neon-purple via-neon-pink to-neon-purple bg-clip-text text-transparent animate-gradient">
                  Enterprise Portal
                </h1>
                <p className="text-sm text-gray-400 font-medium">{company?.companyName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MuteButton />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playSound('click');
                  navigate('/enterprise/coupons');
                }}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-pink hover:to-neon-purple border border-neon-purple rounded-xl transition-all duration-300 shadow-lg shadow-neon-purple/20"
              >
                <ShoppingBag size={18} />
                <span className="font-semibold">Coupons</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playSound('click');
                  handleLogout();
                }}
                className="flex items-center space-x-2 px-5 py-2.5 text-gray-300 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/30 rounded-xl transition-all duration-300"
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h2 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent mb-2">
            Analytics Dashboard
          </h2>
          <p className="text-gray-400">Monitor your coupon performance and customer engagement</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-6xl mb-4"
              >
                💰
              </motion.div>
              <div className="text-gray-400 text-lg">Loading analytics...</div>
            </div>
          </div>
        ) : (
          <>
            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gradient-to-br from-gaming-card to-gaming-darker border border-gaming-border rounded-2xl p-6 shadow-xl shadow-neon-purple/10 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-neon-purple/20 rounded-xl">
                      <ShoppingBag className="text-neon-purple" size={28} />
                    </div>
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                    >
                      {stats.totalCoupons}
                    </motion.span>
                  </div>
                  <p className="text-gray-400 font-medium">Total Coupons</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gradient-to-br from-gaming-card to-gaming-darker border border-gaming-border rounded-2xl p-6 shadow-xl shadow-green-500/10 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                      <TrendingUp className="text-green-400" size={28} />
                    </div>
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                    >
                      {stats.activeCoupons}
                    </motion.span>
                  </div>
                  <p className="text-gray-400 font-medium">Active Coupons</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gradient-to-br from-gaming-card to-gaming-darker border border-gaming-border rounded-2xl p-6 shadow-xl shadow-red-500/10 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-red-500/20 rounded-xl">
                      <Clock className="text-red-400" size={28} />
                    </div>
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                    >
                      {stats.expiredCoupons}
                    </motion.span>
                  </div>
                  <p className="text-gray-400 font-medium">Expired Coupons</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gradient-to-br from-gaming-card to-gaming-darker border border-gaming-border rounded-2xl p-6 shadow-xl shadow-yellow-500/10 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-yellow-500/20 rounded-xl">
                      <Building2 className="text-yellow-400" size={28} />
                    </div>
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                    >
                      {stats.totalRedemptions}
                    </motion.span>
                  </div>
                  <p className="text-gray-400 font-medium">Total Purchases</p>
                </div>
              </motion.div>
            </div>

            {/* Purchase Timeline Graph */}
            <div className="bg-gradient-to-br from-gaming-card to-gaming-darker border border-gaming-border rounded-2xl p-6 mb-10 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">Purchase Timeline</h3>
                  <p className="text-gray-400 text-sm">Track purchase activity over time</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter size={18} className="text-gray-400" />
                  <select
                    value={timelineFilter}
                    onChange={(e) => setTimelineFilter(e.target.value)}
                    className="bg-gaming-darker border border-gaming-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-purple"
                  >
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              
              {stats.timeline && stats.timeline.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getFilteredTimeline()}>
                      <defs>
                        <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#a855f7" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorPurchases)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No purchase data available yet</p>
                    <p className="text-sm mt-2">Create enticing offers to attract adventurers</p>
                  </div>
                </div>
              )}
            </div>

            {/* Multi-line Coupon Analytics Graph */}
            <div className="bg-gradient-to-br from-gaming-card to-gaming-darker border border-gaming-border rounded-2xl p-6 mb-10 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">Coupon Analytics</h3>
                  <p className="text-gray-400 text-sm">Compare active, expired, and purchase trends</p>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showActive}
                      onChange={() => setShowActive(!showActive)}
                      className="w-4 h-4 rounded border-gaming-border bg-gaming-darker text-green-500 focus:ring-neon-purple"
                    />
                    <span className="text-sm text-green-400">Active</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showExpired}
                      onChange={() => setShowExpired(!showExpired)}
                      className="w-4 h-4 rounded border-gaming-border bg-gaming-darker text-red-500 focus:ring-neon-purple"
                    />
                    <span className="text-sm text-red-400">Expired</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPurchases}
                      onChange={() => setShowPurchases(!showPurchases)}
                      className="w-4 h-4 rounded border-gaming-border bg-gaming-darker text-yellow-500 focus:ring-neon-purple"
                    />
                    <span className="text-sm text-yellow-400">Purchases</span>
                  </label>
                </div>
              </div>
              
              {stats.couponAnalytics && stats.couponAnalytics.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getFilteredCouponAnalytics()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Legend />
                      {showActive && (
                        <Line 
                          type="monotone" 
                          dataKey="active" 
                          stroke="#22c55e" 
                          strokeWidth={3}
                          dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                          name="Active"
                        />
                      )}
                      {showExpired && (
                        <Line 
                          type="monotone" 
                          dataKey="expired" 
                          stroke="#ef4444" 
                          strokeWidth={3}
                          dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                          name="Expired"
                        />
                      )}
                      {showPurchases && (
                        <Line 
                          type="monotone" 
                          dataKey="purchases" 
                          stroke="#eab308" 
                          strokeWidth={3}
                          dot={{ fill: '#eab308', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                          name="Purchases"
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Activity size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No analytics data available yet</p>
                    <p className="text-sm mt-2">Analytics will populate as your coupons gain traction</p>
                  </div>
                </div>
              )}
            </div>

            {/* Top Performing Coupons */}
            {stats.topCoupons && stats.topCoupons.length > 0 && (
              <div className="bg-gradient-to-br from-gaming-card to-gaming-darker border border-gaming-border rounded-2xl p-6 mb-10 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <Target className="text-neon-purple" size={24} />
                  <h3 className="text-2xl font-bold">Top Performing Coupons</h3>
                </div>
                <div className="space-y-4">
                  {stats.topCoupons.map((coupon, index) => (
                    <motion.div
                      key={coupon._id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gaming-darker/50 rounded-xl border border-gaming-border hover:border-neon-purple/50 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{coupon.couponName}</p>
                          <p className="text-sm text-gray-400">{coupon.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold text-neon-purple">{coupon.purchaseCount || 0}</p>
                          <p className="text-xs text-gray-400">purchases</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          coupon.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {coupon.isActive ? 'Active' : 'Expired'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Purchases Feed */}
            {stats.recentPurchases && stats.recentPurchases.length > 0 && (
              <div className="bg-gradient-to-br from-gaming-card to-gaming-darker border border-gaming-border rounded-2xl p-6 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <Zap className="text-yellow-400" size={24} />
                  <h3 className="text-2xl font-bold">Recent Purchases</h3>
                </div>
                <div className="space-y-3">
                  {stats.recentPurchases.slice(0, 5).map((purchase, index) => (
                    <motion.div
                      key={purchase._id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-3 bg-gaming-darker/30 rounded-lg border border-gaming-border/50"
                    >
                      <div className="text-2xl">🪙</div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{purchase.couponName}</p>
                        <p className="text-xs text-gray-400">{purchase.timestamp}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Account Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-gaming-card to-gaming-darker border border-gaming-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-red-400 mb-2">Delete Enterprise Account</h3>
              <p className="text-gray-400 text-sm">
                Permanently delete your enterprise account and all data. Purchased coupons will remain accessible to users.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
            >
              Delete Account
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-gaming-card border border-gaming-border rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-red-400 mb-2">Delete Enterprise Account</h3>
                <p className="text-gray-300 mb-4">
                  Are you sure you want to delete your enterprise account? This action cannot be undone.
                </p>
                <p className="text-gray-400 text-sm">
                  All your data including coupons, analytics, and enterprise settings will be permanently deleted.
                  However, coupons that have been purchased by users will remain accessible to them.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gaming-darker text-gray-300 rounded-lg hover:bg-gaming-border transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Forever
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompanyDashboard;
