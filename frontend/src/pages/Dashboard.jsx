import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/api';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskFilter from '../components/TaskFilter';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const navigate = useNavigate();

  // Load tasks on mount and when filters change
  useEffect(() => {
    loadTasks();
  }, [filters, pagination.page]);

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await taskService.getAllTasks({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });
      setTasks(response.data.data.tasks);
      setPagination(prev => ({
        ...prev,
        total: response.data.data.pagination.total,
        pages: response.data.data.pagination.pages
      }));
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      setError('');
      setSuccess('');
      await taskService.createTask(taskData);
      setSuccess('Task created successfully!');
      setShowForm(false);
      loadTasks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      setError('');
      setSuccess('');
      await taskService.updateTask(taskId, taskData);
      setSuccess('Task updated successfully!');
      setEditingTask(null);
      setShowForm(false);
      loadTasks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setError('');
        setSuccess('');
        await taskService.deleteTask(taskId);
        setSuccess('Task deleted successfully!');
        loadTasks();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>📋 Task Management</h1>
          <p className="welcome-text">Welcome, {user.name}!</p>
        </div>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Alerts */}
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="dashboard-layout">
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <button
              className={`btn btn-primary btn-block ${showForm ? 'active' : ''}`}
              onClick={() => {
                setShowForm(!showForm);
                setEditingTask(null);
              }}
            >
              {showForm ? '✕ Close' : '+ New Task'}
            </button>

            {showForm && (
              <TaskForm
                task={editingTask}
                onSubmit={editingTask ? 
                  (data) => handleUpdateTask(editingTask._id, data) : 
                  handleCreateTask
                }
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
              />
            )}

            {/* Filters */}
            <TaskFilter
              filters={filters}
              onFilterChange={setFilters}
            />
          </aside>

          {/* Main Area */}
          <section className="dashboard-main">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <h2>📭 No tasks yet</h2>
                <p>Create your first task to get started!</p>
              </div>
            ) : (
              <>
                <div className="tasks-header">
                  <h2>Your Tasks ({pagination.total || 0})</h2>
                  <span className="page-info">
                    Page {pagination.page} of {pagination.pages || 1}
                  </span>
                </div>
                <TaskList
                  tasks={tasks}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={(taskId, status) =>
                    handleUpdateTask(taskId, { status })
                  }
                />

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="pagination">
                    <button
                      disabled={pagination.page === 1}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                      ← Previous
                    </button>
                    <span className="page-num">
                      {pagination.page} / {pagination.pages}
                    </span>
                    <button
                      disabled={pagination.page === pagination.pages}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
