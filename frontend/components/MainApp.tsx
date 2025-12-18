"use client";

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Editor from './Editor';
import ArchiveView from './ArchiveView';
import SettingsView from './SettingsView';
import { Menu } from 'lucide-react';

export default function MainApp() {
  const [currentView, setCurrentView] = useState<'notes' | 'archive' | 'settings'>('notes');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <main className="flex-1 h-full overflow-hidden relative flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -ml-2 mr-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold text-slate-800 dark:text-white">
            {currentView === 'notes' ? 'Notes' : currentView === 'archive' ? 'Archive' : 'Settings'}
          </span>
        </div>

        <div className="flex-1 overflow-hidden">
          {currentView === 'notes' && <Editor />}
          {currentView === 'archive' && <ArchiveView />}
          {currentView === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
}

