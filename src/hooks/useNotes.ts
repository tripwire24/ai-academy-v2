'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Note {
  id: string;
  content: string;
  visibility: 'private' | 'shared_trainer' | 'shared_cohort';
  lesson_id?: string;
  module_id?: string;
  course_id?: string;
  created_at: string;
  updated_at: string;
  lessons?: { title: string };
  modules?: { title: string };
  courses?: { title: string };
}

export function useNotes(filters?: { lessonId?: string; moduleId?: string; courseId?: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters?.lessonId) queryParams.append('lessonId', filters.lessonId);
      if (filters?.moduleId) queryParams.append('moduleId', filters.moduleId);
      if (filters?.courseId) queryParams.append('courseId', filters.courseId);

      const res = await fetch(`/api/notes?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data = await res.json();
      setNotes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.lessonId, filters?.moduleId, filters?.courseId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (data: Partial<Note>) => {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create note');
      const newNote = await res.json();
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateNote = async (id: string, data: Partial<Note>) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update note');
      const updatedNote = await res.json();
      setNotes((prev) => prev.map((n) => (n.id === id ? updatedNote : n)));
      return updatedNote;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete note');
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { notes, isLoading, error, createNote, updateNote, deleteNote, refreshNotes: fetchNotes };
}
