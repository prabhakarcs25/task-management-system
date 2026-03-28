const express = require('express');
const { body, validationResult } = require('express-validator');
const taskController = require('../controllers/taskController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// ============================================
// Protect all routes - require authentication
// ============================================
router.use(authenticate);

// ============================================
// CREATE TASK - POST /api/v1/tasks
// ============================================
router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be: low, medium, or high'),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Due date must be a valid ISO 8601 date'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array')
  ],
  handleValidationErrors,
  taskController.createTask
);

// ============================================
// GET ALL TASKS - GET /api/v1/tasks
// Query params: status, priority, page, limit, sortBy
// ============================================
router.get('/', taskController.getAllTasks);

// ============================================
// GET SINGLE TASK - GET /api/v1/tasks/:id
// ============================================
router.get('/:id', taskController.getTaskById);

// ============================================
// UPDATE TASK - PUT /api/v1/tasks/:id
// ============================================
router.put(
  '/:id',
  [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters'),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Status must be: pending, in-progress, or completed'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be: low, medium, or high'),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Due date must be a valid ISO 8601 date'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('isCompleted')
      .optional()
      .isBoolean()
      .withMessage('isCompleted must be a boolean')
  ],
  handleValidationErrors,
  taskController.updateTask
);

// ============================================
// DELETE TASK - DELETE /api/v1/tasks/:id
// ============================================
router.delete('/:id', taskController.deleteTask);

// ============================================
// GET TASK STATISTICS - GET /api/v1/tasks/stats/all (Admin only)
// ============================================
router.get('/stats/all', authorize('admin'), taskController.getTaskStats);

module.exports = router;
