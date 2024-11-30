const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  // title, description, dueDate, status, createdAt, updatedAt.
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true
    // need to pass default status with p for pending 
    
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
}, {timestamp: true})


module.exports = mongoose.model('Task', taskSchema);
