'use client';

import { Award, Download, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface CertificateCardProps {
  certificate: {
    id: string;
    courseName: string;
    issuedAt: string;
    certificateNumber: string;
    pdfUrl?: string;
  };
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${certificate.certificateNumber}`;

  return (
    <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-bl-full -z-10" />
      
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-brand-50 text-brand flex items-center justify-center flex-shrink-0">
          <Award size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary leading-tight mb-1">{certificate.courseName}</h3>
          <p className="text-sm text-text-secondary">Issued {format(new Date(certificate.issuedAt), 'MMMM d, yyyy')}</p>
        </div>
      </div>

      <div className="bg-surface-elevated rounded-lg p-3 mb-6 border border-border">
        <p className="text-xs text-text-muted mb-1 uppercase tracking-wider font-semibold">Certificate ID</p>
        <p className="text-sm font-mono text-text-primary">{certificate.certificateNumber}</p>
      </div>

      <div className="flex items-center gap-3">
        {certificate.pdfUrl && (
          <a
            href={certificate.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-secondary transition-colors"
          >
            <Download size={16} />
            Download PDF
          </a>
        )}
        <button
          onClick={() => {
            navigator.clipboard.writeText(verifyUrl);
            alert('Verification link copied to clipboard!');
          }}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-surface-elevated text-text-primary border border-border text-sm font-medium rounded-lg hover:bg-surface-card transition-colors"
        >
          <ExternalLink size={16} />
          Copy Link
        </button>
      </div>
    </div>
  );
}
