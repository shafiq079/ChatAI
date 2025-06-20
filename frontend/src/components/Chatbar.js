import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import UserInput from '../components/UserInput';
import SummaryApi from '../common';

const ChatBar = ({ conversationId, setConversationId, onConversationCreated, updateConversationTitle, initialMessage }) => {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const userProfilePic = 'https://th.bing.com/th/id/OIP.OyNluqhgZobpJ5aL0M2RQwHaHa?w=1060&h=1060&rs=1&pid=ImgDetMain';

  useEffect(() => {
    if (!token) {
      navigate('/register', { replace: true });
      return;
    }

    const fetchMessages = async () => {
      try {
        if (conversationId && !conversationId.startsWith('temp-')) {
          const response = await fetch(`${SummaryApi.getConversationMessages.url}/${conversationId}`, {
            method: SummaryApi.getConversationMessages.method,
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
            throw new Error('Failed to fetch messages');
          }

          const data = await response.json();
          setMessages(data.messages || []);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      }
    };
    fetchMessages();
  }, [conversationId, token, navigate]);

  useEffect(() => {
    if (initialMessage && token) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage, token]);

  const handleSendMessage = async (message) => {
    try {
      if (!token) {
        navigate('/register', { replace: true });
        return;
      }

      const isNewConversation = !conversationId || conversationId.startsWith('temp-');
      const response = await fetch(SummaryApi.createOrUpdateConversation.url, {
        method: SummaryApi.createOrUpdateConversation.method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: isNewConversation ? null : conversationId,
          message,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/register', { replace: true });
          return;
        }
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      if (data.conversationId) {
        if (isNewConversation && updateConversationTitle) {
          const newTitle = message.length > 30 ? message.slice(0, 30) + '...' : message;
          updateConversationTitle(conversationId || `temp-${Date.now()}`, data.conversationId, newTitle);
        }
        setConversationId(data.conversationId);
        setMessages(data.messages || []);
        if (onConversationCreated) {
          onConversationCreated();
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-100">
      <div className="flex w-full flex-1 overflow-y-auto">
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-4 md:p-8">
          {messages.map((msg, index) => (
            <div
              key={`${msg.timestamp}-${index}`}
              className="flex items-start mb-4 w-full sm:w-3/4 mx-auto px-2 sm:px-0"
            >
              {/* Profile picture and text in a row for user */}
              {msg.sender === 'user' ? (
                <>
                  <div className="w-8 h-8 flex-shrink-0 mr-2">
                    <img
                      src={userProfilePic}
                      alt="User Profile"
                      className="w-8 h-8 rounded-full mt-0"
                    />
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="pt-0 text-sm bg-white rounded-xl px-3 py-2 shadow-sm">
                      {msg.text}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1">
                  <div className="text-sm px-2 font-semibold">Chat A.I.</div>
                  <div className="p-2 text-sm ">
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => <h1 className="text-lg font-bold mt-2 mb-1" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-md font-semibold mt-2 mb-1" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-sm font-semibold mt-2 mb-1" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 mt-1 mb-1" {...props} />,
                        li: ({ node, ...props }) => <li className="text-sm pb-4" {...props} />,
                        p: ({ node, ...props }) => <p className="text-sm mt-1 mb-1" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full sm:w-3/4 mx-auto px-2 sm:px-0 border-t bg-gray-100 sticky bottom-0 z-20">
        <UserInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatBar;