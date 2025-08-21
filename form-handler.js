// Form Handler for Ricky Villalobos Website
// Sends all form submissions to rickyvillalobos@kw.com

class FormHandler {
    constructor() {
        this.emailEndpoint = 'rickyvillalobos@kw.com';
        this.init();
    }

    init() {
        // Handle listing alerts form
        const alertsForm = document.querySelector('.search-btn');
        if (alertsForm) {
            alertsForm.addEventListener('click', (e) => this.handleListingAlerts(e));
        }

        // Handle contact form
        const contactForm = document.querySelector('#contact form') || document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
            console.log('Contact form handler attached successfully');
        } else {
            console.log('Contact form not found');
        }

        // Handle newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterForm(e));
        }

        // Review form handled by script.js to avoid conflicts
        console.log('Review form handler disabled - handled by script.js');
    }

    handleListingAlerts(e) {
        e.preventDefault();
        console.log('Listing alerts form submitted - sending email...');
        
        const formData = {
            type: 'Listing Alerts Signup',
            firstName: document.getElementById('first-name')?.value || '',
            lastName: document.getElementById('last-name')?.value || '',
            phone: document.getElementById('phone-number')?.value || '',
            email: document.getElementById('email-address')?.value || '',
            locationPreferences: document.getElementById('location-preferences')?.value || '',
            propertyType: document.getElementById('property-type-select')?.value || '',
            beds: document.getElementById('beds-select')?.value || '',
            baths: document.getElementById('baths-select')?.value || '',
            minPrice: document.getElementById('min-price-select')?.value || '',
            maxPrice: document.getElementById('max-price-select')?.value || '',
            sqft: document.getElementById('sqft-select')?.value || '',
            additionalNotes: document.getElementById('additional-notes')?.value || '',
            alertFrequency: document.getElementById('alert-frequency')?.value || '',
            timestamp: new Date().toISOString()
        };

        // Validate required fields
        if (!formData.firstName || !formData.lastName || !formData.phone) {
            alert('Please fill in all required fields (First Name, Last Name, and Phone Number).');
            return;
        }

        // Show loading state
        const submitBtn = e.target;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Send email and reset button state
        this.sendEmail(formData);
        
        // Reset button state after a short delay
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    handleContactForm(e) {
        e.preventDefault();
        console.log('Contact form submitted!');
        
        const form = e.target;
        const formData = {
            type: 'Contact Form Submission',
            side: form.querySelector('select')?.value || '',
            firstName: form.querySelector('input[placeholder="First Name"]')?.value || '',
            lastName: form.querySelector('input[placeholder="Last Name"]')?.value || '',
            email: form.querySelector('input[placeholder="Email Address"]')?.value || '',
            phone: form.querySelector('input[placeholder="Phone Number"]')?.value || '',
            message: form.querySelector('textarea')?.value || '',
            timestamp: new Date().toISOString()
        };

        this.sendEmail(formData);
    }

    handleNewsletterForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = {
            type: 'Newsletter Signup',
            name: form.querySelector('input[placeholder="Name"]')?.value || '',
            email: form.querySelector('input[placeholder="Email Address"]')?.value || '',
            timestamp: new Date().toISOString()
        };

        this.sendEmail(formData);
    }

    handleReviewForm(e) {
        e.preventDefault();
        
        const formData = {
            type: 'Client Review Submission',
            name: document.getElementById('review-name')?.value || '',
            email: document.getElementById('review-email')?.value || '',
            service: document.getElementById('review-service')?.value || '',
            rating: document.getElementById('review-rating')?.value || '',
            title: document.getElementById('review-title')?.value || '',
            content: document.getElementById('review-content')?.value || '',
            consent: document.getElementById('review-consent')?.checked || false,
            timestamp: new Date().toISOString()
        };

        // Validate required fields
        if (!formData.name || !formData.rating || !formData.title || !formData.content || !formData.consent) {
            alert('Please fill in all required fields and provide consent for review display.');
            return;
        }

        this.sendEmail(formData);
    }

    sendEmail(formData) {
        // Always try EmailJS first if available
        if (typeof emailjs !== 'undefined') {
            this.sendViaEmailJS(formData);
        } else {
            console.warn('EmailJS not loaded, falling back to mailto');
            this.fallbackToMailto(formData);
        }
    }

    sendViaEmailJS(formData) {
        // EmailJS configuration
        const templateParams = {
            to_email: 'rickyvillalobos@kw.com',
            from_name: `${formData.firstName || formData.name || ''} ${formData.lastName || ''}`.trim(),
            from_email: formData.email || 'no-email@provided.com',
            subject: `Website ${formData.type}`,
            message: this.formatFormDataForEmail(formData),
            phone: formData.phone || '',
            form_type: formData.type,
            timestamp: new Date().toLocaleString()
        };

        emailjs.send('service_ll15f7k', 'template_cz2jmqw', templateParams)
            .then(() => {
                this.showSuccessMessage(formData.type);
            })
            .catch((error) => {
                console.error('EmailJS failed:', error);
                // Fallback to mailto
                this.fallbackToMailto(formData);
            });
    }

    formatFormDataForEmail(formData) {
        let emailBody = `New ${formData.type}\n\n`;
        emailBody += `Submitted: ${new Date(formData.timestamp).toLocaleString()}\n\n`;
        
        Object.keys(formData).forEach(key => {
            if (key !== 'type' && key !== 'timestamp' && formData[key]) {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                emailBody += `${label}: ${formData[key]}\n`;
            }
        });
        
        return emailBody;
    }

    fallbackToMailto(formData) {
        const subject = encodeURIComponent(`Website ${formData.type} - ${formData.firstName || formData.name || 'New'} ${formData.lastName || 'Submission'}`);
        const body = encodeURIComponent(this.formatFormDataForEmail(formData));
        const mailtoLink = `mailto:rickyvillalobos@kw.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
        alert('Direct sending failed. Your email client will open with the message prepared.');
    }

    showSuccessMessage(formType) {
        alert(`Thank you! Your ${formType.toLowerCase()} has been sent successfully. Ricky will contact you soon.`);
        
        // Reset listing alerts form if it was a listing alerts submission
        if (formType === 'Listing Alerts Signup') {
            // Reset all form fields
            document.getElementById('first-name').value = '';
            document.getElementById('last-name').value = '';
            document.getElementById('phone-number').value = '';
            document.getElementById('email-address').value = '';
            document.getElementById('location-preferences').value = '';
            document.getElementById('property-type-select').selectedIndex = 0;
            document.getElementById('beds-select').selectedIndex = 0;
            document.getElementById('baths-select').selectedIndex = 0;
            document.getElementById('min-price-select').selectedIndex = 0;
            document.getElementById('max-price-select').selectedIndex = 0;
            document.getElementById('sqft-select').selectedIndex = 0;
            document.getElementById('additional-notes').value = '';
            document.getElementById('alert-frequency').selectedIndex = 0;
        }
        
        // Reset other forms
        document.querySelectorAll('form').forEach(form => {
            if (formType !== 'Listing Alerts Signup') {
                form.reset();
            }
        });
    }
}

// Initialize EmailJS and form handler when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing EmailJS and FormHandler...');
    
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init("bGxN2QNCvDgD7b7Tp");
        console.log('EmailJS initialized');
    } else {
        console.warn('EmailJS not loaded');
    }
    
    new FormHandler();
    console.log('FormHandler initialized');
});