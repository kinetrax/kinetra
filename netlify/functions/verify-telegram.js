// Netlify serverless function to verify Telegram channel and group subscription
// This function uses Telegram Bot API to check if a user is subscribed to the channel and group
// The bot must be an administrator of both the channel and group to verify membership

// Helper function to resolve username to user_id
// Since Telegram Bot API doesn't directly support username lookup, we try to get user_id
// by checking chat administrators (requires bot to be admin)
// Note: This only works if the user is an administrator. For regular members, 
// we cannot resolve username to user_id without the user interacting with the bot first.
async function resolveUsernameToUserId(botToken, username, channelId, groupId) {
    const cleanUsername = username.replace('@', '').trim().toLowerCase();
    
    // Try to find user in channel administrators
    if (channelId) {
        try {
            const adminsUrl = `https://api.telegram.org/bot${botToken}/getChatAdministrators?chat_id=${channelId}`;
            const adminsResponse = await fetch(adminsUrl);
            
            if (adminsResponse.ok) {
                const adminsData = await adminsResponse.json();
                if (adminsData.ok && adminsData.result) {
                    for (const admin of adminsData.result) {
                        const user = admin.user;
                        if (user.username && user.username.toLowerCase() === cleanUsername) {
                            return user.id;
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error checking channel admins:', error);
        }
    }
    
    // Try to find user in group administrators
    if (groupId) {
        try {
            const adminsUrl = `https://api.telegram.org/bot${botToken}/getChatAdministrators?chat_id=${groupId}`;
            const adminsResponse = await fetch(adminsUrl);
            
            if (adminsResponse.ok) {
                const adminsData = await adminsResponse.json();
                if (adminsData.ok && adminsData.result) {
                    for (const admin of adminsData.result) {
                        const user = admin.user;
                        if (user.username && user.username.toLowerCase() === cleanUsername) {
                            return user.id;
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error checking group admins:', error);
        }
    }
    
    // Unfortunately, Telegram Bot API doesn't provide a way to get user_id from username
    // for regular members. The bot can only check administrators or use getChatMember
    // which requires user_id. This is a limitation of the Telegram Bot API.
    return null;
}

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

        // Validate input - username is now the primary method
        if (!username && !userId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Missing required parameter: username'
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

        // Clean username (remove @ if present)
        const cleanUsername = username ? username.replace('@', '').trim() : null;
        
        // If userId is provided, use it directly
        // Otherwise, we'll need to resolve username to user_id
        // Note: Telegram Bot API's getChatMember requires user_id, not username
        // We can only resolve username to user_id if the user is an administrator
        let telegramUserId = userId;
        
        // If we only have username, try to resolve it to user_id
        // This only works if the user is an admin of the channel/group
        if (!telegramUserId && cleanUsername) {
            telegramUserId = await resolveUsernameToUserId(botToken, cleanUsername, channelId, groupId);
        }
        
        // If we still don't have user_id, we cannot verify membership
        // Telegram Bot API limitation: getChatMember requires user_id, not username
        if (!telegramUserId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Unable to verify by username alone.',
                    message: 'Telegram Bot API requires a user ID to check membership. The username could not be resolved to a user ID. This typically works only if the user is an administrator. Please provide your Telegram user ID (you can get it from @userinfobot) or use the Telegram Login Widget.',
                    requiresUserId: true,
                    verified: false
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
