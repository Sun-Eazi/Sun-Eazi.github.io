/**
 * Portfolio-Brain v4.0 — Frontend
 * Linus Lucas Rwechoka
 */

const CONFIG = {
  BACKEND_URL: 'https://linus-portfolio-backend.onrender.com', // Ensure this matches your Render URL
  ENABLE_FALLBACK: true
};

let conversationHistory = [];
let isWaitingForResponse = false;

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const aiStatusDot = document.getElementById('ai-status-dot');
const aiStatusText = document.getElementById('ai-status-text');

async function checkBackendStatus() {
  try {
    const res = await fetch(`${CONFIG.BACKEND_URL}/api/health`);
    if (res.ok) {
      const data = await res.json();
      setStatus('online', data.ai === 'configured' ? 'Gemini AI · Online' : 'Backend · No API Key');
      return true;
    }
  } catch (e) { console.log("Backend offline"); }
  setStatus('offline', 'Standalone Mode');
}

function setStatus(state, text) {
  if (!aiStatusText || !aiStatusDot) return;
  aiStatusText.textContent = text;
  aiStatusDot.style.background = state === 'online' ? '#22c55e' : '#e8ff47';
}

async function getAIResponse(message) {
  try {
    const response = await fetch(`${CONFIG.BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history: conversationHistory.slice(-10) })
    });
    const data = await response.json();
    return { text: data.reply, source: 'gemini' };
  } catch (error) {
    if (CONFIG.ENABLE_FALLBACK) return { text: "I am running in local mode.", source: 'standalone' };
    throw error;
  }
}

async function handleChat() {
  const message = userInput.value.trim();
  if (!message || isWaitingForResponse) return;

  isWaitingForResponse = true;
  appendMessage('user', message);
  userInput.value = '';
  
  try {
    const { text, source } = await getAIResponse(message);
    appendMessage('ai', text, source === 'standalone');
    conversationHistory.push({ role: 'user', content: message }, { role: 'assistant', content: text });
  } catch (e) {
    appendMessage('ai', "Error connecting to AI.");
  }
  isWaitingForResponse = false;
}

function appendMessage(role, text, isStandalone = false) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  const badge = role === 'ai' ? (isStandalone ? '⚡ STANDALONE' : '✨ GEMINI AI') : '';
  div.innerHTML = `<div class="message-inner">${badge ? `<span class="ai-mode-badge">${badge}</span>` : ''}<p>${text}</p></div>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener('click', handleChat);
userInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleChat(); });
window.addEventListener('DOMContentLoaded', checkBackendStatus);