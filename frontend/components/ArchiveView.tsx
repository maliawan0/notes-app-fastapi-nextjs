"use client";

import React from 'react';
import { useNotes } from '../context/NotesContext';
import { Archive, RefreshCw, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ArchiveView() {
  const { notes, restoreNote, deleteNote, refreshNotes } = useNotes();
  
  // Notes are already filtered by the API, but we can use them directly
  const archivedNotes = notes;

  if (archivedNotes.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Archive size={32} className="text-slate-300 dark:text-slate-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">Archive is empty</h2>
        <p className="text-sm max-w-xs text-center">
          Archived notes will appear here. You can restore them anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-slate-900 overflow-y-auto p-8">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center">
        <Archive className="mr-3 text-slate-400" />
        Archived Notes
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {archivedNotes.map(note => (
          <div key={note.id} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow group">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 truncate">
              {note.title || 'Untitled Note'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3 h-12">
              {note.content || 'No content'}
            </p>
            
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400">
                {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
              </span>
              
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={async () => {
                    try {
                      await restoreNote(note.id);
                      await refreshNotes(true);
                    } catch (error) {
                      console.error("Failed to restore note:", error);
                    }
                  }}
                  className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                  title="Restore"
                >
                  <RefreshCw size={16} />
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to permanently delete this note?')) {
                      try {
                        await deleteNote(note.id);
                        await refreshNotes(true);
                      } catch (error) {
                        console.error("Failed to delete note:", error);
                      }
                    }
                  }}
                  className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  title="Delete Permanently"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

