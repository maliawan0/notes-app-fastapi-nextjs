"use client";

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, CheckCircle } from 'lucide-react';

export default function Login() {
  const { login, isLoading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isRegistering && !name) {
      setError('Please enter your name');
      return;
    }

    try {
      // For MVP, we just simulate login with any credentials
      await login(email, name || email.split('@')[0]);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full p-8 md:p-10">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              Q
            </div>
            <span className="font-bold text-2xl text-slate-800">QuickNote</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            {isRegistering ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="text-slate-500 mb-8">
            {isRegistering 
              ? 'Start capturing your thoughts instantly.' 
              : 'Enter your details to access your notes.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                isRegistering ? 'Sign Up' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-600 font-medium hover:underline"
            >
              {isRegistering ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
