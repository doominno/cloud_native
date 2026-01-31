import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Todo', todoSchema);
