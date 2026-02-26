import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Award, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export default async function VerifyCertificatePage({ params }: { params: { certNumber: string } }) {
  const supabase = await createClient();

  const { data: cert } = await supabase
    .from('certificates')
    .select('*, courses(title), profiles(full_name)')
    .eq('certificate_number', params.certNumber)
    .single();

  if (!cert) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface-card border border-border rounded-2xl p-8 shadow-xl text-center">
        <div className="w-20 h-20 bg-success-light rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-success" />
        </div>
        
        <h1 className="text-2xl font-bold text-text-primary mb-2">Verified Certificate</h1>
        <p className="text-text-secondary mb-8">This certificate is valid and authentic.</p>

        <div className="bg-surface-elevated rounded-xl p-6 border border-border text-left space-y-4">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Recipient</p>
            <p className="text-lg font-bold text-text-primary">{cert.profiles?.full_name}</p>
          </div>
          
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Course</p>
            <p className="text-base font-medium text-text-primary">{cert.courses?.title}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Issue Date</p>
              <p className="text-sm font-medium text-text-primary">{format(new Date(cert.issued_at), 'MMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Certificate ID</p>
              <p className="text-sm font-mono text-text-primary">{cert.certificate_number}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-text-muted">
          <Award size={16} />
          <span className="text-sm font-medium">Tripwire AI Academy</span>
        </div>
      </div>
    </div>
  );
}
