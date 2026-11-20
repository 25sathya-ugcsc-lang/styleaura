import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('styleaura_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default logged in demo admin so user immediately sees the beautiful dashboard
    return {
      name: 'Admin',
      email: 'admin@styleaura.com',
      role: 'Head Store Manager',
      avatar: '/assets/logo/styleaura-logo.png'
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('styleaura_auth_token') !== 'false';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('styleaura_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('styleaura_auth_user');
    }
  }, [user]);

  const login = (email, password) => {
    // Frontend demo validation
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }
    const loggedInUser = {
      name: 'Admin',
      email: email,
      role: 'Head Store Manager',
      avatar: '/assets/logo/styleaura-logo.png'
    };
    setUser(loggedInUser);
    setIsAuthenticated(true);
    localStorage.setItem('styleaura_auth_token', 'true');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.setItem('styleaura_auth_token', 'false');
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
