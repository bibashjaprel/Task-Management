const mongoose = require('mongoose');
const Task = require('../models/task.model');

// Create a new task
const createTasks = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    let emptyFields = [];
    if (!title) emptyFields.push('title');
    if (!description) emptyFields.push('description');
    if (!dueDate) emptyFields.push('dueDate');
    if (!status) emptyFields.push('status');

    if (emptyFields.length > 0) {
      return res.status(400).json({ error: 'Please fill all fields', emptyFields });
    }

    // Create task and associate it with the authenticated user
    const task = await Task.create({
      title,
      description,
      dueDate,
      status,
      user: req.user._id  // Associate the task with the logged-in user's ID
    });
    res.status(201).json(task);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// Get all tasks for the logged-in user
const getTasks = async (req, res) => {
  try {
    // Fetch tasks associated with the logged-in user (filtered by user ID)
    const tasks = await Task.find({ user: req.user._id });
    res.status(200).json(tasks);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Get a single task for the logged-in user
const getSingleTasks = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such task' });
    }

    // Fetch the task associated with the logged-in user
    const task = await Task.findOne({ _id: id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ error: 'No such task for this user' });
    }

    res.status(200).json(task);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

// Update a task for the logged-in user
const updateTasks = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such task' });
  }

  try {
    // Update the task if it belongs to the logged-in user
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },  // Ensure task belongs to the logged-in user
      { title, description, dueDate, status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'No such task for this user' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// Delete a task for the logged-in user
const deleteTasks = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such task' });
  }

  try {
    // Delete the task only if it belongs to the logged-in user
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ error: 'No such task for this user' });
    }

    res.status(200).json({ message: 'Task deleted successfully', task });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

module.exports = {
  createTasks,
  getTasks,
  getSingleTasks,
  updateTasks,
  deleteTasks
};
