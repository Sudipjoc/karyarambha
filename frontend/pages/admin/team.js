import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/Layout';
import { isAuthenticated } from '../../lib/auth';
import api from '../../lib/api';

export default function TeamAdminPage() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [form, setForm] = useState({ name: '', designation: '', bio: '', photoUrl: '', linkedinUrl: '', order: 0, isActive: true });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/admin/login'); return; }
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/team/admin');
      setMembers(res.data.data.members);
    } catch {} finally { setLoading(false); }
  };

  const openEdit = (member) => {
    setEditingMember(member);
    setForm({ name: member.name, designation: member.designation, bio: member.bio || '', photoUrl: member.photoUrl || '', linkedinUrl: member.linkedinUrl || '', order: member.order, isActive: member.isActive });
    setShowForm(true);
  };

  const resetForm = () => { setEditingMember(null); setForm({ name: '', designation: '', bio: '', photoUrl: '', linkedinUrl: '', order: 0, isActive: true }); setShowForm(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingMember) { await api.put(`/team/${editingMember.id}`, form); }
      else { await api.post('/team', form); }
      resetForm(); fetchMembers();
    } catch (err) { alert(err.response?.data?.message || 'Failed.'); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this team member?')) return;
    try { await api.delete(`/team/${id}`); setMembers(members.filter((m) => m.id !== id)); }
    catch (err) { alert(err.response?.data?.message || 'Failed.'); }
  };

  return (
    <AdminLayout title="Team Members">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary">+ Add Member</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 border border-primary-100">
          <h2 className="text-lg font-semibold mb-4">{editingMember ? 'Edit Member' : 'Add Team Member'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label">Name *</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><label className="label">Designation *</label><input className="input" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} required /></div>
            <div><label className="label">Photo URL</label><input className="input" value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} placeholder="https://..." /></div>
            <div><label className="label">LinkedIn URL</label><input className="input" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/..." /></div>
            <div><label className="label">Display Order</label><input type="number" className="input" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })} /></div>
            <div className="flex items-end gap-2 pb-2"><input type="checkbox" id="memberActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4" /><label htmlFor="memberActive" className="text-sm">Active</label></div>
            <div className="md:col-span-2"><label className="label">Bio</label><textarea className="input" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">{submitting ? 'Saving...' : (editingMember ? 'Update' : 'Add Member')}</button>
            <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <p className="text-gray-400">Loading...</p>
          : members.length === 0 ? <div className="card text-gray-400 text-center col-span-3 py-8">No team members yet.</div>
          : members.map((m) => (
          <div key={m.id} className={`card ${!m.isActive ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 text-xl flex items-center justify-center font-bold">
                {m.photoUrl ? <img src={m.photoUrl} alt={m.name} className="w-12 h-12 rounded-full object-cover" /> : m.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{m.name}</p>
                <p className="text-primary-600 text-sm">{m.designation}</p>
              </div>
            </div>
            {m.bio && <p className="text-gray-500 text-sm mb-3 line-clamp-2">{m.bio}</p>}
            <div className="flex gap-2 mt-2">
              <button onClick={() => openEdit(m)} className="text-xs text-primary-600 hover:text-primary-800">Edit</button>
              <button onClick={() => handleDelete(m.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
              {!m.isActive && <span className="text-xs text-gray-400 ml-auto">Hidden</span>}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
