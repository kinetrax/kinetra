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
    // Note: telegramBotToken and telegramChatId are no longer needed in frontend
    // They are now used server-side only via Netlify functions
    telegramBotUsername: '', // Will be loaded from config.js (for bot link)
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
    const telegramBotLink = document.getElementById('telegramBotLink');
    
    if (telegramLink) telegramLink.href = PRESALE_CONFIG.telegramChannelUrl;
    if (telegramCheckLink) telegramCheckLink.href = PRESALE_CONFIG.telegramChannelUrl;
    if (twitterLink) twitterLink.href = PRESALE_CONFIG.twitterUrl;
    if (twitterCheckLink) twitterCheckLink.href = PRESALE_CONFIG.twitterUrl;
    
    // Set bot link if bot username is configured
    if (telegramBotLink && PRESALE_CONFIG.telegramBotUsername) {
        telegramBotLink.href = `https://t.me/${PRESALE_CONFIG.telegramBotUsername.replace('@', '')}`;
    } else if (telegramBotLink) {
        // Hide the link if bot username is not configured
        telegramBotLink.style.display = 'none';
    }
}

// Global variable to track reCAPTCHA widget ID
let recaptchaWidgetId = null;

// Global variable to track Telegram verification status
let telegramVerified = false;
let telegramUserId = null;
let telegramVerificationInProgress = false;

// Function to initialize reCAPTCHA
function initializeRecaptcha() {
    const recaptchaContainer = document.querySelector('.g-recaptcha');
    
    // Check if container exists and site key is available
    if (!recaptchaContainer || !PRESALE_CONFIG.recaptchaSiteKey) {
        return;
    }
    
    // Only initialize if not already initialized
    if (recaptchaContainer.hasAttribute('data-widget-id') || recaptchaWidgetId !== null) {
        return;
    }
    
    // Use grecaptcha.ready() to ensure reCAPTCHA is loaded before rendering
    grecaptcha.ready(function() {
        try {
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
            // Mark container as initialized
            recaptchaContainer.setAttribute('data-widget-id', recaptchaWidgetId);
        } catch (error) {
            console.error('Error initializing reCAPTCHA:', error);
        }
    });
}

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        loadConfig();
        
        // Initialize reCAPTCHA using grecaptcha.ready() pattern
        // This will work whether reCAPTCHA is already loaded or still loading
        initializeRecaptcha();
    
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
    const telegramVerifyBtn = document.getElementById('telegramVerifyBtn');
    const telegramVerifyStatus = document.getElementById('telegramVerifyStatus');
    
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
        
        // Check Telegram verification
        if (!telegramVerified) {
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
        if (typeof grecaptcha === 'undefined' || typeof grecaptcha.getResponse !== 'function') {
            submitBtn.disabled = true;
            return false;
        }
        
        let captchaResponse = '';
        try {
            captchaResponse = recaptchaWidgetId !== null 
                ? grecaptcha.getResponse(recaptchaWidgetId)
                : grecaptcha.getResponse();
        } catch (error) {
            console.error('Error getting reCAPTCHA response:', error);
            submitBtn.disabled = true;
            return false;
        }
        
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
    
    // Telegram verification handler
    if (telegramVerifyBtn) {
        telegramVerifyBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            await verifyTelegramSubscription();
        });
    }
    
    // Auto-verify when Telegram username changes (if user has already verified)
    if (telegramInput) {
        telegramInput.addEventListener('blur', async function() {
            const telegram = telegramInput.value.trim();
            if (telegram && telegramVerified && telegramUserId) {
                // Re-verify if username changed
                await verifyTelegramSubscription();
            }
        });
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
        
        // Check Telegram verification
        if (!telegramVerified) {
            showMessage('error', getTranslation('presale_error_telegram_verify') || 'Please verify your Telegram subscription first by clicking the "Verify Telegram" button');
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
        if (typeof grecaptcha === 'undefined' || typeof grecaptcha.getResponse !== 'function') {
            showMessage('error', getTranslation('presale_error_captcha_load') || 'CAPTCHA is loading. Please wait a moment and try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = getTranslation('presale_submit') || 'Submit Registration';
            return;
        }
        
        let captchaResponse = '';
        try {
            captchaResponse = recaptchaWidgetId !== null 
                ? grecaptcha.getResponse(recaptchaWidgetId)
                : grecaptcha.getResponse();
        } catch (error) {
            console.error('Error getting reCAPTCHA response:', error);
            showMessage('error', getTranslation('presale_error_captcha_load') || 'CAPTCHA error. Please refresh the page and try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = getTranslation('presale_submit') || 'Submit Registration';
            return;
        }
        
        if (!captchaResponse) {
            showMessage('error', getTranslation('presale_error_captcha') || 'Please complete the CAPTCHA verification');
            submitBtn.disabled = false;
            submitBtn.textContent = getTranslation('presale_submit') || 'Submit Registration';
            return;
        }
        
        // Send to Netlify function (server-side)
        try {
            await submitToServer(formData, captchaResponse);
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
        } catch (submitError) {
            let errorMessage = getTranslation('presale_error_submit') || 'Failed to submit registration. Please try again later or contact support.';
            
            // Use error message from server if available
            if (submitError.message) {
                errorMessage = submitError.message;
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
    
    // Function to verify Telegram subscription
    async function verifyTelegramSubscription() {
        if (telegramVerificationInProgress) {
            return;
        }

        const telegram = telegramInput ? telegramInput.value.trim() : '';
        if (!telegram) {
            showTelegramVerifyStatus('error', getTranslation('presale_telegram_verify_enter_username') || 'Please enter your Telegram username first');
            return;
        }

        // Clean username (remove @ if present)
        const cleanTelegram = telegram.replace('@', '');

        telegramVerificationInProgress = true;
        if (telegramVerifyBtn) {
            telegramVerifyBtn.disabled = true;
            telegramVerifyBtn.textContent = getTranslation('presale_telegram_verify_verifying') || 'Verifying...';
        }
        showTelegramVerifyStatus('info', getTranslation('presale_telegram_verify_checking') || 'Checking subscription...');

        try {
            // First, try to get user ID using Telegram Login Widget if available
            // If Telegram Web App is available, use it to get user ID
            let userId = telegramUserId;
            
            if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
                userId = window.Telegram.WebApp.initDataUnsafe.user.id;
                telegramUserId = userId;
            }

            // Call verification endpoint
            const response = await fetch('/.netlify/functions/verify-telegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId,
                    username: cleanTelegram
                })
            });

            const result = await response.json();

            if (result.verified) {
                telegramVerified = true;
                if (result.userId) {
                    telegramUserId = result.userId;
                }
                showTelegramVerifyStatus('success', getTranslation('presale_telegram_verify_success') || '✓ Telegram subscription verified!');
                if (telegramVerifyBtn) {
                    telegramVerifyBtn.textContent = getTranslation('presale_telegram_verify_verified') || 'Verified';
                    telegramVerifyBtn.style.backgroundColor = '#28a745';
                }
            } else {
                telegramVerified = false;
                let errorMsg = result.message || getTranslation('presale_telegram_verify_not_subscribed') || 'You are not subscribed to the required Telegram channel/group.';
                
                if (result.requiresUserId) {
                    errorMsg = result.message || getTranslation('presale_telegram_verify_use_widget') || 'Please use the Telegram Login Widget below to verify your account.';
                } else if (result.channelError || result.groupError) {
                    // Show specific API errors
                    const errors = [];
                    if (result.channelError) errors.push(`Channel: ${result.channelError}`);
                    if (result.groupError) errors.push(`Group: ${result.groupError}`);
                    if (errors.length > 0) {
                        errorMsg = errors.join('. ') + '. Make sure the bot is an admin of the channel/group.';
                    }
                } else if (!result.channelSubscribed && !result.groupSubscribed) {
                    errorMsg = getTranslation('presale_telegram_verify_not_subscribed_both') || 'Please subscribe to both the Telegram channel and group.';
                } else if (!result.channelSubscribed) {
                    errorMsg = getTranslation('presale_telegram_verify_not_subscribed_channel') || 'Please subscribe to the Telegram channel.';
                } else if (!result.groupSubscribed) {
                    errorMsg = getTranslation('presale_telegram_verify_not_subscribed_group') || 'Please subscribe to the Telegram group.';
                }
                
                showTelegramVerifyStatus('error', errorMsg);
                if (telegramVerifyBtn) {
                    telegramVerifyBtn.textContent = getTranslation('presale_telegram_verify_retry') || 'Verify Again';
                }
            }
        } catch (error) {
            console.error('Error verifying Telegram subscription:', error);
            telegramVerified = false;
            showTelegramVerifyStatus('error', getTranslation('presale_telegram_verify_error') || 'Error verifying subscription. Please try again.');
            if (telegramVerifyBtn) {
                telegramVerifyBtn.textContent = getTranslation('presale_telegram_verify_retry') || 'Verify Again';
            }
        } finally {
            telegramVerificationInProgress = false;
            if (telegramVerifyBtn) {
                telegramVerifyBtn.disabled = false;
            }
            // Re-validate form
            if (window.validateForm) {
                window.validateForm();
            }
        }
    }

    // Function to show Telegram verification status
    function showTelegramVerifyStatus(type, message) {
        if (telegramVerifyStatus) {
            telegramVerifyStatus.className = `telegram-verify-status ${type}`;
            telegramVerifyStatus.textContent = message;
            telegramVerifyStatus.style.display = 'block';
        }
    }

    async function submitToServer(data, captchaResponse) {
        // Send form data to Netlify function (server-side)
        // This keeps the bot token secure on the server
        const response = await fetch('/.netlify/functions/submit-presale', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: data.name,
                telegram: data.telegram,
                twitter: data.twitter,
                tonAddress: data.tonAddress,
                subscribedTelegram: data.subscribedTelegram,
                subscribedTwitter: data.subscribedTwitter,
                subscribedTgChat: data.subscribedTgChat,
                captchaResponse: captchaResponse
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMsg = errorData.message || errorData.error || 'Failed to submit registration. Please try again later.';
            throw new Error(errorMsg);
        }
        
        const result = await response.json();
        return result;
    }
});
