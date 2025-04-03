/**
 * Mosaic Grove - Main JavaScript
 * Handles interactivity and animations for the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the mobile menu
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Scroll animations using Intersection Observer
    if ('IntersectionObserver' in window) {
        const animatedElements = document.querySelectorAll('.animate-fade-in, .product-card, .pillar-card, .metric');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Initialize metrics counter
    const metrics = document.querySelectorAll('.metric-number');
    
    if (metrics.length > 0) {
        const observeMetrics = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const count = parseInt(target.getAttribute('data-count'));
                    
                    let start = 0;
                    const duration = 2000; // 2 seconds
                    const step = timestamp => {
                        if (!start) start = timestamp;
                        const progress = Math.min((timestamp - start) / duration, 1);
                        target.textContent = Math.floor(progress * count);
                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        }
                    };
                    window.requestAnimationFrame(step);
                    
                    observeMetrics.unobserve(target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        metrics.forEach(metric => {
            observeMetrics.observe(metric);
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.getAttribute('href') !== '#') {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (navLinks && navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        menuToggle.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Show success message
                const formGroup = this.querySelector('.form-group');
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you for subscribing!';
                successMessage.style.color = 'white';
                successMessage.style.padding = '10px';
                successMessage.style.textAlign = 'center';
                
                formGroup.innerHTML = '';
                formGroup.appendChild(successMessage);
            }
        });
    }

    // Product notification button
    const notifyBtn = document.querySelector('.notify-btn');
    if (notifyBtn) {
        notifyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Scroll to newsletter section
            const newsletterSection = document.querySelector('.newsletter-section');
            if (newsletterSection) {
                window.scrollTo({
                    top: newsletterSection.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Focus on email input after scrolling
                setTimeout(() => {
                    const emailInput = document.querySelector('.newsletter-form input[type="email"]');
                    if (emailInput) {
                        emailInput.focus();
                    }
                }, 1000);
            }
        });
    }
}); 