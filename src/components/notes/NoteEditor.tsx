'use client';

import { useState, useEffect, useRef } from 'react';
import { Save, EyeOff, Users, UserCheck, Loader2 } from 'lucide-react';

interface NoteEditorProps {
  initialContent?: string;
  initialVisibility?: 'private' | 'shared_trainer' | 'shared_cohort';
  onSave: (content: string, visibility: 'private' | 'shared_trainer' | 'shared_cohort') => Promise<void>;
  autoSave?: boolean;
}

export function NoteEditor({ initialContent = '', initialVisibility = 'private', onSave, autoSave = true }: NoteEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [visibility, setVisibility] = useState(initialVisibility);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(content, visibility);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!autoSave) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (content !== initialContent || visibility !== initialVisibility) {
        handleSave();
      }
    }, 1500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [content, visibility, autoSave]);

  return (
    <div className="flex flex-col h-full bg-surface-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-3 border-b border-border bg-surface-elevated">
        <div className="flex items-center gap-2">
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as any)}
            className="text-xs font-medium bg-surface-card border border-border rounded-md px-2 py-1 text-text-primary focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="private">Private</option>
            <option value="shared_trainer">Shared with Trainer</option>
            <option value="shared_cohort">Shared with Cohort</option>
          </select>
          {visibility === 'private' && <EyeOff size={14} className="text-text-muted" />}
          {visibility === 'shared_trainer' && <UserCheck size={14} className="text-brand" />}
          {visibility === 'shared_cohort' && <Users size={14} className="text-info" />}
        </div>
        
        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="text-xs text-text-muted">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white text-xs font-medium rounded-md hover:bg-brand-secondary transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save
          </button>
        </div>
      </div>
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Take notes here... (Markdown supported)"
        className="flex-1 w-full p-4 bg-transparent text-text-primary resize-none focus:outline-none placeholder-text-muted"
      />
    </div>
  );
}
