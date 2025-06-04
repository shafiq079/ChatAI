const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../../helpers/verification');
require('dotenv').config();

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for existing user (email used by email/password or Google)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.googleId) {
        return res.status(400).json({ message: 'Email is registered via Google. Please use Google login.' });
      }
      return res.status(400).json({ message: 'Email already registered. Please login.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const user = await User.create({
      email,
      password: hashedPassword,
      verificationToken: token,
      verifyTokenExpiry: Date.now() + 3600000,
    });

    await sendVerificationEmail(email, token);

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};