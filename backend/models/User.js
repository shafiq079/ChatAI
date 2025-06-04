const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows null values while enforcing uniqueness
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: false, // Optional for Google-authenticated users
  },
  isVerified: {
    type: Boolean,
    default: false, // Set to true for Google users in controller
  },
  verifyToken: {
    type: String,
  },
  verifyTokenExpiry: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);