document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.main-header');
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // --- Header Scroll Effect & Active Nav Link ---
    function setActiveNavLink() {
        let currentActive = 'hero'; // Default to hero
        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight - 50; // Add buffer
            const sectionBottom = sectionTop + section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentActive = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentActive)) {
                link.classList.add('active');
            }
        });
    }

    // --- Smooth Scrolling for Navigation ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - header.offsetHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                // Close mobile nav after clicking
                if (navToggle.classList.contains('open')) {
                    navToggle.classList.remove('open');
                    navList.classList.remove('open');
                }
            }
        });
    });

    // --- Mobile Navigation Toggle ---
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('open');
            navList.classList.toggle('open');
            document.body.classList.toggle('no-scroll'); // Optional: prevent body scroll when nav is open
        });
    }

    // Optional: Close mobile nav when clicking outside (or on scroll)
    window.addEventListener('scroll', () => {
        if (navToggle.classList.contains('open')) {
            navToggle.classList.remove('open');
            navList.classList.remove('open');
            document.body.classList.remove('no-scroll');
        }
    });

    // --- Fade-in on Scroll Animation ---
    const fadeInElements = document.querySelectorAll('.fade-in-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Element is visible by 10%
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    fadeInElements.forEach(el => {
        observer.observe(el);
    });

    // --- Contact Form Submission (using Formspree.io) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            formStatus.textContent = 'Sending...';
            formStatus.className = 'form-status'; // Reset classes
            formStatus.style.display = 'block';

            const formData = new FormData(contactForm);
            const formAction = contactForm.getAttribute('action');

            try {
                const response = await fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully! Thank you.';
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwnProperty.call(data, 'errors')) {
                        formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        formStatus.textContent = 'Oops! There was a problem sending your message.';
                    }
                    formStatus.classList.add('error');
                }
            } catch (error) {
                formStatus.textContent = 'Network error: Could not connect to the server.';
                formStatus.classList.add('error');
            }
        });
    }

    // Initial call and event listener for scroll
    setActiveNavLink();
    window.addEventListener('scroll', setActiveNavLink);
});