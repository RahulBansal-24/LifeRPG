import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const MageContext = createContext();

// Provider component
export const MageProvider = ({ children }) => {
  const [isMageVisible, setIsMageVisible] = useState(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('mageVisible');
    return saved !== null ? JSON.parse(saved) : true; // Default to visible
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('mageVisible', JSON.stringify(isMageVisible));
  }, [isMageVisible]);

  // Reset mage to visible when user logs in (new authentication)
  const resetMageOnLogin = () => {
    setIsMageVisible(true);
  };

  // Toggle mage visibility
  const toggleMage = () => {
    setIsMageVisible(prev => !prev);
  };

  const value = {
    isMageVisible,
    toggleMage,
    resetMageOnLogin,
  };

  return <MageContext.Provider value={value}>{children}</MageContext.Provider>;
};

// Hook to use mage context
export const useMage = () => {
  const context = useContext(MageContext);
  if (!context) {
    throw new Error('useMage must be used within a MageProvider');
  }
  return context;
};

export default MageContext;
