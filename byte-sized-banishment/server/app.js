import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import config from './config/index.js';

// Load env vars from .env file
dotenv.config();

// Connect to the MongoDB Database
connectDB();

// Initialize the Express app
const app = express();

// --- Middlewares ---

// Enable Cross-Origin Resource Sharing (CORS)
// This is crucial for allowing your frontend (e.g., on localhost:3000 or a Vite port)
// to communicate with your backend on localhost:5000
app.use(cors());

// To accept and parse JSON data in the request body
app.use(express.json());

// --- API Routes ---

// All routes related to authentication will be prefixed with /api/auth
app.use('/api/auth', authRoutes);

// A default route to check if the API is running
app.get('/', (req, res) => {
    res.send('Byte-Sized Banishment API is running...');
});

// Get the port from environment variables or use 5000 as a default
const PORT = config.PORT || 5000;

// Start the server and listen for incoming requests
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
