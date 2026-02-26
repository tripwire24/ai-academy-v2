'use client';

import { useState } from 'react';
import { Bot } from 'lucide-react';
import { AIChatPanel } from './AIChatPanel';

interface AIChatWidgetProps {
  lessonId?: string;
  contextTitle?: string;
}

export function AIChatWidget({ lessonId, contextTitle }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand text-white rounded-full shadow-lg flex items-center justify-center hover:bg-brand-secondary transition-transform hover:scale-105 z-40"
        aria-label="Open AI Assistant"
      >
        <Bot size={24} />
      </button>

      <AIChatPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        lessonId={lessonId}
        contextTitle={contextTitle}
      />
    </>
  );
}
