export {}

// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
// What is cors for
// Cross-Origin Resource Sharing (CORS) is a security feature implemented in browsers to prevent JavaScript code from making requests to a different domain than the one that served the JavaScript code. This is a security feature to prevent malicious websites from making requests to other websites on behalf of the user. When you enable CORS in your server, you allow your server to accept requests from other domains. This is useful when you have a frontend application that makes requests to a backend server. By enabling CORS, you allow the frontend application to make requests to the backend server.

// Connect to MongoDB Atlas
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI is not defined in the environment variables');
}

mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err: any) => console.error(err));

// Use routes
const userRoutes = require('./routes/user2');
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
