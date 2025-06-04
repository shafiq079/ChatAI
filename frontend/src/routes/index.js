import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import SignUp from '../pages/Register';
import Home from '../pages/Home';
import Chat from '../pages/Chat';
import VerifyEmail from '../pages/VerifyEmail';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { path: '', element: <Home /> },  // Now protected
          { path: 'chat', element: <Chat /> },
        ],
      },
      { path: 'register', element: <SignUp /> },
      { path: 'verify-email', element: <VerifyEmail /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;