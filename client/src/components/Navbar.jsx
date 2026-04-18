import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MageToggle from './MageToggle';
import { 
  Sword, 
  Trophy, 
  Target, 
  User, 
  LogOut, 
  Menu, 
  X,
  Home,
  Sparkles,
  Map,
  BookOpen
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/journey', label: 'Journey', icon: Map },
    { path: '/quests', label: 'Quests', icon: Target },
    { path: '/chronicles', label: 'Chronicles', icon: BookOpen },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === path;
  };

  return (
    <nav className="bg-gaming-card border-b border-gaming-border sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="max-w-full xl:max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="text-2xl"
              >
                🎮
              </motion.div>
              <span className="font-orbitron text-xl font-bold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent group-hover:from-neon-pink group-hover:to-neon-purple transition-all duration-300">
                LifeRPG
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-neon-purple bg-opacity-20 text-neon-purple border border-neon-purple'
                        : 'text-gray-300 hover:text-white hover:bg-gaming-border'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mage Toggle */}
              <MageToggle />
            </div>
          )}

          {/* User Menu */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-3 px-3 py-2 bg-gaming-darker rounded-lg border border-gaming-border">
                <span className="text-2xl">{user?.avatar || '🎮'}</span>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-white">{user?.username}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-xp-gold">XP: {user?.xp || 0}</p>
                    <span className="text-xs text-gray-400">|</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-lg">⭐</span>
                      <span className="text-xs text-xp-gold font-bold">{user?.stars || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-red-400 hover:bg-opacity-10 rounded-lg transition-all duration-200"
              >
                <LogOut size={18} />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isAuthenticated && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gaming-border"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        {isAuthenticated && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-gaming-border"
          >
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-neon-purple bg-opacity-20 text-neon-purple border border-neon-purple'
                        : 'text-gray-300 hover:text-white hover:bg-gaming-border'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mage Toggle in Mobile Menu */}
              <div className="flex items-center justify-between px-3 py-2 bg-gaming-darker rounded-lg border border-gaming-border">
                <span className="text-sm font-medium text-gray-300">Mage Guide</span>
                <MageToggle />
              </div>
              
              <div className="pt-4 border-t border-gaming-border">
                <div className="flex items-center space-x-3 px-3 py-2 bg-gaming-darker rounded-lg border border-gaming-border mb-3">
                  <span className="text-2xl">{user?.avatar || '🎮'}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{user?.username}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-xp-gold">XP: {user?.xp || 0}</p>
                      <span className="text-xs text-gray-400">|</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">⭐</span>
                        <span className="text-xs text-xp-gold font-bold">{user?.stars || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-400 hover:bg-opacity-10 rounded-lg transition-all duration-200"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
