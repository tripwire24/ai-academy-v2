import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { BookOpen, FileText, User, Settings } from 'lucide-react';

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-surface-primary/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl tracking-tight text-brand">
            Tripwire AI Academy
          </Link>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-text-secondary">
            <Link href="/dashboard/courses" className="hover:text-brand transition-colors flex items-center gap-2">
              <BookOpen size={16} />
              Courses
            </Link>
            <Link href="/dashboard/notes" className="hover:text-brand transition-colors flex items-center gap-2">
              <FileText size={16} />
              Notes
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/admin" className="hidden md:flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors">
            <Settings size={16} />
            Admin
          </Link>
          <ThemeToggle />
          <Link href="/dashboard/profile" className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand font-medium hover:bg-brand hover:text-white transition-colors">
            <User size={16} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
