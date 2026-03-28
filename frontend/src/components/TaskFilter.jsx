import React from 'react';
import './TaskFilter.css';

const TaskFilter = ({ filters, onFilterChange }) => {
  const handleStatusChange = (e) => {
    onFilterChange({
      ...filters,
      status: e.target.value
    });
  };

  const handlePriorityChange = (e) => {
    onFilterChange({
      ...filters,
      priority: e.target.value
    });
  };

  const handleReset = () => {
    onFilterChange({
      status: '',
      priority: ''
    });
  };

  return (
    <div className="task-filter">
      <h3>🔍 Filters</h3>

      <div className="filter-group">
        <label htmlFor="statusFilter">Status</label>
        <select
          id="statusFilter"
          value={filters.status}
          onChange={handleStatusChange}
        >
          <option value="">All Status</option>
          <option value="pending">⏳ Pending</option>
          <option value="in-progress">🔄 In Progress</option>
          <option value="completed">✓ Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="priorityFilter">Priority</label>
        <select
          id="priorityFilter"
          value={filters.priority}
          onChange={handlePriorityChange}
        >
          <option value="">All Priority</option>
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
      </div>

      <button
        className="btn btn-secondary btn-block"
        onClick={handleReset}
        disabled={!filters.status && !filters.priority}
      >
        🔄 Reset Filters
      </button>
    </div>
  );
};

export default TaskFilter;
