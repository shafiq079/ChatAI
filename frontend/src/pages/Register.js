import React, { useState } from 'react';
import bgImg from '../assets/banners/signUpBanner.avif';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useNavigate } from 'react-router-dom';
import { AiFillApple } from 'react-icons/ai';
import SummaryApi from '../common/index';

const SignUp = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLogin, setIsLogin] = useState(false); // Toggle between register and login
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const endpoint = isLogin ? SummaryApi.login.url : SummaryApi.register.url;
      const res = await fetch(endpoint, {
        method: isLogin ? SummaryApi.login.method : SummaryApi.register.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          navigate('/');
        } else {
          setMessage('Please check your email to verify your account.');
          setFormData({ email: '', password: '' });
        }
      } else {
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setMessage('Error connecting to server.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      <div
        className="w-full lg:w-1/2 h-64 lg:h-screen relative bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <div className="absolute inset-0 bg-blue-900 bg-opacity-60"></div>
        <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-10 text-white">
          <h2 className="absolute top-4 left-4 tracking-widest font-bold text-white">
            CHAT A.I +
          </h2>
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Mastermind Better.</h1>
            <h1 className="text-2xl font-bold">Succeed Together.</h1>
            <p className="px-4 text-lg font-light">
              Get meaningful results with essential tools for brainstorming, goal setting,
              and accountability.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col bg-white justify-center items-center min-h-[60vh] lg:h-screen p-4 sm:p-8">
        <h1 className="text-xl font-bold mb-2">
          {isLogin ? 'Login to Your Account' : 'Sign Up With Free Trial'}
        </h1>
        <p className="text-xs text-gray-600 mb-6">
          {isLogin
            ? 'Access your account to continue your journey.'
            : 'Empower your experience, sign up for a free account today.'}
        </p>

        {message && (
          <p
            className={`text-sm text-center ${
              message.includes('successful') || message.includes('verify')
                ? 'text-green-600'
                : 'text-red-600'
            } mb-4`}
          >
            {message}
          </p>
        )}

        <form className="w-full max-w-sm space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-left text-sm font-medium text-gray-700 mb-1">
              Email Address*
            </label>
            <input
              id="email"
              type="email"
              placeholder="ex.email@domain.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="text-xs px-4 py-4 rounded-lg focus:outline-none border border-gray-300"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-left text-sm font-medium text-gray-700 mb-1"
            >
              Password*
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="text-xs px-4 py-4 rounded-lg focus:outline-none border border-gray-300"
            />
          </div>

          <p className="text-xs text-gray-500">
            By {isLogin ? 'logging in' : 'registering'}, you agree to our{' '}
            <span className="text-blue-600 cursor-pointer underline">Terms & Conditions</span>.
          </p>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-3xl font-semibold"
          >
            {isLogin ? 'Login' : 'Get Started Free'}
          </button>

          <p className="text-sm text-center text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline font-medium"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">Or better yet</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <div className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-3xl hover:bg-gray-200 transition">
            <GoogleLoginButton />
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-3xl hover:bg-gray-200 transition"
          >
            <AiFillApple className="text-lg" /> Continue with Apple
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;