'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/admin/FileUploader';
import { FileText, FileArchive, UploadCloud } from 'lucide-react';

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk' | 'handout'>('single');

  const handleSingleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload/markdown', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Upload failed');
    }
  };

  const handleBulkUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload/bulk', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Bulk upload failed');
    }
  };

  const handleHandoutUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload/handout', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Handout upload failed');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Content Management</h1>
        <p className="text-text-secondary">Upload markdown lessons, bulk zip files, or course handouts.</p>
      </div>

      <div className="bg-surface-card border border-border rounded-2xl overflow-hidden shadow-sm mb-8">
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('single')}
            className={`flex-1 py-4 px-6 text-sm font-bold text-center transition-colors ${
              activeTab === 'single'
                ? 'text-brand border-b-2 border-brand bg-brand-50'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText size={18} />
              Single Markdown (.md)
            </div>
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`flex-1 py-4 px-6 text-sm font-bold text-center transition-colors ${
              activeTab === 'bulk'
                ? 'text-brand border-b-2 border-brand bg-brand-50'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileArchive size={18} />
              Bulk Upload (.zip)
            </div>
          </button>
          <button
            onClick={() => setActiveTab('handout')}
            className={`flex-1 py-4 px-6 text-sm font-bold text-center transition-colors ${
              activeTab === 'handout'
                ? 'text-brand border-b-2 border-brand bg-brand-50'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <UploadCloud size={18} />
              Handouts (PDF, etc.)
            </div>
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'single' && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 text-center">
                <h3 className="text-lg font-bold text-text-primary mb-2">Upload a single lesson</h3>
                <p className="text-sm text-text-secondary">
                  Upload a .md file containing frontmatter (title, slug, type) and markdown content.
                </p>
              </div>
              <FileUploader
                accept=".md"
                maxSizeMB={5}
                onUpload={handleSingleUpload}
              />
            </div>
          )}

          {activeTab === 'bulk' && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 text-center">
                <h3 className="text-lg font-bold text-text-primary mb-2">Bulk upload lessons</h3>
                <p className="text-sm text-text-secondary">
                  Upload a .zip file containing multiple .md files. The folder structure will be preserved.
                </p>
              </div>
              <FileUploader
                accept=".zip"
                maxSizeMB={50}
                onUpload={handleBulkUpload}
              />
            </div>
          )}

          {activeTab === 'handout' && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 text-center">
                <h3 className="text-lg font-bold text-text-primary mb-2">Upload course handouts</h3>
                <p className="text-sm text-text-secondary">
                  Upload PDFs, documents, or spreadsheets to be attached to lessons.
                </p>
              </div>
              <FileUploader
                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                maxSizeMB={20}
                onUpload={handleHandoutUpload}
              />
            </div>
          )}
        </div>
      </div>

      {/* Upload History Table Placeholder */}
      <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-text-primary mb-4">Recent Uploads</h3>
        <div className="text-center py-12 text-text-secondary border-2 border-dashed border-border rounded-xl">
          Upload history will appear here.
        </div>
      </div>
    </div>
  );
}
