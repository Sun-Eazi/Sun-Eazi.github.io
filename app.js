/**
 * Portfolio-Brain v4.0
 * Linus Lucas Rwechoka — AI Engineer Portfolio
 * Real Claude AI — Powered by backend proxy
 */

// ============================================================
// CONFIG — Update BACKEND_URL after deploying your server
// ============================================================
const CONFIG = {
  // 🔴 CHANGE THIS to your deployed backend URL after hosting
  // Example: 'https://linus-portfolio-backend.onrender.com'
  // For local dev: 'http://localhost:3000'
  BACKEND_URL: 'https://linus-portfolio-backend.onrender.com',
  
  // If true, uses standalone keyword mode if backend is unreachable
  ENABLE_FALLBACK: true
};

// ============================================================
// Chat State
// ============================================================
let conversationHistory = [];
let isWaitingForResponse = false;

// ============================================================
// DOM Elements
// ============================================================
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const aiStatusDot = document.getElementById('ai-status-dot');
const aiStatusText = document.getElementById('ai-status-text');

// ============================================================
// AI Status — Check backend on load
// ============================================================
async function checkBackendStatus() {
  try {
    const res = await fetch(`${CONFIG.BACKEND_URL}/api/health`, {
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      const data = await res.json();
      setStatus('online', data.ai === 'configured' ? 'Claude AI · Online' : 'Backend · No API Key');
      return true;
    }
  } catch {
    // Backend unreachable
  }
  setStatus('offline', CONFIG.ENABLE_FALLBACK ? 'Standalone Mode' : 'Offline');
  return false;
}

function setStatus(state, text) {
  if (!aiStatusDot || !aiStatusText) return;
  aiStatusText.textContent = text;
  
  const colors = {
    online: '#22c55e',
    offline: '#e8ff47',
    thinking: '#06b6d4'
  };
  aiStatusDot.style.background = colors[state] || colors.online;
  
  if (state === 'thinking') {
    aiStatusDot.style.animation = 'blink 0.6s infinite';
  } else {
    aiStatusDot.style.animation = 'blink 1.5s infinite';
  }
}

// ============================================================
// Real AI via Backend (Claude)
// ============================================================
async function getClaudeResponse(message) {
  const response = await fetch(`${CONFIG.BACKEND_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history: conversationHistory.slice(-10) // Send recent history for context
    }),
    signal: AbortSignal.timeout(20000) // 20s timeout
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.reply;
}

// ============================================================
// Standalone Fallback (Bilingual — English + Kiswahili)
// ============================================================
async function getStandaloneResponse(msg) {
  await new Promise(r => setTimeout(r, 700)); // Natural delay
  
  const m = msg.toLowerCase();
  const isSwahili = /habari|mambo|vipi|jambo|nini|nani|yuko|fanya|miradi|ujuzi|tanzania|uaut|sana|asante|karibu/.test(m);

  const responses = {
    en: {
      greeting: "Hey! 👋 I'm Linus's AI representative — I know everything about his work. What would you like to explore?",
      yolo: "Linus's flagship work is the **YOLOv5 Traffic Density Model** — a computer vision system that detects vehicles and estimates road congestion in real-time. Built with Python, PyTorch, and OpenCV. It's designed specifically for Dar es Salaam's traffic reality.",
      arduino: "The **Arduino Smart Home System** automates home functions using C++ and sensors like LDR (light), DHT11 (temperature/humidity), and PIR (motion). Built with Tanzania's power infrastructure in mind.",
      inventory: "The **Inventory Management System** is a full-stack MySQL + PHP solution for local SMEs — designed to streamline stock tracking for businesses in Tanzania.",
      skills: "Linus's core stack: **Python** for AI/ML (PyTorch, YOLOv5, OpenCV), **C++** for embedded systems, and web tech (HTML/CSS/JS). Also deep in Linux admin, MySQL, and Git.",
      about: "Linus is a 2nd-year Computer Engineering student at **UAUT, Dar es Salaam, Tanzania**. He builds at the intersection of AI, computer vision, and embedded hardware — focused on solving real local problems.",
      github: "All of Linus's projects live at **github.com/Sun-Eazi** — go explore his repos!",
      contact: "Linus is open to collaborations, internships, and innovative engineering projects. Reach him via GitHub: github.com/Sun-Eazi",
      default: "Great question! I'm operating in offline mode right now and may not answer that fully. Try asking about Linus's projects (YOLOv5, Smart Home, Inventory), his skills, or his background."
    },
    sw: {
      greeting: "Habari! 👋 Mimi ni mwakilishi wa AI wa Linus. Nikusaidie vipi kujua zaidi kuhusu kazi zake?",
      yolo: "Mradi mkuu wa Linus ni **YOLOv5 Traffic Density Model** — mfumo wa computer vision unaotambua magari na msongamano wa barabara kwa wakati halisi. Umetengenezwa kwa Python, PyTorch, na OpenCV kwa ajili ya Dar es Salaam.",
      arduino: "**Arduino Smart Home System** inatumia C++ na vitambuzi (LDR, DHT11, PIR) kuongoza mifumo ya nyumbani — taa, joto, na ulinzi — kwa muktadha wa Tanzania.",
      inventory: "**Inventory System** ni mfumo wa kusimamia bidhaa kwa MySQL na PHP, umeundwa kwa ajili ya biashara ndogo Tanzania.",
      skills: "Ujuzi wa Linus: **Python** kwa AI (PyTorch, YOLOv5), **C++** kwa Arduino, na web. Pia ana ujuzi wa Linux, MySQL, na Git.",
      about: "Linus ni mwanafunzi wa mwaka wa pili wa Uhandisi wa Kompyuta pale **UAUT, Dar es Salaam**. Anajenga mifumo ya akili ili kutatua matatizo ya Tanzania.",
      github: "Miradi yote ya Linus ipo **github.com/Sun-Eazi** — nenda uangalie!",
      contact: "Linus yuko wazi kwa ushirikiano na miradi ya uhandisi. Wasiliana naye kupitia GitHub.",
      default: "Samahani, sijaelewa vizuri. Unaweza kuuliza kuhusu miradi ya Linus, ujuzi wake, au historia yake ya uhandisi."
    }
  };

  const r = isSwahili ? responses.sw : responses.en;

  if (/hello|hi|hey|habari|mambo|vipi|salam/.test(m)) return r.greeting;
  if (/yolo|traffic|barabara|magari|vision|detect/.test(m)) return r.yolo;
  if (/arduino|home|nyumbani|sensor|iot|smart/.test(m)) return r.arduino;
  if (/inventory|stock|bidhaa|mysql|database/.test(m)) return r.inventory;
  if (/skill|ujuzi|uwezo|tech|language|python|c\+\+/.test(m)) return r.skills;
  if (/linus|who|nani|about|kuhusu|background|uaut/.test(m)) return r.about;
  if (/github|code|repo|project|mradi/.test(m)) return r.github;
  if (/contact|collab|hire|work|together/.test(m)) return r.contact;
  
  return r.default;
}

// ============================================================
// Master AI Handler
// ============================================================
async function getAIResponse(message) {
  try {
    const reply = await getClaudeResponse(message);
    setStatus('online', 'Claude AI · Online');
    return { text: reply, source: 'claude' };
  } catch (error) {
    console.warn('Backend unavailable:', error.message);
    if (CONFIG.ENABLE_FALLBACK) {
      const text = await getStandaloneResponse(message);
      setStatus('offline', 'Standalone Mode');
      return { text, source: 'standalone' };
    }
    throw error;
  }
}

// ============================================================
// Chat Logic
// ============================================================
async function handleChat() {
  if (isWaitingForResponse) return;
  const message = userInput.value.trim();
  if (!message) return;

  isWaitingForResponse = true;
  appendMessage('user', message);
  userInput.value = '';
  userInput.disabled = true;
  sendBtn.disabled = true;
  setStatus('thinking', 'Thinking...');

  const loadingId = appendLoading();

  try {
    const { text, source } = await getAIResponse(message);
    
    // Add to conversation history for context memory
    conversationHistory.push({ role: 'user', content: message });
    conversationHistory.push({ role: 'assistant', content: text });
    
    // Keep history reasonable
    if (conversationHistory.length > 30) {
      conversationHistory = conversationHistory.slice(-20);
    }

    removeLoading(loadingId);
    appendMessage('ai', text, source === 'standalone');
    
    setStatus('online', source === 'claude' ? 'Claude AI · Online' : 'Standalone Mode');
  } catch (error) {
    removeLoading(loadingId);
    appendMessage('ai', `⚠️ Connection error: ${error.message}. Please try again.`, true);
    setStatus('offline', 'Error — retry');
  }

  userInput.disabled = false;
  sendBtn.disabled = false;
  isWaitingForResponse = false;
  userInput.focus();
}

function appendMessage(role, text, isStandalone = false) {
  const div = document.createElement('div');
  div.className = `message ${role}`;

  if (role === 'ai') {
    const badge = isStandalone
      ? `<span class="ai-mode-badge standalone">⚡ STANDALONE</span>`
      : `<span class="ai-mode-badge claude">🧠 CLAUDE AI</span>`;
    div.innerHTML = `<div class="message-inner">${badge}${formatText(text)}</div>`;
  } else {
    div.textContent = text;
  }

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendLoading() {
  const id = 'loading-' + Date.now();
  const div = document.createElement('div');
  div.id = id;
  div.className = 'message loading';
  div.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  return id;
}

function removeLoading(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

function quickPrompt(text) {
  if (isWaitingForResponse) return;
  userInput.value = text;
  handleChat();
}

// Enter key
userInput?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) handleChat();
});

// ============================================================
// Matrix Rain Effect
// ============================================================
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const chars = 'アァカサタナハマヤラワガザダバパ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const fontSize = 13;
  let drops = [];
  
  const resetDrops = () => {
    const columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
  };
  resetDrops();
  window.addEventListener('resize', resetDrops);

  const draw = () => {
    ctx.fillStyle = 'rgba(8, 11, 16, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#e8ff47';
    ctx.font = `${fontSize}px monospace`;

    drops.forEach((y, i) => {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.globalAlpha = Math.random() * 0.3 + 0.05;
      ctx.fillText(text, i * fontSize, y * fontSize);
      ctx.globalAlpha = 1;
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  };

  setInterval(draw, 40);
}

// ============================================================
// Scroll Reveal
// ============================================================
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ============================================================
// Skill Bars Animation
// ============================================================
function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(fill => {
          setTimeout(() => fill.classList.add('animated'), 200);
        });
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.skill-group').forEach(g => observer.observe(g));
}

// ============================================================
// Counter Animation
// ============================================================
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    let count = 0;
    const step = Math.max(1, Math.floor(target / 20));
    const interval = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count;
      if (count >= target) clearInterval(interval);
    }, 60);
  });
}

// ============================================================
// Custom Cursor (desktop only)
// ============================================================
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--cx', e.clientX + 'px');
    document.documentElement.style.setProperty('--cy', e.clientY + 'px');
  });
}

// ============================================================
// Mobile Menu
// ============================================================
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ============================================================
// Active Nav Link on Scroll
// ============================================================
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(section => observer.observe(section));
}

// ============================================================
// Initialize
// ============================================================
window.addEventListener('DOMContentLoaded', async () => {
  console.log('%c PORTFOLIO-BRAIN v4.0 — Real Claude AI 🧠 ', 
    'background:#e8ff47;color:#080b10;font-weight:bold;padding:4px 10px;border-radius:3px;');

  initMatrixRain();
  initScrollReveal();
  initSkillBars();
  initCursor();
  initMobileMenu();
  initActiveNav();
  setTimeout(animateCounters, 800);

  // Check backend connectivity
  await checkBackendStatus();
});
