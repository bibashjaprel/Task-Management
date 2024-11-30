import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // React Router for redirection

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state

  const navigate = useNavigate(); // For redirecting after successful signup

  useEffect(() => {
    // Clear error when email, password, or username changes
    setError('');
  }, [email, password, username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when the form is submitted

    // Basic validation for email and password
    if (!email || !password || !username) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/v1/user/signup', {
        email,
        password,
        username,
      });

      // If signup is successful, store the token
      localStorage.setItem('token', response.data.token);

      // Redirect to dashboard after successful signup
      navigate('/'); // Example redirect

      alert('Signup successful!');
    } catch (err) {
      setLoading(false); // Set loading state to false after request is done
      // Handle error response
      if (err.response && err.response.data.error) {
        setError(err.response.data.error); // Show error message from the server
      } else {
        setError('Signup failed. Please try again.'); // Generic error message
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md mt-2"
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md mt-2"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md mt-2"
              placeholder="Enter your password"
            />
          </div>

          {/* Error message */}
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          {/* Submit button with loading state */}
          <button
            type="submit"
            disabled={loading} // Disable button while loading
            className={`w-full py-3 ${loading ? 'bg-gray-400' : 'bg-blue-600'} text-white font-semibold rounded-md hover:bg-blue-700 transition`}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        {/* Login button */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')} // Navigate to login page
              className="text-blue-600 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
