import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/Layout';
import { isAuthenticated } from '../../lib/auth';
import api from '../../lib/api';

export default function ServicesAdminPage() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', icon: '', order: 0, isActive: true, metaTitle: '', metaDescription: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/admin/login'); return; }
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/services/admin');
      setServices(res.data.data.services);
    } catch {} finally { setLoading(false); }
  };

  const openEdit = (svc) => {
    setEditingService(svc);
    setForm({ title: svc.title, description: svc.description, icon: svc.icon || '', order: svc.order, isActive: svc.isActive, metaTitle: svc.metaTitle || '', metaDescription: svc.metaDescription || '' });
    setShowForm(true);
  };

  const resetForm = () => { setEditingService(null); setForm({ title: '', description: '', icon: '', order: 0, isActive: true, metaTitle: '', metaDescription: '' }); setShowForm(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingService) { await api.put(`/services/${editingService.id}`, form); }
      else { await api.post('/services', form); }
      resetForm(); fetchServices();
    } catch (err) { alert(err.response?.data?.message || 'Failed.'); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    try { await api.delete(`/services/${id}`); setServices(services.filter((s) => s.id !== id)); }
    catch (err) { alert(err.response?.data?.message || 'Failed.'); }
  };

  return (
    <AdminLayout title="Services">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-500 text-sm mt-1">Manage services with SEO metadata</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary">+ Add Service</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 border border-primary-100">
          <h2 className="text-lg font-semibold mb-4">{editingService ? 'Edit Service' : 'Add Service'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label">Title *</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div><label className="label">Icon (emoji or class)</label><input className="input" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="💻" /></div>
            <div className="md:col-span-2"><label className="label">Description *</label><textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
            <div><label className="label">Display Order</label><input type="number" className="input" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })} /></div>
            <div className="flex items-end gap-2 pb-2"><input type="checkbox" id="svcActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4" /><label htmlFor="svcActive" className="text-sm">Active</label></div>
            <div className="border-t md:col-span-2 pt-4">
              <h3 className="font-medium text-gray-700 mb-3">SEO Settings <span className="text-xs text-gray-400 font-normal">(auto-generated if empty)</span></h3>
            </div>
            <div><label className="label">Meta Title</label><input className="input" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} placeholder={form.title} /></div>
            <div><label className="label">Meta Description</label><textarea className="input" rows={2} maxLength={160} value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} /></div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">{submitting ? 'Saving...' : (editingService ? 'Update' : 'Add Service')}</button>
            <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? <p className="text-gray-400">Loading...</p>
          : services.length === 0 ? <div className="card text-center py-8 text-gray-400 col-span-2">No services yet.</div>
          : services.map((svc) => (
          <div key={svc.id} className={`card flex items-start gap-4 ${!svc.isActive ? 'opacity-60' : ''}`}>
            <span className="text-3xl">{svc.icon || '🔧'}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{svc.title}</h3>
              <p className="text-gray-500 text-sm line-clamp-2">{svc.description}</p>
              {!svc.isActive && <span className="text-xs text-gray-400">Hidden</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(svc)} className="text-xs text-primary-600 hover:text-primary-800">Edit</button>
              <button onClick={() => handleDelete(svc.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
