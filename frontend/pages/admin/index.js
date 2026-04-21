import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/Layout';
import { isAuthenticated, getUser } from '../../lib/auth';
import api from '../../lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = typeof window !== 'undefined' ? getUser() : null;

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/admin/login'); return; }
    if (user?.role === 'admin') {
      api.get('/admin/dashboard-stats')
        .then((res) => setStats(res.data.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'User'}!</h1>
        <p className="text-gray-500 mt-1 capitalize">Role: {user?.role?.replace('_', ' ')}</p>
      </div>

      {/* Stats Cards (Admin only) */}
      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Users', value: stats?.totalUsers ?? '—', color: 'bg-blue-50 text-blue-700', icon: '👥' },
            { label: 'Total Tasks', value: stats?.totalTasks ?? '—', color: 'bg-green-50 text-green-700', icon: '✅' },
            { label: 'Team Members', value: '—', color: 'bg-purple-50 text-purple-700', icon: '🏢' },
            { label: 'Published Blogs', value: '—', color: 'bg-orange-50 text-orange-700', icon: '📝' },
          ].map((s) => (
            <div key={s.label} className={`card flex items-center gap-4 ${s.color}`}>
              <span className="text-3xl">{s.icon}</span>
              <div>
                <p className="text-2xl font-bold">{loading ? '...' : s.value}</p>
                <p className="text-sm opacity-80">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Status Summary */}
      {user?.role === 'admin' && stats?.tasksByStatus && (
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Status Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.tasksByStatus.map((item) => (
              <div key={item.status} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{item.dataValues?.count || item.count || 0}</p>
                <p className="text-sm text-gray-500 capitalize mt-1">{item.status?.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity (Admin only) */}
      {user?.role === 'admin' && stats?.recentLogs && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {stats.recentLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 text-sm text-gray-600 py-2 border-b border-gray-50 last:border-0">
                <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-0.5 rounded">{log.action}</span>
                <span className="text-gray-400">{log.entityType}</span>
                <span className="font-medium">{log.user?.name || 'System'}</span>
                <span className="ml-auto text-gray-400 text-xs">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            ))}
            {stats.recentLogs.length === 0 && <p className="text-gray-400">No recent activity.</p>}
          </div>
        </div>
      )}

      {/* Quick Links for non-admin */}
      {user?.role !== 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-3">My Tasks</h2>
            <p className="text-gray-500 text-sm mb-4">View and update the status of your assigned tasks.</p>
            <a href="/admin/tasks" className="btn-primary text-sm">Go to Tasks →</a>
          </div>
          {user?.role === 'project_manager' && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-3">Manage Content</h2>
              <p className="text-gray-500 text-sm mb-4">Update website content, blogs, and team information.</p>
              <a href="/admin/content" className="btn-primary text-sm">Go to Content →</a>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
