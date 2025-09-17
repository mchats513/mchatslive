// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth Scrolling for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar Background on Scroll
    const navbar = document.querySelector('.navbar');
    
    // Parallax Effect
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    const isMobile = window.innerWidth <= 768;
    
    function updateParallax() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Update navbar
        if (scrollTop > 100) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        // Update parallax layers (only on desktop for performance)
        if (!isMobile) {
            parallaxLayers.forEach((layer, index) => {
                const speed = (index + 1) * 0.2; // Reduced speed for smoother effect
                const yPos = -(scrollTop * speed);
                layer.style.transform = `translateY(${yPos}px)`;
            });
        }
    }
    
    // Use requestAnimationFrame for smoother parallax
    let ticking = false;
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', function() {
        requestTick();
        ticking = false;
    });

    // Skill Bar Animation on Scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillSection = document.querySelector('.skills');

    function animateSkillBars() {
        const skillSectionTop = skillSection.offsetTop;
        const skillSectionHeight = skillSection.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;

        // Check if skills section is in viewport
        if (scrollTop + windowHeight > skillSectionTop + 200) {
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            });
        }
    }

    // Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 200);
                    });
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        if (skillSection) {
            skillObserver.observe(skillSection);
        }
    } else {
        // Fallback for older browsers
        window.addEventListener('scroll', animateSkillBars);
    }

    // Contact Form Handling
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Basic validation
            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = this.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate API call delay
            setTimeout(() => {
                showFormMessage('Thank you! Your message has been sent successfully.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show form message function
    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        messageDiv.style.cssText = `
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            font-weight: 500;
            text-align: center;
            ${type === 'success' 
                ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;'
                : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
            }
        `;

        // Insert message at the top of the form
        const form = document.querySelector('.contact-form');
        form.insertBefore(messageDiv, form.firstChild);

        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Scroll to Top functionality
    function createScrollToTopButton() {
        const scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '↑';
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary-brown, #8B4513);
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

        document.body.appendChild(scrollBtn);

        // Show/hide scroll button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
        });

        // Scroll to top on click
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Hover effects
        scrollBtn.addEventListener('mouseenter', () => {
            scrollBtn.style.transform = 'scale(1.1)';
            scrollBtn.style.backgroundColor = 'var(--dark-brown, #654321)';
        });

        scrollBtn.addEventListener('mouseleave', () => {
            scrollBtn.style.transform = 'scale(1)';
            scrollBtn.style.backgroundColor = 'var(--primary-brown, #8B4513)';
        });
    }

    // Initialize scroll to top button
    createScrollToTopButton();

    // Loading animation for page
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // Animate elements on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .skill-item, .contact-item');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Initialize elements for animation
    function initializeAnimations() {
        const elements = document.querySelectorAll('.service-card, .skill-item, .contact-item');
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    }

    // Initialize animations and scroll listener
    initializeAnimations();
    window.addEventListener('scroll', animateOnScroll);

    // Trigger initial animation check
    animateOnScroll();

    // Add active class to current navigation item based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current nav link
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    // Add CSS for active nav link
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active {
            color: var(--primary-brown, #8B4513) !important;
        }
        .nav-link.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call

    // Preload images and optimize performance
    function preloadImages() {
        const images = ['hero-bg.jpg', 'about-bg.jpg']; // Add any background images you might use
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // Call preload function
    preloadImages();

    // Add touch support for mobile devices
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', e => {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', e => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up
                console.log('Swiped up');
            } else {
                // Swipe down
                console.log('Swiped down');
            }
        }
    }

    console.log('Portfolio loaded successfully! 🚀');
});

// Playground Functions
function loadPlaygroundApp(appUrl) {
    const playgroundApp = document.getElementById('playground-app');
    const iframe = document.getElementById('playground-iframe');
    
    // Set the iframe source
    iframe.src = appUrl;
    
    // Show the playground app container
    playgroundApp.style.display = 'block';
    
    // Smooth scroll to the playground app
    setTimeout(() => {
        playgroundApp.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
    
    // Add loading state
    iframe.style.opacity = '0.5';
    iframe.onload = function() {
        iframe.style.opacity = '1';
    };
}

function closePlaygroundApp() {
    const playgroundApp = document.getElementById('playground-app');
    const iframe = document.getElementById('playground-iframe');
    
    // Hide the playground app container
    playgroundApp.style.display = 'none';
    
    // Clear the iframe source to stop any running processes
    iframe.src = '';
    
    // Scroll back to the playground section
    const playgroundSection = document.getElementById('playground');
    playgroundSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function openInNewTab(appUrl) {
    // Open the playground app in a new tab
    window.open(appUrl, '_blank', 'noopener,noreferrer');
} 