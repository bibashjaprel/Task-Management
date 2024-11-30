import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // React Router for redirection

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state

  const navigate = useNavigate(); // For redirecting after successful login

  useEffect(() => {
    // Clear error when email or password changes
    setError('');
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when the form is submitted

    // Basic front-end validation
    if (!email || !password) {
      setError('Both email and password are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/v1/user/login', {
        email,
        password,
      });
      console.log('Login successful:', response.data);
    } catch (err) {
      console.error('Error during login:', err.response ? err.response.data : err.message);
    }
    

      const user = response.data; // User object contains token and details

      // Store the token and user object in localStorage
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to dashboard after successful login
      navigate('/'); // Example redirect

      alert('Login successful!');
    } catch (err) {
      setLoading(false); // Set loading state to false after request is done
      // Handle error response
      if (err.response && err.response.data.error) {
        setError(err.response.data.error); // Show error message from the server
      } else {
        setError('Login failed. Please try again.'); // Generic error message
      }
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup'); // Navigate to the signup page
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Redirect to Signup */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button 
              onClick={handleSignupRedirect} 
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
