const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-game');
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB connection failed: ${error.message}`);
        console.warn('⚠️ Server running without database connection. Some features may be limited.');
        // process.exit(1); // Removed to allow server to run without MongoDB
    }
};

module.exports = connectDB;
