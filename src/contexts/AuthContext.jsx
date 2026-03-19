import React, { createContext, useEffect, useState } from 'react';
import { authAPI } from '../services/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await authAPI.getCurrentUser();
          if (response.success) {
            setUser(response.data.user);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setAuthError(null);
      const response = await authAPI.login(email, password);
      if (response.success) {
        localStorage.setItem('authToken', response.data.token);
        setUser(response.data.user);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setAuthError(message);
      throw error;
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    try {
      setAuthError(null);
      const response = await authAPI.register(name, email, password, confirmPassword);
      if (response.success) {
        localStorage.setItem('authToken', response.data.token);
        setUser(response.data.user);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setAuthError(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    authError,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
