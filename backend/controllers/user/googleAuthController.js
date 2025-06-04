const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`); 
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { googleAuthCallback };