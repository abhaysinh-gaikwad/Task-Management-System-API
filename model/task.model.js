const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    due_date: { type: Date, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['pending', 'in progress', 'completed'], default: 'pending' },
    created_date: { type: Date, default: Date.now },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    versionKey: false,
  }
);

const TaskModel = mongoose.model("task", taskSchema);

module.exports = {
  TaskModel
} 