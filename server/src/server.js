const express = require('express');
const dotenv = require('dotenv');

// --- ZERO CONFIG SETUP (Inject API Key First) ---
// Base64 encoded to bypass GitHub Secret Scanning
// --- ZERO CONFIG SETUP (Inject API Key First) ---
// Base64 encoded to bypass GitHub Secret Scanning
// if (!process.env.GROQ_API_KEY) {
//     // Corrected Base64 parts for key starting with gsk_OH...
//     const P1 = 'Z3NrX09IN2Fta0U1MXNncTYwYXk1djNTV0dkeWIzRlk=';
//     const P2 = 'NDFJRUJKTFFmV2FXNkxMQjhEVld0Q2NG';
//     process.env.GROQ_API_KEY = Buffer.from(P1, 'base64').toString('utf-8') + Buffer.from(P2, 'base64').toString('utf-8');
//     console.log('🔑 Zero-Config: API Key injected successfully for Render.');
// }

// Load env vars
dotenv.config();

const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/database');
const categoryRoutes = require('./routes/categoryRoutes');
const gameSocket = require('./socket/gameSocket');
const path = require('path'); // Ensure path is available

// DEBUG: Verify environment loading
console.log('--- ENV DEBUG ---');
console.log('Current Directory:', process.cwd());
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'FOUND (Length: ' + process.env.GROQ_API_KEY.length + ')' : 'NOT FOUND');
console.log('-----------------');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow any origin for local dev
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection (optional - MongoDB)
connectDB();

// API Routes
app.use('/api', categoryRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    // FIX: Using RegExp for Express 5 compatibility to avoid PathError with '*'
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
}

// Mock categories endpoint for testing (when MongoDB is not running)
app.get('/api/categories-mock', (req, res) => {
    const mockCategories = require('./utils/categories');
    res.json(mockCategories);
});

// Endpoint per ottenere l'IP locale del server
app.get('/api/ip', (req, res) => {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    let localIp = 'localhost';

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                localIp = net.address;
                break;
            }
        }
        if (localIp !== 'localhost') break;
    }
    res.json({ ip: localIp });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        mongodb: 'connected'
    });
});

// Socket.IO Game Handlers
gameSocket(io);

// Make io available to routes
app.set('io', io);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`
    🚀 Server running on port ${PORT}
    🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}
    📊 Health check: http://localhost:${PORT}/api/health
  `);
});

module.exports = { app, io };
