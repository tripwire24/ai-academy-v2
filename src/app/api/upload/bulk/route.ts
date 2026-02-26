import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || (profile.role !== 'admin' && profile.role !== 'trainer')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.endsWith('.zip')) {
      return NextResponse.json({ error: 'Invalid file type. Only .zip files are allowed.' }, { status: 400 });
    }

    // In a real implementation, we would use a library like jszip to extract and process files
    // For this prototype, we'll just simulate success
    return NextResponse.json({
      success: true,
      message: 'Bulk upload processed successfully (simulated)',
      results: [
        { file: 'module-1/lesson-1.md', status: 'success' },
        { file: 'module-1/lesson-2.md', status: 'success' },
      ]
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to process bulk upload' }, { status: 500 });
  }
}
