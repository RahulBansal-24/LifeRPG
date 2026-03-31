import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, UserPlus, Sparkles } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { validateEmail, validatePassword, validateUsername, avatarOptions } from '../utils/helpers';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '🎮',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedAvatar, setSelectedAvatar] = useState('🎮');
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setFormData(prev => ({ ...prev, avatar }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (!validateUsername(formData.username)) {
      newErrors.username = 'Username must be 3-20 characters and contain only letters, numbers, and underscores';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const { confirmPassword, ...signupData } = formData;
    const result = await signup(signupData);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-bg p-4">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="gaming-card border-2 border-neon-pink shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="inline-block text-5xl mb-4"
            >
              🎮
            </motion.div>
            <h1 className="font-orbitron text-3xl font-bold bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent mb-2">
              Join the Adventure
            </h1>
            <p className="text-gray-400">
              Create your LifeRPG hero
            </p>
          </div>

          {/* Avatar Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Choose Your Avatar
            </label>
            <div className="grid grid-cols-8 gap-2">
              {avatarOptions.slice(0, 16).map((avatar) => (
                <motion.button
                  key={avatar}
                  type="button"
                  onClick={() => handleAvatarSelect(avatar)}
                  className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                    selectedAvatar === avatar
                      ? 'border-neon-pink bg-neon-pink bg-opacity-20'
                      : 'border-gaming-border hover:border-neon-purple'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-2xl">{avatar}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gaming-darker border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent transition-all duration-200 ${
                    errors.username ? 'border-red-500' : 'border-gaming-border'
                  }`}
                  placeholder="Choose a username"
                  disabled={isLoading}
                />
                {errors.username && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-5 left-0 text-red-400 text-xs"
                  >
                    {errors.username}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gaming-darker border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gaming-border'
                  }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-5 left-0 text-red-400 text-xs"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 bg-gaming-darker border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent transition-all duration-200 ${
                    errors.password ? 'border-red-500' : 'border-gaming-border'
                  }`}
                  placeholder="Create a password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-5 left-0 text-red-400 text-xs"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 bg-gaming-darker border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gaming-border'
                  }`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-5 left-0 text-red-400 text-xs"
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full neon-button-pink relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" text="" />
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <UserPlus size={20} />
                  <span>Begin Your Journey</span>
                </div>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-neon-pink hover:text-neon-purple transition-colors duration-200 font-semibold"
              >
                Login Here
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-4 -right-4 text-2xl opacity-50"
        >
          <Sparkles />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-4 -left-4 text-2xl opacity-50"
        >
          <Sparkles />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
