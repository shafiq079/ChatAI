import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlToken = params.get('token');
  const localStorageToken = localStorage.getItem('token');

  // Store token from URL and clean up query parameter
  if (urlToken) {
    localStorage.setItem('token', urlToken);
    window.history.replaceState({}, '', location.pathname); 
    return <Outlet />;
  }

  // Allow access if token exists in localStorage
  if (localStorageToken) {
    return <Outlet />;
  }

  // Redirect to register page if no token
  return <Navigate to="/register" replace />;
};

export default ProtectedRoute;