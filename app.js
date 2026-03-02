/**
 * Portfolio-Brain v4.0 — Frontend
 * Linus Lucas Rwechoka
 * Mode: User brings their own Gemini API key
 */

const CONFIG = {
  BACKEND_URL: 'https://sun-eazi-github-io.onrender.com',
  ENABLE_FALLBACK: true
};

let conversationHistory = [];
let isWaitingForResponse = false;
let userGeminiKey = null; // Stored in memory only — never saved anywhere

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const aiStatusDot = document.getElementById('ai-status-dot');
const aiStatusText = document.getElementById('ai-status-text');

// ============================================================
// Backend Status
// ============================================================
async function checkBackendStatus() {
  try {
    const res = await fetch(`${CONFIG.BACKEND_URL}/api/health`, {
      signal: AbortSignal.timeout(8000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.serverKey === 'available') {
        setStatus('online', 'Gemini AI · Online');
      } else {
        setStatus('offline', 'Add your API key below');
      }
      return true;
    }
  } catch (e) {
    console.log('Backend offline');
  }
  setStatus('offline', 'Standalone Mode');
  return false;
}

function setStatus(state, text) {
  if (!aiStatusText || !aiStatusDot) return;
  aiStatusText.textContent = text;
  const colors = { online: '#22c55e', offline: '#e8ff47', thinking: '#06b6d4' };
  aiStatusDot.style.background = colors[state] || colors.online;
}

// ============================================================
// API Key Management
// ============================================================
function activateUserKey() {
  const keyInput = document.getElementById('user-api-key-input');
  const key = keyInput?.value?.trim();
  if (!key || !key.startsWith('AIza')) {
    showKeyError('Invalid key — Gemini keys start with "AIza..."');
    return;
  }
  userGeminiKey = key;
  keyInput.value = '';
  document.getElementById('key-setup-panel').style.display = 'none';
  setStatus('online', 'Gemini AI · Your Key Active');
  appendMessage('ai', '✅ Your Gemini API key is active for this session! Ask me anything — about Linus or any topic you like.', false);
}

function showKeyError(msg) {
  const err = document.getElementById('key-error');
  if (err) { err.textContent = msg; err.style.display = 'block'; }
}

function toggleKeyPanel() {
  const panel = document.getElementById('key-setup-panel');
  if (!panel) return;
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  document.getElementById('key-error').style.display = 'none';
}

function removeKey() {
  userGeminiKey = null;
  setStatus('offline', 'Key removed');
  appendMessage('ai', 'Your API key has been removed from this session.', true);
}

// ============================================================
// AI Response
// ============================================================
async function getAIResponse(message) {
  try {
    const body = { message, history: conversationHistory.slice(-10) };
    if (userGeminiKey) body.userApiKey = userGeminiKey;

    const response = await fetch(`${CONFIG.BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20000)
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        userGeminiKey = null;
        setStatus('offline', 'Invalid key — try again');
        throw new Error('Invalid API key. Please check your key and try again.');
      }
      throw new Error(data.error || 'Server error');
    }

    return { text: data.reply, source: data.keySource === 'user' ? 'your-key' : 'gemini' };

  } catch (error) {
    console.warn('Backend error:', error.message);
    if (CONFIG.ENABLE_FALLBACK && !userGeminiKey) {
      return { text: getStandaloneResponse(message), source: 'standalone' };
    }
    throw error;
  }
}

// ============================================================
// Standalone Fallback
// ============================================================
function getStandaloneResponse(msg) {
  const m = msg.toLowerCase();
  const sw = /habari|mambo|vipi|jambo|nani|miradi|ujuzi|tanzania|uaut|asante/.test(m);
  const en = {
    hi: "Hey! 👋 I'm Linus's AI rep. Add your Gemini API key above to unlock full AI, or ask me about Linus's projects!",
    yolo: "Linus's flagship is the **YOLOv5 Traffic Density Model** — real-time vehicle detection with Python, PyTorch and OpenCV.",
    arduino: "The **Arduino Smart Home** uses C++ and sensors (LDR, DHT11, PIR) for lighting and security automation.",
    inventory: "The **Inventory System** is MySQL + PHP built for stock tracking in Tanzanian SMEs.",
    skills: "Core skills: **Python** (AI/ML), **C++** (Arduino), Web, Linux, MySQL, Git.",
    about: "Linus is a 2nd-year Computer Engineering student at **UAUT, Dar es Salaam**.",
    github: "All projects at **github.com/Sun-Eazi**",
    default: "Add your free Gemini API key above to chat about anything! Or ask me about Linus's projects."
  };
  const sw_r = {
    hi: "Habari! 👋 Ongeza Gemini API key yako juu ili uweze kuzungumza kuhusu chochote!",
    yolo: "Mradi mkuu ni **YOLOv5 Traffic Density Model** — inatambua magari kwa wakati halisi.",
    arduino: "**Arduino Smart Home** inatumia C++ na vitambuzi kusimamia taa na ulinzi.",
    inventory: "**Inventory System** ni MySQL + PHP kwa biashara za Tanzania.",
    skills: "Ujuzi: Python, C++, Web, Linux, MySQL, Git.",
    about: "Linus ni mwanafunzi wa mwaka wa pili, UAUT Dar es Salaam.",
    github: "Miradi yote: **github.com/Sun-Eazi**",
    default: "Ongeza Gemini API key yako ili uweze kuzungumza kuhusu chochote!"
  };
  const r = sw ? sw_r : en;
  if (/hello|hi|hey|habari|mambo|vipi/.test(m)) return r.hi;
  if (/yolo|traffic|barabara|magari/.test(m)) return r.yolo;
  if (/arduino|home|nyumbani|sensor|iot/.test(m)) return r.arduino;
  if (/inventory|stock|bidhaa|mysql/.test(m)) return r.inventory;
  if (/skill|ujuzi|python|c\+\+/.test(m)) return r.skills;
  if (/linus|who|nani|about|kuhusu|uaut/.test(m)) return r.about;
  if (/github|code|repo/.test(m)) return r.github;
  return r.default;
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
    removeLoading(loadingId);
    appendMessage('ai', text, source === 'standalone');
    conversationHistory.push(
      { role: 'user', content: message },
      { role: 'assistant', content: text }
    );
    if (conversationHistory.length > 30) conversationHistory = conversationHistory.slice(-20);

    if (source === 'your-key') setStatus('online', 'Gemini AI · Your Key Active');
    else if (source === 'gemini') setStatus('online', 'Gemini AI · Online');
    else setStatus('offline', 'Standalone Mode');

  } catch (e) {
    removeLoading(loadingId);
    appendMessage('ai', `⚠️ ${e.message || 'Connection error. Please try again.'}`, true);
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
      : `<span class="ai-mode-badge gemini">✨ GEMINI AI</span>`;
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

// ============================================================
// Cursor
// ============================================================
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--cx', e.clientX + 'px');
    document.documentElement.style.setProperty('--cy', e.clientY + 'px');
  });
}

// ============================================================
// Matrix Rain
// ============================================================
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);
  const chars = 'アァカサタナハマ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const fontSize = 13;
  let drops = Array(Math.floor(canvas.width / fontSize)).fill(1);
  window.addEventListener('resize', () => { drops = Array(Math.floor(canvas.width / fontSize)).fill(1); });
  setInterval(() => {
    ctx.fillStyle = 'rgba(8,11,16,0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#e8ff47';
    ctx.font = `${fontSize}px monospace`;
    drops.forEach((y, i) => {
      ctx.globalAlpha = Math.random() * 0.3 + 0.05;
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, y * fontSize);
      ctx.globalAlpha = 1;
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }, 40);
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) setTimeout(() => entry.target.classList.add('visible'), i * 80);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting)
        entry.target.querySelectorAll('.skill-fill').forEach(f => setTimeout(() => f.classList.add('animated'), 200));
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.skill-group').forEach(g => observer.observe(g));
}

function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    let count = 0;
    const interval = setInterval(() => {
      count = Math.min(count + Math.max(1, Math.floor(target / 20)), target);
      el.textContent = count;
      if (count >= target) clearInterval(interval);
    }, 60);
  });
}

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('open')));
}

function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting)
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  sections.forEach(s => observer.observe(s));
}

userInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !e.shiftKey) handleChat(); });
document.getElementById('user-api-key-input')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') activateUserKey(); });

window.addEventListener('DOMContentLoaded', async () => {
  console.log('%c PORTFOLIO-BRAIN v4.0 — Gemini AI 🧠 ', 'background:#e8ff47;color:#080b10;font-weight:bold;padding:4px 10px;');
  initMatrixRain();
  initScrollReveal();
  initSkillBars();
  initCursor();
  initMobileMenu();
  initActiveNav();
  setTimeout(animateCounters, 800);
  await checkBackendStatus();
});
