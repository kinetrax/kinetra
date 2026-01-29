// Netlify serverless function to verify Telegram channel and group subscription
// This function uses Telegram Bot API to check if a user is subscribed to the channel and group

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
        const { userId, username } = body;

        // Validate input
        if (!userId && !username) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Missing required parameter: userId or username'
                })
            };
        }

        // Get configuration from environment variables
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const channelId = process.env.TELEGRAM_CHANNEL_ID;
        const groupId = process.env.TELEGRAM_GROUP_ID;

        if (!botToken) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Server configuration error: TELEGRAM_BOT_TOKEN not set',
                    verified: false
                })
            };
        }

        if (!channelId && !groupId) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Server configuration error: TELEGRAM_CHANNEL_ID or TELEGRAM_GROUP_ID must be set',
                    verified: false
                })
            };
        }

        // Telegram Bot API requires user_id (not username) to check membership
        // The userId should be obtained from:
        // 1. Telegram Login Widget (recommended - provides userId automatically)
        // 2. Manual entry - user can get their ID from @userinfobot on Telegram
        
        let telegramUserId = userId;
        
        if (!telegramUserId) {
            // Note: Telegram Bot API requires user_id (not username) to check membership
            // The userId can be obtained from:
            // 1. Telegram Login Widget (recommended - provides userId automatically)
            // 2. Manual entry - user can get their ID from @userinfobot on Telegram
            
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'User ID is required for verification.',
                    message: 'To verify your subscription, you need to provide your Telegram user ID. You can get it by messaging @userinfobot on Telegram, or by using the Telegram Login Widget.',
                    requiresUserId: true,
                    verified: false,
                    help: 'Get your user ID: 1) Message @userinfobot on Telegram, or 2) Use Telegram Login Widget below'
                })
            };
        }

        // Verify channel subscription
        let channelSubscribed = false;
        let channelError = null;
        if (channelId) {
            try {
                const channelUrl = `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${channelId}&user_id=${telegramUserId}`;
                const channelResponse = await fetch(channelUrl);
                
                if (channelResponse.ok) {
                    const channelData = await channelResponse.json();
                    if (channelData.ok) {
                        const status = channelData.result?.status;
                        // User is subscribed if status is 'member', 'administrator', 'creator', or 'restricted'
                        channelSubscribed = ['member', 'administrator', 'creator', 'restricted'].includes(status);
                    } else {
                        channelError = channelData.description || 'Failed to check channel membership';
                    }
                } else {
                    const errorData = await channelResponse.json().catch(() => ({}));
                    channelError = errorData.description || 'Failed to check channel membership';
                }
            } catch (error) {
                console.error('Error checking channel subscription:', error);
                channelError = error.message;
            }
        }

        // Verify group subscription
        let groupSubscribed = false;
        let groupError = null;
        if (groupId) {
            try {
                const groupUrl = `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${groupId}&user_id=${telegramUserId}`;
                const groupResponse = await fetch(groupUrl);
                
                if (groupResponse.ok) {
                    const groupData = await groupResponse.json();
                    if (groupData.ok) {
                        const status = groupData.result?.status;
                        // User is subscribed if status is 'member', 'administrator', 'creator', or 'restricted'
                        groupSubscribed = ['member', 'administrator', 'creator', 'restricted'].includes(status);
                    } else {
                        groupError = groupData.description || 'Failed to check group membership';
                    }
                } else {
                    const errorData = await groupResponse.json().catch(() => ({}));
                    groupError = errorData.description || 'Failed to check group membership';
                }
            } catch (error) {
                console.error('Error checking group subscription:', error);
                groupError = error.message;
            }
        }

        // Return verification result
        const allSubscribed = (channelId ? channelSubscribed : true) && (groupId ? groupSubscribed : true);

        // Build detailed message
        let message = '';
        if (allSubscribed) {
            message = 'Successfully verified Telegram subscription';
        } else {
            const missing = [];
            if (channelId && !channelSubscribed) {
                missing.push('channel');
            }
            if (groupId && !groupSubscribed) {
                missing.push('group');
            }
            message = `Not subscribed to required Telegram ${missing.join(' and ')}`;
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                verified: allSubscribed,
                channelSubscribed: channelId ? channelSubscribed : null,
                groupSubscribed: groupId ? groupSubscribed : null,
                channelError: channelError || null,
                groupError: groupError || null,
                userId: telegramUserId,
                message: message
            })
        };

    } catch (error) {
        console.error('Error in verify-telegram function:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};
