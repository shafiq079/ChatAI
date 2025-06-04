import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuggestionCard = ({ title, description, icon }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chat?message=${encodeURIComponent(description)}`);
  };

  const getCardStyles = () => {
    switch (title) {
      case "Explore":
        return {
          card: "bg-gray-900 text-white border-gray-700",
          icon: "text-white"
        };
      case "Capabilities":
        return {
          card: "bg-gray-900 text-white border-orange-600",
          icon: "text-white"
        };
      case "Limitation":
        return {
          card: "bg-gray-900 text-white border-gray-700",
          icon: "text-white"
        };
      default:
        return {
          card: "bg-white border-gray-200",
          icon: "text-white"
        };
    }
  };

  const styles = getCardStyles();

  return (
    <div
      onClick={handleClick}
      className={`border rounded-lg p-4 flex items-start space-x-4 cursor-pointer ${styles.card}`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${styles.icon}`}>
        <span className="text-xl">{icon}</span>
      </div>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <span className="ml-auto text-gray-500">→</span>
    </div>
  );
};

export default SuggestionCard;