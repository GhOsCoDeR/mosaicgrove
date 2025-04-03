/**
 * Mosaic Grove - Contact Page JavaScript
 * Handles form validation and FAQ accordion functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Toggle the current item
            item.classList.toggle('active');
            
            // Close other items when opening a new one
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Update icon
            const icon = item.querySelector('.faq-toggle i');
            if (item.classList.contains('active')) {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            } else {
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            }
        });
    });
    
    // Form Validation
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Perform form validation
            if (validateForm()) {
                // Here you would typically send the form data to your server
                // For demo purposes, we'll just show a success message
                showSuccessMessage();
            }
        });
    }
    
    function validateForm() {
        let isValid = true;
        
        // Reset previous validation styles
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.classList.remove('error');
            const errorEl = input.nextElementSibling;
            if (errorEl && errorEl.classList.contains('error-message')) {
                errorEl.remove();
            }
        });
        
        // Validate required fields
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showErrorMessage(field, 'This field is required');
            }
        });
        
        // Validate email format
        const emailField = contactForm.querySelector('#email');
        if (emailField.value.trim() && !isValidEmail(emailField.value.trim())) {
            isValid = false;
            showErrorMessage(emailField, 'Please enter a valid email address');
        }
        
        return isValid;
    }
    
    function showErrorMessage(inputElement, message) {
        inputElement.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Insert error message after the input
        if (!inputElement.nextElementSibling || !inputElement.nextElementSibling.classList.contains('error-message')) {
            inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showSuccessMessage() {
        // Remove the form
        contactForm.innerHTML = '';
        
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        
        const checkIcon = document.createElement('div');
        checkIcon.className = 'success-icon';
        checkIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        
        const heading = document.createElement('h3');
        heading.textContent = 'Thank You!';
        
        const message = document.createElement('p');
        message.textContent = 'Your message has been sent successfully. We\'ll get back to you within 24 hours.';
        
        successDiv.appendChild(checkIcon);
        successDiv.appendChild(heading);
        successDiv.appendChild(message);
        
        contactForm.appendChild(successDiv);
        
        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Add CSS for form validation and success message
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #e74c3c;
        }
        
        .error-message {
            color: #e74c3c;
            font-size: 0.85rem;
            margin-top: 0.5rem;
        }
        
        .form-success {
            text-align: center;
            padding: 2rem;
        }
        
        .success-icon {
            font-size: 4rem;
            color: var(--primary-color);
            margin-bottom: 1.5rem;
            animation: scaleIn 0.5s ease;
        }
        
        .form-success h3 {
            margin-bottom: 1rem;
            color: var(--secondary-color);
        }
        
        @keyframes scaleIn {
            from {
                transform: scale(0);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;
    
    document.head.appendChild(style);
}); 