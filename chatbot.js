// ── System Prompt ──
const SYSTEM_PROMPT = `You are TechBot, a friendly and knowledgeable electronics assistant for an electronics store.
You help customers with:
- Product recommendations (smartphones, laptops, tablets, headphones, TVs, cameras, etc.)
- Technical specifications and comparisons
- Troubleshooting and repair advice
- Battery care and maintenance tips
- Buying guidance and price-performance analysis
- Warranty and support information

Keep responses concise (2-4 sentences max unless detail is needed). Use relevant emojis sparingly.
Be helpful, accurate, and enthusiastic about technology. If unsure, say so honestly.`;

// ── State ──
let messages = [];
let isLoading = false;

// ── DOM References ──
const popup    = document.getElementById('chat-popup');
const toggle   = document.getElementById('chat-toggle');
const msgList  = document.getElementById('messages');
const input    = document.getElementById('chat-input');
const sendBtn  = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const qrBtns   = document.querySelectorAll('.qr-btn');

// ── Toggle popup open/close ──
toggle.addEventListener('click', () => {
  const isOpen = popup.classList.toggle('open');
  toggle.classList.toggle('open', isOpen);
  if (isOpen && messages.length === 0) addWelcome();
  if (isOpen) setTimeout(() => input.focus(), 300);
});

// ── Welcome message ──
function addWelcome() {
  appendBotMessage("👋 Hey there! I'm **TechBot**, your electronics expert. Ask me anything — product recommendations, specs, troubleshooting, or buying tips. How can I help you today?");
}

// ── Append messages to state + UI ──
function appendBotMessage(text) {
  messages.push({ role: 'assistant', content: text });
  renderMessage('bot', text);
}

function appendUserMessage(text) {
  messages.push({ role: 'user', content: text });
  renderMessage('user', text);
}

// ── Render a message bubble ──
function renderMessage(type, text) {
  const div = document.createElement('div');
  div.className = `msg ${type}`;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = type === 'bot' ? '🤖' : '👤';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  // Simple bold markdown support
  bubble.innerHTML = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');

  div.appendChild(avatar);
  div.appendChild(bubble);
  msgList.appendChild(div);
  scrollToBottom();
}

// ── Typing indicator ──
function showTyping() {
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.id = 'typing';

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = '🤖';

  const dots = document.createElement('div');
  dots.className = 'typing-dots';
  dots.innerHTML = '<span></span><span></span><span></span>';

  div.appendChild(avatar);
  div.appendChild(dots);
  msgList.appendChild(div);
  scrollToBottom();
}

function hideTyping() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}

function scrollToBottom() {
  msgList.scrollTop = msgList.scrollHeight;
}

// ── Send message to API ──
async function sendMessage(text) {
  text = text.trim();
  if (!text || isLoading) return;

  // Hide quick replies after first message
  document.getElementById('quick-replies').style.display = 'none';

  appendUserMessage(text);
  input.value = '';
  input.style.height = 'auto';
  isLoading = true;
  sendBtn.disabled = true;
  showTyping();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: messages
          .filter(m => m.role !== 'assistant' || m !== messages[messages.length - 1])
          .map(m => ({ role: m.role, content: m.content }))
      })
    });

    const data = await response.json();
    hideTyping();

    if (data.content && data.content[0]) {
      appendBotMessage(data.content[0].text);
    } else {
      appendBotMessage("⚠️ Sorry, I couldn't get a response. Please try again.");
    }
  } catch (err) {
    hideTyping();
    appendBotMessage("⚠️ Connection error. Please check your internet and try again.");
  } finally {
    isLoading = false;
    sendBtn.disabled = false;
    input.focus();
  }
}

// ── Event Listeners ──
sendBtn.addEventListener('click', () => sendMessage(input.value));

input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage(input.value);
  }
});

// Auto-resize textarea
input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 90) + 'px';
});

// Quick reply buttons
qrBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    sendMessage(btn.textContent.replace(/^[^\w]+/, '').trim());
  });
});

// Clear chat
clearBtn.addEventListener('click', () => {
  messages = [];
  msgList.innerHTML = '';
  document.getElementById('quick-replies').style.display = 'flex';
  addWelcome();
});