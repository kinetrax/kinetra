# Netlify Deployment Setup

## Steps to Deploy on Netlify

### 1. Environment Variables

In your Netlify dashboard, go to **Site settings** → **Environment variables** and add:

- `TELEGRAM_BOT_TOKEN` - Your Telegram bot token
- `TELEGRAM_CHAT_ID` - Your Telegram chat/channel ID
- `TELEGRAM_CHANNEL_URL` (optional) - Default: `https://t.me/kinetraX`
- `TWITTER_URL` (optional) - Default: `https://x.com/kinetrax`

**IMPORTANT:** Also add this variable to exclude `js/config.js` from secrets scanning:

- `SECRETS_SCAN_OMIT_PATHS` = `js/config.js`

This is required because `config.js` is expected to contain tokens (it's generated from your environment variables).

### 2. Build Settings

Netlify will automatically detect the `netlify.toml` file. The build settings are:

- **Build command:** `npm run config`
- **Publish directory:** `.` (root directory)

### 3. Deploy

1. Connect your repository to Netlify
2. Netlify will automatically run the build command
3. The `generate-config.js` script will create `js/config.js` from environment variables
4. Your site will be deployed!

## Important Notes

- The `.env` file is **NOT** used on Netlify - use Environment Variables in Netlify dashboard instead
- The `config.js` file is generated during build and should be in `.gitignore` (already configured)
- Make sure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set in Netlify environment variables

## Troubleshooting

If the build fails:
1. Check that all required environment variables are set in Netlify
2. Verify Node.js version compatibility (Netlify uses Node 18 by default)
3. Check build logs in Netlify dashboard
