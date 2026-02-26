import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/guards';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { LessonContent } from '@/components/content/LessonContent';
import { HandoutList } from '@/components/content/HandoutList';
import { AIChatWidget } from '@/components/ai/AIChatWidget';
import { parseMdx } from '@/lib/mdx/parse';

export default async function LessonViewerPage({ params }: { params: { courseSlug: string, moduleSlug: string, lessonSlug: string } }) {
  const user = await requireAuth();
  const supabase = await createClient();
  const { courseSlug, moduleSlug, lessonSlug } = params;

  // Fetch course, module, and lesson details
  const { data: course } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      slug,
      modules (
        id,
        slug,
        title,
        sort_order,
        lessons (
          id,
          slug,
          title,
          content_md,
          lesson_type,
          sort_order,
          estimated_minutes
        )
      )
    `)
    .eq('slug', courseSlug)
    .single();

  if (!course) {
    notFound();
  }

  // Sort modules
  const modules = course.modules?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [];
  
  // Find current module
  const currentModuleIndex = modules.findIndex((m: any) => m.slug === moduleSlug);
  if (currentModuleIndex === -1) {
    notFound();
  }
  
  const currentModule = modules[currentModuleIndex];

  // Sort lessons
  const lessons = currentModule.lessons?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [];
  
  // Find current lesson
  const currentLessonIndex = lessons.findIndex((l: any) => l.slug === lessonSlug);
  if (currentLessonIndex === -1) {
    notFound();
  }
  
  const currentLesson = lessons[currentLessonIndex];

  // Fetch enrollment status
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .single();

  if (!enrollment) {
    redirect(`/courses/${courseSlug}`);
  }

  // Fetch handouts for this lesson
  const { data: handouts } = await supabase
    .from('handouts')
    .select('*')
    .eq('lesson_id', currentLesson.id);

  // Determine previous and next lessons
  let previousLesson = null;
  let nextLesson = null;

  if (currentLessonIndex > 0) {
    previousLesson = {
      ...lessons[currentLessonIndex - 1],
      moduleSlug: currentModule.slug
    };
  } else if (currentModuleIndex > 0) {
    const prevModule = modules[currentModuleIndex - 1];
    const prevModuleLessons = prevModule.lessons?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [];
    if (prevModuleLessons.length > 0) {
      previousLesson = {
        ...prevModuleLessons[prevModuleLessons.length - 1],
        moduleSlug: prevModule.slug
      };
    }
  }

  if (currentLessonIndex < lessons.length - 1) {
    nextLesson = {
      ...lessons[currentLessonIndex + 1],
      moduleSlug: currentModule.slug
    };
  } else if (currentModuleIndex < modules.length - 1) {
    const nextModule = modules[currentModuleIndex + 1];
    const nextModuleLessons = nextModule.lessons?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [];
    if (nextModuleLessons.length > 0) {
      nextLesson = {
        ...nextModuleLessons[0],
        moduleSlug: nextModule.slug
      };
    }
  }

  // Parse MDX content
  const mdxSource = await parseMdx(currentLesson.content_md || '');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl relative">
      <Breadcrumbs items={[
        { label: 'Courses', href: '/courses' },
        { label: course.title, href: `/courses/${courseSlug}` },
        { label: currentModule.title, href: `/courses/${courseSlug}/${moduleSlug}` },
        { label: currentLesson.title }
      ]} />

      <div className="bg-surface-card border border-border rounded-3xl overflow-hidden shadow-sm mb-12">
        <div className="p-8 md:p-12 border-b border-border bg-surface-elevated">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold text-brand uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full border border-brand-light">
              Lesson {currentLessonIndex + 1}
            </span>
            <span className="text-xs font-medium text-text-muted px-2 py-1 rounded bg-surface-card border border-border capitalize">
              {currentLesson.lesson_type}
            </span>
            {currentLesson.estimated_minutes && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
                <Clock size={14} />
                {currentLesson.estimated_minutes} min read
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-text-primary tracking-tight leading-tight">
            {currentLesson.title}
          </h1>
        </div>

        <div className="p-8 md:p-12">
          <LessonContent 
            lessonId={currentLesson.id} 
            moduleId={currentModule.id}
            courseId={course.id}
            source={currentLesson.content_md || ''} 
          />
          
          {handouts && handouts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <HandoutList handouts={handouts} />
            </div>
          )}
        </div>

        <div className="p-8 bg-surface-elevated border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full">
            {previousLesson && (
              <Link 
                href={`/courses/${courseSlug}/${previousLesson.moduleSlug}/${previousLesson.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-brand transition-colors"
              >
                <ArrowLeft size={16} />
                Previous: {previousLesson.title}
              </Link>
            )}
          </div>

          <div className="flex-1 w-full flex justify-end">
            {nextLesson && (
              <Link 
                href={`/courses/${courseSlug}/${nextLesson.moduleSlug}/${nextLesson.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-brand transition-colors"
              >
                Next: {nextLesson.title}
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <AIChatWidget 
        lessonId={currentLesson.id} 
        contextTitle={`${course.title} - ${currentLesson.title}`} 
      />
    </div>
  );
}
