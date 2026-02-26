import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const lessonId = searchParams.get('lessonId');
  const moduleId = searchParams.get('moduleId');
  const courseId = searchParams.get('courseId');

  let query = supabase
    .from('notes')
    .select('*, lessons(title), modules(title), courses(title)')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (lessonId) query = query.eq('lesson_id', lessonId);
  if (moduleId) query = query.eq('module_id', moduleId);
  if (courseId) query = query.eq('course_id', courseId);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { content, lesson_id, module_id, course_id, visibility } = body;

  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: user.id,
      content,
      lesson_id,
      module_id,
      course_id,
      visibility: visibility || 'private',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
