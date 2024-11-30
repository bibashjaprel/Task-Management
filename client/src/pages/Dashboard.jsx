import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'p',
  });
  const [editTask, setEditTask] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortByStatus, setSortByStatus] = useState('all'); // all, pending, completed
  const [message, setMessage] = useState(null); // For success/error messages
  const tasksEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
  
    if (!token || !user) {
      console.log("No token or user found, redirecting to login...");
      navigate('/login'); // Redirect to login if no token or user found
      return;
    }
  
    setIsLoggedIn(true);
    try {
      const parsedUser = JSON.parse(user); // Attempt to parse the user
      setUsername(parsedUser.user.username);
    } catch (error) {
      console.log("Error parsing user:", error);
    }
  
    // Ensure fetchTasks runs once after mounting
    fetchTasks();
  }, [navigate]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setMessage(null); // Reset any previous messages
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setMessage({ type: 'error', text: 'Failed to fetch tasks.' });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const endpoint = editTask ? `/api/v1/tasks/${editTask._id}` : '/api/v1/tasks';
    const method = editTask ? 'patch' : 'post';

    try {
      await axios[method](endpoint, taskForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetTaskForm();
      fetchTasks();
      setMessage({ type: 'success', text: `Task ${editTask ? 'updated' : 'created'} successfully!` });
    } catch (error) {
      console.error('Error submitting task:', error);
      setMessage({ type: 'error', text: 'Failed to create/update task.' });
    }
  };

  const resetTaskForm = () => {
    setTaskForm({ title: '', description: '', dueDate: new Date().toISOString().split('T')[0], status: 'p' });
    setEditTask(null);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/v1/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      setMessage({ type: 'success', text: 'Task deleted successfully!' });
    } catch (error) {
      console.error('Error deleting task:', error);
      setMessage({ type: 'error', text: 'Failed to delete task.' });
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setTaskForm({ title: task.title, description: task.description, dueDate: task.dueDate, status: task.status });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value.toLowerCase());
  const handleSortChange = (e) => setSortByStatus(e.target.value);

  const filteredTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(searchQuery))
    .filter((task) => {
      if (sortByStatus === 'pending') return task.status === 'p';
      if (sortByStatus === 'completed') return task.status === 'c';
      return true;
    });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl font-bold text-gray-800">Task Management</div>
        <div className="flex items-center space-x-4">
          {isLoggedIn && <p className="text-lg">Hello, {username}</p>}
          <button onClick={handleLogout} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
            Logout
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-md text-white ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md mb-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">{editTask ? 'Edit' : 'Create'} Task</h2>
        <input
          type="text"
          value={taskForm.title}
          onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
          placeholder="Title"
          className="border p-3 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          value={taskForm.description}
          onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
          placeholder="Description"
          className="border p-3 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="date"
          value={taskForm.dueDate}
          onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
          className="border p-3 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <select
          value={taskForm.status}
          onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
          className="border p-3 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="p">Pending</option>
          <option value="c">Completed</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-md w-full hover:bg-blue-600">
          {editTask ? 'Update' : 'Create'} Task
        </button>
      </form>

      <div className="mb-6 max-w-3xl mx-auto">
        <input
          type="text"
          placeholder="Search tasks by title"
          onChange={handleSearchChange}
          className="border p-3 rounded-md w-full mb-4"
        />
        <select onChange={handleSortChange} className="border p-3 rounded-md w-full">
          <option value="all">All Tasks</option>
          <option value="pending">Pending Tasks</option>
          <option value="completed">Completed Tasks</option>
        </select>
      </div>

      <h2 className="text-2xl font-semibold mb-4 max-w-3xl mx-auto">Tasks List</h2>
      {loading && (
        <div className="flex justify-center items-center mb-4">
          <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-blue-500 rounded-full"></div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {filteredTasks.map((task) => (
          <div key={task._id} className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
            <p className={`text-sm ${task.status === 'p' ? 'text-yellow-500' : 'text-green-500'}`}>
              Status: {task.status === 'p' ? 'Pending' : 'Completed'}
            </p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(task)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div ref={tasksEndRef} />
    </div>
  );
};

export default Dashboard;
