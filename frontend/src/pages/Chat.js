import React, { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ChatBar from '../components/Chatbar';

const Chat = () => {
  const [conversationId, setConversationId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [updateTitleFn, setUpdateTitleFn] = useState(null);
  const [initialMessage, setInitialMessage] = useState(null);
  const location = useLocation();

  // Read message or conversationId from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message = params.get('message');
    const convId = params.get('conversationId');
    if (message) {
      console.log('Chat.js: Initial message from URL:', message);
      setInitialMessage(decodeURIComponent(message));
      setConversationId(null);
      window.history.replaceState({}, '', location.pathname);
    } else if (convId) {
      console.log('Chat.js: Conversation ID from URL:', convId);
      setConversationId(convId);
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);

  const handleConversationCreated = useCallback(() => {
    console.log('Chat.js: handleConversationCreated triggered, incrementing refreshKey');
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleUpdateTitle = useCallback((fn) => {
    console.log('Chat.js: Setting updateTitleFn');
    setUpdateTitleFn(() => fn);
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar
        setConversationId={setConversationId}
        onConversationCreated={handleConversationCreated}
        updateConversationTitle={handleUpdateTitle}
        refreshKey={refreshKey}
      />
      <ChatBar
        conversationId={conversationId}
        setConversationId={setConversationId}
        onConversationCreated={handleConversationCreated}
        updateConversationTitle={updateTitleFn}
        initialMessage={initialMessage}
      />
    </div>
  );
};

export default Chat;