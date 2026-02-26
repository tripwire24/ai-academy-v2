import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { courseId } = await request.json();

  // Verify completion
  // In a real app, we'd check if all lessons in the course are completed.
  // For this prototype, we'll assume the client verified it and just generate.

  const certNumber = `TW-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const { data, error } = await supabase
    .from('certificates')
    .insert({
      user_id: user.id,
      course_id: courseId,
      certificate_number: certNumber,
      // pdf_url would be generated here via @react-pdf/renderer and uploaded to storage
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
