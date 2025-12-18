"use client";

import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { NotesProvider } from '../context/NotesContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotesProvider>
        {children}
      </NotesProvider>
    </AuthProvider>
  );
}
