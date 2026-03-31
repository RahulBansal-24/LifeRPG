import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Sword, Sparkles } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { validateEmail } from '../utils/helpers';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await login(formData);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        <div className="gaming-card border-2 border-neon-purple shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="inline-block text-5xl mb-4"
            >
              🎮
            </motion.div>
            <h1 className="font-orbitron text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400">
              Login to continue your adventure
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className={`w-full px-4 py-3 bg-gaming-darker border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-transparent transition-all duration-200 ${
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
                  className={`w-full px-4 py-3 pr-12 bg-gaming-darker border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-transparent transition-all duration-200 ${
                    errors.password ? 'border-red-500' : 'border-gaming-border'
                  }`}
                  placeholder="Enter your password"
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

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full neon-button relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" text="" />
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Sword size={20} />
                  <span>Login to Adventure</span>
                </div>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-neon-purple hover:text-neon-pink transition-colors duration-200 font-semibold"
              >
                Sign Up Now
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

export default LoginPage;
