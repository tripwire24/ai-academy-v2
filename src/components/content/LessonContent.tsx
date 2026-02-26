'use client';

import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { MDXRenderer } from '@/components/content/MDXRenderer';
import { CheckCircle, Loader2, FileText } from 'lucide-react';
import { NotesSlideOver } from '@/components/notes/NotesSlideOver';

interface LessonContentProps {
  lessonId: string;
  moduleId: string;
  courseId: string;
  source: string;
}

export function LessonContent({ lessonId, moduleId, courseId, source }: LessonContentProps) {
  const { status, isLoading, markStarted, markCompleted } = useProgress(lessonId);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  // Mark as started when mounted
  useEffect(() => {
    if (status === 'not_started') {
      markStarted();
    }
  }, [lessonId, status, markStarted]);

  // Handle scroll position auto-save
  useEffect(() => {
    const saveScrollPosition = () => {
      if (!contentRef.current) return;
      const position = window.scrollY;
      localStorage.setItem(`lesson_scroll_${lessonId}`, position.toString());
    };

    const intervalId = setInterval(saveScrollPosition, 5000);
    window.addEventListener('beforeunload', saveScrollPosition);

    // Restore scroll position on mount
    const savedPosition = localStorage.getItem(`lesson_scroll_${lessonId}`);
    if (savedPosition) {
      window.scrollTo({ top: parseInt(savedPosition, 10), behavior: 'smooth' });
    }

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', saveScrollPosition);
      saveScrollPosition();
    };
  }, [lessonId]);

  return (
    <div ref={contentRef} className="relative">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsNotesOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-surface-card transition-colors"
        >
          <FileText size={16} className="text-brand" />
          Take Notes
        </button>
      </div>

      <MDXRenderer source={source} />
      
      <div className="mt-12 flex justify-center">
        <button
          onClick={markCompleted}
          disabled={status === 'completed' || isLoading}
          className={`inline-flex items-center justify-center gap-2 px-8 py-3 border border-transparent text-sm font-bold rounded-xl shadow-sm transition-colors ${
            status === 'completed'
              ? 'bg-success-light text-success cursor-default'
              : 'text-white bg-success hover:bg-success/90'
          }`}
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <CheckCircle size={18} />
          )}
          {status === 'completed' ? 'Completed' : 'Mark as Complete'}
        </button>
      </div>

      <NotesSlideOver
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        lessonId={lessonId}
        moduleId={moduleId}
        courseId={courseId}
      />
    </div>
  );
}
