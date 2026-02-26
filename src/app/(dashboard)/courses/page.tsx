import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/guards';
import { CourseCard } from '@/components/course/CourseCard';

export default async function CoursesPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  // Fetch all published courses
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      id,
      slug,
      title,
      subtitle,
      cover_image,
      difficulty,
      estimated_hours,
      modules (id)
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  // Fetch user enrollments
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id, status')
    .eq('user_id', user.id);

  const enrolledCourseIds = new Set(enrollments?.map(e => e.course_id) || []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-text-primary mb-4 tracking-tight">Course Catalogue</h1>
        <p className="text-lg text-text-secondary max-w-2xl">
          Explore our executive training programs designed to build AI readiness and capability across your organization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses?.map((course: any) => (
          <CourseCard
            key={course.id}
            course={{
              ...course,
              moduleCount: course.modules?.length || 0,
            }}
            isEnrolled={enrolledCourseIds.has(course.id)}
            progress={0} // TODO: Calculate actual progress
          />
        ))}
      </div>

      {(!courses || courses.length === 0) && (
        <div className="text-center py-24 bg-surface-card rounded-2xl border border-border">
          <h3 className="text-xl font-semibold text-text-primary mb-2">No courses available</h3>
          <p className="text-text-secondary">Check back soon for new content.</p>
        </div>
      )}
    </div>
  );
}
