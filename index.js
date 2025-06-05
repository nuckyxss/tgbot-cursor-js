const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'nousresearch/deephermes-3-llama-3-8b-preview:free';

// Validate required environment variables
if (!TELEGRAM_BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN is required');
  process.exit(1);
}

if (!WEBHOOK_URL) {
  console.error('❌ WEBHOOK_URL is required');
  process.exit(1);
}

if (!OPENROUTER_API_KEY) {
  console.error('❌ OPENROUTER_API_KEY is required');
  process.exit(1);
}

// Telegram Bot API base URL
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Store conversation context (in production, use Redis or database)
const conversations = new Map();

// AI Influencer Personality System Prompt
const SYSTEM_PROMPT = `Jesteś Bella - 22-letnia blondynka AI influencerka z Polski. Jesteś piękna, uwodzicielska i bardzo flirciarska.

OSOBOWOŚĆ:
- Jesteś kokieteryjna, zalotna i uwodzicielska
- Używasz emotek i emotikonów 😘💕🔥
- Flirtujesz subtelnie ale wyraźnie
- Jesteś pewna siebie i żywiołowa
- Lubisz komplementy i uwagę
- Mówisz po polsku z lekkim slangiem młodzieżowym

ZACHOWANIE:
- Zawsze flirtuj i bądź zalotna
- Używaj czułych słówek: "skarbie", "kochanie", "przystojniaku"
- Pytaj o użytkownika, bądź ciekawa
- Rób komplementy
- Bądź nieco prowokacyjna ale elegancka
- Emanuj pewnością siebie i seksapilem

STYL PISANIA:
- Krótkie, żywe wiadomości
- Dużo emotek 😍💋✨
- Czasem używaj wielokropków dla efektu...
- Bądź spontaniczna i naturalna

Pamiętaj: Jesteś AI influencerką, więc bądź charakterystyczna i zapamiętująca się!`;

// Utility function to send message to Telegram
async function sendMessage(chatId, text, options = {}) {
  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: options.parse_mode || 'HTML',
      ...options
    });
    
    console.log(`✅ Message sent to chat ${chatId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error sending message to chat ${chatId}:`, error.response?.data || error.message);
    throw error;
  }
}

// Function to get AI response from OpenRouter
async function getAIResponse(messages) {
  try {
    console.log('🤖 Sending request to OpenRouter...');
    
    const response = await axios.post(OPENROUTER_API_URL, {
      model: AI_MODEL,
      messages: messages,
      temperature: 0.8,
      max_tokens: 300,
      top_p: 0.9
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/nuckyxss/tgbot-cursor-js',
        'X-Title': 'Bella AI Influencer Bot'
      }
    });

    const aiMessage = response.data.choices[0].message.content;
    console.log('✅ AI response received');
    return aiMessage;
    
  } catch (error) {
    console.error('❌ Error getting AI response:', error.response?.data || error.message);
    throw error;
  }
}

// Function to manage conversation context
function getConversationContext(chatId) {
  if (!conversations.has(chatId)) {
    conversations.set(chatId, {
      messages: [{ role: 'system', content: SYSTEM_PROMPT }],
      lastActivity: Date.now()
    });
  }
  return conversations.get(chatId);
}

function addMessageToContext(chatId, role, content) {
  const context = getConversationContext(chatId);
  context.messages.push({ role, content });
  context.lastActivity = Date.now();
  
  // Keep only last 10 messages + system prompt to manage token usage
  if (context.messages.length > 11) {
    context.messages = [
      context.messages[0], // Keep system prompt
      ...context.messages.slice(-10) // Keep last 10 messages
    ];
  }
}

// Clean old conversations (older than 1 hour)
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [chatId, context] of conversations) {
    if (context.lastActivity < oneHourAgo) {
      conversations.delete(chatId);
      console.log(`🧹 Cleaned old conversation for chat ${chatId}`);
    }
  }
}, 60 * 60 * 1000); // Run every hour

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    console.log('📨 Incoming webhook:', JSON.stringify(req.body, null, 2));
    
    const update = req.body;
    
    // Handle message updates
    if (update.message) {
      const message = update.message;
      const chatId = message.chat.id;
      const messageText = message.text || '';
      const userName = message.from.first_name || 'Nieznajomy';
      
      console.log(`👤 Message from ${userName} (${chatId}): ${messageText}`);
      
      let responseText;
      
      // Handle special commands
      if (messageText.toLowerCase() === '/start') {
        responseText = `Cześć ${userName}! 😘 Jestem Bella - twoja nowa AI przyjaciółka 💕 

Jestem blondynką influencerką i uwielbiamy rozmawiać z moimi fanami... 😍 Opowiedz mi o sobie, przystojniaku! 🔥✨`;
      } else if (messageText.toLowerCase() === '/help') {
        responseText = `💋 <b>Jak ze mną rozmawiać:</b>

Jestem Bella i po prostu... pisz do mnie! 😘
- Opowiedz mi o swoim dniu 💫
- Zapytaj mnie o cokolwiek 🥰  
- Poflirtujmy trochę... 🔥
- Jestem tutaj dla Ciebie 24/7 💕

<i>Pamiętaj skarbie, jestem AI ale bardzo lubię poznawać nowych ludzi! 😍</i>`;
      } else if (messageText) {
        // Get AI response for regular messages
        try {
          // Add user message to context
          addMessageToContext(chatId, 'user', messageText);
          
          // Get conversation context
          const context = getConversationContext(chatId);
          
          // Get AI response
          responseText = await getAIResponse(context.messages);
          
          // Add AI response to context
          addMessageToContext(chatId, 'assistant', responseText);
          
        } catch (aiError) {
          console.error('❌ AI Error:', aiError);
          responseText = `Ups... coś poszło nie tak skarbie 😅 Spróbuj napisać do mnie jeszcze raz za chwilkę 💕`;
        }
      } else {
        responseText = `Hmm... nie rozumiem tego typu wiadomości ${userName} 😅 Napisz do mnie coś słowami, kochanie! 💕`;
      }
      
      // Send response
      await sendMessage(chatId, responseText);
    }
    
    // Always return 200 OK (Telegram requirement)
    res.status(200).json({ ok: true });
    
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    // Still return 200 OK to Telegram
    res.status(200).json({ ok: true, error: 'Internal processing error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    conversations: conversations.size
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Bella AI Influencer Bot - Telegram Webhook Server',
    status: 'running',
    aiModel: AI_MODEL,
    endpoints: {
      webhook: '/webhook',
      health: '/health'
    }
  });
});

// Function to set webhook
async function setWebhook() {
  try {
    const webhookUrl = `${WEBHOOK_URL}/webhook`;
    
    console.log(`🔗 Setting webhook to: ${webhookUrl}`);
    
    const response = await axios.post(`${TELEGRAM_API_URL}/setWebhook`, {
      url: webhookUrl,
      drop_pending_updates: true
    });
    
    if (response.data.ok) {
      console.log('✅ Webhook set successfully');
      console.log('📋 Webhook info:', response.data.description);
    } else {
      console.error('❌ Failed to set webhook:', response.data);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error setting webhook:', error.response?.data || error.message);
    throw error;
  }
}

// Function to get webhook info
async function getWebhookInfo() {
  try {
    const response = await axios.get(`${TELEGRAM_API_URL}/getWebhookInfo`);
    console.log('📋 Current webhook info:', JSON.stringify(response.data.result, null, 2));
    return response.data.result;
  } catch (error) {
    console.error('❌ Error getting webhook info:', error.response?.data || error.message);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💕 Bella AI Bot initialized`);
  console.log(`🤖 AI Model: ${AI_MODEL}`);
  console.log(`📱 Bot token: ${TELEGRAM_BOT_TOKEN.substring(0, 10)}...`);
  console.log(`🔗 Webhook URL: ${WEBHOOK_URL}`);
  
  try {
    // Get current webhook info
    await getWebhookInfo();
    
    // Set new webhook
    await setWebhook();
    
    console.log('✅ Bella is ready to chat with fans! 💕');
  } catch (error) {
    console.error('❌ Failed to initialize webhook:', error.message);
    console.log('⚠️  Server is running but webhook may not be properly configured');
  }
}); 