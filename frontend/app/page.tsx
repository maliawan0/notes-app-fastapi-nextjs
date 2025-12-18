"use client";

import React from 'react';
import { useAuth } from '../context/AuthContext';
import Login from '../components/Login';
import MainApp from '../components/MainApp';
import { Loader2 } from 'lucide-react';

export default function Page() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <MainApp />;
}

