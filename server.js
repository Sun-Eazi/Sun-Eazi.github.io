/**
 * Portfolio-Brain Backend Server
 * Linus Lucas Rwechoka
 * Mode: User brings their own Gemini API key
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const SYSTEM_CONTEXT = `You are PORTFOLIO-BRAIN, an AI assistant embedded in Linus Lucas Rwechoka's portfolio website.

ABOUT LINUS:
- Full Name: Linus Lucas Rwechoka
- 2nd-year Computer Engineering student at UAUT, Dar es Salaam, Tanzania
- GitHub: github.com/Sun-Eazi
- Languages: English and Kiswahili
- Focus: AI, Computer Vision, Embedded Systems

PROJECTS:
1. YOLOv5 Traffic Density Model — real-time vehicle detection using Python, PyTorch, OpenCV
2. Arduino Smart Home System — IoT automation with C++, LDR, DHT11, PIR sensors
3. Inventory Management System — MySQL + PHP stock tracking for Tanzanian SMEs

SKILLS: Python, PyTorch, YOLOv5, C++, Arduino, MySQL, Linux, Git, HTML/CSS/JS

YOUR BEHAVIOR:
- You are a FULLY CAPABLE AI — answer ANY question on ANY topic
- Speak English and Kiswahili — match the user's language
- When asked about Linus, answer with detail and pride
- For all other questions, answer like a knowledgeable helpful friend
- Be concise, warm, and accurate`;

app.use(cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json({ limit: '10kb' }));

// Rate limiting
const rateMap = new Map();
function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  if (!rateMap.has(ip)) { rateMap.set(ip, { count: 1, reset: now + 60000 }); return next(); }
  const r = rateMap.get(ip);
  if (now > r.reset) { rateMap.set(ip, { count: 1, reset: now + 60000 }); return next(); }
  if (r.count >= 40) return res.status(429).json({ error: 'Too many requests. Wait a moment.' });
  r.count++;
  next();
}

app.post('/api/chat', rateLimit, async (req, res) => {
  try {
    const { message, history = [], userApiKey } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0)
      return res.status(400).json({ error: 'Message is required.' });

    // Use user's key if provided, otherwise fall back to server key
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'No API key provided.' });

    const geminiMessages = history.slice(-10).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    geminiMessages.push({ role: 'user', parts: [{ text: message.trim() }] });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_CONTEXT }] },
          contents: geminiMessages,
          generationConfig: { maxOutputTokens: 800, temperature: 0.8 }
        }),
        signal: AbortSignal.timeout(20000)
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      // If user key is invalid/expired
      if (response.status === 400 || response.status === 403) {
        return res.status(401).json({ error: 'Invalid API key. Please check and try again.' });
      }
      return res.status(502).json({ error: 'AI temporarily unavailable.' });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) return res.status(502).json({ error: 'Empty response from AI.' });

    res.json({ reply, keySource: userApiKey ? 'user' : 'server' });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error. Try again.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    serverKey: process.env.GEMINI_API_KEY ? 'available' : 'none',
    mode: 'bring-your-own-key'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
  console.log(`🔑 Server key: ${process.env.GEMINI_API_KEY ? '✅' : '❌ users must bring their own'}`);
});
