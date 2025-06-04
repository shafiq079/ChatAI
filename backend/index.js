const dotenv = require('dotenv');

// Load environment variables from .env
const dotenvResult = dotenv.config();
if (dotenvResult.error) {
  console.error('Error loading .env file:', dotenvResult.error);
  process.exit(1);
}
// Proceed with other imports
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const router = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 8080;

// ─── Middleware ───
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json()); // Parse incoming JSON
app.use(
  session({
    secret: process.env.JWT_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ─── Routes ───
app.use('/api', router);

// ─── Start server ───
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('Connected to DB');
    console.log('Server is running on ' + PORT);
  });
});