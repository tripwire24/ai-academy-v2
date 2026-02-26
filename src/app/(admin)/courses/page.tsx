import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { PlusCircle, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';

export default async function AdminCoursesPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from('courses')
    .select('*, modules(id), enrollments(id)')
    .order('created_at', { ascending: false });

  const formattedCourses = courses?.map(c => ({
    ...c,
    moduleCount: c.modules?.length || 0,
    enrollmentCount: c.enrollments?.length || 0,
  })) || [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Manage Courses</h1>
          <p className="text-text-secondary">Create, edit, and publish courses.</p>
        </div>
        <Link 
          href="/admin/courses/new" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-secondary transition-colors shadow-sm"
        >
          <PlusCircle size={18} />
          Create Course
        </Link>
      </div>

      <AdminTable
        data={formattedCourses}
        searchKey="title"
        columns={[
          {
            header: 'Title',
            accessor: 'title',
            sortable: true,
          },
          {
            header: 'Status',
            accessor: (row) => (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                row.published 
                  ? 'bg-success-light text-success border-success/20' 
                  : 'bg-surface-elevated text-text-muted border-border'
              }`}>
                {row.published ? <Eye size={12} /> : <EyeOff size={12} />}
                {row.published ? 'Published' : 'Draft'}
              </span>
            ),
          },
          {
            header: 'Modules',
            accessor: 'moduleCount',
            sortable: true,
          },
          {
            header: 'Enrollments',
            accessor: 'enrollmentCount',
            sortable: true,
          },
          {
            header: 'Actions',
            accessor: (row) => (
              <div className="flex items-center gap-2">
                <Link 
                  href={`/admin/courses/${row.id}`}
                  className="p-1.5 text-text-muted hover:text-brand transition-colors rounded hover:bg-surface-elevated"
                >
                  <Edit2 size={16} />
                </Link>
                <button 
                  className="p-1.5 text-text-muted hover:text-error transition-colors rounded hover:bg-error-light/50"
                  title="Delete course"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
