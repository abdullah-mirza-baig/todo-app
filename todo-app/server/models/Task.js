import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  tags: [String],
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  file: { type: String },
  completed: { type: Boolean, default: false },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
export default Task;
