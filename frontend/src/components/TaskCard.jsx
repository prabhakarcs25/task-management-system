import React from 'react';
import './TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'in-progress':
        return '#ff9800';
      default:
        return '#2196f3';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  return (
    <div className="task-card" style={{ borderLeftColor: getStatusColor(task.status) }}>
      <div className="task-header">
        <div className="task-title-section">
          <h3 className={task.isCompleted ? 'completed' : ''}>
            {task.isCompleted && '✓ '}
            {task.title}
          </h3>
          <span className="priority-badge">
            {getPriorityIcon(task.priority)} {task.priority}
          </span>
        </div>
        <span className="status-badge" style={{ backgroundColor: getStatusColor(task.status) }}>
          {task.status}
        </span>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <span className="due-date">
          📅 {formatDate(task.dueDate)}
        </span>
        {task.tags && task.tags.length > 0 && (
          <div className="tags">
            {task.tags.map((tag, idx) => (
              <span key={idx} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="task-actions">
        <select
          className="status-select"
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
        >
          <option value="pending">⏳ Pending</option>
          <option value="in-progress">🔄 In Progress</option>
          <option value="completed">✓ Completed</option>
        </select>

        <button
          className="btn btn-sm btn-secondary"
          onClick={() => onEdit(task)}
          title="Edit task"
        >
          ✏️ Edit
        </button>

        <button
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(task._id)}
          title="Delete task"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
