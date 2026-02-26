'use client';

import { FileText, Download, FileArchive, FileImage, FileVideo } from 'lucide-react';

interface HandoutCardProps {
  id: string;
  title: string;
  description?: string;
  fileType: string;
  fileSize: string;
}

export function HandoutCard({ id, title, description, fileType, fileSize }: HandoutCardProps) {
  const getIcon = () => {
    if (fileType.includes('pdf')) return <FileText size={20} />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <FileArchive size={20} />;
    if (fileType.includes('image')) return <FileImage size={20} />;
    if (fileType.includes('video')) return <FileVideo size={20} />;
    return <FileText size={20} />;
  };

  const handleDownload = () => {
    window.open(`/api/handouts/${id}/download`, '_blank');
  };

  return (
    <div className="bg-surface-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-brand/30 hover:shadow-sm transition-all">
      <div className="w-12 h-12 rounded-lg bg-surface-elevated flex items-center justify-center text-text-secondary flex-shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-text-primary truncate">{title}</h4>
        {description && <p className="text-xs text-text-secondary truncate mt-0.5">{description}</p>}
        <div className="flex items-center gap-2 mt-1.5 text-[10px] font-medium text-text-muted uppercase tracking-wider">
          <span>{fileType.split('/').pop()}</span>
          <span>•</span>
          <span>{fileSize}</span>
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center text-text-secondary hover:bg-brand hover:text-white transition-colors flex-shrink-0"
        aria-label="Download"
      >
        <Download size={18} />
      </button>
    </div>
  );
}
