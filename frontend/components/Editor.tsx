"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useNotes } from '../context/NotesContext';
import { 
  Save, 
  MoreVertical, 
  Trash2, 
  Archive as ArchiveIcon, 
  CornerUpLeft,
  Bold,
  Italic,
  List,
  CheckSquare,
  Heading1,
  Heading2,
  Loader2,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export default function Editor() {
  const { 
    activeNoteId, 
    getNote, 
    updateNote, 
    archiveNote, 
    deleteNote, 
    isSaving,
    tags: allTags
  } = useNotes();
  
  const [content, setContent] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [tagFilter, setTagFilter] = useState('');
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });

  const activeNote = activeNoteId ? getNote(activeNoteId) : undefined;

  useEffect(() => {
    if (activeNote) {
      setContent(activeNote.content);
    } else {
      setContent('');
    }
  }, [activeNoteId, activeNote?.id]); // Only update when ID changes to avoid cursor jumping on every keystroke save

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (activeNoteId) {
      updateNote(activeNoteId, { content: newContent });
    }

    // Check for tag autocomplete
    const cursor = e.target.selectionStart;
    const textBeforeCursor = newContent.substring(0, cursor);
    const lastWord = textBeforeCursor.split(/\s/).pop();

    if (lastWord && lastWord.startsWith('#') && lastWord.length > 1) {
      const query = lastWord.substring(1).toLowerCase();
      setTagFilter(query);
      setShowTagSuggestions(true);
      
      // Calculate position (rough approximation)
      // In a real app, we'd use a library or a hidden div to measure text
      // For MVP, we'll just show it near the bottom or top of the textarea or fixed
    } else {
      setShowTagSuggestions(false);
    }
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = textareaRef.current.value;
    const selectedText = text.substring(start, end);
    
    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    
    // Update content and cursor
    setContent(newText);
    if (activeNoteId) {
      updateNote(activeNoteId, { content: newText });
    }
    
    // Restore focus and cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + prefix.length, end + prefix.length);
      }
    }, 0);
  };

  const insertTag = (tagName: string) => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const text = textareaRef.current.value;
    const textBeforeCursor = text.substring(0, start);
    const lastWordIndex = textBeforeCursor.lastIndexOf('#');
    
    if (lastWordIndex !== -1) {
      const newText = text.substring(0, lastWordIndex) + '#' + tagName + ' ' + text.substring(start);
      setContent(newText);
      if (activeNoteId) {
        updateNote(activeNoteId, { content: newText });
      }
      setShowTagSuggestions(false);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  if (!activeNote) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <FileText size={32} className="text-slate-300 dark:text-slate-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">Select a note to view</h2>
        <p className="text-sm max-w-xs text-center">
          Choose a note from the sidebar or create a new one to get started.
        </p>
      </div>
    );
  }

  // Filter tags for autocomplete
  const filteredTags = allTags.filter(t => 
    t.name.toLowerCase().includes(tagFilter) && 
    t.name.toLowerCase() !== tagFilter
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center text-xs text-slate-400 space-x-2">
          <span>{format(new Date(activeNote.updatedAt), 'MMM d, yyyy h:mm a')}</span>
          {isSaving ? (
            <span className="flex items-center text-blue-500">
              <Loader2 size={10} className="animate-spin mr-1" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center text-green-600 dark:text-green-500">
              <Save size={10} className="mr-1" />
              Saved
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button 
            onClick={() => archiveNote(activeNote.id)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="Archive Note"
          >
            <ArchiveIcon size={18} />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              <MoreVertical size={18} />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 z-20 py-1">
                  <button 
                    onClick={() => { deleteNote(activeNote.id); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete Permanently
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Formatting Bar */}
      <div className="flex items-center px-6 py-2 border-b border-slate-50 dark:border-slate-800 space-x-1 overflow-x-auto no-scrollbar">
        <FormatButton icon={<Heading1 size={16} />} onClick={() => insertMarkdown('# ', '')} label="H1" />
        <FormatButton icon={<Heading2 size={16} />} onClick={() => insertMarkdown('## ', '')} label="H2" />
        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-2" />
        <FormatButton icon={<Bold size={16} />} onClick={() => insertMarkdown('**', '**')} label="Bold" />
        <FormatButton icon={<Italic size={16} />} onClick={() => insertMarkdown('*', '*')} label="Italic" />
        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-2" />
        <FormatButton icon={<List size={16} />} onClick={() => insertMarkdown('- ', '')} label="List" />
        <FormatButton icon={<CheckSquare size={16} />} onClick={() => insertMarkdown('- [ ] ', '')} label="Task" />
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing... Use # to add tags"
          className="w-full h-full p-6 resize-none focus:outline-none text-slate-800 dark:text-slate-200 dark:bg-slate-900 leading-relaxed text-lg font-light placeholder-slate-300 dark:placeholder-slate-600"
          spellCheck={false}
        />

        {/* Tag Autocomplete Popup */}
        {showTagSuggestions && filteredTags.length > 0 && (
          <div className="absolute bottom-4 left-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-30 max-h-48 overflow-y-auto min-w-[200px]">
            <div className="text-xs font-semibold text-slate-400 px-2 py-1 mb-1">SUGGESTED TAGS</div>
            {filteredTags.map(tag => (
              <button
                key={tag.name}
                onClick={() => insertTag(tag.name)}
                className="w-full text-left px-2 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded flex items-center justify-between"
              >
                <span>#{tag.name}</span>
                <span className="text-xs text-slate-400">{tag.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FormatButton({ icon, onClick, label }: { icon: React.ReactNode, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
      title={label}
    >
      {icon}
    </button>
  );
}




