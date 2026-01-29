# KinetraX Website

Blockchain-powered sport platform website with token airdrop registration.

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
   TELEGRAM_BOT_USERNAME=your_bot_username
   TELEGRAM_CHANNEL_ID=your_channel_id
   TELEGRAM_GROUP_ID=your_group_id
   ```
   
   **Security Note:** `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are now used server-side only via Netlify functions. They are NOT exposed in the frontend `config.js` file for security.

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
2. Set environment variables in Netlify (Site settings > Environment variables):
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `TELEGRAM_BOT_USERNAME`
   - `TELEGRAM_CHANNEL_ID`
   - `TELEGRAM_GROUP_ID`
   - `RECAPTCHA_SITE_KEY` (and optionally `RECAPTCHA_SECRET_KEY`)
3. Deploy all files (including `config.js`)
4. **Never deploy `.env` file** - keep it local only
5. **Never commit `config.js` with tokens** - bot token is now server-side only

## License

Copyright © 2025 KinetraX. All rights reserved.

