import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, BookOpen, FileText, Users, BarChart3, LogOut } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'trainer')) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-surface-secondary flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-card border-r border-border flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="text-xl font-bold text-text-primary flex items-center gap-2">
            <span className="w-8 h-8 bg-brand text-white rounded-lg flex items-center justify-center">T</span>
            Tripwire Admin
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-text-secondary hover:text-brand hover:bg-brand-50 transition-colors">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/admin/courses" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-text-secondary hover:text-brand hover:bg-brand-50 transition-colors">
            <BookOpen size={18} /> Courses
          </Link>
          <Link href="/admin/content" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-text-secondary hover:text-brand hover:bg-brand-50 transition-colors">
            <FileText size={18} /> Content
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-text-secondary hover:text-brand hover:bg-brand-50 transition-colors">
            <Users size={18} /> Users
          </Link>
          <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-text-secondary hover:text-brand hover:bg-brand-50 transition-colors">
            <BarChart3 size={18} /> Analytics
          </Link>
        </nav>
        <div className="p-4 border-t border-border">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-text-secondary hover:text-error hover:bg-error-light transition-colors">
            <LogOut size={18} /> Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
