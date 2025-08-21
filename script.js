// ENHANCED MOBILE NAVIGATION AND FUNCTIONALITY

document.addEventListener('DOMContentLoaded', function() {
    // Add loaded class to body for animations
    document.body.classList.add('loaded');
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    // Handle dropdown toggles for mobile and desktop
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const toggle = dropdown.querySelector('.nav-link');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', function(e) {
                // Only prevent default on mobile
                if (window.innerWidth <= 767) {
                    e.preventDefault();
                    
                    // Toggle this dropdown
                    dropdown.classList.toggle('active');
                    
                    // Close other dropdowns
                    document.querySelectorAll('.dropdown').forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    });
                }
            });
        }
    });
    
    // Close mobile menu when clicking on regular nav links
    document.querySelectorAll('.nav-link:not(.dropdown .nav-link)').forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
            // Close all dropdowns
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                // Close all dropdowns
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        }
    });
    
    // Handle window resize - ensure mobile menu is properly reset
    window.addEventListener('resize', function() {
        if (window.innerWidth > 767) {
            // Reset mobile menu for desktop
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
            // Close all dropdowns
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Property Search Form Handler
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(searchForm);
            const searchData = {};
            for (let [key, value] of formData.entries()) {
                searchData[key] = value;
            }
            
            // Log search data (replace with actual search functionality)
            console.log('Property Search:', searchData);
            
            // Show search results (placeholder)
            alert('Search functionality will be implemented with MLS integration. Your search criteria have been logged.');
        });
    }
    
    // Reviews Carousel Functionality
    let currentReview = 0;
    const reviewsTrack = document.querySelector('.reviews-track');
    const reviewCards = document.querySelectorAll('.review-card');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    
    function updateCarousel() {
        if (reviewsTrack && reviewCards.length > 0) {
            const translateX = -currentReview * 100;
            reviewsTrack.style.transform = `translateX(${translateX}%)`;
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentReview);
            });
        }
    }
    
    function nextReview() {
        if (reviewCards.length > 0) {
            currentReview = (currentReview + 1) % reviewCards.length;
            updateCarousel();
        }
    }
    
    function prevReview() {
        if (reviewCards.length > 0) {
            currentReview = currentReview === 0 ? reviewCards.length - 1 : currentReview - 1;
            updateCarousel();
        }
    }
    
    // Carousel button listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextReview);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevReview);
    }
    
    // Indicator listeners
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentReview = index;
            updateCarousel();
        });
    });
    
    // Auto-play carousel (optional)
    if (reviewCards.length > 1) {
        setInterval(nextReview, 5000); // Change review every 5 seconds
    }
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    if (reviewsTrack) {
        reviewsTrack.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        reviewsTrack.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    nextReview(); // Swipe left - next review
                } else {
                    prevReview(); // Swipe right - previous review
                }
            }
        });
    }
    
    // Star Rating Functionality
    const starRatings = document.querySelectorAll('.star-rating');
    
    starRatings.forEach(rating => {
        const stars = rating.querySelectorAll('.star');
        let currentRating = 0;
        
        stars.forEach((star, index) => {
            star.addEventListener('click', function() {
                currentRating = index + 1;
                updateStars();
            });
            
            star.addEventListener('mouseenter', function() {
                highlightStars(index + 1);
            });
        });
        
        rating.addEventListener('mouseleave', function() {
            updateStars();
        });
        
        function updateStars() {
            stars.forEach((star, index) => {
                star.classList.toggle('active', index < currentRating);
            });
        }
        
        function highlightStars(count) {
            stars.forEach((star, index) => {
                star.classList.toggle('active', index < count);
            });
        }
    });
    
    // Contact Form Handler with EmailJS
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const templateParams = {};
            for (let [key, value] of formData.entries()) {
                templateParams[key] = value;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Send email using EmailJS (replace with your service details)
            if (typeof emailjs !== 'undefined') {
                emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
                    .then(function(response) {
                        alert('Message sent successfully! I will get back to you soon.');
                        contactForm.reset();
                    })
                    .catch(function(error) {
                        alert('Failed to send message. Please try again or call directly.');
                        console.error('EmailJS Error:', error);
                    })
                    .finally(function() {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    });
            } else {
                // Fallback if EmailJS is not loaded
                alert('Contact form submitted! (EmailJS not configured - check console for form data)');
                console.log('Contact Form Data:', templateParams);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Review Form Handler
    const reviewForm = document.querySelector('#review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data including star rating
            const formData = new FormData(reviewForm);
            const reviewData = {};
            for (let [key, value] of formData.entries()) {
                reviewData[key] = value;
            }
            
            // Get star rating
            const activeStars = reviewForm.querySelectorAll('.star-rating .star.active');
            reviewData.rating = activeStars.length;
            
            // Validate rating
            if (reviewData.rating === 0) {
                alert('Please select a star rating before submitting your review.');
                return;
            }
            
            // Show loading state
            const submitBtn = reviewForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            // Send review (replace with actual review handling)
            setTimeout(() => {
                alert('Thank you for your review! It will be published after moderation.');
                reviewForm.reset();
                // Reset star rating
                reviewForm.querySelectorAll('.star-rating .star').forEach(star => {
                    star.classList.remove('active');
                });
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
            
            console.log('Review Data:', reviewData);
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Fade in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for fade-in animation
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    
    // Initialize carousel
    updateCarousel();
    
    console.log('Website functionality initialized successfully!');
});

// Phone number formatting
function formatPhoneNumber(input) {
    // Remove all non-digit characters
    const digits = input.value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (digits.length >= 6) {
        input.value = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (digits.length >= 3) {
        input.value = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
        input.value = digits;
    }
}

// Apply phone formatting to phone inputs
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
});