
// Example configuration file
// Copy this to config.js and fill in your values
// Or use generate-config.js to auto-generate from .env

// SECURITY NOTE: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are no longer exposed here
// They are used server-side only via Netlify functions for security
// Set them in Netlify environment variables instead

window.PRESALE_CONFIG = {
    telegramBotUsername: 'YOUR_BOT_USERNAME_HERE',  // e.g., 'kinetrax_bot' (without @)
    telegramChannelUrl: 'https://t.me/kinetraX',
    twitterUrl: 'https://x.com/kinetrax',
    
    // Google reCAPTCHA v2 Site Key
    // Get your keys from: https://www.google.com/recaptcha/admin
    recaptchaSiteKey: 'YOUR_RECAPTCHA_SITE_KEY_HERE'
};
