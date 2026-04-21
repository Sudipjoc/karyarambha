import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/Layout';
import { isAuthenticated } from '../../lib/auth';
import api from '../../lib/api';

export default function TestimonialsAdminPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ clientName: '', company: '', content: '', rating: 5, photoUrl: '', isActive: true });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/admin/login'); return; }
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await api.get('/testimonials/admin');
      setTestimonials(res.data.data.testimonials);
    } catch {} finally { setLoading(false); }
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({ clientName: item.clientName, company: item.company || '', content: item.content, rating: item.rating, photoUrl: item.photoUrl || '', isActive: item.isActive });
    setShowForm(true);
  };

  const resetForm = () => { setEditingItem(null); setForm({ clientName: '', company: '', content: '', rating: 5, photoUrl: '', isActive: true }); setShowForm(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingItem) { await api.put(`/testimonials/${editingItem.id}`, form); }
      else { await api.post('/testimonials', form); }
      resetForm(); fetchTestimonials();
    } catch (err) { alert(err.response?.data?.message || 'Failed.'); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try { await api.delete(`/testimonials/${id}`); setTestimonials(testimonials.filter((t) => t.id !== id)); }
    catch (err) { alert(err.response?.data?.message || 'Failed.'); }
  };

  return (
    <AdminLayout title="Testimonials">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary">+ Add Testimonial</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 border border-primary-100">
          <h2 className="text-lg font-semibold mb-4">{editingItem ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label">Client Name *</label><input className="input" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} required /></div>
            <div><label className="label">Company</label><input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
            <div>
              <label className="label">Rating</label>
              <select className="input" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div><label className="label">Photo URL</label><input className="input" value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} /></div>
            <div className="md:col-span-2"><label className="label">Testimonial Content *</label><textarea className="input" rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required /></div>
            <div className="flex items-center gap-2"><input type="checkbox" id="tActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4" /><label htmlFor="tActive" className="text-sm">Active</label></div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">{submitting ? 'Saving...' : (editingItem ? 'Update' : 'Add')}</button>
            <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {loading ? <p className="text-gray-400">Loading...</p>
          : testimonials.length === 0 ? <div className="card text-center py-8 text-gray-400">No testimonials yet.</div>
          : testimonials.map((t) => (
          <div key={t.id} className={`card flex items-start gap-4 ${!t.isActive ? 'opacity-60' : ''}`}>
            <div className="flex-1">
              <div className="flex mb-1">{[...Array(t.rating)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}</div>
              <p className="text-gray-700 italic mb-2">"{t.content}"</p>
              <p className="text-sm font-semibold text-gray-900">{t.clientName}{t.company && <span className="text-gray-500 font-normal">, {t.company}</span>}</p>
              {!t.isActive && <span className="text-xs text-gray-400">Hidden</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(t)} className="text-xs text-primary-600 hover:text-primary-800">Edit</button>
              <button onClick={() => handleDelete(t.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
