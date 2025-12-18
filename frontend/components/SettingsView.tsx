"use client";

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { User, Download, Moon, Sun, Shield, Database } from 'lucide-react';

import { useTheme } from "next-themes";

export default function SettingsView() {
  const { user } = useAuth();
  const { notes } = useNotes();
  const { theme, setTheme } = useTheme();

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "quicknote_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="h-full bg-white dark:bg-slate-900 overflow-y-auto p-8">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">Settings</h1>
      
      <div className="max-w-2xl space-y-8">
        {/* Profile Section */}
        <section className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            <User className="mr-2 text-blue-500" size={20} />
            Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Name</label>
              <div className="text-slate-800 dark:text-slate-200 font-medium">{user?.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Email</label>
              <div className="text-slate-800 dark:text-slate-200 font-medium">{user?.email}</div>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            <Database className="mr-2 text-purple-500" size={20} />
            Data Management
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-800 dark:text-slate-200">Export Notes</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Download all your notes as a JSON file</div>
              </div>
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
              >
                <Download size={16} className="mr-2" />
                Export
              </button>
            </div>
            
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">Storage Usage</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {notes.length} notes • {notes.filter(n => n.isArchived).length} archived
                  </div>
                </div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  ~{(JSON.stringify(notes).length / 1024).toFixed(2)} KB
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            <Sun className="mr-2 text-orange-500" size={20} />
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-800 dark:text-slate-200">Theme</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light'}
              </div>
            </div>
            <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
              <button 
                onClick={() => setTheme('light')}
                className={cn(
                  "p-2 rounded shadow-sm transition-all",
                  theme === 'light' 
                    ? "bg-white text-slate-800" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
                title="Light Mode"
              >
                <Sun size={16} />
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={cn(
                  "p-2 rounded shadow-sm transition-all",
                  theme === 'dark' 
                    ? "bg-slate-600 text-white" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
                title="Dark Mode"
              >
                <Moon size={16} />
              </button>
              <button 
                onClick={() => setTheme('system')}
                className={cn(
                  "p-2 rounded shadow-sm transition-all",
                  theme === 'system' 
                    ? "bg-white dark:bg-slate-600 text-slate-800 dark:text-white" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
                title="System"
              >
                <span className="text-xs font-bold">AUTO</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

