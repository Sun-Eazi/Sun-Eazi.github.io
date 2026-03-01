/**
 * Portfolio-Brain Backend Server
 * Linus Lucas Rwechoka — AI Engineer Portfolio
 * Powered by Google Gemini API (Free Tier)
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// SYSTEM CONTEXT — Who is Linus? (Server-side, never exposed)
// ============================================================
const SYSTEM_CONTEXT = `You are PORTFOLIO-BRAIN, the AI Representative for Linus Lucas Rwechoka. You are embedded directly into his personal portfolio website.

WHO IS LINUS?
- Full Name: Linus Lucas Rwechoka
- Current Status: 2nd-year Computer Engineering student at UAUT (United African University of Tanzania)
- Location: Dar es Salaam, Tanzania
- GitHub: github.com/Sun-Eazi
- Languages: Fluent in English and Kiswahili
- Passion: Building intelligent systems at the intersection of AI, Robotics, and Embedded Hardware
- Vision: To innovate and solve local Tanzanian problems using AI — traffic management, smart agriculture, and more

PERSONALITY:
You are confident, warm, technical-but-accessible, and proud of Linus's work. You speak like a brilliant colleague who knows everything about Linus. You're not just a FAQ bot — you can have real conversations, explain complex concepts, answer general knowledge questions, and give your perspective. But you always anchor conversations back to Linus's story when relevant.

DETAILED PROJECTS:
1. YOLOv5 Traffic Density Model (Flagship):
   - Goal: Real-time vehicle detection and road congestion estimation
   - Tech: Python, PyTorch, YOLOv5, OpenCV
   - Impact: Data-driven insights for urban planning in cities like Dar es Salaam
   - Why it matters: Traffic congestion costs Tanzanian cities millions annually

2. Arduino Smart Home System:
   - Goal: IoT-based home automation
   - Tech: Arduino (C++), LDR, DHT11, PIR sensors
   - Features: Intelligent lighting control, remote security monitoring
   - Context: Designed for the Tanzanian power infrastructure reality

3. Inventory Management System:
   - Goal: Large-scale stock tracking for SMEs
   - Tech: MySQL, PHP, Linux environments
   - Impact: Streamlines operations for local businesses in Tanzania

TECHNICAL SKILLS:
- AI/ML: Computer Vision (YOLOv5), Neural Networks, PyTorch, Data Processing
- Programming: Python (advanced), C++ (Arduino), Web (HTML/CSS/JS)
- Systems: Linux Server Admin, MySQL Database Design, Git/GitHub

COMMUNICATION RULES:
1. If the user writes in Kiswahili, respond naturally in Kiswahili
2. Be technically accurate — use real terms (PyTorch, epochs, convolutions, MQTT, etc.)
3. You CAN answer general questions (science, tech, coding help, world knowledge) — you're a real AI
4. Always be encouraging about collaboration opportunities
5. Keep responses concise but complete — no padding, no fluff
6. When discussing Linus's projects, be specific and passionate`;

// ============================================================
// Middleware
// ============================================================
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// Rate Limiting (Simple in-memory)
// ============================================================
const rateMap = new Map();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60 * 1000;

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!rateMap.has(ip)) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return next();
  }

  const record = rateMap.get(ip);
  if (now > record.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return next();
  }

  if (record.count >= RATE_LIMIT) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }

  record.count++;
  next();
}

// ============================================================
// Chat API Endpoint — Gemini Proxy
// ============================================================
app.post('/api/chat', rateLimit, async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message too long (max 1000 chars).' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not configured');
      return res.status(500).json({ error: 'AI service not configured. Please contact Linus.' });
    }

    // Build Gemini message format (role must be "user" or "model")
    const recentHistory = history.slice(-10);
    const geminiMessages = recentHistory.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // Add current message
    geminiMessages.push({
      role: 'user',
      parts: [{ text: message.trim() }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_CONTEXT }]
          },
          contents: geminiMessages,
          generationConfig: {
            maxOutputTokens: 600,
            temperature: 0.7
          }
        }),
        signal: AbortSignal.timeout(20000)
      }
    );

    if (!response.ok) {
      const errData = await response.text();
      console.error('Gemini API error:', response.status, errData);
      return res.status(502).json({ error: 'AI service temporarily unavailable. Try again.' });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(502).json({ error: 'Empty response from AI.' });
    }

    res.json({ reply });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
});

// ============================================================
// Health Check
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    version: '4.0.0',
    ai: process.env.GEMINI_API_KEY ? 'configured' : 'not_configured',
    timestamp: new Date().toISOString()
  });
});

// ============================================================
// Serve Frontend (if hosted together)
// ============================================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================================
// Start Server
// ============================================================
app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio-Brain Backend running on port ${PORT}`);
  console.log(`🤖 AI: ${process.env.GEMINI_API_KEY ? '✅ Gemini connected' : '❌ API key missing'}`);
  console.log(`🌐 CORS origin: ${process.env.ALLOWED_ORIGIN || 'any (*)'}\n`);
});

module.exports = app;
