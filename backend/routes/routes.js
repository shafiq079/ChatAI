const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { register } = require('../controllers/user/register');
const { login } = require('../controllers/user/login');
const verifyEmailController = require('../controllers/user/userVerificationController');
const { googleAuthCallback } = require('../controllers/user/googleAuthController');
const {
  authenticate,
  createOrUpdateConversation,
  getConversations,
  getConversationMessages,
} = require('../controllers/user/conversationController');

// Existing routes for email/password authentication
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmailController);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.FRONTEND_URL + '/register' }), // Changed to home page
  googleAuthCallback
);

// Conversation routes
router.post('/conversations', authenticate, createOrUpdateConversation);
router.get('/conversations', authenticate, getConversations);
router.get('/conversations/:id', authenticate, getConversationMessages);

module.exports = router;