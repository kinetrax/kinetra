// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// RequestAnimationFrame throttle for scroll
let ticking = false;
function requestTick(fn) {
    if (!ticking) {
        requestAnimationFrame(fn);
        ticking = true;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect - optimized with RAF
    const header = document.getElementById('header');
    let lastScroll = 0;

    function updateHeader() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        requestTick(updateHeader);
    }, { passive: true });

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    let menuBackdrop = null;

    function createBackdrop() {
        if (!menuBackdrop) {
            menuBackdrop = document.createElement('div');
            menuBackdrop.className = 'menu-backdrop';
            menuBackdrop.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 998; opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease;';
            document.body.appendChild(menuBackdrop);
            menuBackdrop.addEventListener('click', closeMobileMenu);
        }
        return menuBackdrop;
    }

    function openMobileMenu() {
        if (!mainNav || !mobileMenuToggle) return;
        mobileMenuToggle.classList.add('active');
        mainNav.classList.add('active');
        document.body.style.overflow = 'hidden';
        const backdrop = createBackdrop();
        backdrop.style.opacity = '1';
        backdrop.style.visibility = 'visible';
    }

    function closeMobileMenu() {
        if (!mainNav || !mobileMenuToggle) return;
        mobileMenuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.style.overflow = '';
        if (menuBackdrop) {
            menuBackdrop.style.opacity = '0';
            menuBackdrop.style.visibility = 'hidden';
        }
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            if (mainNav && mainNav.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    // Close mobile menu when clicking on a link
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
    }

    // Close mobile menu on window resize if it's desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && mainNav && mainNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Active section highlighting in navigation - optimized with throttling
    const sections = document.querySelectorAll('section[id]');
    const navLinksArray = Array.from(navLinks);

    function updateActiveNav() {
        const scrollY = window.pageYOffset;
        let currentSection = '';

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });

        if (currentSection) {
            navLinksArray.forEach(link => {
                const isActive = link.getAttribute('href') === `#${currentSection}`;
                link.classList.toggle('active', isActive);
            });
        }
    }

    const throttledUpdateNav = throttle(updateActiveNav, 100);
    window.addEventListener('scroll', throttledUpdateNav, { passive: true });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });


    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', function() {
                    const isActive = item.classList.contains('active');
                    
                    // Close all FAQ items
                    faqItems.forEach(faqItem => {
                        faqItem.classList.remove('active');
                    });
                    
                    // Open clicked item if it wasn't active
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // Phone Mockup Interactivity
    const steps = document.querySelectorAll('.step');
    const appScreens = document.querySelectorAll('.app-screen');

    // Function to activate a specific step and show corresponding app screen
    function activateStep(stepIndex) {
        if (!steps.length || !appScreens.length) {
            return; // Skip if elements don't exist on this page
        }
        
        // Remove active class from all steps
        steps.forEach(step => {
            step.classList.remove('active-step');
        });

        // Add active class to the clicked step
        if (steps[stepIndex]) {
            steps[stepIndex].classList.add('active-step');
        }

        // Hide all app screens
        appScreens.forEach(screen => {
            screen.classList.remove('active');
        });

        // Show the corresponding app screen
        if (appScreens[stepIndex]) {
            appScreens[stepIndex].classList.add('active');
        }
    }

    // Add click event listeners to steps
    if (steps.length > 0) {
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
        const stepsContainer = document.querySelector('.steps');
        if (stepsContainer) {
            stepsContainer.addEventListener('mouseenter', () => {
                clearInterval(autoRotateInterval);
            });
        }
    }
    // Sport Map Animation Interactivity
    const sportMapAnimation = document.querySelector('.sport-map-animation');
    const particles = document.querySelectorAll('.particle');
    const pins = document.querySelectorAll('.pin');
    const dataPackets = document.querySelectorAll('.data-packet');
    const gridLines = document.querySelectorAll('.grid-line');

    if (sportMapAnimation) {
        // Add mouse move effect
        sportMapAnimation.addEventListener('mousemove', function(e) {
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
        sportMapAnimation.addEventListener('mouseleave', function() {
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
        if (translations[lang].title) {
            document.title = translations[lang].title;
        }

        // Update meta description if it exists
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && translations[lang].description) {
            metaDescription.content = translations[lang].description;
        }

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                // For input elements and buttons, update value or textContent
                if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
                    if (element.type === 'submit' || element.type === 'button') {
                        element.textContent = translations[lang][key];
                    }
                } else {
                    // For other elements, update textContent
                    element.textContent = translations[lang][key];
                }
            }
        });
        
        // Update placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });

        // Store the language preference
        localStorage.setItem('language', lang);
        currentLanguage = lang;
    }

    // Language dropdown functionality - Initialize after a short delay to ensure DOM is ready
    setTimeout(function() {
        const languageDropdown = document.querySelector('.language-dropdown');
        const selectedLanguage = document.querySelector('.selected-language span');
        const languageOptions = document.querySelector('.language-options');

        if (languageDropdown && selectedLanguage && languageOptions) {
            // Set the initial selected language
            selectedLanguage.textContent = currentLanguage.toUpperCase();

            // Toggle dropdown when clicking on the selected language
            const selectedLanguageElement = document.querySelector('.selected-language');
            if (selectedLanguageElement) {
                // Remove any existing listeners by cloning and replacing
                const newElement = selectedLanguageElement.cloneNode(true);
                const parent = selectedLanguageElement.parentNode;
                if (parent) {
                    parent.replaceChild(newElement, selectedLanguageElement);
                }
                
                newElement.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    // Toggle active class
                    if (languageDropdown.classList.contains('active')) {
                        languageDropdown.classList.remove('active');
                    } else {
                        languageDropdown.classList.add('active');
                    }
                });
            }

            // Prevent dropdown from closing when clicking inside it
            languageDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                // Check if click is outside the dropdown
                if (languageDropdown && !languageDropdown.contains(e.target)) {
                    languageDropdown.classList.remove('active');
                }
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
                option.addEventListener('click', function(e) {
                    e.stopPropagation();
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
        }
    }, 100);

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

    // Enhanced animation on scroll with Intersection Observer - optimized
    const animatedElements = document.querySelectorAll('.benefit-card, .step, .event-card, .doc-card, .pricing-card, .faq-item');
    
    if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        animatedElements.forEach(element => {
            element.classList.add('animated');
        });
    }

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


    // Event listeners for documentation buttons
    if (docCardBtns.length > 0) {
        docCardBtns.forEach(btn => {
            // Only show modal for buttons that don't have a valid href
            if (btn.getAttribute('href') === '#') {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    openModal();
                });
            }
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
