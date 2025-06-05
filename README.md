# Telegram Bot Webhook Server

A production-ready Telegram bot built with Node.js, Express, and webhook integration. Designed for deployment on free hosting platforms like Render or Railway.

## 🚀 Features

- ✅ Webhook-based (no polling, perfect for free hosting)
- ✅ Echo bot functionality with custom commands
- ✅ Automatic webhook registration on startup
- ✅ Proper error handling and logging
- ✅ Health check endpoint
- ✅ Graceful shutdown handling
- ✅ Production-ready with environment variables

## 📦 Setup

### 1. Get Bot Token
1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Create a new bot with `/newbot`
3. Save the bot token

### 2. Local Development
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your values
TELEGRAM_BOT_TOKEN=your_bot_token_here
WEBHOOK_URL=https://your-app-name.onrender.com
```

### 3. Test Locally (Optional)
```bash
# For local testing, you can use ngrok
npm install -g ngrok
ngrok http 3000

# Update WEBHOOK_URL in .env with ngrok URL
# Then run:
npm start
```

## 🌐 Deployment

### Option 1: Render (Recommended)

1. **Fork/Upload this repository to GitHub**

2. **Deploy to Render:**
   - Go to [render.com](https://render.com)
   - Connect your GitHub account
   - Create a new "Web Service"
   - Select this repository
   - Use these settings:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Set Environment Variables:**
   - `TELEGRAM_BOT_TOKEN`: Your bot token from BotFather
   - `WEBHOOK_URL`: Your Render app URL (e.g., `https://your-app-name.onrender.com`)

4. **Deploy and Test**

### Option 2: Railway

1. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Connect GitHub and select this repository
   - Railway will auto-detect Node.js

2. **Set Environment Variables:**
   - `TELEGRAM_BOT_TOKEN`: Your bot token
   - `WEBHOOK_URL`: Your Railway app URL

### Option 3: Manual Deployment

For any other hosting platform that supports Node.js:

1. Upload files to your hosting platform
2. Run `npm install`
3. Set environment variables:
   - `TELEGRAM_BOT_TOKEN`
   - `WEBHOOK_URL`
   - `PORT` (if required by platform)
4. Start with `npm start`

## 🧪 Testing

### 1. Test Webhook Endpoint
```bash
# Test health check
curl https://your-app-name.onrender.com/health

# Test webhook endpoint (simulates Telegram)
curl -X POST https://your-app-name.onrender.com/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "chat": {"id": 123456},
      "from": {"first_name": "Test"},
      "text": "Hello Bot"
    }
  }'
```

### 2. Test with Telegram
1. Find your bot on Telegram (use the username you set with BotFather)
2. Send `/start` to initialize
3. Send any message to test echo functionality
4. Try `/help` for available commands

## 🤖 Bot Commands

- `/start` - Initialize the bot
- `/help` - Show available commands
- Any text message - Echo back with formatting

## 📁 Project Structure

```
telegram-bot-webhook/
├── index.js           # Main server file
├── package.json       # Dependencies and scripts
├── .env.example       # Environment variables template
├── render.yaml        # Render deployment config
├── Procfile          # Railway/Heroku deployment config
└── README.md         # This file
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather | ✅ Yes |
| `WEBHOOK_URL` | Your app's public URL | ✅ Yes |
| `PORT` | Server port (auto-set by hosting platforms) | ❌ No |

## 🛠️ Troubleshooting

### Bot not responding
1. Check if webhook is set correctly:
   ```bash
   curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
   ```

2. Check server logs for errors

3. Verify environment variables are set correctly

### Webhook errors
- Ensure `WEBHOOK_URL` matches your deployed app URL
- Make sure the URL is accessible publicly
- Check that the `/webhook` endpoint returns 200 OK

### Local development
- Use ngrok for local webhook testing
- Make sure bot token is valid
- Check firewall settings

## 📝 Logs

The bot provides detailed logging:
- 📨 Incoming webhook requests
- 👤 User message details
- ✅ Successful message sends
- ❌ Error messages with details
- 🔗 Webhook registration status

## 🔒 Security

- Environment variables are used for sensitive data
- All webhook payloads are validated
- Graceful error handling prevents crashes
- Always returns 200 OK to Telegram (required)

## 📈 Free Tier Compatibility

This bot is optimized for free hosting tiers:
- Uses webhooks (not polling) to minimize resource usage
- Lightweight dependencies
- Efficient error handling
- Health check endpoint for platform monitoring

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - feel free to use this code for your projects. 