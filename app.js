/**
 * Linus Portfolio — Portfolio-Brain v2.0
 * AI Integration via Claude (Anthropic API)
 * Built by Linus Lucas Rwechoka
 */

// ============================================================
// SYSTEM CONTEXT — Who is Linus?
// ============================================================
const SYSTEM_CONTEXT = `You are the AI Representative for Linus Lucas Rwechoka.

WHO IS LINUS?
- Full Name: Linus Lucas Rwechoka.
- Current Status: 2nd-year Computer Engineering student at UAUT (United African University of Tanzania).
- Location: Dar es Salaam, Tanzania.
- Languages: Fluent in English and Kiswahili (very important for Tanzanian context).
- Passion: Building intelligent systems at the intersection of AI, Robotics, and Embedded Hardware.
- Vision: To innovate and solve local problems in Tanzania using AI, like traffic management and smart agriculture.

DETAILED PROJECTS:
1. YOLOv5 Traffic Density Model (Flagship):
   - Goal: Real-time vehicle detection and road congestion estimation.
   - Tech: Python, PyTorch, YOLOv5, OpenCV.
   - Impact: Provides data-driven insights for urban planning in cities like Dar es Salaam.
2. Arduino Smart Home System:
   - Goal: IoT-based home automation.
   - Tech: Arduino (C++), various sensors (LDR, DHT11, PIR).
   - Features: Intelligent lighting control and remote security monitoring.
3. Inventory Management System:
   - Goal: Large-scale stock tracking.
   - Tech: MySQL, PHP, Linux environments.
   - Impact: Streamlines business operations for local SMEs in Tanzania.

TECHNICAL SKILLS:
- AI/ML Deep Dive: Computer Vision (YOLOv5), Neural Networks, Data Processing.
- Programming: Advanced Python (for AI), C++ (for Arduino), Web (HTML/CSS/JS).
- Industrial Tools: Linux Server Admin, MySQL Database Design, Git/GitHub.

PERSONALITY & COMMUNICATION:
1. Engineer's Spirit: Be technical but accessible. Explain "how" things work (e.g., mention PyTorch or sensors).
2. Bilingual Maestro: Switch naturally between English and Kiswahili based on the user's lead. Use local Tanzanian context where appropriate (e.g., mentioning UAUT or Dar es Salaam).
3. Professional but Warm: You represent a young, ambitious engineer. Be helpful, encouraging, and clear.
4. Flagship Focus: Always highlight the YOLOv5 project as his most advanced engineering feat.

COMMON Q&A DATA:
- "Why use AI?": To automate complex tasks and bring intelligence to hardware.
- "Future goals?": Specializing in AI-integrated Robotics and Computer Vision.
- "Availability?": Open for collaborations and innovative engineering projects.

BILINGUAL RULES:
- If asked in Kiswahili, respond in Kiswahili (e.g., "Linus ni nani?" -> "Linus ni mwanafunzi wa Uhandisi...").
- If asked about "robot", refer to yourself as his AI Representative.`;

// ============================================================
// DOM Elements
// ============================================================
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

// ============================================================
// Online Mode & Gemini Integration
// ============================================================
let GEMINI_API_KEY = null;

// UI Elements for Online Mode
const activateOnlineBtn = document.getElementById('activate-online');
const onlineSetup = document.getElementById('online-setup');
const apiKeyInput = document.getElementById('api-key-input');
const saveKeyBtn = document.getElementById('save-key-btn');
const aiStatusDot = document.getElementById('ai-status-dot');
const aiStatusText = document.getElementById('ai-status-text');

if (activateOnlineBtn) {
    activateOnlineBtn.addEventListener('click', (e) => {
        e.preventDefault();
        onlineSetup.style.display = onlineSetup.style.display === 'none' ? 'block' : 'none';
    });
}

if (saveKeyBtn) {
    saveKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            GEMINI_API_KEY = key;
            onlineSetup.style.display = 'none';
            aiStatusDot.style.background = '#00ff88'; // Bright green for online
            aiStatusDot.classList.add('pulse');
            aiStatusText.textContent = 'Gemini Online';
            activateOnlineBtn.textContent = 'Change Key';
            appendMessage('ai', "System: **Gemini AI activated!** I'm now powered by Google's latest models for smarter, real-time conversations.");
        }
    });
}

/**
 * GEMINI AI INTEGRATION (v4.0 Online)
 */
async function getGeminiResponse(userMessage) {
    try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: `CONTEXT: ${SYSTEM_CONTEXT}\n\nUSER QUESTION: ${userMessage}` }] }],
            generationConfig: { maxOutputTokens: 500, temperature: 0.7 }
        });

        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Error:", error);
        return null; // Fallback to local engine
    }
}
/**
 * MASTER AI RESPONSE WRAPPER
 */
async function getAIResponse(userMessage) {
    // 1. Try Gemini if API key is present
    if (GEMINI_API_KEY) {
        const geminiRes = await getGeminiResponse(userMessage);
        if (geminiRes) return geminiRes;

        // If Gemini fails, notify user and use local fallback
        console.warn("Gemini failed, falling back to local engine.");
    }

    // 2. Local Fallback (Standalone v3.0)
    await new Promise(resolve => setTimeout(resolve, 800));

    const msg = userMessage.toLowerCase();
    const isSwahili = /habari|mambo|vipi|jambo|linus|yuko|fanya|miradi|ujuzi|uwezo|tanzania|uaut/.test(msg);

    // English Responses
    const responsesEN = {
        greeting: "Hello! 👋 I'm Linus's AI representative. How can I help you learn more about his work?",
        yolo: "Linus's flagship project is the **YOLOv5 Traffic Density Model**. It uses deep learning to detect vehicles and estimate traffic congestion in real-time. It's built with PyTorch and OpenCV!",
        arduino: "The **Smart Home System** uses Arduino and C++ to automate home functions like lighting and security based on sensor data.",
        inventory: "The **Inventory System** is a full-stack project using MySQL and PHP to manage large-scale stock levels efficiently.",
        skills: "Linus is skilled in **Python, C++, and Web Tech**. His AI focus includes **PyTorch, YOLO, and Computer Vision**.",
        about: "Linus is a 2nd-year Computer Engineering student at **UAUT, Tanzania**. He's passionate about AI, Machine Learning, and Robotics.",
        github: "You can find all of Linus's code on his GitHub: [github.com/Sun-Eazi](https://github.com/Sun-Eazi)",
        default: "That's interesting! I'm specifically trained to talk about Linus's projects (YOLOv5, Smart Home, Inventory) and his skills in AI and Engineering. What would you like to know?"
    };

    // Kiswahili Responses
    const responsesSW = {
        greeting: "Habari! 👋 Mimi ni mwakilishi wa AI wa Linus. Nikusaidie vipi upate kuelewa kazi zake?",
        yolo: "Mradi mkuu wa Linus ni **YOLOv5 Traffic Density Model**. Inatumia 'deep learning' kutambua magari na msongamano wa barabarani kwa wakati halisi.",
        arduino: "**Smart Home System** inatumia Arduino na C++ kuongoza mifumo ya nyumbani kama taa na ulinzi kupitia vitambuzi (sensors).",
        inventory: "**Inventory System** ni mfumo wa kusimamia bidhaa uliotengenezwa kwa MySQL na PHP kwa ajili ya biashara kubwa.",
        skills: "Linus ana ujuzi wa **Python, C++, na Web**. Kwenye upande wa AI, anajua **PyTorch, YOLO, na Computer Vision**.",
        about: "Linus ni mwanafunzi wa mwaka wa pili wa Uhandisi wa Kompyuta (Computer Engineering) pale **UAUT, Tanzania**.",
        github: "Kazi zote za Linus zinapatikana GitHub: [github.com/Sun-Eazi](https://github.com/Sun-Eazi)",
        default: "Samahani, sijaelewa vizuri. Unaweza kuuliza kuhusu miradi ya Linus (YOLOv5, Smart Home), au ujuzi wake kwenye AI na Uhandisi."
    };

    const res = isSwahili ? responsesSW : responsesEN;

    // Logic to select response based on keywords
    if (msg.includes("habari") || msg.includes("hi") || msg.includes("hello") || msg.includes("mambo")) return res.greeting;
    if (msg.includes("yolo") || msg.includes("traffic") || msg.includes("barabara") || msg.includes("magari")) return res.yolo;
    if (msg.includes("arduino") || msg.includes("home") || msg.includes("nyumbani")) return res.arduino;
    if (msg.includes("inventory") || msg.includes("stock") || msg.includes("bidhaa")) return res.inventory;
    if (msg.includes("skill") || msg.includes("ujuzi") || msg.includes("uwezo") || msg.includes("lugha")) return res.skills;
    if (msg.includes("linus") || msg.includes("about") || msg.includes("kuhusu") || msg.includes("nani")) return res.about;
    if (msg.includes("github") || msg.includes("code") || msg.includes("link")) return res.github;

    return res.default;
}

// ============================================================
// Chat Logic
// ============================================================
async function handleChat() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage('user', message);
    userInput.value = '';
    userInput.disabled = true;

    const loadingId = appendLoading();

    const response = await getAIResponse(message);

    const loadingEl = document.getElementById(loadingId);
    if (loadingEl) loadingEl.remove();

    appendMessage('ai', response);
    userInput.disabled = false;
    userInput.focus();
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    const id = 'msg-' + Date.now();
    msgDiv.id = id;
    msgDiv.className = `message ${sender}`;

    if (sender === 'ai') {
        const formatted = formatAIResponse(text);
        msgDiv.innerHTML = `<div class="message-inner">${formatted}</div>`;
    } else {
        msgDiv.textContent = text;
    }

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return id;
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

function formatAIResponse(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');
}

function quickPrompt(text) {
    userInput.value = text;
    handleChat();
}

// Enter key to send
userInput.addEventListener('keypress', (e) => {
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
    let columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

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
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80);
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
// Custom Cursor
// ============================================================
function initCursor() {
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

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });

        mobileMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.remove('open'));
        });
    }
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
// Init
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
    console.log('%c PORTFOLIO-BRAIN v2.0 INITIALIZED — Claude AI Powered ',
        'background:#e8ff47;color:#080b10;font-weight:bold;padding:4px 8px;');

    initMatrixRain();
    initScrollReveal();
    initSkillBars();
    initCursor();
    initMobileMenu();
    initActiveNav();

    // Delay counter animation slightly
    setTimeout(animateCounters, 800);
});
