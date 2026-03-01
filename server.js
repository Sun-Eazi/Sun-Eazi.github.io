/**
 * Portfolio-Brain Backend Server
 * Linus Lucas Rwechoka — AI Engineer Portfolio
 * Powered by Google Gemini API
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const SYSTEM_CONTEXT = `You are PORTFOLIO-BRAIN, the AI Representative for Linus Lucas Rwechoka.
Linus is a 2nd-year Computer Engineering student at UAUT in Dar es Salaam.
Projects: YOLOv5 Traffic Model, Arduino Smart Home, Inventory System.
Languages: English and Kiswahili.`;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ error: 'API key missing' });

    const geminiMessages = history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    geminiMessages.push({ role: 'user', parts: [{ text: message }] });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_CONTEXT }] },
          contents: geminiMessages
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ reply: reply || "I'm having trouble thinking right now." });

  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', ai: process.env.GEMINI_API_KEY ? 'configured' : 'not_configured' });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));