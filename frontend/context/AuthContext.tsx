"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi, AuthResponse } from '../lib/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const token = localStorage.getItem('quicknote_token');
      const storedUser = localStorage.getItem('quicknote_user');
      
      if (token && storedUser) {
        try {
          // Verify token is still valid by fetching user profile
          const userData = await authApi.getMe();
          setUser(userData);
          // Update stored user data
          localStorage.setItem('quicknote_user', JSON.stringify(userData));
        } catch (error) {
          // Token is invalid, clear storage
          console.error("Session expired or invalid", error);
          localStorage.removeItem('quicknote_token');
          localStorage.removeItem('quicknote_user');
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response: AuthResponse = await authApi.signup({ name, email, password });
      
      // Store token and user data
      localStorage.setItem('quicknote_token', response.token);
      localStorage.setItem('quicknote_user', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response: AuthResponse = await authApi.login({ email, password });
      
      // Store token and user data
      localStorage.setItem('quicknote_token', response.token);
      localStorage.setItem('quicknote_user', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem('quicknote_token');
      localStorage.removeItem('quicknote_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
