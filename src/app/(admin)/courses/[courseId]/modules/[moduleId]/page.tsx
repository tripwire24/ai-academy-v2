'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, PlusCircle, GripVertical, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

export default function EditModulePage({ params }: { params: { courseId: string, moduleId: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    estimated_minutes: 0,
    published: false,
  });

  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await fetch(`/api/modules/${params.moduleId}`);
        if (!res.ok) throw new Error('Failed to fetch module');
        const data = await res.json();
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          description: data.description || '',
          estimated_minutes: data.estimated_minutes || 0,
          published: data.published ?? false,
        });
        setLessons(data.lessons?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsFetching(false);
      }
    };
    fetchModule();
  }, [params.moduleId]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug === generateSlug(prev.title) ? generateSlug(title) : prev.slug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/modules/${params.moduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update module');
      }

      router.push(`/admin/courses/${params.courseId}/modules`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-brand" size={32} /></div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <Link href={`/admin/courses/${params.courseId}/modules`} className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors mb-4">
          <ArrowLeft size={16} /> Back to Modules
        </Link>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Edit Module</h1>
        <p className="text-text-secondary">Update module details and manage its lessons.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-light text-error rounded-xl border border-error/20 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="space-y-6 bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-text-primary mb-4">Module Settings</h2>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-text-primary">Module Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full px-4 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-text-primary">URL Slug</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-text-primary">Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand resize-y"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-text-primary">Estimated Minutes</label>
              <input
                type="number"
                min="0"
                value={formData.estimated_minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_minutes: parseInt(e.target.value, 10) }))}
                className="w-full px-4 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer pt-4 border-t border-border">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                className="w-5 h-5 rounded border-border text-brand focus:ring-brand"
              />
              <span className="text-sm font-medium text-text-primary">Published</span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-2 bg-brand text-white font-medium rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Module
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary">Lessons</h2>
            <button 
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-border text-text-primary text-sm font-medium rounded-lg hover:bg-surface-card transition-colors shadow-sm"
            >
              <PlusCircle size={18} className="text-brand" />
              Add Lesson
            </button>
          </div>

          <div className="bg-surface-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-border">
              {lessons.length === 0 ? (
                <div className="p-8 text-center text-text-secondary">
                  No lessons in this module yet.
                </div>
              ) : (
                lessons.map((lesson, index) => (
                  <div key={lesson.id} className="p-4 flex items-center gap-4 hover:bg-surface-elevated/50 transition-colors group">
                    <div className="flex items-center justify-center cursor-grab text-text-muted hover:text-text-primary">
                      <GripVertical size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                          Lesson {index + 1}
                        </span>
                        <span className="text-xs font-medium text-text-muted px-2 py-0.5 rounded bg-surface-elevated border border-border capitalize">
                          {lesson.lesson_type}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${
                          lesson.published 
                            ? 'bg-success-light text-success border-success/20' 
                            : 'bg-surface-elevated text-text-muted border-border'
                        }`}>
                          {lesson.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium text-text-primary truncate">
                        {lesson.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-text-muted hover:text-brand transition-colors rounded hover:bg-surface-elevated">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 text-text-muted hover:text-error transition-colors rounded hover:bg-error-light/50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
