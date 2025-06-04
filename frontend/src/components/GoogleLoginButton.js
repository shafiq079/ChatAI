import React from 'react';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  window.location.href = `${backendUrl}/api/google`;};

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-2 w-full"
    >
      <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path
          fill="#4285F4"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <path
          fill="#34A853"
          d="M24 44c5.97 0 11.01-1.98 14.68-5.36l-7.36-5.73c-2.07 1.38-4.68 2.2-7.32 2.2-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 44 24 44z"
        />
        <path
          fill="#FBBC05"
          d="M46.44 13.22l-7.98 6.19c.67 1.81 1.04 3.74 1.04 5.59 0 1.85-.37 3.78-1.04 5.59l7.98 6.19c.72-2.29 1.12-4.74 1.12-7.28 0-2.54-.4-4.99-1.12-7.28z"
        />
        <path
          fill="#EA4335"
          d="M10.54 28.41c-.49-1.45-.78-2.98-.78-4.59 0-1.61.29-3.14.78-4.59l-7.98-6.19C.99 16.82 0 20.71 0 24.82c0 4.11.99 8 2.56 11.78l7.98-6.19z"
        />
      </svg>
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;