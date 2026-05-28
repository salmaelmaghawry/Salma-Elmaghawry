/* ==========================================================================
   Salma Elmaghawry Portfolio - Interaction Scripts JS
   Provides premium scrolling, theme toggles, dynamic text cycling, 
   project filtering, tabs toggling, certificate lightbox, and form submissions.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- STICKY NAV & ACTIVE LINK HIGHLIGHTER ---
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        // Sticky Header scroll class
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active links scrolling updater
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
    });

    // --- MOBILE BURGER MENU ---
    const burgerMenu = document.getElementById('burger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinksList = document.querySelectorAll('.nav-link, .nav-btn-mobile');
    
    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- THEME SELECTOR (DARK / LIGHT MODE) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Get persisted theme preference or default to light mode
    const storedTheme = localStorage.getItem('theme') || 'light-mode';
    body.className = storedTheme;
    
    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    });

    // --- PREMIUM TYPING TEXT EFFECT CYCLER ---
    const typingSpan = document.querySelector('.typing-text');
    const professions = [
        "Software Engineer & Flutter Developer",
        "Computer Science Programming Instructor",
        "Edu Tech Content Creator",
        "Clean Architecture Enthusiast",
        "Tech Community Mentor"
    ];
    
    let professionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function cycleText() {
        const currentText = professions[professionIndex];
        
        if (isDeleting) {
            // Delete characters
            typingSpan.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40; // delete faster
        } else {
            // Write characters
            typingSpan.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80; // natural typing speed
        }
        
        // Handling limits
        if (!isDeleting && charIndex === currentText.length) {
            // Full word typed, pause before deletion
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Word deleted, move to the next
            isDeleting = false;
            professionIndex = (professionIndex + 1) % professions.length;
            typeSpeed = 400; // brief pause before typing next
        }
        
        setTimeout(cycleText, typeSpeed);
    }
    
    // Initiate cycler
    if (typingSpan) {
        cycleText();
    }

    // --- INTERSECTION OBSERVER SCROLL REVEALS ---
    const revealItems = document.querySelectorAll('.reveal, .timeline-item, .project-card, .service-card, .volunteer-card');
    
    // Set class lists immediately to reveal objects on scrolling
    revealItems.forEach((item, index) => {
        item.classList.add('reveal');
        // stagger timings for grids
        if (index % 3 === 1) item.classList.add('reveal-delay-1');
        if (index % 3 === 2) item.classList.add('reveal-delay-2');
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // trigger once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.reveal').forEach(item => {
        revealObserver.observe(item);
    });

    // --- PORTFOLIO PROJECT FILTERING SYSTEM ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active states
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const selectedCategory = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const cardCategories = card.getAttribute('data-category').split(' ');
                
                if (selectedCategory === 'all' || cardCategories.includes(selectedCategory)) {
                    card.style.display = 'flex';
                    // Trigger reflow/fade animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // --- IMPACT SECTIONS TAB CONTROL ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            btn.classList.add('active');
            const targetTabId = `tab-${btn.getAttribute('data-tab')}`;
            document.getElementById(targetTabId).classList.add('active');
            
            // Retrigger icons alignment inside tab if needed
            lucide.createIcons();
        });
    });
});

// --- CERTIFICATE LIGHTBOX MODAL TRIGGER ---
function openLightbox(imageUrl, captionText) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    // Create an aesthetic vector SVG certificate base in fallback cases, since assets/ are virtual
    lightboxImg.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%"><rect width="100%" height="100%" fill="%231E293B"/><rect x="40" y="40" width="720" height="520" fill="none" stroke="%2334D399" stroke-width="6"/><rect x="60" y="60" width="680" height="480" fill="none" stroke="%23F472B6" stroke-width="2"/><text x="400" y="160" font-family="'Nunito', sans-serif" font-size="28" font-weight="bold" fill="%2334D399" text-anchor="middle" letter-spacing="2">CERTIFICATE OF APPRECIATION</text><text x="400" y="220" font-family="'Nunito', sans-serif" font-size="16" fill="%2394A3B8" text-anchor="middle">PROUDLY PRESENTED TO</text><text x="400" y="290" font-family="'Nunito', sans-serif" font-size="36" font-weight="900" fill="%23F8FAFC" text-anchor="middle">${encodeURIComponent("Salma Elmaghawry")}</text><line x1="200" y1="320" x2="600" y2="320" stroke="%23F472B6" stroke-width="2"/><text x="400" y="370" font-family="'Nunito', sans-serif" font-size="15" fill="%2394A3B8" text-anchor="middle" width="500">${encodeURIComponent(captionText)}</text><text x="400" y="420" font-family="'Nunito', sans-serif" font-size="14" fill="%2364748B" text-anchor="middle">Cairo Coding School &amp; MU Student Partners</text><circle cx="400" cy="500" r="30" fill="%2334D399" opacity="0.2"/><circle cx="400" cy="500" r="20" fill="%23F472B6" opacity="0.3"/><path d="M390 490 L400 480 L410 490 L405 490 L405 510 L395 510 L395 490 Z" fill="%2334D399"/></svg>`;
    
    lightboxCaption.textContent = captionText;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // prevent scrolls behind
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto'; // enable scroll
}

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// --- MOCK CONTACT FORM SUBMISSION RESPONSE ---
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const statusDiv = document.getElementById('form-status');
    const submitBtnText = submitBtn.querySelector('span');
    
    // Visually toggle loading state
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtnText.textContent = 'Sending Message...';
    
    setTimeout(() => {
        statusDiv.className = 'form-status success';
        statusDiv.innerHTML = `<i data-lucide="check" style="display:inline-block; vertical-align:middle; width:18px; height:18px;"></i> Message Sent! Thank you, I will get back to you shortly.`;
        
        // Re-draw lucide icon
        lucide.createIcons();
        
        // Reset form
        form.reset();
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtnText.textContent = 'Send Message';
        
        // Clear message after 5 seconds
        setTimeout(() => {
            statusDiv.innerHTML = '';
            statusDiv.className = 'form-status';
        }, 5000);
        
    }, 1500);
}
