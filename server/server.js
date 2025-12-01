const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB, checkConnection } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const laundryRoutes = require('./routes/laundryRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

dotenv.config();

// Connect to database (non-blocking)
connectDB().then((connected) => {
  if (!connected) {
    console.log('💡 To fix: Create a .env file with MONGO_URI=your_mongodb_connection_string');
  }
});

const app = express();

// Middleware
app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/laundry', laundryRoutes);
app.use('/api/employee', employeeRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({ 
        message: 'WashEase API is running...',
        status: 'OK',
        database: checkConnection() ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📡 API available at http://localhost:${PORT}`);
    if (!checkConnection()) {
        console.log('⚠️  Warning: MongoDB not connected. Some features may not work.');
    }
});
