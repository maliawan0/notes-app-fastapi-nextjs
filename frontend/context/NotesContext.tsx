"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Note, Tag } from '../types';
import { notesApi, Note as ApiNote } from '../lib/api';

interface NotesContextType {
  notes: Note[];
  tags: Tag[];
  activeNoteId: string | null;
  setActiveNoteId: (id: string | null) => void;
  createNote: () => Promise<string>;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => Promise<void>; // Permanent delete
  archiveNote: (id: string) => Promise<void>;
  restoreNote: (id: string) => Promise<void>;
  getNote: (id: string) => Note | undefined;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  isSaving: boolean;
  isLoading: boolean;
  refreshNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

// Helper to convert API note to frontend note format
const apiNoteToNote = (apiNote: ApiNote): Note => ({
  id: apiNote.id,
  title: apiNote.title,
  content: apiNote.content,
  tags: apiNote.tags,
  isArchived: apiNote.isArchived,
  createdAt: apiNote.createdAt,
  updatedAt: apiNote.updatedAt,
});

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Debounce timer for auto-save
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch notes and tags from API
  const refreshNotes = useCallback(async (isArchived: boolean = false, customSearch?: string, customTag?: string) => {
    try {
      setIsLoading(true);
      
      // Use provided values or current state values for search and tag
      const currentSearch = customSearch !== undefined ? customSearch : (searchQuery || undefined);
      const currentTag = customTag !== undefined ? customTag : (selectedTag || undefined);
      
      // Fetch notes with search and tag filters
      const apiNotes = await notesApi.getNotes(
        currentSearch,
        currentTag,
        isArchived
      );
      
      setNotes(apiNotes.map(apiNoteToNote));
      
      // Fetch tags (only for non-archived view)
      if (!isArchived) {
        const apiTags = await notesApi.getTags();
        setTags(apiTags);
      } else {
        setTags([]);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedTag]);

  // Initial load and refresh when filters change
  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  // Auto-save debounced updates
  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    // Optimistically update UI
    setNotes(prev => prev.map(note => {
      if (note.id === id) {
        return { ...note, ...updates, updatedAt: new Date().toISOString() };
      }
      return note;
    }));

    // Debounce API call for content updates
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (updates.content !== undefined) {
      setIsSaving(true);
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await notesApi.updateNote(id, { content: updates.content! });
          // Refresh to get updated tags and title from backend
          await refreshNotes();
        } catch (error) {
          console.error("Failed to save note:", error);
        } finally {
          setIsSaving(false);
        }
      }, 1000); // 1 second debounce
    }
  }, [refreshNotes]);

  const createNote = useCallback(async () => {
    try {
      const newNote = await notesApi.createNote();
      const note = apiNoteToNote(newNote);
      setNotes(prev => [note, ...prev]);
      setActiveNoteId(note.id);
      return note.id;
    } catch (error) {
      console.error("Failed to create note:", error);
      throw error;
    }
  }, []);

  const archiveNote = useCallback(async (id: string) => {
    try {
      await notesApi.archiveNote(id);
      if (activeNoteId === id) {
        setActiveNoteId(null);
      }
      await refreshNotes();
    } catch (error) {
      console.error("Failed to archive note:", error);
      throw error;
    }
  }, [activeNoteId, refreshNotes]);

  const restoreNote = useCallback(async (id: string) => {
    try {
      await notesApi.restoreNote(id);
      await refreshNotes();
    } catch (error) {
      console.error("Failed to restore note:", error);
      throw error;
    }
  }, [refreshNotes]);

  const deleteNote = useCallback(async (id: string) => {
    try {
      await notesApi.deleteNote(id);
      if (activeNoteId === id) {
        setActiveNoteId(null);
      }
      await refreshNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
      throw error;
    }
  }, [activeNoteId, refreshNotes]);

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
      isSaving,
      isLoading,
      refreshNotes
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
