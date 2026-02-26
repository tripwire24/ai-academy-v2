import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/guards';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, BookOpen, CheckCircle, Lock, PlayCircle, FileText } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export default async function CourseOverviewPage({ params }: { params: { courseSlug: string } }) {
  const user = await requireAuth();
  const supabase = await createClient();
  const { courseSlug } = params;

  // Fetch course details
  const { data: course } = await supabase
    .from('courses')
    .select(`
      *,
      modules (
        id,
        slug,
        title,
        description,
        sort_order,
        estimated_minutes,
        lessons (id, slug, title, sort_order)
      )
    `)
    .eq('slug', courseSlug)
    .single();

  if (!course) {
    notFound();
  }

  // Sort modules
  const modules = course.modules?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [];

  // Fetch enrollment status
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .single();

  const isEnrolled = !!enrollment;

  // Fetch progress if enrolled
  let progressData: any[] = [];
  if (isEnrolled) {
    const { data: pData } = await supabase
      .from('progress')
      .select('lesson_id, status')
      .eq('user_id', user.id);
    progressData = pData || [];
  }

  // Helper to check if a module is completed
  const isModuleCompleted = (mod: any) => {
    if (!mod.lessons || mod.lessons.length === 0) return false;
    return mod.lessons.every((l: any) => 
      progressData.some(p => p.lesson_id === l.id && p.status === 'completed')
    );
  };

  // Helper to check if a module is locked (sequential logic)
  const isModuleLocked = (index: number) => {
    if (!course.is_sequential || index === 0) return false;
    const prevModule = modules[index - 1];
    return !isModuleCompleted(prevModule);
  };

  // Calculate overall progress
  const totalLessons = modules.reduce((acc: number, mod: any) => acc + (mod.lessons?.length || 0), 0);
  const completedLessons = progressData.filter(p => p.status === 'completed').length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Handle enrollment action
  const handleEnroll = async () => {
    'use server';
    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) return;

    await supabaseServer.from('enrollments').insert({
      user_id: user.id,
      course_id: course.id,
      status: 'active'
    });
    
    redirect(`/courses/${courseSlug}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Breadcrumbs items={[
        { label: 'Courses', href: '/courses' },
        { label: course.title }
      ]} />

      {/* Hero Section */}
      <div className="bg-surface-card rounded-3xl border border-border overflow-hidden shadow-sm mb-12">
        <div className="md:flex">
          <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
            {course.difficulty && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand border border-brand-light capitalize mb-6 w-fit">
                {course.difficulty}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4 tracking-tight leading-tight">
              {course.title}
            </h1>
            {course.subtitle && (
              <p className="text-xl text-text-secondary mb-8 leading-relaxed max-w-2xl">
                {course.subtitle}
              </p>
            )}
            
            <div className="flex items-center gap-6 text-sm font-medium text-text-muted mb-8">
              {course.estimated_hours && (
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{course.estimated_hours} Hours</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <BookOpen size={18} />
                <span>{modules.length} Modules</span>
              </div>
            </div>

            {isEnrolled ? (
              <div className="flex items-center gap-6">
                <Link 
                  href={`/courses/${courseSlug}/${modules[0]?.slug || ''}`}
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-brand hover:bg-brand-secondary transition-colors shadow-sm"
                >
                  Continue Learning
                </Link>
                <div className="flex items-center gap-4">
                  {/* Progress Ring */}
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-surface-elevated"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-brand transition-all duration-1000 ease-out"
                        strokeDasharray={`${progressPercentage}, 100`}
                        strokeWidth="3"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-xs font-bold text-text-primary">{progressPercentage}%</span>
                  </div>
                  <span className="text-sm font-medium text-text-secondary">Completed</span>
                </div>
              </div>
            ) : (
              <form action={handleEnroll}>
                <button 
                  type="submit"
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-brand hover:bg-brand-secondary transition-colors shadow-sm"
                >
                  Enroll Now
                </button>
              </form>
            )}
          </div>
          
          <div className="md:w-1/3 relative min-h-[300px] bg-surface-elevated">
            {course.cover_image ? (
              <Image
                src={course.cover_image}
                alt={course.title}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-text-muted opacity-20">
                <BookOpen size={120} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-surface-card to-transparent md:w-24" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content: Modules */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Course Modules</h2>
            <div className="space-y-4">
              {modules.map((module: any, index: number) => {
                const isLocked = isEnrolled && isModuleLocked(index);
                const isCompleted = isEnrolled && isModuleCompleted(module);
                const hasStarted = isEnrolled && !isLocked && !isCompleted && module.lessons?.some((l: any) => 
                  progressData.some(p => p.lesson_id === l.id)
                );

                return (
                  <div 
                    key={module.id} 
                    className={`bg-surface-card border rounded-2xl p-6 transition-all ${
                      isLocked ? 'border-border/50 opacity-75' : 'border-border hover:border-brand/30 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-bold text-text-muted uppercase tracking-wider">
                            Module {index + 1}
                          </span>
                          {isCompleted && <span className="flex items-center gap-1 text-xs font-medium text-success bg-success-light px-2 py-0.5 rounded-full"><CheckCircle size={12} /> Completed</span>}
                          {hasStarted && <span className="flex items-center gap-1 text-xs font-medium text-brand bg-brand-50 px-2 py-0.5 rounded-full"><PlayCircle size={12} /> In Progress</span>}
                          {isLocked && <span className="flex items-center gap-1 text-xs font-medium text-text-muted bg-surface-elevated px-2 py-0.5 rounded-full"><Lock size={12} /> Locked</span>}
                        </div>
                        
                        {isLocked ? (
                          <h3 className="text-lg font-semibold text-text-secondary mb-2">{module.title}</h3>
                        ) : (
                          <Link href={`/courses/${courseSlug}/${module.slug}`} className="group">
                            <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-brand transition-colors">
                              {module.title}
                            </h3>
                          </Link>
                        )}
                        
                        {module.description && (
                          <p className="text-sm text-text-secondary line-clamp-2 mb-4">
                            {module.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs font-medium text-text-muted">
                          <div className="flex items-center gap-1.5">
                            <BookOpen size={14} />
                            <span>{module.lessons?.length || 0} Lessons</span>
                          </div>
                          {module.estimated_minutes && (
                            <div className="flex items-center gap-1.5">
                              <Clock size={14} />
                              <span>{module.estimated_minutes} mins</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {!isLocked && isEnrolled && (
                        <Link 
                          href={`/courses/${courseSlug}/${module.slug}`}
                          className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center text-text-secondary hover:bg-brand hover:text-white transition-colors flex-shrink-0"
                        >
                          <PlayCircle size={20} />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar: About & Handouts */}
        <div className="space-y-8">
          {course.description && (
            <div className="bg-surface-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">About this course</h3>
              <div className="prose prose-sm dark:prose-invert text-text-secondary">
                {/* Simple render for now, ideally use MDXRenderer if it's markdown */}
                <p>{course.description}</p>
              </div>
            </div>
          )}

          <div className="bg-surface-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <FileText size={20} className="text-brand" />
              Course Resources
            </h3>
            <div className="space-y-3">
              {/* Placeholder for handouts - would fetch from handouts table where course_id matches */}
              <div className="p-3 rounded-lg border border-border bg-surface-elevated flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-brand-50 text-brand flex items-center justify-center flex-shrink-0">
                  <FileText size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">Course Syllabus.pdf</p>
                  <p className="text-xs text-text-muted">PDF Document • 2.4 MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
