import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, setAuthToken, getAuthToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('styleaura_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = getAuthToken();
    const savedUser = localStorage.getItem('styleaura_auth_user');
    if (!token || token === 'false' || token === 'true' || !savedUser) {
      return false;
    }
    try {
      const parsed = JSON.parse(savedUser);
      return parsed?.role === 'Admin';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('styleaura_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('styleaura_auth_user');
    }
  }, [user]);

  const login = async (email, password) => {
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }

    try {
      const data = await authApi.login(email, password);

      if (!data.token || !data.user) {
        return {
          success: false,
          message: 'Invalid response from server.',
        };
      }

      // Normalize role check: backend may return 'admin' or 'Admin'
      const userRole = (data.user.role || '').toLowerCase();
      if (userRole !== 'admin') {
        return {
          success: false,
          message: 'Access denied. Admin privileges required.',
        };
      }

      // Store with consistent 'Admin' role for the ProtectedRoute check
      const normalizedUser = { ...data.user, role: 'Admin' };

      setAuthToken(data.token);
      setUser(normalizedUser);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Unable to connect to authentication server. Please try again.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthToken(null);
    localStorage.removeItem('styleaura_auth_user');
  };

  const updateProfile = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
