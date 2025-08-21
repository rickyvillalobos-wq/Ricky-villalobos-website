// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll and back to top button
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    // Show/hide back to top button
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// Back to top button functionality
document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn = document.getElementById('back-to-top');
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});



// Property search form handling
const searchForm = document.querySelector('.search-form');
if (searchForm) {
    const searchBtn = searchForm.querySelector('.search-btn');
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const propertyType = searchForm.querySelector('select:nth-of-type(1)').value;
        const beds = searchForm.querySelector('select:nth-of-type(2)').value;
        const baths = searchForm.querySelector('select:nth-of-type(3)').value;
        const minPrice = searchForm.querySelector('select:nth-of-type(4)').value;
        const maxPrice = searchForm.querySelector('select:nth-of-type(5)').value;
        
        // Simulate search
        this.textContent = 'Searching...';
        this.disabled = true;
        
        setTimeout(() => {
            alert(`Searching for ${propertyType} with ${beds} beds, ${baths} baths, price range ${minPrice} - ${maxPrice}`);
            this.textContent = 'Search Properties';
            this.disabled = false;
        }, 2000);
    });
}

// Newsletter form handling
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        
        if (name && email) {
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        }
    });
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.property-card, .about-content, .contact-content, .stats, .testimonial-card, .resource-card, .service-card, .achievement-card');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Form handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const side = this.querySelector('select').value;
        const firstName = this.querySelector('input[type="text"]:nth-of-type(1)').value;
        const lastName = this.querySelector('input[type="text"]:nth-of-type(2)').value;
        const email = this.querySelector('input[type="email"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        const message = this.querySelector('textarea').value;
        
        // Simple validation
        if (!side || !firstName || !lastName || !email || !message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            alert(`Thank you for your message, ${firstName}! We will get back to you soon.`);
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Property card hover effects
document.querySelectorAll('.property-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Resource card hover effects
document.querySelectorAll('.resource-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('$') ? '' : '') + (element.textContent.includes('M') ? 'M' : '');
            clearInterval(timer);
        } else {
            const current = Math.floor(start);
            if (element.textContent.includes('$')) {
                element.textContent = '$' + current + 'M+';
            } else {
                element.textContent = current + (element.textContent.includes('+') ? '+' : '');
            }
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat h3');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                let target;
                if (text.includes('$')) {
                    target = parseInt(text.replace(/\D/g, ''));
                } else {
                    target = parseInt(text.replace(/\D/g, ''));
                }
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add active class to current navigation item
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Enhanced dropdown menu functionality for mobile
document.querySelectorAll('.nav-item.dropdown').forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown-menu');
    
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
    });
});

// Add CSS for active navigation state and enhanced styles
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #3498db !important;
        font-weight: 600;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    .dropdown-menu {
        display: none;
    }
    
    @media (min-width: 769px) {
        .dropdown-menu {
            display: block !important;
        }
    }
    
    .search-form {
        animation: slideUp 0.6s ease;
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .vip-popup {
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    .property-price-overlay {
        animation: slideIn 0.5s ease;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(-20px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Review Section Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Star Rating System
    const stars = document.querySelectorAll('.star-rating .star');
    const ratingInput = document.getElementById('review-rating');
    let currentRating = 0;
    
    stars.forEach((star, index) => {
        star.addEventListener('mouseover', () => {
            highlightStars(index + 1);
        });
        
        star.addEventListener('mouseout', () => {
            highlightStars(currentRating);
        });
        
        star.addEventListener('click', () => {
            currentRating = index + 1;
            ratingInput.value = currentRating;
            highlightStars(currentRating);
        });
    });
    
    function highlightStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
    
    // Review Form Submission
    const reviewForm = document.querySelector('.review-form');
    if (reviewForm) {
        console.log('Review form found - attaching handler');
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Review form submitted!');
            
            // Validate required fields
            const requiredFields = [
                'review-name',
                'review-title', 
                'review-content',
                'review-consent'
            ];
            
            let isValid = true;
            
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (fieldId === 'review-consent') {
                    if (!field.checked) {
                        isValid = false;
                        field.closest('.form-group').style.borderColor = '#dc3545';
                    }
                } else if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#dc3545';
                } else {
                    field.style.borderColor = '#e9ecef';
                }
            });
            
            // Validate rating
            if (currentRating === 0) {
                isValid = false;
                document.querySelector('.star-rating').style.boxShadow = '0 0 5px #dc3545';
            } else {
                document.querySelector('.star-rating').style.boxShadow = 'none';
            }
            
            if (!isValid) {
                alert('Please fill in all required fields and provide a rating.');
                return;
            }
            
            // Collect form data
            const formData = {
                name: document.getElementById('review-name').value,
                email: document.getElementById('review-email').value,
                service: document.getElementById('review-service').value,
                rating: currentRating,
                title: document.getElementById('review-title').value,
                content: document.getElementById('review-content').value,
                consent: document.getElementById('review-consent').checked
            };
            
            // Show success message
            const submitButton = document.querySelector('.review-submit');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            // Send review via EmailJS
            const templateParams = {
                to_email: 'rickyvillalobos@kw.com',
                from_name: formData.name,
                from_email: formData.email,
                phone: '', // Reviews don't have phone
                message: `New Client Review Submission:

Name: ${formData.name}
Email: ${formData.email}
Service Used: ${formData.service}
Rating: ${formData.rating}/5 stars
Review Title: ${formData.title}

Review Content:
${formData.content}

Consent for Display: ${formData.consent ? 'Yes' : 'No'}

Submitted: ${new Date().toLocaleString()}`,
                subject: `Website Review Submission - ${formData.name}`,
                timestamp: new Date().toLocaleString()
            };
            
            console.log('Attempting to send review email...');
            console.log('EmailJS available:', typeof emailjs !== 'undefined');
            console.log('Template params:', templateParams);
            
            if (typeof emailjs !== 'undefined') {
                emailjs.send('service_ll15f7k', 'template_cz2jmqw', templateParams)
                    .then((response) => {
                        console.log('Review email sent successfully!', response);
                        alert('Thank you for your review! Your feedback has been sent successfully and will be reviewed shortly.');
                        reviewForm.reset();
                        currentRating = 0;
                        highlightStars(0);
                    })
                    .catch((error) => {
                        console.error('Failed to send review email:', error);
                        alert('There was an issue submitting your review. Please try again or contact us directly.');
                    })
                    .finally(() => {
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                    });
            } else {
                // Fallback if EmailJS not loaded
                console.warn('EmailJS not available, using fallback');
                alert('Thank you for your review! Your feedback has been submitted.');
                reviewForm.reset();
                currentRating = 0;
                highlightStars(0);
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
            
            console.log('Review submitted:', formData);
        });
    }
    
    // Reviews Carousel Functionality
    const reviewsCarousel = {
        track: document.querySelector('.reviews-track'),
        cards: document.querySelectorAll('.review-card'),
        prevBtn: document.querySelector('.carousel-btn-prev'),
        nextBtn: document.querySelector('.carousel-btn-next'),
        indicators: document.querySelectorAll('.indicator'),
        currentSlide: 0,
        cardWidth: 0,
        cardsPerView: 1,
        
        init() {
            if (!this.track || !this.cards.length) return;
            
            this.calculateDimensions();
            this.setupEventListeners();
            this.updateCarousel();
            
            // Update on window resize
            window.addEventListener('resize', () => {
                this.calculateDimensions();
                this.updateCarousel();
            });
        },
        
        calculateDimensions() {
            if (this.cards.length > 0) {
                // Force single card view
                this.cardsPerView = 1;
                
                // Calculate width based on container
                const containerWidth = this.track.parentElement.offsetWidth;
                this.cardWidth = containerWidth;
                
                // Set each card to full container width
                this.cards.forEach(card => {
                    card.style.width = `${containerWidth}px`;
                });
            }
        },
        
        setupEventListeners() {
            this.prevBtn?.addEventListener('click', () => this.previousSlide());
            this.nextBtn?.addEventListener('click', () => this.nextSlide());
            
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
            });
            
            // Touch/swipe support
            let startX = 0;
            let currentX = 0;
            let isDragging = false;
            
            this.track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            });
            
            this.track.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
            });
            
            this.track.addEventListener('touchend', () => {
                if (!isDragging) return;
                
                const diff = startX - currentX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.previousSlide();
                    }
                }
                
                isDragging = false;
            });
        },
        
        updateCarousel() {
            if (!this.track) return;
            
            const translateX = -this.currentSlide * this.cardWidth;
            this.track.style.transform = `translateX(${translateX}px)`;
            
            // Update indicators
            this.indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentSlide);
            });
            
            // Update button states
            if (this.prevBtn) {
                this.prevBtn.disabled = this.currentSlide === 0;
                this.prevBtn.style.opacity = this.currentSlide === 0 ? '0.5' : '1';
            }
            
            if (this.nextBtn) {
                const maxSlide = this.cards.length - this.cardsPerView;
                this.nextBtn.disabled = this.currentSlide >= maxSlide;
                this.nextBtn.style.opacity = this.currentSlide >= maxSlide ? '0.5' : '1';
            }
        },
        
        nextSlide() {
            const maxSlide = this.cards.length - this.cardsPerView;
            if (this.currentSlide < maxSlide) {
                this.currentSlide++;
                this.updateCarousel();
            }
        },
        
        previousSlide() {
            if (this.currentSlide > 0) {
                this.currentSlide--;
                this.updateCarousel();
            }
        },
        
        goToSlide(slideIndex) {
            const maxSlide = this.cards.length - this.cardsPerView;
            this.currentSlide = Math.max(0, Math.min(slideIndex, maxSlide));
            this.updateCarousel();
        }
    };
    
    // Initialize reviews carousel
    reviewsCarousel.init();
    
    // Auto-play carousel (optional)
    setInterval(() => {
        if (reviewsCarousel.track) {
            const maxSlide = reviewsCarousel.cards.length - reviewsCarousel.cardsPerView;
            if (reviewsCarousel.currentSlide >= maxSlide) {
                reviewsCarousel.goToSlide(0);
            } else {
                reviewsCarousel.nextSlide();
            }
        }
    }, 6000); // Change slide every 6 seconds
});
