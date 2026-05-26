import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CompanyAuthContext = createContext();

export const useCompanyAuth = () => {
  const context = useContext(CompanyAuthContext);
  if (!context) {
    throw new Error('useCompanyAuth must be used within CompanyAuthProvider');
  }
  return context;
};

export const CompanyAuthProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('companyToken');
      const companyData = localStorage.getItem('companyData');
      
      if (token && companyData) {
        setCompany(JSON.parse(companyData));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token, companyData) => {
    localStorage.setItem('companyToken', token);
    localStorage.setItem('companyData', JSON.stringify(companyData));
    setCompany(companyData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('companyToken');
    localStorage.removeItem('companyData');
    setCompany(null);
    setIsAuthenticated(false);
    setIsLoggingOut(false);
  };

  const startLogout = () => {
    setIsLoggingOut(true);
  };

  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem('companyToken');
      await axios.delete('/api/company/delete', {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('companyToken');
      localStorage.removeItem('companyData');
      setCompany(null);
      setIsAuthenticated(false);
      setIsLoggingOut(false);
      toast.success('Enterprise account deleted successfully. All your data has been removed.');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete account';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return (
    <CompanyAuthContext.Provider value={{ company, isAuthenticated, isLoading, isLoggingOut, login, logout, startLogout, deleteAccount }}>
      {children}
    </CompanyAuthContext.Provider>
  );
};
