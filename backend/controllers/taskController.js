const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// ============================================
// CREATE TASK
// ============================================
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, tags } = req.body;

    const task = new Task({
      title: title.trim(),
      description: description?.trim() || '',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      tags: tags || [],
      owner: req.user.userId,
      status: 'pending'
    });

    await task.save();
    await task.populate('owner', 'name email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
};

// ============================================
// GET ALL TASKS (with filtering)
// ============================================
exports.getAllTasks = async (req, res) => {
  try {
    const { status, priority, sortBy } = req.query;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    // Build filter
    let filter = { owner: req.user.userId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Get total count
    const total = await Task.countDocuments(filter);

    // Build query
    let query = Task.find(filter).populate('owner', 'name email');

    // Sorting
    if (sortBy === 'oldest') {
      query = query.sort({ createdAt: 1 });
    } else if (sortBy === 'due-date') {
      query = query.sort({ dueDate: 1 });
    } else {
      query = query.sort({ createdAt: -1 }); // newest by default
    }

    // Pagination
    query = query.skip((page - 1) * limit).limit(limit);

    const tasks = await query;

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: {
        tasks,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};

// ============================================
// GET SINGLE TASK
// ============================================
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id).populate('owner', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check ownership (unless admin)
    if (task.owner._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this task'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: error.message
    });
  }
};

// ============================================
// UPDATE TASK
// ============================================
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, tags, isCompleted } = req.body;

    // Validate status
    if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, in-progress, or completed'
      });
    }

    // Validate priority
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority. Must be: low, medium, or high'
      });
    }

    // Find task
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check ownership (unless admin)
    if (task.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this task'
      });
    }

    // Update fields
    if (title) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (tags) task.tags = tags;
    if (isCompleted !== undefined) task.isCompleted = isCompleted;

    await task.save();
    await task.populate('owner', 'name email');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
};

// ============================================
// DELETE TASK
// ============================================
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check ownership (unless admin)
    if (task.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this task'
      });
    }

    await Task.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
};

// ============================================
// GET TASK STATISTICS (Admin only)
// ============================================
exports.getTaskStats = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalTasks = await Task.countDocuments();

    res.status(200).json({
      success: true,
      message: 'Task statistics retrieved successfully',
      data: {
        totalTasks,
        byStatus: stats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};
