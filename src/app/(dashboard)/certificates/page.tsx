import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/guards';
import { CertificateCard } from '@/components/course/CertificateCard';

export default async function CertificatesPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: certificates } = await supabase
    .from('certificates')
    .select('*, courses(title)')
    .eq('user_id', user.id)
    .order('issued_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">My Certificates</h1>
        <p className="text-text-secondary">View and download your earned course certificates.</p>
      </div>

      {(!certificates || certificates.length === 0) ? (
        <div className="text-center py-16 bg-surface-card rounded-2xl border border-border">
          <p className="text-text-secondary">You haven't earned any certificates yet. Complete a course to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={{
                id: cert.id,
                courseName: cert.courses?.title || 'Unknown Course',
                issuedAt: cert.issued_at,
                certificateNumber: cert.certificate_number,
                pdfUrl: cert.pdf_url,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
