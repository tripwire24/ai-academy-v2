import Link from 'next/link';
import Image from 'next/image';
import { Clock, BookOpen, BarChart } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    cover_image?: string;
    difficulty?: string;
    estimated_hours?: number;
    moduleCount?: number;
  };
  isEnrolled?: boolean;
  progress?: number;
}

export function CourseCard({ course, isEnrolled = false, progress = 0 }: CourseCardProps) {
  return (
    <div className="bg-surface-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-md transition-shadow flex flex-col h-full group">
      <div className="relative h-48 w-full bg-surface-elevated overflow-hidden">
        {course.cover_image ? (
          <Image
            src={course.cover_image}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-text-muted">
            <BookOpen size={48} opacity={0.5} />
          </div>
        )}
        {course.difficulty && (
          <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-primary/90 backdrop-blur-sm text-text-primary border border-border/50 capitalize">
            {course.difficulty}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-brand transition-colors">
          {course.title}
        </h3>
        
        {course.subtitle && (
          <p className="text-sm text-text-secondary mb-4 line-clamp-2 flex-grow">
            {course.subtitle}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs font-medium text-text-muted mb-6 mt-auto">
          {course.estimated_hours && (
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{course.estimated_hours}h</span>
            </div>
          )}
          {course.moduleCount !== undefined && (
            <div className="flex items-center gap-1.5">
              <BookOpen size={14} />
              <span>{course.moduleCount} Modules</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <BarChart size={14} />
            <span className="capitalize">{course.difficulty || 'Beginner'}</span>
          </div>
        </div>

        {isEnrolled ? (
          <div className="mt-auto">
            <div className="flex items-center justify-between text-xs font-medium mb-2">
              <span className="text-text-secondary">Progress</span>
              <span className="text-brand">{progress}%</span>
            </div>
            <div className="w-full bg-surface-elevated rounded-full h-2 mb-4 overflow-hidden">
              <div 
                className="bg-brand h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <Link 
              href={`/courses/${course.slug}`}
              className="block w-full text-center py-2.5 px-4 border border-border rounded-lg text-sm font-semibold text-text-primary hover:bg-surface-elevated transition-colors"
            >
              Continue Learning
            </Link>
          </div>
        ) : (
          <div className="mt-auto">
            <Link 
              href={`/courses/${course.slug}`}
              className="block w-full text-center py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-brand hover:bg-brand-secondary transition-colors"
            >
              View Course
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
