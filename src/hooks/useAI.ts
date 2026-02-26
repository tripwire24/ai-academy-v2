'use client';

import { useState } from 'react';
import { streamAIResponse } from '@/lib/ai/client';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function useAI(lessonId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);

    const assistantMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

    try {
      await streamAIResponse(
        newMessages.map(m => ({ role: m.role, content: m.content })),
        lessonId,
        (chunk) => {
          setMessages((prev) => 
            prev.map((m) => 
              m.id === assistantMessageId ? { ...m, content: m.content + chunk } : m
            )
          );
        }
      );
    } catch (err: any) {
      setError(err.message);
      setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => setMessages([]);

  return { messages, isLoading, error, sendMessage, clearMessages };
}
