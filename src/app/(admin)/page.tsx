import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Users, BookOpen, CheckCircle, PlusCircle, Upload, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch stats
  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: activeLearners } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'learner');
  const { count: totalCourses } = await supabase.from('courses').select('*', { count: 'exact', head: true });
  
  const { data: progressData } = await supabase.from('progress').select('status');
  const totalProgress = progressData?.length || 0;
  const completedProgress = progressData?.filter(p => p.status === 'completed').length || 0;
  const completionRate = totalProgress > 0 ? Math.round((completedProgress / totalProgress) * 100) : 0;

  // Fetch recent activity
  const { data: recentEnrollments } = await supabase
    .from('enrollments')
    .select('id, created_at, profiles(full_name), courses(title)')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Admin Dashboard</h1>
        <p className="text-text-secondary">Overview of platform activity and quick actions.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-brand-50 text-brand flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Total Users</p>
              <h3 className="text-2xl font-bold text-text-primary">{totalUsers || 0}</h3>
            </div>
          </div>
        </div>
        <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-info-light text-info flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Active Learners</p>
              <h3 className="text-2xl font-bold text-text-primary">{activeLearners || 0}</h3>
            </div>
          </div>
        </div>
        <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-success-light text-success flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Total Courses</p>
              <h3 className="text-2xl font-bold text-text-primary">{totalCourses || 0}</h3>
            </div>
          </div>
        </div>
        <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-warning-light text-warning flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Completion Rate</p>
              <h3 className="text-2xl font-bold text-text-primary">{completionRate}%</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-text-primary mb-4">Quick Actions</h2>
          <Link href="/admin/courses/new" className="flex items-center gap-3 p-4 bg-surface-card border border-border rounded-xl hover:border-brand/30 hover:shadow-sm transition-all group">
            <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle size={20} />
            </div>
            <div>
              <h4 className="font-bold text-text-primary">Create Course</h4>
              <p className="text-xs text-text-secondary">Start a new learning path</p>
            </div>
          </Link>
          <Link href="/admin/content" className="flex items-center gap-3 p-4 bg-surface-card border border-border rounded-xl hover:border-brand/30 hover:shadow-sm transition-all group">
            <div className="w-10 h-10 rounded-lg bg-info-light text-info flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload size={20} />
            </div>
            <div>
              <h4 className="font-bold text-text-primary">Upload Content</h4>
              <p className="text-xs text-text-secondary">Import MDX or handouts</p>
            </div>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 p-4 bg-surface-card border border-border rounded-xl hover:border-brand/30 hover:shadow-sm transition-all group">
            <div className="w-10 h-10 rounded-lg bg-warning-light text-warning flex items-center justify-center group-hover:scale-110 transition-transform">
              <Settings size={20} />
            </div>
            <div>
              <h4 className="font-bold text-text-primary">Manage Users</h4>
              <p className="text-xs text-text-secondary">View and edit user roles</p>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-text-primary mb-4">Recent Enrollments</h2>
          <div className="bg-surface-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-border">
              {recentEnrollments?.map((enrollment: any) => (
                <div key={enrollment.id} className="p-4 flex items-center justify-between hover:bg-surface-elevated transition-colors">
                  <div>
                    <p className="font-medium text-text-primary">{enrollment.profiles?.full_name}</p>
                    <p className="text-sm text-text-secondary">Enrolled in <span className="font-medium">{enrollment.courses?.title}</span></p>
                  </div>
                  <span className="text-xs text-text-muted">
                    {formatDistanceToNow(new Date(enrollment.created_at), { addSuffix: true })}
                  </span>
                </div>
              ))}
              {(!recentEnrollments || recentEnrollments.length === 0) && (
                <div className="p-8 text-center text-text-secondary">No recent activity.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
