import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserInput from '../components/UserInput';
import SuggestionCard from '../components/SuggestionCard';

const Home = () => {
  const navigate = useNavigate();
  const [conversationId, setConversationId] = useState(null);

  const suggestions = [
    { title: "Explore", description: "General information for curious minds", icon: "🌍" },
    { title: "Explain", description: "Quantum personally computing in simple terms", icon: "🧠" },
    { title: "How to", description: "Make a search engine platform like Google", icon: "🔧" },
    { title: "Capabilities", description: "How much capability chatAI to fully fill your chatAI", icon: "⚡" },
    { title: "Remember", description: "Quantum computing in simple terms", icon: "📝" },
    { title: "Allows", description: "Use to provide follow-up corrections", icon: "✅" },
    { title: "Limitation", description: "How much capability chatAI to fully fill your chatAI", icon: "⚠️" },
    { title: "May", description: "Occasionally generate incorrect information", icon: "❓" },
    { title: "Limited", description: "Knowledge of world and events after 2021", icon: "⏳" }
  ];

  // Handle UserInput submission
  const handleSendMessage = (message) => {
    if (message.trim()) {
      navigate(`/chat?message=${encodeURIComponent(message)}`);
    }
  };

  // Handle conversation selection
  const handleConversationSelect = (id) => {
    setConversationId(id);
    navigate(`/chat?conversationId=${id}`);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen w-full">
        <Sidebar setConversationId={handleConversationSelect} />
        <div className="flex-1 flex flex-col bg-gray-100 overflow-y-auto">
          <div className="flex flex-col items-center justify-center p-4 sm:p-8">
            <h1 className="text-2xl font-bold mb-4">CHAT A.I.+</h1>
            <p className="text-lg font-bold mb-8">Good day! How may I assist you today?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl w-full">
              {suggestions.map((suggestion, index) => (
                <SuggestionCard key={index} {...suggestion} />
              ))}
            </div>
          </div>
          <div className="p-2 sm:p-4 border-t">
            <UserInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;