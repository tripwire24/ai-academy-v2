'use client';

import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player/lazy';
import { useProgress } from '@/hooks/useProgress';

interface VideoEmbedProps {
  url: string;
  title?: string;
  lessonId?: string;
}

export function VideoEmbed({ url, title, lessonId }: VideoEmbedProps) {
  const [isReady, setIsReady] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const { markCompleted } = useProgress(lessonId || '');

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    // Auto-mark as complete when 90% watched
    if (state.played >= 0.9 && lessonId) {
      markCompleted();
    }
  };

  if (!hasMounted) {
    return (
      <div className="my-10 rounded-2xl overflow-hidden border border-border shadow-card bg-surface-card">
        <div className="aspect-video relative bg-black flex items-center justify-center text-white/50">
          Loading video player...
        </div>
      </div>
    );
  }

  return (
    <div className="my-10 rounded-2xl overflow-hidden border border-border shadow-card bg-surface-card">
      <div className="aspect-video relative bg-black">
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center text-white/50">
            Loading video...
          </div>
        )}
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          controls
          onReady={() => setIsReady(true)}
          onProgress={handleProgress}
          config={{
            youtube: {
              playerVars: { showinfo: 1 }
            }
          }}
        />
      </div>
      {title && (
        <div className="p-4 bg-surface-elevated border-t border-border">
          <p className="text-sm font-medium text-text-primary">{title}</p>
        </div>
      )}
    </div>
  );
}
