require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// ─── Middleware ───────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.render.com') ||
      process.env.NODE_ENV === 'development'
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/users', require('./routes/users'));
app.use('/api/assessments', require('./routes/assessments'));
app.use('/api/verify', require('./routes/verify'));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'SkillBridge API',
    version: '1.0.0',
    dbMode: process.env.USE_MOCK_DB === 'true' ? 'mock (in-memory)' : 'mongodb',
    aiEngine: process.env.OPENAI_API_KEY ? 'openai' : 'simulated',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[Error]', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ─── Database Connection ──────────────────────────────────────────────────────
async function startServer() {
  if (process.env.USE_MOCK_DB !== 'true' && process.env.MONGO_URI) {
    try {
      const mongoose = require('mongoose');
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ MongoDB connected:', process.env.MONGO_URI);
    } catch (err) {
      console.warn('⚠️  MongoDB connection failed. Falling back to mock DB:', err.message);
      process.env.USE_MOCK_DB = 'true';
    }
  } else {
    console.log('📦 Using in-memory mock database (USE_MOCK_DB=true)');
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 SkillBridge API running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   AI Engine: ${process.env.OPENAI_API_KEY ? 'OpenAI GPT-4o-mini' : 'Simulated (no API key)'}`);
    console.log(`   DB Mode: ${process.env.USE_MOCK_DB === 'true' ? 'In-Memory Mock' : 'MongoDB'}\n`);
  });
}

startServer();
module.exports = app;
