// Authentication Context - Role-based authorization & persistent session management

import React, { createContext, useState, useEffect, useContext } from 'react';
import { DataService } from '../services/dataService';
import { isFirebaseConfigured } from '../firebase/config';

const AuthContext = createContext({
  user: null,
  role: null,
  isLoading: true,
  isFirebase: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  switchDemoRole: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      await DataService.initializeData();
      const session = await DataService.getCurrentSession();
      if (session) {
        setUser(session);
        setRole(session.role);
      }
    } catch (err) {
      console.warn('Session load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const session = await DataService.authenticateUser(email, password);
    setUser(session);
    setRole(session.role);
    return session;
  };

  const register = async (name, email, password, phone, selectedRole = 'user') => {
    const session = await DataService.registerUser(name, email, password, phone, selectedRole);
    setUser(session);
    setRole(session.role);
    return session;
  };

  const logout = async () => {
    await DataService.logout();
    setUser(null);
    setRole(null);
  };

  const switchDemoRole = async (targetRole) => {
    if (targetRole === 'admin') {
      return await login('admin@smartparking.com', 'admin123');
    } else {
      return await login('user@smartparking.com', 'user123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        isFirebase: isFirebaseConfigured,
        login,
        register,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
