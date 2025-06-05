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

// Validate required environment variables
if (!TELEGRAM_BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN is required');
  process.exit(1);
}

if (!WEBHOOK_URL) {
  console.error('❌ WEBHOOK_URL is required');
  process.exit(1);
}

// Telegram Bot API base URL
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Utility function to send message to Telegram
async function sendMessage(chatId, text) {
  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    });
    
    console.log(`✅ Message sent to chat ${chatId}: ${text}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error sending message to chat ${chatId}:`, error.response?.data || error.message);
    throw error;
  }
}

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
      const userName = message.from.first_name || 'User';
      
      console.log(`👤 Message from ${userName} (${chatId}): ${messageText}`);
      
      // Simple echo response with some customization
      let responseText;
      
      if (messageText.toLowerCase() === '/start') {
        responseText = `👋 Hello ${userName}! Welcome to the bot. Send me any message and I'll echo it back to you.`;
      } else if (messageText.toLowerCase() === '/help') {
        responseText = `🤖 <b>Bot Commands:</b>\n\n/start - Start the bot\n/help - Show this help message\n\nJust send me any text and I'll echo it back!`;
      } else if (messageText) {
        responseText = `🔄 <b>Echo:</b> ${messageText}\n\n👤 <i>Sent by: ${userName}</i>`;
      } else {
        responseText = `📎 I received your message, but I can only echo text messages for now.`;
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
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Telegram Bot Webhook Server',
    status: 'running',
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
  console.log(`📱 Bot token: ${TELEGRAM_BOT_TOKEN.substring(0, 10)}...`);
  console.log(`🔗 Webhook URL: ${WEBHOOK_URL}`);
  
  try {
    // Get current webhook info
    await getWebhookInfo();
    
    // Set new webhook
    await setWebhook();
    
    console.log('✅ Bot is ready to receive messages!');
  } catch (error) {
    console.error('❌ Failed to initialize webhook:', error.message);
    console.log('⚠️  Server is running but webhook may not be properly configured');
  }
}); 