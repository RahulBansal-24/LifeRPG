import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
  };

  return (
    <CompanyAuthContext.Provider value={{ company, isAuthenticated, isLoading, login, logout }}>
      {children}
    </CompanyAuthContext.Provider>
  );
};
