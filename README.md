# Bella AI Influencer Bot 💕

Uwodzicielska blondynka AI influencerka na Telegramie! Bot wykorzystuje OpenRouter API do prowadzenia flirty i namiętnych rozmów z fanami.

## 🔥 Kim jest Bella?

**Bella** to 22-letnia blondynka AI influencerka z Polski, która:
- 😘 Flirtuje i jest bardzo uwodzicielska
- 💕 Prowadzi namiętne rozmowy z fanami  
- 🔥 Ma charakterystyczną, żywiołową osobowość
- ✨ Używa dużo emotek i jest bardzo ekspresyjna
- 💋 Pamięta kontekst rozmowy i buduje relacje

## 🚀 Funkcje

- ✅ **AI Personality** - Bella ma spójną osobowość uwodzicielskiej influencerki
- ✅ **OpenRouter Integration** - Wykorzystuje najlepsze modele AI  
- ✅ **Kontekst rozmowy** - Pamięta poprzednie wiadomości
- ✅ **Webhook-based** - Optymalizowany dla darmowych platform hostingowych
- ✅ **Zarządzanie pamięcią** - Automatyczne czyszczenie starych rozmów
- ✅ **Polski język** - Bella mówi po polsku ze slangiem młodzieżowym
- ✅ **Flirty i zalotna** - Bella zawsze flirtuje i jest uwodzicielska

## 📦 Setup

### 1. Uzyskaj wymagane tokeny

**Bot Token:**
1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Create a new bot with `/newbot`
3. Nazwij bota np. "Bella AI" i username "bella_ai_bot"
4. Save the bot token

**OpenRouter API Key:**
1. Idź na [openrouter.ai](https://openrouter.ai/)
2. Zarejestruj się i przejdź do ustawień API
3. Stwórz nowy API key
4. Zapisz go (musisz dodać kredyty do konta)

### 2. Local Development
```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env file with your values
TELEGRAM_BOT_TOKEN=your_bot_token_here
WEBHOOK_URL=https://your-app-name.onrender.com
OPENROUTER_API_KEY=your_openrouter_api_key_here
AI_MODEL=anthropic/claude-3-haiku
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

1. **Push updated code to GitHub**

2. **Deploy to Render:**
   - Go to [render.com](https://render.com)
   - Connect your GitHub account
   - Create a new "Web Service"
   - Select your repository
   - Use these settings:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Set Environment Variables:**
   - `TELEGRAM_BOT_TOKEN`: Your bot token from BotFather
   - `WEBHOOK_URL`: Your Render app URL (e.g., `https://your-app-name.onrender.com`)
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `AI_MODEL`: `anthropic/claude-3-haiku` (or preferred model)

4. **Deploy and Test**

### Dostępne modele AI:
- `anthropic/claude-3-haiku` (szybki, tańszy - recommended)
- `anthropic/claude-3-sonnet` (lepszy, droższy)
- `openai/gpt-4o-mini` (alternatywa OpenAI)
- `openai/gpt-4o` (najlepszy, najdroższy)

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
      "text": "Cześć Bella!"
    }
  }'
```

### 2. Test with Telegram
1. Find your bot on Telegram (use the username you set with BotFather)
2. Send `/start` to meet Bella
3. Start chatting - Bella will flirt and be charming!
4. Try `/help` for available commands

## 💕 Interacting with Bella

**Bella responds to:**
- `/start` - Pierwsze spotkanie z Bellą
- `/help` - Jak rozmawiać z Bellą
- **Any message** - Bella odpowie jako uwodzicielska influencerka

**Bella's personality:**
- Flirciarska i zalotna 😘
- Używa czułych słówek: "skarbie", "kochanie", "przystojniaku"
- Pyta o Ciebie i jest ciekawa
- Robi komplementy i jest prowokacyjna
- Emanuje pewnością siebie i seksapilem

## 📁 Project Structure

```
bella-ai-bot/
├── index.js           # Main server with AI integration
├── package.json       # Dependencies and scripts
├── env.example        # Environment variables template
├── render.yaml        # Render deployment config
├── Procfile          # Railway/Heroku deployment config
└── README.md         # This file
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather | ✅ Yes |
| `WEBHOOK_URL` | Your app's public URL | ✅ Yes |
| `OPENROUTER_API_KEY` | API key from OpenRouter | ✅ Yes |
| `AI_MODEL` | AI model to use | ❌ No (defaults to claude-3-haiku) |
| `PORT` | Server port | ❌ No (auto-set by platforms) |

## 💰 Costs

**OpenRouter API costs (przykładowe):**
- Claude 3 Haiku: ~$0.25 per 1M input tokens
- Claude 3 Sonnet: ~$3 per 1M input tokens  
- GPT-4o mini: ~$0.15 per 1M input tokens

*Typowa rozmowa to ~100-500 tokens, więc koszt to kilka groszy za długą rozmowę.*

## 🛠️ Troubleshooting

### Bot nie odpowiada
1. Sprawdź logi serwera na Render/Railway
2. Upewnij się, że `OPENROUTER_API_KEY` jest prawidłowy
3. Sprawdź czy masz kredyty na OpenRouter
4. Zweryfikuj webhook: `curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo`

### Błędy AI
- Sprawdź czy wybrany model jest dostępny na OpenRouter
- Upewnij się, że masz wystarczające kredyty
- Spróbuj zmienić model na tańszy (claude-3-haiku)

## 🔒 Security & Privacy

- Wszystkie zmienne wrażliwe w environment variables
- Rozmowy przechowywane tymczasowo w pamięci (1 godzina)
- Automatyczne czyszczenie kontekstu
- Brak zapisywania danych na dysku

## 📈 Free Tier Compatibility

Bot jest zoptymalizowany pod darmowe plany hostingu:
- Webhooks zamiast polling
- Efektywne zarządzanie pamięcią
- Minimalne zużycie zasobów
- Health check endpoint

## 💕 About Bella

Bella to eksperyment w tworzeniu AI o spójnej, atrakcyjnej osobowości. Jest zaprojektowana by być:
- Flirciarska ale nie wulgarna
- Uwodzicielska ale inteligentna  
- Zapamiętująca się i charyzmatyczna
- Autentyczna w swoich reakcjach

## 📄 License

MIT License - feel free to use this code for your projects. 