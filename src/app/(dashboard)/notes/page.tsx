'use client';

import { useState } from 'react';
import { useNotes, Note } from '@/hooks/useNotes';
import { NotesList } from '@/components/notes/NotesList';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function NotesPage() {
  const { notes, isLoading, deleteNote, updateNote } = useNotes();
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  if (isLoading) {
    return <div className="py-12"><LoadingSpinner /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">My Notes</h1>
        <p className="text-text-secondary">View and manage all your notes across courses.</p>
      </div>

      {editingNote ? (
        <div className="mb-8 h-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-text-primary">Edit Note</h2>
            <button 
              onClick={() => setEditingNote(null)}
              className="text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              Cancel
            </button>
          </div>
          <NoteEditor
            initialContent={editingNote.content}
            initialVisibility={editingNote.visibility}
            onSave={async (content, visibility) => {
              await updateNote(editingNote.id, { content, visibility });
              setEditingNote(null);
            }}
            autoSave={false}
          />
        </div>
      ) : null}

      <NotesList 
        notes={notes} 
        onDelete={deleteNote} 
        onEdit={setEditingNote} 
      />
    </div>
  );
}
