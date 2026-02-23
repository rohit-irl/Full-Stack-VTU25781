/* ================================================
   TechFest Homepage - JavaScript
   Interactivity and Navigation
   ================================================ */

(function() {
    'use strict';

    // ================================================
    // DOM ELEMENTS
    // ================================================

    const menuToggle = document.getElementById('menuToggle');
    const sidebarNav = document.getElementById('sidebarNav');
    const navLinks = document.querySelectorAll('.nav-link');

    // ================================================
    // MOBILE MENU TOGGLE
    // ================================================

    function initMobileMenu() {
        menuToggle?.addEventListener('click', () => {
            sidebarNav?.classList.toggle('active');
            animateMenuToggle();
        });

        // Close menu when clicking on a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                sidebarNav?.classList.remove('active');
                resetMenuToggle();
                updateActiveLink(link);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebarNav?.contains(e.target) && !menuToggle?.contains(e.target)) {
                sidebarNav?.classList.remove('active');
                resetMenuToggle();
            }
        });
    }

    // ================================================
    // MENU TOGGLE ANIMATION
    // ================================================

    function animateMenuToggle() {
        const spans = menuToggle?.querySelectorAll('span');
        if (!spans) return;

        if (sidebarNav?.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(10px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    function resetMenuToggle() {
        const spans = menuToggle?.querySelectorAll('span');
        if (!spans) return;

        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    }

    // ================================================
    // ACTIVE LINK MANAGEMENT
    // ================================================

    function updateActiveLink(clickedLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
    }

    // ================================================
    // SMOOTH SCROLL & ACTIVE LINK ON SCROLL
    // ================================================

    function initScrollObserver() {
        const sections = document.querySelectorAll('section[id]');
        
        const observerOptions = {
            threshold: 0.25,
            rootMargin: '-10% 0px -66%'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    
                    if (navLink) {
                        navLinks.forEach(link => link.classList.remove('active'));
                        navLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    // ================================================
    // LAZY IMAGE LOADING
    // ================================================

    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    // ================================================
    // CONTACT FORM HANDLING
    // ================================================

    function initContactForm() {
        const contactForm = document.querySelector('.contact-form');
        
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(this);
            const values = {
                name: this.querySelector('input[type="text"]').value,
                email: this.querySelector('input[type="email"]').value,
                message: this.querySelector('textarea').value
            };

            // Validate form
            if (!values.name || !values.email || !values.message) {
                showNotification('Please fill all fields', 'error');
                return;
            }

            if (!isValidEmail(values.email)) {
                showNotification('Please enter a valid email', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // ================================================
    // EMAIL VALIDATION
    // ================================================

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ================================================
    // NOTIFICATION SYSTEM
    // ================================================

    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-in-out;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        // Add animation keyframes
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove notification after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in-out';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // ================================================
    // CTA BUTTON INTERACTION
    // ================================================

    function initCTAButton() {
        const ctaButton = document.querySelector('.cta-button');
        
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                showNotification('Registration feature coming soon!', 'info');
            });
        }
    }

    // ================================================
    // EVENT LINK TRACKING
    // ================================================

    function initEventLinks() {
        const eventLinks = document.querySelectorAll('.event-link');
        
        eventLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const eventCard = link.closest('.event-card');
                const eventTitle = eventCard?.querySelector('h3')?.textContent || 'Event';
                showNotification(`${eventTitle} - More details coming soon!`, 'info');
            });
        });
    }

    // ================================================
    // SCROLL TO TOP ON PAGE LOAD
    // ================================================

    function initScrollToTop() {
        window.addEventListener('load', () => {
            window.scrollTo(0, 0);
        });
    }

    // ================================================
    // VOTING COMPONENT
    // ================================================

    class VotingComponent {
        constructor(config = {}) {
            this.minScore = config.minScore || 0;
            this.maxScore = config.maxScore || 100;
            this.initialScore = config.initialScore || 0;
            
            const score = Math.max(this.minScore, Math.min(this.maxScore, this.initialScore));
            let currentScore = score;
            
            const scoreDisplay = document.getElementById('scoreDisplay');
            const incrementBtn = document.getElementById('incrementBtn');
            const decrementBtn = document.getElementById('decrementBtn');
            const resetBtn = document.getElementById('resetBtn');
            
            // Private method to update display
            const updateDisplay = () => {
                if (scoreDisplay) {
                    scoreDisplay.textContent = currentScore;
                    scoreDisplay.classList.add('score-updated');
                    setTimeout(() => scoreDisplay.classList.remove('score-updated'), 300);
                }
            };
            
            // Public methods
            this.increment = () => {
                if (currentScore < this.maxScore) {
                    currentScore++;
                    this.addButtonAnimation(incrementBtn);
                    updateDisplay();
                    this.dispatchEvent('scoreChanged', currentScore);
                }
            };
            
            this.decrement = () => {
                if (currentScore > this.minScore) {
                    currentScore--;
                    this.addButtonAnimation(decrementBtn);
                    updateDisplay();
                    this.dispatchEvent('scoreChanged', currentScore);
                }
            };
            
            this.reset = () => {
                currentScore = this.initialScore;
                this.addButtonAnimation(resetBtn);
                updateDisplay();
                this.dispatchEvent('scoreReset', currentScore);
            };
            
            this.getScore = () => currentScore;
            
            this.setScore = (newScore) => {
                const validScore = Math.max(this.minScore, Math.min(this.maxScore, newScore));
                currentScore = validScore;
                updateDisplay();
                this.dispatchEvent('scoreChanged', currentScore);
            };
            
            // Event handling
            this.addButtonAnimation = (button) => {
                if (button) {
                    button.classList.add('btn-active');
                    setTimeout(() => button.classList.remove('btn-active'), 200);
                }
            };
            
            this.dispatchEvent = (eventName, detail) => {
                const event = new CustomEvent(eventName, { detail });
                document.dispatchEvent(event);
            };
            
            // Event listeners
            if (incrementBtn) {
                incrementBtn.addEventListener('click', () => this.increment());
            }
            if (decrementBtn) {
                decrementBtn.addEventListener('click', () => this.decrement());
            }
            if (resetBtn) {
                resetBtn.addEventListener('click', () => this.reset());
            }
            
            // Initialize display
            updateDisplay();
        }
    }

    // ================================================
    // INITIALIZATION
    // ================================================

    function initVotingComponent() {
        const votingSection = document.getElementById('voting');
        if (votingSection) {
            window.votingComponent = new VotingComponent({
                initialScore: 0,
                minScore: 0,
                maxScore: 100
            });
            console.log('Voting component initialized');
        }
    }

    function init() {
        // Check if DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        initMobileMenu();
        initScrollObserver();
        initLazyLoading();
        initContactForm();
        initCTAButton();
        initEventLinks();
        initScrollToTop();
        initVotingComponent();

        console.log('TechFest Homepage initialized successfully');
    }

    // Start initialization
    init();

})();

// ================================================
// PERFORMANCE MONITORING (Optional)
// ================================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    });
}
