import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

const App = () => {
  const isAuthenticated = localStorage.getItem('user'); // Check if user is logged in

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect to dashboard if already authenticated */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/" /> : <Signup />} 
        />
        
        {/* Other routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
