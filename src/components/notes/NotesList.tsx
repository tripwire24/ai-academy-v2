'use client';

import { Note } from '@/hooks/useNotes';
import { formatDistanceToNow } from 'date-fns';
import { EyeOff, Users, UserCheck, Trash2, Edit2 } from 'lucide-react';

interface NotesListProps {
  notes: Note[];
  onDelete?: (id: string) => void;
  onEdit?: (note: Note) => void;
}

export function NotesList({ notes, onDelete, onEdit }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12 bg-surface-card rounded-2xl border border-border">
        <p className="text-text-secondary">No notes found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div key={note.id} className="bg-surface-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md bg-surface-elevated border border-border">
                {note.visibility === 'private' && <><EyeOff size={12} className="text-text-muted" /> Private</>}
                {note.visibility === 'shared_trainer' && <><UserCheck size={12} className="text-brand" /> Trainer</>}
                {note.visibility === 'shared_cohort' && <><Users size={12} className="text-info" /> Cohort</>}
              </div>
              <span className="text-xs text-text-muted">
                {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {onEdit && (
                <button onClick={() => onEdit(note)} className="p-1.5 text-text-muted hover:text-brand transition-colors rounded-md hover:bg-surface-elevated">
                  <Edit2 size={16} />
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(note.id)} className="p-1.5 text-text-muted hover:text-error transition-colors rounded-md hover:bg-error-light/50">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
          
          <div className="prose prose-sm dark:prose-invert max-w-none mb-4 line-clamp-3">
            {note.content}
          </div>
          
          {(note.lessons?.title || note.courses?.title) && (
            <div className="text-xs font-medium text-text-muted flex items-center gap-1.5 pt-3 border-t border-border">
              <span>From:</span>
              <span className="text-text-primary">{note.courses?.title}</span>
              {note.lessons?.title && (
                <>
                  <span>/</span>
                  <span className="text-text-primary">{note.lessons.title}</span>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
