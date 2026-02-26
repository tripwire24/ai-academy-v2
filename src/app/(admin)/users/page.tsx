import { createClient } from '@/lib/supabase/server';
import { AdminTable } from '@/components/admin/AdminTable';
import { Download, Shield, ShieldAlert, User } from 'lucide-react';

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from('profiles')
    .select('*, enrollments(id)')
    .order('created_at', { ascending: false });

  const formattedUsers = users?.map(u => ({
    ...u,
    enrollmentCount: u.enrollments?.length || 0,
  })) || [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Manage Users</h1>
          <p className="text-text-secondary">View and manage user roles and access.</p>
        </div>
        <button 
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-border text-text-primary text-sm font-medium rounded-lg hover:bg-surface-card transition-colors shadow-sm"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <AdminTable
        data={formattedUsers}
        searchKey="full_name"
        columns={[
          {
            header: 'Name',
            accessor: 'full_name',
            sortable: true,
          },
          {
            header: 'Email',
            accessor: 'email',
            sortable: true,
          },
          {
            header: 'Company',
            accessor: 'company',
            sortable: true,
          },
          {
            header: 'Role',
            accessor: (row) => (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                row.role === 'admin' 
                  ? 'bg-error-light text-error border-error/20' 
                  : row.role === 'trainer'
                  ? 'bg-warning-light text-warning border-warning/20'
                  : 'bg-surface-elevated text-text-muted border-border'
              }`}>
                {row.role === 'admin' ? <ShieldAlert size={12} /> : row.role === 'trainer' ? <Shield size={12} /> : <User size={12} />}
                {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
              </span>
            ),
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
                <select 
                  defaultValue={row.role}
                  className="text-xs bg-surface-elevated border border-border rounded px-2 py-1 text-text-primary focus:outline-none focus:ring-1 focus:ring-brand"
                  onChange={async (e) => {
                    // In a real app, this would call the API to update the role
                    const newRole = e.target.value;
                    await fetch(`/api/users/${row.id}/role`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ role: newRole })
                    });
                    // Then refresh or optimistically update
                  }}
                >
                  <option value="learner">Learner</option>
                  <option value="trainer">Trainer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
