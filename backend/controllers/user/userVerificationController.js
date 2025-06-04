const jwt = require('jsonwebtoken');
const userModel = require('../../models/User'); // Adjust the path as necessary
require('dotenv').config();

const verifyEmailController = async (req, res) => {
    try {
        const token = req.query.token;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Verification token is missing',
                error: 'token_missing'
            });
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        // Find the user by decoded email
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                error: 'user_not_found'
            });
        }

        if (user.isVerified) {
            return res.status(200).json({
                success: true,
                message: 'Email is already verified. You can proceed to login.',
            });
        }

        // Check if token has expired
        if (user.verifyTokenExpiry && user.verifyTokenExpiry < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Verification token has expired. Please request a new one.',
                error: 'token_expired'
            });
        }

        // Mark user as verified and clear token fields
        user.isVerified = true;
        user.verificationToken = null;
        user.verifyTokenExpiry = null;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Email verified successfully!',
        });
    } catch (err) {
        console.error('Error during email verification:', err);
        if (err.name === 'TokenExpiredError') {
            return res.status(400).json({
                success: false,
                message: 'Verification token has expired. Please request a new one.',
                error: 'token_expired'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Error verifying email, please try again',
            error: 'server_error'
        });
    }
};

module.exports = verifyEmailController;