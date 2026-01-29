// Helper function to get translation
function getTranslation(key) {
    if (typeof translations !== 'undefined' && typeof currentLanguage !== 'undefined') {
        return translations[currentLanguage] && translations[currentLanguage][key] 
            ? translations[currentLanguage][key] 
            : null;
    }
    // Fallback to English if translations not loaded yet
    if (typeof translations !== 'undefined' && translations.en) {
        return translations.en[key] || null;
    }
    return null;
}

const PRESALE_CONFIG = {
    telegramBotToken: '', // Will be loaded from config.js
    telegramChatId: '', // Will be loaded from config.js
    telegramChannelUrl: 'https://t.me/kinetraX',
    twitterUrl: 'https://x.com/kinetrax',
    recaptchaSiteKey: '' // Will be loaded from config.js
};

// Load configuration from config.js (if available)
function loadConfig() {
    // Check if config is defined (loaded from config.js)
    if (typeof window.PRESALE_CONFIG !== 'undefined') {
        Object.assign(PRESALE_CONFIG, window.PRESALE_CONFIG);
    }
    
    // Set social media links
    const telegramLink = document.getElementById('telegramLink');
    const telegramCheckLink = document.getElementById('telegramCheckLink');
    const twitterLink = document.getElementById('twitterLink');
    const twitterCheckLink = document.getElementById('twitterCheckLink');
    
    if (telegramLink) telegramLink.href = PRESALE_CONFIG.telegramChannelUrl;
    if (telegramCheckLink) telegramCheckLink.href = PRESALE_CONFIG.telegramChannelUrl;
    if (twitterLink) twitterLink.href = PRESALE_CONFIG.twitterUrl;
    if (twitterCheckLink) twitterCheckLink.href = PRESALE_CONFIG.twitterUrl;
}

// Global variable to track reCAPTCHA widget ID
let recaptchaWidgetId = null;

// Function to initialize reCAPTCHA - exposed globally
window.initializeRecaptcha = function() {
    const recaptchaContainer = document.querySelector('.g-recaptcha');
    if (recaptchaContainer && PRESALE_CONFIG.recaptchaSiteKey && typeof grecaptcha !== 'undefined') {
        // Only initialize if not already initialized
        if (!recaptchaContainer.hasAttribute('data-widget-id') && recaptchaWidgetId === null) {
            recaptchaWidgetId = grecaptcha.render(recaptchaContainer, {
                'sitekey': PRESALE_CONFIG.recaptchaSiteKey,
                'callback': function() {
                    // Called when CAPTCHA is completed
                    if (window.validateForm) {
                        window.validateForm();
                    }
                },
                'expired-callback': function() {
                    // Called when CAPTCHA expires
                    if (window.validateForm) {
                        window.validateForm();
                    }
                }
            });
        }
    }
};

// Update the global callback to use the proper initialization
if (typeof window.onRecaptchaLoad === 'undefined') {
    window.onRecaptchaLoad = function() {
        // Initialize reCAPTCHA after it's loaded and config is available
        window.initializeRecaptcha();
    };
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadConfig();
    
    // Initialize reCAPTCHA if it's already loaded, otherwise wait for onload callback
    if (typeof grecaptcha !== 'undefined' || window.recaptchaReady) {
        window.initializeRecaptcha();
    }
    
    const form = document.getElementById('airdropForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    
    if (!form) {
        return;
    }
    
    if (!submitBtn) {
        return;
    }
    
    if (!formMessage) {
        return;
    }
    
    // Get form fields
    const nameInput = document.getElementById('name');
    const telegramInput = document.getElementById('telegram');
    const twitterInput = document.getElementById('twitter');
    const tonAddressInput = document.getElementById('tonAddress');
    const subscribedTelegramCheck = document.getElementById('subscribedTelegram');
    const subscribedTwitterCheck = document.getElementById('subscribedTwitter');
    const subscribedTgChatCheck = document.getElementById('subscribedTgChat');
    
    // Disable submit button initially
    submitBtn.disabled = true;
    
    // Validation function
    window.validateForm = function() {
        // Get current form values
        const name = nameInput ? nameInput.value.trim() : '';
        const telegram = telegramInput ? telegramInput.value.trim() : '';
        const twitter = twitterInput ? twitterInput.value.trim() : '';
        const tonAddress = tonAddressInput ? tonAddressInput.value.trim() : '';
        const subscribedTelegram = subscribedTelegramCheck ? subscribedTelegramCheck.checked : false;
        const subscribedTwitter = subscribedTwitterCheck ? subscribedTwitterCheck.checked : false;
        const subscribedTgChat = subscribedTgChatCheck ? subscribedTgChatCheck.checked : false;
        
        // Check required fields
        if (!name || !telegram || !twitter || !tonAddress) {
            submitBtn.disabled = true;
            return false;
        }
        
        // Check checkboxes
        if (!subscribedTelegram || !subscribedTwitter || !subscribedTgChat) {
            submitBtn.disabled = true;
            return false;
        }
        
        // Validate TON address format
        const tonAddressRegex = /^(EQ|UQ|0:)[a-zA-Z0-9_-]{24,48}$/;
        if (!tonAddressRegex.test(tonAddress)) {
            submitBtn.disabled = true;
            return false;
        }
        
        // Check CAPTCHA
        if (typeof grecaptcha === 'undefined') {
            submitBtn.disabled = true;
            return false;
        }
        
        const captchaResponse = recaptchaWidgetId !== null 
            ? grecaptcha.getResponse(recaptchaWidgetId)
            : grecaptcha.getResponse();
        if (!captchaResponse) {
            submitBtn.disabled = true;
            return false;
        }
        
        // All validations passed
        submitBtn.disabled = false;
        return true;
    };
    
    // Add event listeners to all form fields
    if (nameInput) {
        nameInput.addEventListener('input', window.validateForm);
        nameInput.addEventListener('blur', window.validateForm);
    }
    if (telegramInput) {
        telegramInput.addEventListener('input', window.validateForm);
        telegramInput.addEventListener('blur', window.validateForm);
    }
    if (twitterInput) {
        twitterInput.addEventListener('input', window.validateForm);
        twitterInput.addEventListener('blur', window.validateForm);
    }
    if (tonAddressInput) {
        tonAddressInput.addEventListener('input', window.validateForm);
        tonAddressInput.addEventListener('blur', window.validateForm);
    }
    if (subscribedTelegramCheck) {
        subscribedTelegramCheck.addEventListener('change', window.validateForm);
    }
    if (subscribedTwitterCheck) {
        subscribedTwitterCheck.addEventListener('change', window.validateForm);
    }
    if (subscribedTgChatCheck) {
        subscribedTgChatCheck.addEventListener('change', window.validateForm);
    }
    
    // Initial validation
    window.validateForm();
    
    // Add click handler to button as backup
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Trigger form submission manually
        if (form) {
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
    });
    
    // Main form submit handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Use setTimeout to ensure async works
        setTimeout(function() {
            handleFormSubmit();
        }, 10);
    });
    
    // Extract submit logic to separate function
    async function handleFormSubmit() {
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = getTranslation('presale_submitting') || 'Submitting...';
        formMessage.className = 'form-message';
        formMessage.style.display = 'none';
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            telegram: document.getElementById('telegram').value.trim(),
            twitter: document.getElementById('twitter').value.trim(),
            tonAddress: document.getElementById('tonAddress').value.trim(),
            subscribedTelegram: document.getElementById('subscribedTelegram').checked,
            subscribedTwitter: document.getElementById('subscribedTwitter').checked,
            subscribedTgChat: document.getElementById('subscribedTgChat').checked
        };
        
        // Validate form data
        if (!formData.name || !formData.telegram || !formData.twitter || !formData.tonAddress) {
            showMessage('error', getTranslation('presale_error_required') || 'Please fill in all required fields');
            submitBtn.disabled = false;
            submitBtn.textContent = getTranslation('presale_submit') || 'Submit Registration';
            return;
        }
        
        if (!formData.subscribedTelegram || !formData.subscribedTwitter || !formData.subscribedTgChat) {
            showMessage('error', getTranslation('presale_error_subscribed') || 'Please confirm that you are subscribed to Telegram, Twitter, and TG Chat');
            submitBtn.disabled = false;
            submitBtn.textContent = getTranslation('presale_submit') || 'Submit Registration';
            return;
        }
        
        // Validate Telegram username format
        if (!formData.telegram.startsWith('@')) {
            formData.telegram = '@' + formData.telegram;
        }
        
        // Validate Twitter username format
        if (!formData.twitter.startsWith('@')) {
            formData.twitter = '@' + formData.twitter;
        }
        
        // Validate TON address format
        // TON addresses can start with EQ (user-friendly), UQ (base64), or 0: (raw format)
        // They are typically 48 characters long after the prefix
        const tonAddressRegex = /^(EQ|UQ|0:)[a-zA-Z0-9_-]{24,48}$/;
        if (!tonAddressRegex.test(formData.tonAddress)) {
            showMessage('error', getTranslation('presale_error_ton_address') || 'Please enter a valid TON wallet address (should start with EQ, UQ, or 0:)');
            submitBtn.disabled = false;
            submitBtn.textContent = getTranslation('presale_submit') || 'Submit Registration';
            return;
        }
        
        // Verify CAPTCHA
        if (typeof grecaptcha === 'undefined') {
            showMessage('error', getTranslation('presale_error_captcha_load') || 'CAPTCHA is loading. Please wait a moment and try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = getTranslation('presale_submit') || 'Submit Registration';
            return;
        }
        
        const captchaResponse = recaptchaWidgetId !== null 
            ? grecaptcha.getResponse(recaptchaWidgetId)
            : grecaptcha.getResponse();
        if (!captchaResponse) {
            showMessage('error', getTranslation('presale_error_captcha') || 'Please complete the CAPTCHA verification');
            submitBtn.disabled = false;
            submitBtn.textContent = getTranslation('presale_submit') || 'Submit Registration';
            return;
        }
        
        // Send directly to Telegram
        try {
            await submitToTelegramBot(formData);
            showMessage('success', getTranslation('presale_success') || 'Registration submitted successfully!');
            form.reset();
            // Reset CAPTCHA after successful submission
            if (typeof grecaptcha !== 'undefined' && recaptchaWidgetId !== null) {
                grecaptcha.reset(recaptchaWidgetId);
            }
            // Re-validate form to disable button after reset
            if (window.validateForm) {
                window.validateForm();
            }
        } catch (telegramError) {
            let errorMessage = getTranslation('presale_error_submit') || 'Failed to submit registration. Please try again later or contact support.';
            
            // Provide more specific error messages
            if (telegramError.message && telegramError.message.includes('bot token')) {
                errorMessage = 'Telegram bot configuration error. Please contact support.';
            } else if (telegramError.message && telegramError.message.includes('chat_id')) {
                errorMessage = 'Telegram chat configuration error. Please contact support.';
            } else if (telegramError.message) {
                errorMessage = telegramError.message;
            }
            
            showMessage('error', errorMessage);
            // Reset CAPTCHA on error so user can try again
            if (typeof grecaptcha !== 'undefined' && recaptchaWidgetId !== null) {
                grecaptcha.reset(recaptchaWidgetId);
            }
            // Re-validate form after error
            if (window.validateForm) {
                window.validateForm();
            }
        } finally {
            // Only re-enable if form is valid
            if (window.validateForm) {
                window.validateForm();
            } else {
                submitBtn.disabled = false;
            }
            submitBtn.textContent = getTranslation('presale_submit') || 'Submit Registration';
        }
    }
    
    function showMessage(type, message) {
        formMessage.className = `form-message ${type}`;
        formMessage.textContent = message;
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    async function submitToTelegramBot(data) {
        // Check if configuration is available
        if (!PRESALE_CONFIG.telegramBotToken || !PRESALE_CONFIG.telegramChatId) {
            throw new Error('Telegram bot configuration not available. Please configure config.js file.');
        }
        
        // Escape special characters for Markdown
        const escapeMarkdown = (text) => {
            return String(text).replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
        };
        
        const message = `
🎯 *New Airdrop Registration*

👤 *Name:* ${escapeMarkdown(data.name)}
📱 *Telegram:* ${escapeMarkdown(data.telegram)}
🐦 *Twitter:* ${escapeMarkdown(data.twitter)}
💼 *TON Address:* \`${escapeMarkdown(data.tonAddress)}\`
✅ *Subscribed to Telegram:* ${data.subscribedTelegram ? 'Yes' : 'No'}
✅ *Subscribed to Twitter:* ${data.subscribedTwitter ? 'Yes' : 'No'}
💬 *Subscribed to TG Chat:* ${data.subscribedTgChat ? 'Yes' : 'No'}

*Timestamp:* ${new Date().toISOString()}
        `.trim();
        
        const url = `https://api.telegram.org/bot${PRESALE_CONFIG.telegramBotToken}/sendMessage`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: PRESALE_CONFIG.telegramChatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMsg = errorData.description || errorData.error_code 
                ? `Telegram API error: ${errorData.description || `Error code ${errorData.error_code}`}`
                : 'Failed to send message to Telegram';
            throw new Error(errorMsg);
        }
        
        const result = await response.json();
        return result;
    }
});
