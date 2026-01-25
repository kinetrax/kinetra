# KinetraX Website

Blockchain-powered fitness platform website with token airdrop registration.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Telegram Bot

1. Copy the environment template:
   ```bash
   cp env.template .env
   ```

2. Edit `.env` and add your Telegram bot credentials:
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_CHAT_ID=your_chat_id_here
   ```

3. Generate config file:
   ```bash
   npm run config
   ```

### 3. Run Locally

Simply open `index.html` in your browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

## Project Structure

- `index.html` - Main homepage
- `token-airdrop.html` - Token airdrop registration form
- `js/` - JavaScript files
  - `presale-form.js` - Form submission handler
  - `config.js` - Auto-generated from .env (do not edit manually)
- `css/` - Stylesheets
- `.env` - Environment variables (not committed to git)
- `generate-config.js` - Script to generate config.js from .env

## Configuration

See [CONFIG_SETUP.md](CONFIG_SETUP.md) for detailed configuration instructions.

## Deployment

1. Make sure `config.js` is generated: `npm run config`
2. Deploy all files (including `config.js`)
3. **Never deploy `.env` file** - keep it local only

## License

Copyright © 2025 KinetraX. All rights reserved.

