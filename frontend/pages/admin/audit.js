import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/Layout';
import { isAuthenticated, getUser } from '../../lib/auth';
import api from '../../lib/api';

const ENTITY_ICONS = { Task: '✅', Blog: '📝', User: '👤', Service: '🔧', TeamMember: '👥', Testimonial: '⭐', ContentBlock: '🧩' };

export default function AuditPage() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ entityType: '', page: 1 });

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/admin/login'); return; }
    const user = getUser();
    if (user?.role !== 'admin') { router.push('/admin'); return; }
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: filter.page, limit: 30 });
      if (filter.entityType) params.append('entityType', filter.entityType);
      const res = await api.get(`/admin/audit-trail?${params}`);
      setLogs(res.data.data.logs);
      setTotal(res.data.data.total);
    } catch {} finally { setLoading(false); }
  };

  const actionColors = { CREATE: 'bg-green-100 text-green-700', UPDATE: 'bg-blue-100 text-blue-700', DELETE: 'bg-red-100 text-red-700', LOGIN: 'bg-purple-100 text-purple-700', REGISTER: 'bg-yellow-100 text-yellow-700' };

  return (
    <AdminLayout title="Audit Trail">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
        <p className="text-gray-500 text-sm mt-1">Track all actions performed in the system · {total} total records</p>
      </div>

      <div className="flex gap-4 mb-6">
        <select className="input w-auto" value={filter.entityType} onChange={(e) => setFilter({ entityType: e.target.value, page: 1 })}>
          <option value="">All Entities</option>
          {['Task', 'Blog', 'User', 'Service', 'TeamMember', 'Testimonial', 'ContentBlock'].map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Time', 'User', 'Action', 'Entity', 'ID', 'IP'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No activity logs found.</td></tr>
            ) : logs.map((log) => (
              <tr key={log.id} className="border-t border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{log.user?.name || <span className="text-gray-400">System</span>}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${actionColors[log.action] || 'bg-gray-100 text-gray-600'}`}>{log.action}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {ENTITY_ICONS[log.entityType] || '📋'} {log.entityType}
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{log.entityId || '—'}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{log.ipAddress || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 30 && (
        <div className="flex gap-2 mt-4">
          <button onClick={() => setFilter({ ...filter, page: Math.max(1, filter.page - 1) })} disabled={filter.page === 1} className="btn-secondary text-sm disabled:opacity-50">Previous</button>
          <span className="flex items-center text-sm text-gray-500">Page {filter.page} of {Math.ceil(total / 30)}</span>
          <button onClick={() => setFilter({ ...filter, page: filter.page + 1 })} disabled={filter.page >= Math.ceil(total / 30)} className="btn-secondary text-sm disabled:opacity-50">Next</button>
        </div>
      )}
    </AdminLayout>
  );
}
