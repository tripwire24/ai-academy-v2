'use client';

import { useState, useRef, useEffect } from 'react';
import { useAI } from '@/hooks/useAI';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId?: string;
  contextTitle?: string;
}

export function AIChatPanel({ isOpen, onClose, lessonId, contextTitle }: AIChatPanelProps) {
  const { messages, isLoading, error, sendMessage } = useAI(lessonId);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-surface-card border-l border-border shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
      <div className="flex items-center justify-between p-4 border-b border-border bg-surface-elevated">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-50 text-brand flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-sm">Tripwire AI Assistant</h3>
            {contextTitle && <p className="text-xs text-text-muted truncate max-w-[200px]">{contextTitle}</p>}
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-surface-card transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-text-muted mt-10">
            <Bot size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm">Hi! I'm your AI learning assistant.</p>
            <p className="text-xs mt-2">Ask me anything about the course material.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-surface-elevated text-text-secondary' : 'bg-brand text-white'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-surface-elevated text-text-primary rounded-tr-none' : 'bg-brand-50 border border-brand-light text-text-primary rounded-tl-none'}`}>
              <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-surface-card prose-pre:border prose-pre:border-border">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center flex-shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-brand-50 border border-brand-light rounded-2xl rounded-tl-none p-4 flex items-center gap-1">
              <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-error-light text-error text-xs p-3 rounded-lg border border-error/20 text-center">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border bg-surface-elevated">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 bg-surface-card border border-border rounded-full px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center flex-shrink-0 hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>
        <div className="text-center mt-2">
          <span className="text-[10px] text-text-muted">AI can make mistakes. Verify important information.</span>
        </div>
      </div>
    </div>
  );
}
