const Conversation = require('../../models/Conversation');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Get AI response from Gemini
const getAIResponse = async (userMessage) => {
  try {
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to get AI response');
  }
};

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

// Create or update conversation
const createOrUpdateConversation = async (req, res) => {
  const { conversationId, message } = req.body;

  try {
    // Get AI response from Gemini
    const aiResponse = await getAIResponse(message);

    if (conversationId) {
      // Update existing conversation
      const conversation = await Conversation.findOne({
        _id: conversationId,
        userId: req.userId,
      });
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }

      conversation.messages.push(
        { sender: 'user', text: message },
        { sender: 'ai', text: aiResponse }
      );
      await conversation.save();

      return res.status(200).json({
        conversationId: conversation._id,
        messages: conversation.messages,
      });
    } else {
      // Create new conversation
      const title = message.length > 30 ? message.slice(0, 30) + '...' : message;
      const conversation = new Conversation({
        userId: req.userId,
        title,
        messages: [
          { sender: 'user', text: message },
          { sender: 'ai', text: aiResponse },
        ],
      });
      await conversation.save();

      return res.status(201).json({
        conversationId: conversation._id,
        messages: conversation.messages,
      });
    }
  } catch (error) {
    console.error('Error in conversation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all conversations for user
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.userId })
      .select('title createdAt updatedAt')
      .sort({ createdAt: -1 }); // Sort newest first
    console.log('Conversations in backend (sorted):', conversations);

    // Group by time
    const grouped = conversations.reduce(
      (acc, conv) => {
        const daysAgo = Math.floor(
          (Date.now() - conv.createdAt) / (1000 * 60 * 60 * 24)
        );
        let category;
        if (daysAgo <= 1) category = 'Today';
        else if (daysAgo <= 7) category = 'A week ago';
        else category = 'A month ago';
        acc[category] = acc[category] || [];
        acc[category].push({ id: conv._id, title: conv.title, createdAt: conv.createdAt, updatedAt: conv.updatedAt });
        return acc;
      },
      { 'Today': [], 'A week ago': [], 'A month ago': [] }
    );

    // Sort each category to ensure newest first
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    });

    console.log('Backend grouped conversations:', grouped);
    res.status(200).json(grouped);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get messages for a specific conversation
const getConversationMessages = async (req, res) => {
  const { id } = req.params;

  try {
    const conversation = await Conversation.findOne({
      _id: id,
      userId: req.userId,
    });
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.status(200).json({ messages: conversation.messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  authenticate,
  createOrUpdateConversation,
  getConversations,
  getConversationMessages,
};