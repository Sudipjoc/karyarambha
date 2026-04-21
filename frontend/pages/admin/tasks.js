import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/Layout';
import TaskCard from '../../components/admin/TaskCard';
import { isAuthenticated, getUser } from '../../lib/auth';
import api from '../../lib/api';

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({ status: '', priority: '' });
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', deadline: '', assignedTo: '', status: 'todo' });
  const [submitting, setSubmitting] = useState(false);
  const user = typeof window !== 'undefined' ? getUser() : null;

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/admin/login'); return; }
    fetchTasks();
    if (user?.role !== 'employee') fetchUsers();
  }, [filter]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.priority) params.append('priority', filter.priority);
      const res = await api.get(`/tasks?${params}`);
      setTasks(res.data.data.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data.users);
    } catch {}
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/tasks', form);
      setForm({ title: '', description: '', priority: 'medium', deadline: '', assignedTo: '', status: 'todo' });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      setTasks(tasks.map((t) => t.id === taskId ? { ...t, status } : t));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task.');
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task.');
    }
  };

  return (
    <AdminLayout title="Tasks">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Task Orchestration</h1>
        {user?.role !== 'employee' && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : '+ New Task'}
          </button>
        )}
      </div>

      {/* Create Task Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="card mb-6 border border-primary-100">
          <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Title *</label>
              <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {['low', 'medium', 'high', 'urgent'].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Assign To</label>
              <select className="input" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
                <option value="">— Unassigned —</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.role.replace('_', ' ')})</option>)}
              </select>
            </div>
            <div>
              <label className="label">Deadline</label>
              <input type="date" className="input" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {['todo', 'in_progress', 'review', 'done'].map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select className="input w-auto" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
          <option value="">All Statuses</option>
          {['todo', 'in_progress', 'review', 'done'].map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <select className="input w-auto" value={filter.priority} onChange={(e) => setFilter({ ...filter, priority: e.target.value })}>
          <option value="">All Priorities</option>
          {['low', 'medium', 'high', 'urgent'].map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <p className="text-gray-400">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">No tasks found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              userRole={user?.role}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
