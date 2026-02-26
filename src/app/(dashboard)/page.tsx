import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/guards';
import Link from 'next/link';
import { BookOpen, PlayCircle, Award } from 'lucide-react';
import { CourseCard } from '@/components/course/CourseCard';

export default async function DashboardPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  // Fetch enrolled courses
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      course_id,
      status,
      courses (
        id,
        slug,
        title,
        subtitle,
        cover_image,
        difficulty,
        estimated_hours,
        modules (id)
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'active');

  // Fetch overall progress stats (simplified for now)
  const { data: progress } = await supabase
    .from('progress')
    .select('status')
    .eq('user_id', user.id);

  const completedLessons = progress?.filter(p => p.status === 'completed').length || 0;
  const inProgressLessons = progress?.filter(p => p.status === 'in_progress').length || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome back</h1>
        <p className="text-text-secondary">Pick up where you left off or explore new courses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-surface-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">Enrolled Courses</p>
            <p className="text-2xl font-bold text-text-primary">{enrollments?.length || 0}</p>
          </div>
        </div>
        
        <div className="bg-surface-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-info-light flex items-center justify-center text-info">
            <PlayCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">In Progress Lessons</p>
            <p className="text-2xl font-bold text-text-primary">{inProgressLessons}</p>
          </div>
        </div>

        <div className="bg-surface-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success-light flex items-center justify-center text-success">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">Completed Lessons</p>
            <p className="text-2xl font-bold text-text-primary">{completedLessons}</p>
          </div>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">Your Courses</h2>
        <Link href="/courses" className="text-sm font-medium text-brand hover:text-brand-secondary transition-colors">
          Browse Catalogue &rarr;
        </Link>
      </div>

      {enrollments && enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment: any) => {
            const course = enrollment.courses;
            if (!course) return null;
            return (
              <CourseCard
                key={course.id}
                course={{
                  ...course,
                  moduleCount: course.modules?.length || 0,
                }}
                isEnrolled={true}
                progress={0} // TODO: Calculate actual progress
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-surface-card border border-border rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mx-auto mb-4 text-text-muted">
            <BookOpen size={32} />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No active courses</h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            You haven't enrolled in any courses yet. Browse our catalogue to start your learning journey.
          </p>
          <Link 
            href="/courses" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-brand hover:bg-brand-secondary transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
}
