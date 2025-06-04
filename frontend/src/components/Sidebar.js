import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { RiSearchLine } from "react-icons/ri";
import { TbMessageDots } from "react-icons/tb";

const Sidebar = ({ setConversationId, onConversationCreated, updateConversationTitle, refreshKey }) => {
  const [conversations, setConversations] = useState({ 'Today': [], 'A week ago': [], 'A month ago': [] });
  const [error, setError] = useState(null);
  const [newConversationId, setNewConversationId] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchConversations = useCallback(async () => {
    console.log('Fetching conversations, refreshKey:', refreshKey);
    try {
      if (!token) {
        navigate('/register', { replace: true });
        return;
      }

      const response = await fetch(SummaryApi.getConversations.url, {
        method: SummaryApi.getConversations.method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/register', { replace: true });
          return;
        }
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      const validData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          Array.isArray(value) ? value : [],
        ])
      );
      console.log('Conversations fetched:', validData);
      setConversations(validData);
      setError(null);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to load conversations');
      setConversations({ 'Today': [], 'A week ago': [], 'A month ago': [] });
    }
  }, [token, navigate, refreshKey]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleNewChat = () => {
    const tempId = `temp-${Date.now()}`;
    setNewConversationId(tempId);
    if (setConversationId) {
      setConversationId(tempId);
    }
    setConversations((prev) => ({
      ...prev,
      'Today': [{ id: tempId, title: 'New conversation', createdAt: new Date() }, ...prev['Today']],
    }));
    navigate('/chat');
  };

  const handleUpdateTitle = useCallback((oldId, newId, newTitle) => {
    console.log('Updating title: oldId=', oldId, 'newId=', newId, 'newTitle=', newTitle);
    setConversations((prev) => {
      const updatedToday = prev['Today'].map((conv) =>
        conv.id === oldId ? { id: newId, title: newTitle, createdAt: conv.createdAt || new Date() } : conv
      );
      return { ...prev, 'Today': updatedToday };
    });
    setNewConversationId(null);
  }, []);

  useEffect(() => {
    if (updateConversationTitle) {
      updateConversationTitle(handleUpdateTitle);
    }
  }, [handleUpdateTitle, updateConversationTitle]);

  const handleConversationClick = (id) => {
    if (setConversationId) {
      setConversationId(id);
    } else {
      navigate(`/chat?conversationId=${id}`);
    }
  };

  return (
    <div className="w-1/5 h-screen bg-white shadow-lg p-4 flex flex-col">
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-4">CHAT A.I.+</h1>
        <div className="flex justify-between items-center gap-2">
          <button
            onClick={handleNewChat}
            className="bg-blue-600 text-white w-3/4 py-2 px-8 rounded-full flex items-center"
          >
            + New Chat
          </button>
          <button className="text-white bg-black p-2 rounded-full flex items-center justify-center">
            <RiSearchLine />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-2 border-t border-b border-gray-200 py-2">
        <h2 className="text-sm font-semibold text-gray-500">Conversations</h2>
        <button className="text-blue-600 text-sm">Clear All</button>
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {Object.entries(conversations).map(([timeCategory, chats]) => (
          <div key={timeCategory}>
            <h3 className="text-xs font-semibold text-gray-400 mt-4 mb-2">{timeCategory}</h3>
            {chats.length === 0 ? (
              <div className="text-sm text-gray-500">No conversations</div>
            ) : (
              chats.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleConversationClick(conv.id)}
                  className="flex items-center py-3 border-gray-200 hover:cursor-pointer"
                >
                  <span className="mr-2 text-gray-500"><TbMessageDots /></span>
                  <span className="text-sm truncate">{conv.title}</span>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
      <div className="top-shadow mt-2 flex items-center p-2 rounded-full border border-gray-100">
        <button className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
          <span className="text-sm">⚙️</span>
        </button>
        <span className="text-sm">Settings</span>
      </div>
      <div className="mt-2 flex items-center px-2 py-2 rounded-full border border-gray-100">
        <img src="https://via.placeholder.com/32" alt="Profile" className="w-6 h-6 rounded-full mr-2" />
        <span className="text-sm">Andrew Neilson</span>
      </div>
    </div>
  );
};

export default Sidebar;