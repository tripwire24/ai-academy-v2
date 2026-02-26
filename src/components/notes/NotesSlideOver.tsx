'use client';

import { useState } from 'react';
import { X, FileText } from 'lucide-react';
import { NoteEditor } from './NoteEditor';
import { useNotes } from '@/hooks/useNotes';

interface NotesSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
  moduleId: string;
  courseId: string;
}

export function NotesSlideOver({ isOpen, onClose, lessonId, moduleId, courseId }: NotesSlideOverProps) {
  const { notes, createNote, updateNote } = useNotes({ lessonId });
  const existingNote = notes[0]; // Assuming 1 note per lesson for simplicity

  const handleSave = async (content: string, visibility: any) => {
    if (existingNote) {
      await updateNote(existingNote.id, { content, visibility });
    } else {
      await createNote({ content, visibility, lesson_id: lessonId, module_id: moduleId, course_id: courseId });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-surface-card border-l border-border shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
      <div className="flex items-center justify-between p-4 border-b border-border bg-surface-elevated">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-brand" />
          <h3 className="font-bold text-text-primary text-sm">My Notes</h3>
        </div>
        <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-surface-card transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 p-4">
        <NoteEditor
          initialContent={existingNote?.content || ''}
          initialVisibility={existingNote?.visibility || 'private'}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
