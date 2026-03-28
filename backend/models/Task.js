const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      minlength: 3,
      maxlength: 100
    },
    description: {
      type: String,
      default: '',
      maxlength: 1000
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    dueDate: {
      type: Date,
      default: null
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: 'tasks'
  }
);

// ============================================
// INDEXES for faster queries
// ============================================
taskSchema.index({ owner: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ owner: 1, status: 1 });

// ============================================
// MIDDLEWARE: Update timestamp when task is marked complete
// ============================================
taskSchema.pre('findByIdAndUpdate', function (next) {
  if (this.getUpdate().$set && this.getUpdate().$set.isCompleted === true) {
    this.getUpdate().$set.completedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
