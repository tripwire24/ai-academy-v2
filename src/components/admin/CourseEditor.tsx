'use client';

import { useState } from 'react';
import { MDXRenderer } from '@/components/content/MDXRenderer';
import { Bold, Italic, Heading, Link as LinkIcon, Code, Table, Save, Eye } from 'lucide-react';

interface CourseEditorProps {
  initialContent?: string;
  initialFrontmatter?: any;
  onSave: (content: string, frontmatter: any) => Promise<void>;
}

export function CourseEditor({ initialContent = '', initialFrontmatter = {}, onSave }: CourseEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [frontmatter, setFrontmatter] = useState(initialFrontmatter);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(content, frontmatter);
    } finally {
      setIsSaving(false);
    }
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] border border-border rounded-2xl overflow-hidden bg-surface-card shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-surface-elevated">
        <div className="flex items-center gap-1">
          <button onClick={() => insertText('**', '**')} className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-card rounded transition-colors" title="Bold">
            <Bold size={18} />
          </button>
          <button onClick={() => insertText('*', '*')} className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-card rounded transition-colors" title="Italic">
            <Italic size={18} />
          </button>
          <button onClick={() => insertText('### ')} className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-card rounded transition-colors" title="Heading">
            <Heading size={18} />
          </button>
          <div className="w-px h-6 bg-border mx-2" />
          <button onClick={() => insertText('[', '](url)')} className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-card rounded transition-colors" title="Link">
            <LinkIcon size={18} />
          </button>
          <button onClick={() => insertText('`', '`')} className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-card rounded transition-colors" title="Code">
            <Code size={18} />
          </button>
          <button onClick={() => insertText('\n| Header | Header |\n|--------|--------|\n| Cell   | Cell   |\n')} className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-card rounded transition-colors" title="Table">
            <Table size={18} />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              isPreviewMode ? 'bg-brand-50 text-brand' : 'text-text-secondary hover:bg-surface-card'
            }`}
          >
            <Eye size={16} />
            {isPreviewMode ? 'Edit Mode' : 'Preview'}
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-1.5 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Editor / Preview Split */}
      <div className="flex-1 flex overflow-hidden">
        {(!isPreviewMode || window.innerWidth > 1024) && (
          <div className={`flex-1 border-r border-border ${isPreviewMode ? 'hidden lg:block' : 'block'}`}>
            <textarea
              id="markdown-editor"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full p-6 bg-surface-card text-text-primary font-mono text-sm focus:outline-none resize-none"
              placeholder="Write your markdown here..."
            />
          </div>
        )}
        
        {(isPreviewMode || window.innerWidth > 1024) && (
          <div className={`flex-1 overflow-y-auto bg-surface-secondary ${!isPreviewMode ? 'hidden lg:block' : 'block'}`}>
            <div className="p-8 max-w-3xl mx-auto bg-surface-card min-h-full shadow-sm">
              {content ? (
                <MDXRenderer content={content} />
              ) : (
                <div className="h-full flex items-center justify-center text-text-muted italic">
                  Preview will appear here
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
