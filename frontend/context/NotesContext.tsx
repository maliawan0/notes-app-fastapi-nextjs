"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Note, Tag } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface NotesContextType {
  notes: Note[];
  tags: Tag[];
  activeNoteId: string | null;
  setActiveNoteId: (id: string | null) => void;
  createNote: () => string;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void; // Permanent delete
  archiveNote: (id: string) => void;
  restoreNote: (id: string) => void;
  getNote: (id: string) => Note | undefined;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  isSaving: boolean;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

// Helper to extract tags from content
const extractTags = (content: string): string[] => {
  const tagRegex = /#[\w-]+/g;
  const matches = content.match(tagRegex);
  if (!matches) return [];
  return Array.from(new Set(matches.map(tag => tag.substring(1).toLowerCase()))); // Remove # and lowercase
};

// Helper to extract title from content (first line)
const extractTitle = (content: string): string => {
  const firstLine = content.split('\n')[0].replace(/^#+\s*/, '');
  return firstLine.substring(0, 50) || 'Untitled Note';
};

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load notes from local storage
  useEffect(() => {
    const storedNotes = localStorage.getItem('quicknote_notes');
    if (storedNotes) {
      try {
        setNotes(JSON.parse(storedNotes));
      } catch (e) {
        console.error("Failed to parse notes", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save notes to local storage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('quicknote_notes', JSON.stringify(notes));
    }
  }, [notes, isLoaded]);

  // Derived tags
  const tags = React.useMemo(() => {
    const tagMap = new Map<string, number>();
    notes.forEach(note => {
      if (!note.isArchived) {
        note.tags.forEach(tag => {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        });
      }
    });
    
    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [notes]);

  const createNote = useCallback(() => {
    const newNote: Note = {
      id: uuidv4(),
      title: '',
      content: '',
      tags: [],
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    return newNote.id;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setIsSaving(true);
    
    setNotes(prev => prev.map(note => {
      if (note.id === id) {
        const updatedNote = { ...note, ...updates, updatedAt: new Date().toISOString() };
        
        // If content changed, re-process title and tags
        if (updates.content !== undefined) {
          updatedNote.title = extractTitle(updates.content);
          updatedNote.tags = extractTags(updates.content);
        }
        
        return updatedNote;
      }
      return note;
    }));

    // Simulate network delay for "saving" indicator
    setTimeout(() => setIsSaving(false), 500);
  }, []);

  const archiveNote = useCallback((id: string) => {
    updateNote(id, { isArchived: true });
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
  }, [updateNote, activeNoteId]);

  const restoreNote = useCallback((id: string) => {
    updateNote(id, { isArchived: false });
  }, [updateNote]);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
  }, [activeNoteId]);

  const getNote = useCallback((id: string) => {
    return notes.find(n => n.id === id);
  }, [notes]);

  return (
    <NotesContext.Provider value={{
      notes,
      tags,
      activeNoteId,
      setActiveNoteId,
      createNote,
      updateNote,
      deleteNote,
      archiveNote,
      restoreNote,
      getNote,
      searchQuery,
      setSearchQuery,
      selectedTag,
      setSelectedTag,
      isSaving
    }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
