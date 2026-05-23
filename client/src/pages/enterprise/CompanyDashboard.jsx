import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, ShoppingBag, TrendingUp, Clock, Plus, LogOut } from 'lucide-react';
import axios from 'axios';
import { useCompanyAuth } from '../../context/CompanyAuthContext';
import { useNavigate } from 'react-router-dom';

const CompanyDashboard = () => {
  const { company, logout, startLogout } = useCompanyAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    expiredCoupons: 0,
    totalRedemptions: 0,
    timeline: []
  });
  const [loading, setLoading] = useState(true);

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

  const handleLogout = () => {
    // Set logout flag to prevent CompanyProtectedRoute redirect
    startLogout();
    // Clear auth state immediately
    logout();
    // Navigate to landing page
    window.location.href = '/';
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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/enterprise/coupons')}
                className="flex items-center space-x-2 px-4 py-2 bg-neon-purple hover:bg-neon-purple hover:bg-opacity-80 border border-neon-purple rounded-lg transition-all duration-200"
              >
                <ShoppingBag size={18} />
                <span>Coupons</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-red-400 hover:bg-opacity-10 rounded-lg transition-all duration-200"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400">Loading dashboard...</div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gaming-card border border-gaming-border rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <ShoppingBag className="text-neon-purple" size={32} />
                  <span className="text-3xl font-bold">{stats.totalCoupons}</span>
                </div>
                <p className="text-gray-400">Total Coupons</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gaming-card border border-gaming-border rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="text-green-400" size={32} />
                  <span className="text-3xl font-bold">{stats.activeCoupons}</span>
                </div>
                <p className="text-gray-400">Active Coupons</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gaming-card border border-gaming-border rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Clock className="text-red-400" size={32} />
                  <span className="text-3xl font-bold">{stats.expiredCoupons}</span>
                </div>
                <p className="text-gray-400">Expired Coupons</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gaming-card border border-gaming-border rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Building2 className="text-yellow-400" size={32} />
                  <span className="text-3xl font-bold">{stats.totalRedemptions}</span>
                </div>
                <p className="text-gray-400">Total Redemptions</p>
              </motion.div>
            </div>

            {/* Timeline Graph */}
            <div className="bg-gaming-card border border-gaming-border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Redemption Timeline</h3>
              {stats.timeline.length > 0 ? (
                <div className="h-64 flex items-end justify-between space-x-2">
                  {stats.timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${(item.count / Math.max(...stats.timeline.map(t => t.count))) * 100}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex-1 bg-neon-purple rounded-t-lg relative"
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                        {item.count}
                      </div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 rotate-45 origin-left">
                        {item.date}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No redemption data available
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
