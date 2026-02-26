import { create } from 'zustand';

interface ProgressState {
  progress: Record<string, 'not_started' | 'in_progress' | 'completed'>;
  setProgress: (lessonId: string, status: 'not_started' | 'in_progress' | 'completed') => void;
  setAllProgress: (progress: Record<string, 'not_started' | 'in_progress' | 'completed'>) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  progress: {},
  setProgress: (lessonId, status) =>
    set((state) => ({
      progress: {
        ...state.progress,
        [lessonId]: status,
      },
    })),
  setAllProgress: (progress) => set({ progress }),
}));
