'use client';

import { useState, useCallback } from 'react';
import { UploadCloud, FileText, FileArchive, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  accept: string;
  maxSizeMB: number;
  onUpload: (file: File) => Promise<void>;
}

export function FileUploader({ accept, maxSizeMB, onUpload }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (selectedFile: File) => {
    setError(null);
    setSuccess(false);

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit.`);
      return false;
    }

    const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    const acceptedExtensions = accept.split(',').map(ext => ext.trim());

    if (!acceptedExtensions.includes(fileExtension) && !acceptedExtensions.includes(selectedFile.type)) {
      setError(`Invalid file type. Accepted: ${accept}`);
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  }, [accept, maxSizeMB]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleUploadClick = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    try {
      await onUpload(file);
      setSuccess(true);
      setFile(null);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
            isDragging 
              ? 'border-brand bg-brand-50' 
              : 'border-border bg-surface-card hover:border-brand/50 hover:bg-surface-elevated'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mx-auto mb-4 text-text-muted">
            <UploadCloud size={32} />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">Drag & Drop your file here</h3>
          <p className="text-sm text-text-secondary mb-6">
            Supports {accept} (Max {maxSizeMB}MB)
          </p>
          <label className="inline-flex items-center justify-center px-6 py-2 bg-surface-elevated border border-border text-sm font-medium rounded-lg text-text-primary hover:bg-surface-card transition-colors cursor-pointer shadow-sm">
            Browse Files
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleFileSelect}
            />
          </label>
        </div>
      ) : (
        <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-brand-50 text-brand flex items-center justify-center">
                {file.name.endsWith('.zip') ? <FileArchive size={24} /> : <FileText size={24} />}
              </div>
              <div>
                <h4 className="font-bold text-text-primary truncate max-w-[200px] sm:max-w-md">{file.name}</h4>
                <p className="text-xs text-text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              onClick={() => setFile(null)}
              disabled={isUploading}
              className="p-2 text-text-muted hover:text-error hover:bg-error-light rounded-full transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand text-white font-medium rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-50 shadow-sm"
          >
            {isUploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading & Processing...
              </>
            ) : (
              <>
                <UploadCloud size={18} />
                Confirm Upload
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-error-light text-error rounded-xl border border-error/20 flex items-start gap-3 text-sm">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-success-light text-success rounded-xl border border-success/20 flex items-start gap-3 text-sm">
          <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
          <p>File uploaded and processed successfully!</p>
        </div>
      )}
    </div>
  );
}
