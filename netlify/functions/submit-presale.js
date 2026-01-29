// Netlify serverless function to submit presale/airdrop registration form
// This function sends form data to Telegram using the bot token (kept server-side)

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Parse request body
        const body = JSON.parse(event.body || '{}');
        const { name, telegram, twitter, tonAddress, subscribedTelegram, subscribedTwitter, subscribedTgChat, captchaResponse } = body;

        // Validate required fields
        if (!name || !telegram || !twitter || !tonAddress) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Missing required fields',
                    message: 'Please fill in all required fields'
                })
            };
        }

        // Validate reCAPTCHA (optional server-side verification)
        if (captchaResponse) {
            const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
            if (recaptchaSecret) {
                try {
                    const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify`;
                    const recaptchaResponse = await fetch(recaptchaUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: `secret=${encodeURIComponent(recaptchaSecret)}&response=${encodeURIComponent(captchaResponse)}`
                    });

                    const recaptchaData = await recaptchaResponse.json();
                    if (!recaptchaData.success) {
                        return {
                            statusCode: 400,
                            headers,
                            body: JSON.stringify({
                                error: 'reCAPTCHA verification failed',
                                message: 'Please complete the CAPTCHA verification'
                            })
                        };
                    }
                } catch (error) {
                    console.error('Error verifying reCAPTCHA:', error);
                    // Continue anyway if reCAPTCHA verification fails (client-side already verified)
                }
            }
        }

        // Get configuration from environment variables
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Server configuration error',
                    message: 'Telegram bot configuration not available. Please contact support.'
                })
            };
        }

        // Escape special characters for Markdown
        const escapeMarkdown = (text) => {
            return String(text).replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
        };

        // Format Telegram username if needed
        let formattedTelegram = telegram;
        if (!formattedTelegram.startsWith('@')) {
            formattedTelegram = '@' + formattedTelegram;
        }

        // Format Twitter username if needed
        let formattedTwitter = twitter;
        if (!formattedTwitter.startsWith('@')) {
            formattedTwitter = '@' + formattedTwitter;
        }

        // Create message
        const message = `
🎯 *New Airdrop Registration*

👤 *Name:* ${escapeMarkdown(name)}
📱 *Telegram:* ${escapeMarkdown(formattedTelegram)}
🐦 *Twitter:* ${escapeMarkdown(formattedTwitter)}
💼 *TON Address:* \`${escapeMarkdown(tonAddress)}\`
✅ *Subscribed to Telegram:* ${subscribedTelegram ? 'Yes' : 'No'}
✅ *Subscribed to Twitter:* ${subscribedTwitter ? 'Yes' : 'No'}
💬 *Subscribed to TG Chat:* ${subscribedTgChat ? 'Yes' : 'No'}

*Timestamp:* ${new Date().toISOString()}
        `.trim();

        // Send message to Telegram
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const telegramResponse = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        if (!telegramResponse.ok) {
            const errorData = await telegramResponse.json().catch(() => ({}));
            const errorMsg = errorData.description || errorData.error_code 
                ? `Telegram API error: ${errorData.description || `Error code ${errorData.error_code}`}`
                : 'Failed to send message to Telegram';
            
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Failed to submit registration',
                    message: errorMsg
                })
            };
        }

        const result = await telegramResponse.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Registration submitted successfully!',
                messageId: result.result?.message_id
            })
        };

    } catch (error) {
        console.error('Error in submit-presale function:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message || 'An unexpected error occurred'
            })
        };
    }
};
