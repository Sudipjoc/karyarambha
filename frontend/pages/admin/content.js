import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/Layout';
import { isAuthenticated, getUser } from '../../lib/auth';
import api from '../../lib/api';

const SECTIONS = ['hero', 'about', 'services', 'portfolio', 'contact', 'footer'];
const BLOCK_TYPES = ['heading', 'paragraph', 'image', 'button', 'card', 'list'];

export default function ContentPage() {
  const router = useRouter();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [form, setForm] = useState({ section: 'hero', blockType: 'heading', title: '', content: '', order: 0, isActive: true });
  const [submitting, setSubmitting] = useState(false);
  const user = typeof window !== 'undefined' ? getUser() : null;

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/admin/login'); return; }
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/content/admin');
      setBlocks(res.data.data.blocks);
    } catch {} finally { setLoading(false); }
  };

  const openEdit = (block) => {
    setEditingBlock(block);
    setForm({ section: block.section, blockType: block.blockType, title: block.title || '', content: block.content || '', order: block.order, isActive: block.isActive });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingBlock(null);
    setForm({ section: 'hero', blockType: 'heading', title: '', content: '', order: 0, isActive: true });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingBlock) {
        await api.put(`/content/${editingBlock.id}`, form);
      } else {
        await api.post('/content', form);
      }
      resetForm();
      fetchBlocks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save block.');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this block?')) return;
    try {
      await api.delete(`/content/${id}`);
      setBlocks(blocks.filter((b) => b.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete block.');
    }
  };

  const grouped = SECTIONS.reduce((acc, s) => {
    acc[s] = blocks.filter((b) => b.section === s);
    return acc;
  }, {});

  return (
    <AdminLayout title="Page Builder">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visual Page Builder</h1>
          <p className="text-gray-500 text-sm mt-1">Manage website content blocks by section</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary">
          + Add Block
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 border border-primary-100">
          <h2 className="text-lg font-semibold mb-4">{editingBlock ? 'Edit Block' : 'Add Content Block'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Section</label>
              <select className="input" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}>
                {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Block Type</label>
              <select className="input" value={form.blockType} onChange={(e) => setForm({ ...form, blockType: e.target.value })}>
                {BLOCK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Title</label>
              <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="label">Display Order</label>
              <input type="number" className="input" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })} />
            </div>
            <div className="md:col-span-2">
              <label className="label">Content</label>
              <textarea className="input" rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4" />
              <label htmlFor="isActive" className="text-sm text-gray-700">Active (visible on website)</label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
              {submitting ? 'Saving...' : (editingBlock ? 'Update Block' : 'Add Block')}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {/* Blocks by Section */}
      {loading ? (
        <p className="text-gray-400">Loading blocks...</p>
      ) : (
        <div className="space-y-6">
          {SECTIONS.map((section) => (
            <div key={section} className="card">
              <h2 className="text-lg font-semibold text-gray-900 capitalize mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-primary-500 rounded-full inline-block"></span>
                {section} Section
                <span className="text-gray-400 text-sm font-normal">({grouped[section].length} blocks)</span>
              </h2>
              {grouped[section].length === 0 ? (
                <p className="text-gray-400 text-sm">No blocks in this section.</p>
              ) : (
                <div className="space-y-2">
                  {grouped[section].map((block) => (
                    <div key={block.id} className={`flex items-center gap-4 p-3 rounded-lg border ${block.isActive ? 'border-gray-100 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{block.blockType}</span>
                          <span className="font-medium text-sm">{block.title || '(no title)'}</span>
                          {!block.isActive && <span className="text-xs text-gray-400">(hidden)</span>}
                        </div>
                        {block.content && <p className="text-xs text-gray-400 line-clamp-1">{block.content}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(block)} className="text-xs text-primary-600 hover:text-primary-800">Edit</button>
                        <button onClick={() => handleDelete(block.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
