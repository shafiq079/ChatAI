import React, { useState } from 'react';
import { GiBrain } from "react-icons/gi";
import { RiSendPlaneLine } from "react-icons/ri";

const UserInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full gap-2">
      <div className="relative flex-1 w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          <GiBrain />
        </span>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's in your mind?..."
          className="w-full pl-10 rounded-full text-sm py-3 border border-gray-300 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 relative text-white p-3 rounded-full shadow-md z-10"
      >
        <RiSendPlaneLine />
      </button>
    </form>
  );
};

export default UserInput;