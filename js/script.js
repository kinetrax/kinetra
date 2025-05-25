document.addEventListener('DOMContentLoaded', function() {
    // Phone Mockup Interactivity
    const steps = document.querySelectorAll('.step');
    const appScreens = document.querySelectorAll('.app-screen');

    // Function to activate a specific step and show corresponding app screen
    function activateStep(stepIndex) {
        // Remove active class from all steps
        steps.forEach(step => {
            step.classList.remove('active-step');
        });

        // Add active class to the clicked step
        steps[stepIndex].classList.add('active-step');

        // Hide all app screens
        appScreens.forEach(screen => {
            screen.classList.remove('active');
        });

        // Show the corresponding app screen
        appScreens[stepIndex].classList.add('active');
    }

    // Add click event listeners to steps
    steps.forEach((step, index) => {
        step.addEventListener('click', function() {
            activateStep(index);
        });

        // Add hover event listeners for desktop
        step.addEventListener('mouseenter', function() {
            activateStep(index);
        });
    });

    // Initialize with the first step active
    activateStep(0);

    // Auto-rotate through steps every 3 seconds
    let currentStepIndex = 0;
    const autoRotateInterval = setInterval(() => {
        currentStepIndex = (currentStepIndex + 1) % steps.length;
        activateStep(currentStepIndex);
    }, 3000);

    // Stop auto-rotation when user interacts with steps
    document.querySelector('.steps').addEventListener('mouseenter', () => {
        clearInterval(autoRotateInterval);
    });
    // Fitness Map Animation Interactivity
    const fitnessMapAnimation = document.querySelector('.fitness-map-animation');
    const particles = document.querySelectorAll('.particle');
    const pins = document.querySelectorAll('.pin');
    const dataPackets = document.querySelectorAll('.data-packet');
    const gridLines = document.querySelectorAll('.grid-line');

    if (fitnessMapAnimation) {
        // Add mouse move effect
        fitnessMapAnimation.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element

            // Move particles slightly based on mouse position
            particles.forEach((particle, index) => {
                const factor = (index + 1) * 0.03;
                const translateX = (x - rect.width / 2) * factor;
                const translateY = (y - rect.height / 2) * factor;

                particle.style.transform = `translate(${translateX}px, ${translateY}px)`;
            });

            // Make pins react to mouse position
            pins.forEach((pin, index) => {
                const pinRect = pin.getBoundingClientRect();
                const pinCenterX = pinRect.left + pinRect.width / 2 - rect.left;
                const pinCenterY = pinRect.top + pinRect.height / 2 - rect.top;

                // Calculate distance from mouse to pin
                const dx = x - pinCenterX;
                const dy = y - pinCenterY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // If mouse is close to pin, make it "attract" slightly
                if (distance < 100) {
                    const attractFactor = (100 - distance) / 500;
                    const attractX = dx * attractFactor;
                    const attractY = dy * attractFactor;

                    pin.style.transform = `translate(${attractX}px, ${attractY}px)`;
                } else {
                    pin.style.transform = '';
                }
            });

            // Make data packets move faster when mouse is near
            dataPackets.forEach((packet, index) => {
                const packetRect = packet.getBoundingClientRect();
                const packetCenterX = packetRect.left + packetRect.width / 2 - rect.left;
                const packetCenterY = packetRect.top + packetRect.height / 2 - rect.top;

                // Calculate distance from mouse to packet
                const dx = x - packetCenterX;
                const dy = y - packetCenterY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // If mouse is close to packet, make it pulse
                if (distance < 150) {
                    packet.style.animationDuration = '5s';
                } else {
                    packet.style.animationDuration = '10s';
                }
            });

            // Make grid lines glow when mouse is near
            gridLines.forEach((line, index) => {
                const lineRect = line.getBoundingClientRect();
                const lineCenterX = lineRect.left + lineRect.width / 2 - rect.left;
                const lineCenterY = lineRect.top + lineRect.height / 2 - rect.top;

                // Calculate distance from mouse to line
                const dx = x - lineCenterX;
                const dy = y - lineCenterY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // If mouse is close to line, increase opacity
                if (distance < 100) {
                    line.style.opacity = '0.5';
                    line.style.strokeWidth = '2';
                } else {
                    line.style.opacity = '';
                    line.style.strokeWidth = '';
                }
            });
        });

        // Reset transforms when mouse leaves
        fitnessMapAnimation.addEventListener('mouseleave', function() {
            particles.forEach(particle => {
                particle.style.transform = '';
            });

            pins.forEach(pin => {
                pin.style.transform = '';
            });

            dataPackets.forEach(packet => {
                packet.style.animationDuration = '';
            });

            gridLines.forEach(line => {
                line.style.opacity = '';
                line.style.strokeWidth = '';
            });
        });
    }

    // Language functionality
    // Function to detect the user's browser language
    function detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        // Get the first two characters of the browser language (e.g., 'en-US' -> 'en')
        const lang = browserLang.substring(0, 2).toLowerCase();

        // Check if the detected language is supported
        if (translations[lang]) {
            return lang;
        }

        // Default to English if the detected language is not supported
        return 'en';
    }

    // Get the language from localStorage, or detect from browser, or default to English
    let currentLanguage = localStorage.getItem('language') || detectBrowserLanguage();

    // Function to update all text content based on the selected language
    function updateLanguage(lang) {
        // Make sure the language is supported, otherwise default to English
        if (!translations[lang]) {
            lang = 'en';
        }

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Update page title
        document.title = translations[lang].title;

        // Update meta description
        document.querySelector('meta[name="description"]').content = translations[lang].description;

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                // Handle special cases for elements with children
                if (element.children.length === 0 || element.tagName === 'BUTTON' || element.tagName === 'A') {
                    element.textContent = translations[lang][key];
                }
            }
        });

        // Store the language preference
        localStorage.setItem('language', lang);
        currentLanguage = lang;
    }

    // Language dropdown functionality
    const languageDropdown = document.querySelector('.language-dropdown');
    const selectedLanguage = document.querySelector('.selected-language span');
    const languageOptions = document.querySelector('.language-options');

    // Set the initial selected language
    selectedLanguage.textContent = currentLanguage.toUpperCase();

    // Toggle dropdown when clicking on the selected language
    document.querySelector('.selected-language').addEventListener('click', function(e) {
        e.stopPropagation();
        languageDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        languageDropdown.classList.remove('active');
    });

    // Prevent dropdown from closing when clicking inside it
    languageOptions.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Clear existing options
    languageOptions.innerHTML = '';

    // Add an option for each supported language
    Object.keys(translations).forEach(lang => {
        const option = document.createElement('li');
        option.classList.add('language-option');
        option.textContent = lang.toUpperCase();

        if (lang === currentLanguage) {
            option.classList.add('active');
        }

        // Add click event listener
        option.addEventListener('click', function() {
            const language = this.textContent.toLowerCase();

            // Only proceed if this is a different language
            if (language !== currentLanguage) {
                // Remove active class from all options
                languageOptions.querySelectorAll('.language-option').forEach(opt => opt.classList.remove('active'));

                // Add active class to clicked option
                this.classList.add('active');

                // Update the selected language display
                selectedLanguage.textContent = this.textContent;

                // Update the language
                updateLanguage(language);

                // Close the dropdown
                languageDropdown.classList.remove('active');
            }
        });

        languageOptions.appendChild(option);
    });

    // Initialize with the saved or detected language
    updateLanguage(currentLanguage);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animation on scroll
    // This is a simple implementation. In a production environment,
    // you might want to use a library like AOS (Animate On Scroll)
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.benefit-card, .step, .event-card, .doc-card');

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };

    // Initial check on page load
    animateOnScroll();

    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Modal functionality
    const modal = document.getElementById('coming-soon-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const becomeTrainerBtn = document.querySelector('.cta-buttons .btn.primary');
    const findWorkoutBtn = document.querySelector('.cta-buttons .btn.secondary');
    const docCardBtns = document.querySelectorAll('.doc-card');

    // Function to open modal
    function openModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    // Function to close modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Event listeners for buttons
    if (becomeTrainerBtn) {
        becomeTrainerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    }

    if (findWorkoutBtn) {
        findWorkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    }

    // Event listeners for documentation buttons
    if (docCardBtns.length > 0) {
        docCardBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                openModal();
            });
        });
    }

    // Close modal when clicking the close button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
});
