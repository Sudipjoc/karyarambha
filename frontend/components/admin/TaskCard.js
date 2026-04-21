export default function TaskCard({ task, onStatusChange, onDelete, userRole }) {
  const statusColors = {
    todo: 'badge-todo',
    in_progress: 'badge-in_progress',
    review: 'badge-review',
    done: 'badge-done',
  };

  const priorityColors = {
    low: 'badge-low',
    medium: 'badge-medium',
    high: 'badge-high',
    urgent: 'badge-urgent',
  };

  const statuses = ['todo', 'in_progress', 'review', 'done'];

  return (
    <div className="card border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900">{task.title}</h3>
        <div className="flex gap-2">
          <span className={priorityColors[task.priority] || 'badge-medium'}>{task.priority}</span>
          <span className={statusColors[task.status] || 'badge-todo'}>{task.status?.replace('_', ' ')}</span>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="text-xs text-gray-400 mb-3 space-y-1">
        {task.assignee && <p>Assigned to: <span className="font-medium text-gray-600">{task.assignee.name}</span></p>}
        {task.creator && <p>Created by: <span className="font-medium text-gray-600">{task.creator.name}</span></p>}
        {task.deadline && <p>Deadline: <span className="font-medium text-gray-600">{new Date(task.deadline).toLocaleDateString()}</span></p>}
      </div>

      <div className="flex items-center justify-between mt-4">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>

        {(userRole === 'admin' || userRole === 'project_manager') && (
          <button
            onClick={() => onDelete(task.id)}
            className="text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
