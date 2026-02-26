'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, ArrowLeft, Layers } from 'lucide-react';
import Link from 'next/link';

export default function EditCoursePage({ params }: { params: { courseId: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    category: 'general',
    difficulty: 'beginner',
    estimated_hours: 0,
    is_sequential: true,
    published: false,
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${params.courseId}`);
        if (!res.ok) throw new Error('Failed to fetch course');
        const data = await res.json();
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          category: data.category || 'general',
          difficulty: data.difficulty || 'beginner',
          estimated_hours: data.estimated_hours || 0,
          is_sequential: data.is_sequential ?? true,
          published: data.published ?? false,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsFetching(false);
      }
    };
    fetchCourse();
  }, [params.courseId]);

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
      const res = await fetch(`/api/courses/${params.courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update course');
      }

      router.push('/admin/courses');
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
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/courses" className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors mb-4">
            <ArrowLeft size={16} /> Back to Courses
          </Link>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Edit Course</h1>
          <p className="text-text-secondary">Update course details and settings.</p>
        </div>
        <Link 
          href={`/admin/courses/${params.courseId}/modules`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-border text-text-primary text-sm font-medium rounded-lg hover:bg-surface-card transition-colors shadow-sm"
        >
          <Layers size={18} className="text-brand" />
          Manage Modules
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-light text-error rounded-xl border border-error/20 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-surface-card border border-border rounded-2xl p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-text-primary">Course Title</label>
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
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-text-primary">Subtitle</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
            className="w-full px-4 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-text-primary">Full Description (Markdown)</label>
          <textarea
            rows={6}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand font-mono text-sm resize-y"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-text-primary">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="general">General</option>
              <option value="technology">Technology</option>
              <option value="business">Business</option>
              <option value="design">Design</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-bold text-text-primary">Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
              className="w-full px-4 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-bold text-text-primary">Estimated Hours</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={formData.estimated_hours}
              onChange={(e) => setFormData(prev => ({ ...prev, estimated_hours: parseFloat(e.target.value) }))}
              className="w-full px-4 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-4 border-t border-border">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_sequential}
              onChange={(e) => setFormData(prev => ({ ...prev, is_sequential: e.target.checked }))}
              className="w-5 h-5 rounded border-border text-brand focus:ring-brand"
            />
            <span className="text-sm font-medium text-text-primary">Sequential Learning</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="w-5 h-5 rounded border-border text-brand focus:ring-brand"
            />
            <span className="text-sm font-medium text-text-primary">Published</span>
          </label>
        </div>

        <div className="pt-6 flex justify-end gap-4">
          <Link
            href="/admin/courses"
            className="px-6 py-2 border border-border text-text-primary font-medium rounded-lg hover:bg-surface-elevated transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-2 bg-brand text-white font-medium rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
