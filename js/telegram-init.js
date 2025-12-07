// js/telegram-init.js - Optimized initialization
(function() {
    'use strict';
    
    // Telegram WebApp initialization
    window.TG = window.Telegram?.WebApp || null;
    window.IS_TELEGRAM = !!window.TG;
    
    // Minimal DOM ready handler
    document.addEventListener('DOMContentLoaded', function() {
        // Show loading screen immediately
        const loadingScreen = document.getElementById('quantum-initiation');
        
        if (window.IS_TELEGRAM && window.TG) {
            // Telegram-specific initialization
            initTelegramWebApp();
        } else {
            // Regular browser initialization
            setTimeout(initApp, 100);
        }
    });
    
    function initTelegramWebApp() {
        try {
            // Expand to full height
            window.TG.expand();
            
            // Set theme colors
            const theme = window.TG.themeParams || {};
            document.documentElement.style.setProperty('--tg-bg-color', theme.bg_color || '#0a0e17');
            document.documentElement.style.setProperty('--tg-text-color', theme.text_color || '#ffffff');
            document.documentElement.style.setProperty('--tg-hint-color', theme.hint_color || '#aaaaaa');
            document.documentElement.style.setProperty('--tg-link-color', theme.link_color || '#00f3ff');
            document.documentElement.style.setProperty('--tg-button-color', theme.button_color || '#00f3ff');
            document.documentElement.style.setProperty('--tg-button-text-color', theme.button_text_color || '#0a0e17');
            
            // Enable closing confirmation
            window.TG.enableClosingConfirmation();
            
            // Initialize main app
            window.TG.ready();
            setTimeout(initApp, 50);
            
        } catch (error) {
            console.warn('Telegram WebApp init error:', error);
            setTimeout(initApp, 100);
        }
    }
    
    function initApp() {
        // Hide loading screen
        const loadingScreen = document.getElementById('quantum-initiation');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                showIntro();
            }, 300);
        }
    }
    
    function showIntro() {
        const introSection = document.getElementById('intro-section');
        if (introSection) {
            introSection.style.display = 'flex';
            setTimeout(() => {
                introSection.classList.add('active');
            }, 50);
        }
    }
    
    // Global functions
    window.hideIntro = function() {
        const introSection = document.getElementById('intro-section');
        const mainContent = document.getElementById('main');
        const menuToggle = document.getElementById('menuToggle');
        const chatbot = document.getElementById('chatbot-interface');
        
        if (introSection) {
            introSection.classList.remove('active');
            setTimeout(() => {
                introSection.style.display = 'none';
                if (mainContent) mainContent.style.display = 'block';
                if (menuToggle) menuToggle.classList.add('visible');
                if (chatbot) chatbot.style.display = 'block';
                
                // Initialize lazy components
                setTimeout(initLazyComponents, 100);
            }, 400);
        }
    };
    
    function initLazyComponents() {
        // Initialize calculator
        if (typeof window.initCalculator === 'function') {
            window.initCalculator();
        }
        
        // Initialize lazy iframes
        initLazyIframes();
        
        // Initialize back to top button
        initBackToTop();
    }
    
    function initLazyIframes() {
        const lazyIframes = document.querySelectorAll('.lazy-iframe');
        lazyIframes.forEach(iframe => {
            iframe.addEventListener('click', function() {
                const src = this.getAttribute('data-src');
                if (src) {
                    this.innerHTML = `<iframe src="${src}" frameborder="0" allow="encrypted-media; picture-in-picture" allowfullscreen style="width:100%;height:100%"></iframe>`;
                    this.classList.add('loaded');
                }
            });
        });
    }
    
    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            window.addEventListener('scroll', function() {
                backToTopBtn.classList.toggle('visible', window.scrollY > 300);
            });
            
            backToTopBtn.style.display = 'flex';
        }
    }
    
    // Navigation helper
    window.navTo = function(id) {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    // Link opener
    window.openLink = function(url) {
        if (window.IS_TELEGRAM && window.TG && window.TG.openLink) {
            window.TG.openLink(url);
        } else {
            window.open(url, '_blank');
        }
    };
    
})();
