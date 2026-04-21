import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/Layout';
import { isAuthenticated, getUser } from '../../lib/auth';
import api from '../../lib/api';

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', status: 'draft', metaTitle: '', metaDescription: '', tags: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/admin/login'); return; }
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/blogs/admin');
      setBlogs(res.data.data.blogs);
    } catch {} finally { setLoading(false); }
  };

  const openEdit = (blog) => {
    setEditingBlog(blog);
    setForm({ title: blog.title, content: blog.content, excerpt: blog.excerpt || '', status: blog.status, metaTitle: blog.metaTitle || '', metaDescription: blog.metaDescription || '', tags: blog.tags || '' });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingBlog(null);
    setForm({ title: '', content: '', excerpt: '', status: 'draft', metaTitle: '', metaDescription: '', tags: '' });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingBlog) {
        await api.put(`/blogs/${editingBlog.id}`, form);
      } else {
        await api.post('/blogs', form);
      }
      resetForm();
      fetchBlogs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save blog.');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete blog.');
    }
  };

  const statusColors = { draft: 'bg-gray-100 text-gray-600', published: 'bg-green-100 text-green-700', archived: 'bg-red-100 text-red-600' };

  return (
    <AdminLayout title="Blogs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-500 text-sm mt-1">Create, edit, and publish blog posts with SEO automation</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary">
          + New Post
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 border border-primary-100">
          <h2 className="text-lg font-semibold mb-4">{editingBlog ? 'Edit Post' : 'New Blog Post'}</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Title *</label>
              <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="label">Excerpt</label>
              <textarea className="input" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief summary of the post..." />
            </div>
            <div>
              <label className="label">Content *</label>
              <textarea className="input font-mono" rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required placeholder="HTML content supported..." />
            </div>
            <div>
              <label className="label">Tags (comma separated)</label>
              <input className="input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="technology, web development, nepal" />
            </div>
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-700 mb-3">SEO Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Meta Title <span className="text-gray-400 text-xs">(auto-filled from title)</span></label>
                  <input className="input" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} placeholder={form.title} />
                </div>
                <div>
                  <label className="label">Meta Description <span className="text-gray-400 text-xs">(max 160 chars)</span></label>
                  <textarea className="input" rows={2} maxLength={160} value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} placeholder={form.excerpt?.substring(0, 160)} />
                </div>
              </div>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input w-auto" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
              {submitting ? 'Saving...' : (editingBlog ? 'Update Post' : 'Create Post')}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-400">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <div className="card text-center py-12 text-gray-400">No blog posts yet. Create your first post!</div>
        ) : blogs.map((blog) => (
          <div key={blog.id} className="card flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[blog.status]}`}>{blog.status}</span>
                <h3 className="font-semibold text-gray-900">{blog.title}</h3>
              </div>
              <p className="text-xs text-gray-400">
                By {blog.author?.name} · {new Date(blog.createdAt).toLocaleDateString()}
                {blog.tags && ` · ${blog.tags.split(',').slice(0, 3).join(', ')}`}
              </p>
            </div>
            <div className="flex gap-2">
              {blog.status === 'published' && (
                <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600">View →</a>
              )}
              <button onClick={() => openEdit(blog)} className="text-xs text-primary-600 hover:text-primary-800">Edit</button>
              <button onClick={() => handleDelete(blog.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
