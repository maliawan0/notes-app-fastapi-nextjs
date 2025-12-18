"use client";

import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { NotesProvider } from '../context/NotesContext';

import { ThemeProvider } from './ThemeProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <NotesProvider>
          {children}
        </NotesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

