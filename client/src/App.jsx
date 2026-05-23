import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import { useCompanyAuth } from './context/CompanyAuthContext';
import { MageProvider } from './context/MageContext';
import { CompanyAuthProvider } from './context/CompanyAuthContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import MageGuide from './components/MageGuide';

// Page Components
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import Journey from './pages/Journey';
import QuestsPage from './pages/QuestsPage';
import Chronicles from './pages/Chronicles';
import LeaderboardPage from './pages/LeaderboardPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import MarketplacePage from './pages/MarketplacePage';

// Enterprise Portal Components
import CompanySignupPage from './pages/enterprise/CompanySignupPage';
import CompanyLoginPage from './pages/enterprise/CompanyLoginPage';
import CompanyDashboard from './pages/enterprise/CompanyDashboard';
import CompanyCouponsPage from './pages/enterprise/CompanyCouponsPage';

// Page transition animation
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user, isLoggingOut } = useAuth();

  console.log('ProtectedRoute - Auth state:', { isAuthenticated, isLoading, user, isLoggingOut });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gaming-dark">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated && !isLoggingOut) {
    console.log('ProtectedRoute - Redirecting to login, user not authenticated');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute - User authenticated or logging out, rendering children');
  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gaming-dark">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Company Public Route Component (redirect if company authenticated)
const CompanyPublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useCompanyAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gaming-dark">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/enterprise/dashboard" replace />;
  }

  return children;
};

// Company Protected Route Component (redirect if not authenticated)
const CompanyProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, isLoggingOut } = useCompanyAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gaming-dark">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated && !isLoggingOut) {
    return <Navigate to="/enterprise/login" replace />;
  }

  return children;
};

function App() {
  const { isLoading } = useAuth();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gaming-dark">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-6xl mb-4"
        >
          🎮
        </motion.div>
        <LoadingSpinner size="md" text="Loading LifeRPG..." />
      </div>
    );
  }

  const isLandingPage = location.pathname === '/';
  const isEnterpriseRoute = location.pathname.startsWith('/enterprise');

  return (
    <div className="min-h-screen bg-gaming-dark">
      {!isLandingPage && !isEnterpriseRoute && <Navbar />}
      
      <AnimatePresence mode="wait">
        <Routes>
          {/* Landing Page */}
          <Route 
            path="/" 
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <LandingPage />
              </motion.div>
            } 
          />

          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <LoginPage />
                </motion.div>
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <SignupPage />
                </motion.div>
              </PublicRoute>
            } 
          />
          <Route 
            path="/reset-password" 
            element={
              <PublicRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ResetPasswordPage />
                </motion.div>
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <DashboardPage />
                </motion.div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/journey" 
            element={
              <ProtectedRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Journey />
                </motion.div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quests" 
            element={
              <ProtectedRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <QuestsPage />
                </motion.div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chronicles" 
            element={
              <ProtectedRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Chronicles />
                </motion.div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leaderboard" 
            element={
              <ProtectedRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <LeaderboardPage />
                </motion.div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/marketplace" 
            element={
              <ProtectedRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <MarketplacePage />
                </motion.div>
              </ProtectedRoute>
            } 
          />

          {/* Enterprise Portal Routes */}
          <Route 
            path="/enterprise/signup" 
            element={
              <CompanyAuthProvider>
                <CompanyPublicRoute>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <CompanySignupPage />
                  </motion.div>
                </CompanyPublicRoute>
              </CompanyAuthProvider>
            } 
          />
          <Route 
            path="/enterprise/login" 
            element={
              <CompanyAuthProvider>
                <CompanyPublicRoute>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <CompanyLoginPage />
                  </motion.div>
                </CompanyPublicRoute>
              </CompanyAuthProvider>
            } 
          />
          <Route 
            path="/enterprise/dashboard" 
            element={
              <CompanyAuthProvider>
                <CompanyProtectedRoute>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <CompanyDashboard />
                  </motion.div>
                </CompanyProtectedRoute>
              </CompanyAuthProvider>
            } 
          />
          <Route 
            path="/enterprise/coupons" 
            element={
              <CompanyAuthProvider>
                <CompanyProtectedRoute>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <CompanyCouponsPage />
                  </motion.div>
                </CompanyProtectedRoute>
              </CompanyAuthProvider>
            } 
          />

          {/* Catch all route */}
          <Route 
            path="*" 
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="min-h-screen flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">🎮</div>
                  <h1 className="font-orbitron text-4xl font-bold text-white mb-2">404</h1>
                  <p className="text-gray-400 mb-6">Page not found</p>
                  <button
                    onClick={() => window.history.back()}
                    className="neon-button"
                  >
                    Go Back
                  </button>
                </div>
              </motion.div>
            } 
          />
        </Routes>
      </AnimatePresence>
      
      {/* Global Mage Guide Assistant - only show on user authenticated pages */}
      {!isLandingPage && !isEnterpriseRoute && <MageGuide />}
    </div>
  );
}

export default App;
