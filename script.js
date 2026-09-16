/* ==========================================================================
   Salma Elmaghawry Portfolio - Interaction Scripts JS
   Provides premium scrolling, theme toggles, dynamic text cycling, 
   project filtering, tabs toggling, certificate lightbox, and form submissions.
   ========================================================================== */

/* --- BRAND ICONS (inline SVG) ---
   Lucide removed brand/logo icons (github, linkedin, youtube, instagram,
   facebook) from recent versions, so they render blank. We inject reliable
   inline SVGs into any element marked with data-brand="name". */
const BRAND_ICONS = {
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7 0-.7 0-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.1 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2M12 0C8.7 0 8.3 0 7 .1 5.7.1 4.8.3 4.1.6c-.8.3-1.4.7-2.1 1.4C1.3 2.7.9 3.3.6 4.1.3 4.8.1 5.7.1 7 0 8.3 0 8.7 0 12s0 3.7.1 5c.1 1.3.3 2.2.5 2.9.3.8.7 1.4 1.4 2.1.7.7 1.3 1.1 2.1 1.4.7.3 1.6.5 2.9.5 1.3.1 1.7.1 5 .1s3.7 0 5-.1c1.3-.1 2.2-.3 2.9-.5.8-.3 1.4-.7 2.1-1.4.7-.7 1.1-1.3 1.4-2.1.3-.7.5-1.6.5-2.9.1-1.3.1-1.7.1-5s0-3.7-.1-5c-.1-1.3-.3-2.2-.5-2.9-.3-.8-.7-1.4-1.4-2.1C21.3 1.3 20.7.9 19.9.6 19.2.3 18.3.1 17 .1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.6.2 2.6.2v2.9h-1.5c-1.5 0-1.9.9-1.9 1.8V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12z"/></svg>'
};

function renderBrandIcons() {
    document.querySelectorAll('[data-brand]').forEach(el => {
        const name = el.getAttribute('data-brand');
        if (BRAND_ICONS[name] && !el.dataset.brandDone) {
            el.innerHTML = BRAND_ICONS[name];
            el.dataset.brandDone = 'true';
            el.classList.add('brand-svg');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {

    // Inject brand SVGs (LinkedIn/GitHub/YouTube/Instagram/Facebook)
    renderBrandIcons();

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
        const isOpen = burgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
        burgerMenu.setAttribute('aria-expanded', String(isOpen));
    });
    
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            burgerMenu.setAttribute('aria-expanded', 'false');
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1100) {
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            burgerMenu.setAttribute('aria-expanded', 'false');
        }
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

    // --- AUTOPLAY YOUTUBE SHORTS WHEN SCROLLED INTO VIEW ---
    // Lazy-loads a muted, looping embed so the page stays fast until the
    // Educational Content row is actually on screen.
    const shortPlayers = document.querySelectorAll('.short-player');

    if (shortPlayers.length) {
        const shortsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const el = entry.target;
                const frame = el.querySelector('.short-frame');
                if (!frame) return;

                if (entry.isIntersecting) {
                    // Build the autoplaying embed only once
                    if (!frame.querySelector('iframe')) {
                        const id = el.getAttribute('data-video');
                        const iframe = document.createElement('iframe');
                        iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1&rel=0&modestbranding=1&playsinline=1`;
                        iframe.title = el.getAttribute('data-title') || 'YouTube Short';
                        iframe.setAttribute('frameborder', '0');
                        iframe.setAttribute('loading', 'lazy');
                        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                        iframe.allowFullscreen = true;
                        frame.appendChild(iframe);
                        frame.classList.add('is-playing');
                    }
                    el.classList.add('active');
                }
            });
        }, { threshold: 0.4 });

        shortPlayers.forEach(p => shortsObserver.observe(p));
    }

    // --- ACTIVITIES MARQUEE (shuffled, auto-scrolling photo strip) ---
    const activitiesTrack = document.getElementById('activities-track');

    if (activitiesTrack) {
        const activityFiles = [
            '1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg', '5.jpeg', '6.jpeg', '7.jpeg',
            '8.jpeg', '9.jpeg', '10.png', '11.png', '12.png', '13.png', '14.png',
            '15.png', 'github_workshop.jpeg', 'presentation_workshop.jpeg'
        ];

        // Fisher–Yates shuffle for a random order each visit
        for (let i = activityFiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [activityFiles[i], activityFiles[j]] = [activityFiles[j], activityFiles[i]];
        }

        const basePath = 'assets/My_activities/';
        const buildItem = (file) => {
            const src = basePath + encodeURIComponent(file);
            const item = document.createElement('div');
            item.className = 'activity-item';

            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Salma Elmaghawry — community activity';
            img.loading = 'lazy';
            item.appendChild(img);

            item.addEventListener('click', () => openPhotoLightbox(src, 'Community & Activities'));
            return item;
        };

        // Duplicate the set so the loop is seamless (track scrolls exactly -50%)
        [...activityFiles, ...activityFiles].forEach(file => {
            activitiesTrack.appendChild(buildItem(file));
        });

        // Slow the animation down proportionally to the number of images
        activitiesTrack.style.animationDuration = `${activityFiles.length * 4}s`;
    }

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

// Opens the lightbox with a REAL photo (used by the activities gallery)
function openPhotoLightbox(src, captionText) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    lightboxImg.src = src;
    lightboxCaption.textContent = captionText || '';
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
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
        closeVideoModal(null);
    }
});

// --- YOUTUBE SHORTS VIDEO MODAL ---
function openVideoModal(videoId, title) {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-modal-iframe');
    const titleEl = document.getElementById('video-modal-title');
    const ytLink = document.getElementById('video-modal-yt-link');

    // Set embed src with autoplay for immediate playback
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    titleEl.textContent = title;
    ytLink.href = `https://youtube.com/shorts/${videoId}`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Re-render lucide icons (for the YT icon in the link)
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeVideoModal(event) {
    const modal = document.getElementById('video-modal');

    // If triggered by click, only close if clicking the backdrop (not the inner card)
    if (event && event.target !== modal) return;

    const iframe = document.getElementById('video-modal-iframe');
    // Clear src to stop video playback
    iframe.src = '';

    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

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
