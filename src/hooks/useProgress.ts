'use client';

import { useEffect, useState } from 'react';
import { useProgressStore } from '@/stores/progressStore';

export function useProgress(lessonId: string) {
  const { progress, setProgress, setAllProgress } = useProgressStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const status = progress[lessonId] || 'not_started';

  // Fetch all progress on mount if empty
  useEffect(() => {
    const fetchProgress = async () => {
      if (Object.keys(progress).length > 0) return;
      
      try {
        const res = await fetch('/api/progress');
        if (!res.ok) throw new Error('Failed to fetch progress');
        const data = await res.json();
        
        const progressMap: Record<string, 'not_started' | 'in_progress' | 'completed'> = {};
        data.forEach((p: any) => {
          progressMap[p.lesson_id] = p.status;
        });
        
        setAllProgress(progressMap);
      } catch (err: any) {
        console.error(err);
      }
    };

    fetchProgress();
  }, [progress, setAllProgress]);

  const markStarted = async () => {
    if (status !== 'not_started') return;
    
    // Optimistic update
    setProgress(lessonId, 'in_progress');
    
    try {
      const res = await fetch(`/api/progress/${lessonId}/start`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to mark started');
    } catch (err: any) {
      // Revert on error
      setProgress(lessonId, 'not_started');
      setError(err.message);
    }
  };

  const markCompleted = async () => {
    if (status === 'completed') return;
    
    setIsLoading(true);
    // Optimistic update
    setProgress(lessonId, 'completed');
    
    try {
      const res = await fetch(`/api/progress/${lessonId}/complete`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to mark completed');
    } catch (err: any) {
      // Revert on error
      setProgress(lessonId, status);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    status,
    isLoading,
    error,
    markStarted,
    markCompleted,
  };
}
