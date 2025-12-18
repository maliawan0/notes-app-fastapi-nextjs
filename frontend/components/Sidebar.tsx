"use client";

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { 
  Search, 
  Plus, 
  FileText, 
  Archive, 
  Settings, 
  LogOut, 
  Hash,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface SidebarProps {
  currentView: 'notes' | 'archive' | 'settings';
  setCurrentView: (view: 'notes' | 'archive' | 'settings') => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ 
  currentView, 
  setCurrentView,
  isMobileOpen,
  setIsMobileOpen
}: SidebarProps) {
  const { user, logout } = useAuth();
  const { 
    notes, 
    tags, 
    createNote, 
    activeNoteId, 
    setActiveNoteId, 
    searchQuery, 
    setSearchQuery,
    selectedTag,
    setSelectedTag
  } = useNotes();

  // Filter notes based on search and tag
  const filteredNotes = notes.filter(note => {
    // Filter by view (archive vs active)
    if (currentView === 'archive') {
      if (!note.isArchived) return false;
    } else if (currentView === 'notes') {
      if (note.isArchived) return false;
    } else {
      // Settings view doesn't show notes list usually, but let's keep it consistent
      return false;
    }

    // Filter by tag
    if (selectedTag && !note.tags.includes(selectedTag)) return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return true;
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleCreateNote = () => {
    createNote();
    setCurrentView('notes');
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  const handleNoteClick = (id: string) => {
    setActiveNoteId(id);
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                Q
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-100">QuickNote</span>
            </div>
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          <button
            onClick={handleCreateNote}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>New Note</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex p-2 space-x-1 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => { setCurrentView('notes'); setSelectedTag(null); }}
            className={cn(
              "flex-1 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center space-x-2 transition-colors",
              currentView === 'notes' 
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <FileText size={16} />
            <span>Notes</span>
          </button>
          <button
            onClick={() => { setCurrentView('archive'); setSelectedTag(null); }}
            className={cn(
              "flex-1 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center space-x-2 transition-colors",
              currentView === 'archive' 
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <Archive size={16} />
            <span>Archive</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400"
            />
          </div>

          {/* Tags Horizontal Scroll */}
          {tags.length > 0 && (
            <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
              <button
                onClick={() => setSelectedTag(null)}
                className={cn(
                  "flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors border",
                  selectedTag === null
                    ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-slate-800 dark:border-slate-200"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                )}
              >
                All
              </button>
              {tags.map(tag => (
                <button
                  key={tag.name}
                  onClick={() => setSelectedTag(tag.name === selectedTag ? null : tag.name)}
                  className={cn(
                    "flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors border flex items-center space-x-1",
                    selectedTag === tag.name
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  )}
                >
                  <span>#</span>
                  <span>{tag.name}</span>
                  <span className="ml-1 opacity-60">({tag.count})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400 p-4 text-center">
              <p className="text-sm">No notes found</p>
              {searchQuery && <p className="text-xs mt-1">Try a different search term</p>}
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredNotes.map(note => (
                <button
                  key={note.id}
                  onClick={() => handleNoteClick(note.id)}
                  className={cn(
                    "w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group",
                    activeNoteId === note.id 
                      ? "bg-white dark:bg-slate-800 border-l-4 border-blue-500 shadow-sm" 
                      : "border-l-4 border-transparent"
                  )}
                >
                  <h3 className={cn(
                    "font-medium text-sm mb-1 truncate",
                    !note.title && "text-slate-400 italic",
                    activeNoteId === note.id ? "text-slate-800 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"
                  )}>
                    {note.title || 'Untitled Note'}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                    </span>
                    {note.tags.length > 0 && (
                      <div className="flex space-x-1">
                        {note.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-1.5 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                        {note.tags.length > 2 && (
                          <span className="text-[10px] text-slate-400">+{note.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 font-medium">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[120px]">{user?.name || 'Guest'}</span>
                <span className="text-xs text-slate-400 truncate max-w-[120px]">Free Plan</span>
              </div>
            </div>
            <div className="flex space-x-1">
              <button 
                onClick={() => setCurrentView('settings')}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <Settings size={18} />
              </button>
              <button 
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

