import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseMDX } from '@/lib/mdx/parser';

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

    if (!file.name.endsWith('.md')) {
      return NextResponse.json({ error: 'Invalid file type. Only .md files are allowed.' }, { status: 400 });
    }

    const text = await file.text();
    const parsed = await parseMDX(text);

    // In a real implementation, we would insert this into the database
    // For now, we just return the parsed data to simulate success
    return NextResponse.json({
      success: true,
      metadata: parsed.frontmatter,
      preview: parsed.content.substring(0, 200) + '...',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to parse markdown' }, { status: 500 });
  }
}
