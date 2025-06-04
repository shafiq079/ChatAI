import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SummaryApi from '../common';

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get('token');
      console.log("User-verification token:", token);

      if (!token) {
        setMessage('Verification token is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(SummaryApi.VerifyEmail.url + token, {
          method: SummaryApi.VerifyEmail.method,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (response.ok) {
          setMessage(result.message || 'Email verified successfully!');
          setTimeout(() => navigate('/'), 2000);
        } else {
          setMessage(result.message || 'Failed to verify email.');
        }
      } catch (error) {
        setMessage('An error occurred while verifying email.');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [location.search, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        {loading ? (
          <div className="animate-pulse">
            <p className="text-xl font-semibold text-gray-700">Verifying your email...</p>
            <div className="mt-4 w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div>
            <h2 className={`text-2xl font-bold mb-4 ${message.includes('success') || message.includes('already') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </h2>
            {message.includes('success') || message.includes('already') ? (
              <p className="text-gray-600">Redirecting to login...</p>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Go to Login
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;