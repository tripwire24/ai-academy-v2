import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/guards';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Clock, BookOpen, CheckCircle, PlayCircle, Circle, ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ModuleGate } from '@/components/progress/ModuleGate';

export default async function ModuleOverviewPage({ params }: { params: { courseSlug: string, moduleSlug: string } }) {
  const user = await requireAuth();
  const supabase = await createClient();
  const { courseSlug, moduleSlug } = params;

  // Fetch course and module details
  const { data: course } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      slug,
      is_sequential,
      modules (
        id,
        slug,
        title,
        description,
        sort_order,
        estimated_minutes,
        lessons (
          id,
          slug,
          title,
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
  const previousModule = currentModuleIndex > 0 ? modules[currentModuleIndex - 1] : null;

  // Sort lessons
  const lessons = currentModule.lessons?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [];

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

  // Fetch progress
  const { data: progressData } = await supabase
    .from('progress')
    .select('lesson_id, status')
    .eq('user_id', user.id);

  const progress = progressData || [];

  // Helper to check if a module is completed
  const isModuleCompleted = (mod: any) => {
    if (!mod.lessons || mod.lessons.length === 0) return false;
    return mod.lessons.every((l: any) => 
      progress.some(p => p.lesson_id === l.id && p.status === 'completed')
    );
  };

  // Gating logic
  const isLocked = course.is_sequential && previousModule && !isModuleCompleted(previousModule);

  // Calculate module progress
  const completedLessons = lessons.filter((l: any) => 
    progress.some(p => p.lesson_id === l.id && p.status === 'completed')
  ).length;
  const progressPercentage = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumbs items={[
        { label: 'Courses', href: '/courses' },
        { label: course.title, href: `/courses/${courseSlug}` },
        { label: currentModule.title }
      ]} />

      <div className="mb-8">
        <Link 
          href={`/courses/${courseSlug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Course
        </Link>
        
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-bold text-brand uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full border border-brand-light">
            Module {currentModuleIndex + 1}
          </span>
          {completedLessons === lessons.length && lessons.length > 0 && (
            <span className="flex items-center gap-1 text-xs font-medium text-success bg-success-light px-2 py-1 rounded-full border border-success/20">
              <CheckCircle size={14} /> Completed
            </span>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4 tracking-tight">
          {currentModule.title}
        </h1>
        
        {currentModule.description && (
          <p className="text-lg text-text-secondary mb-8 leading-relaxed max-w-3xl">
            {currentModule.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-text-muted mb-8 bg-surface-card border border-border rounded-xl p-4 shadow-sm w-fit">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-brand" />
            <span>{lessons.length} Lessons</span>
          </div>
          {currentModule.estimated_minutes && (
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-brand" />
              <span>{currentModule.estimated_minutes} mins</span>
            </div>
          )}
          <div className="flex items-center gap-3 pl-6 border-l border-border">
            <span className="text-text-secondary">Progress:</span>
            <div className="w-32 bg-surface-elevated rounded-full h-2 overflow-hidden">
              <div 
                className="bg-brand h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-brand font-bold">{progressPercentage}%</span>
          </div>
        </div>
      </div>

      <ModuleGate isLocked={isLocked} previousModuleTitle={previousModule?.title}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-text-primary mb-4">Lessons</h2>
          
          {lessons.map((lesson: any, index: number) => {
            const lessonProgress = progress.find(p => p.lesson_id === lesson.id);
            const status = lessonProgress?.status || 'not_started';
            
            return (
              <Link 
                key={lesson.id}
                href={`/courses/${courseSlug}/${moduleSlug}/${lesson.slug}`}
                className="block bg-surface-card border border-border rounded-2xl p-5 hover:border-brand/30 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {status === 'completed' ? (
                      <CheckCircle size={24} className="text-success" />
                    ) : status === 'in_progress' ? (
                      <PlayCircle size={24} className="text-brand" />
                    ) : (
                      <Circle size={24} className="text-text-muted group-hover:text-text-secondary transition-colors" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Lesson {index + 1}
                      </span>
                      <span className="text-xs font-medium text-text-muted px-2 py-0.5 rounded bg-surface-elevated capitalize">
                        {lesson.lesson_type}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-text-primary truncate group-hover:text-brand transition-colors">
                      {lesson.title}
                    </h3>
                  </div>
                  
                  {lesson.estimated_minutes && (
                    <div className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-text-muted bg-surface-elevated px-2.5 py-1 rounded-full">
                      <Clock size={14} />
                      <span>{lesson.estimated_minutes}m</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
          
          {lessons.length === 0 && (
            <div className="text-center py-12 bg-surface-card rounded-2xl border border-border">
              <p className="text-text-secondary">No lessons available in this module yet.</p>
            </div>
          )}
        </div>
      </ModuleGate>
    </div>
  );
}
