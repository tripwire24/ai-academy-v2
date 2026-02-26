import { createClient } from '@/lib/supabase/server';

export async function getLessonContext(lessonId: string) {
  const supabase = await createClient();
  
  const { data: lesson } = await supabase
    .from('lessons')
    .select(`
      title,
      content_md,
      modules (
        title,
        courses (
          title
        )
      )
    `)
    .eq('id', lessonId)
    .single();

  if (!lesson) return null;

  return {
    courseTitle: lesson.modules?.courses?.title || '',
    moduleTitle: lesson.modules?.title || '',
    lessonTitle: lesson.title,
    lessonContent: lesson.content_md || '',
  };
}
