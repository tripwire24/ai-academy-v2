import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: { handoutId: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: handout, error } = await supabase
    .from('handouts')
    .select('file_url')
    .eq('id', params.handoutId)
    .single();

  if (error || !handout) {
    return NextResponse.json({ error: 'Handout not found' }, { status: 404 });
  }

  // Increment download count (RPC or direct update if allowed)
  // For now, we'll just redirect to the file URL
  
  return NextResponse.redirect(handout.file_url);
}
