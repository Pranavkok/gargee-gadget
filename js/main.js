// ========================================
// GSAP + ScrollTrigger — Reliable, Cinematic, Premium
// ========================================

gsap.registerPlugin(ScrollTrigger);

// Force ScrollTrigger to check positions more aggressively
ScrollTrigger.config({ limitCallbacks: true });

// ========== UTILITY: Manual Text Splitting ==========

function splitTextIntoChars(element) {
    const text = element.textContent;
    element.textContent = '';
    element.setAttribute('aria-label', text);
    const chars = [];
    for (const char of text) {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        element.appendChild(span);
        chars.push(span);
    }
    return chars;
}

function splitTextIntoWords(element) {
    const html = element.innerHTML;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const wordSpans = [];

    function processNode(node, parent) {
        if (node.nodeType === Node.TEXT_NODE) {
            const words = node.textContent.split(/(\s+)/);
            words.forEach(word => {
                if (word.match(/^\s+$/)) {
                    parent.appendChild(document.createTextNode(' '));
                } else if (word.length > 0) {
                    const outer = document.createElement('span');
                    outer.className = 'word';
                    const inner = document.createElement('span');
                    inner.className = 'word-inner';
                    inner.textContent = word;
                    outer.appendChild(inner);
                    parent.appendChild(outer);
                    wordSpans.push(inner);
                }
            });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const clone = document.createElement(node.tagName.toLowerCase());
            for (const attr of node.attributes) {
                clone.setAttribute(attr.name, attr.value);
            }
            parent.appendChild(clone);
            node.childNodes.forEach(child => processNode(child, clone));
        }
    }

    element.innerHTML = '';
    tempDiv.childNodes.forEach(child => processNode(child, element));
    return wordSpans;
}

// ==========================================================
// RELIABLE SCROLL ANIMATION HELPER
// Uses ScrollTrigger.create + onEnter (fires even if already
// scrolled past) instead of gsap.from + toggleActions
// ==========================================================

function scrollReveal(trigger, targets, fromVars, toVars, options = {}) {
    const els = typeof targets === 'string' ? gsap.utils.toArray(targets) :
                (targets instanceof Element ? [targets] : Array.from(targets));
    if (!els.length) return;

    // Set initial hidden state
    gsap.set(els, fromVars);

    ScrollTrigger.create({
        trigger: trigger,
        start: options.start || 'top 88%',
        once: true,
        onEnter: () => {
            gsap.to(els, {
                ...toVars,
                duration: toVars.duration || 0.9,
                ease: toVars.ease || 'power3.out',
                stagger: toVars.stagger || 0,
                delay: toVars.delay || 0,
            });
        },
    });
}

// ==========================================================
// RELIABLE BATCH REVEAL — for cards/grids (handles fast scroll)
// ==========================================================

function batchReveal(selector, fromVars, toVars, options = {}) {
    const els = gsap.utils.toArray(selector);
    if (!els.length) return;

    gsap.set(els, fromVars);

    ScrollTrigger.batch(els, {
        start: options.start || 'top 90%',
        once: true,
        onEnter: (batch) => {
            gsap.to(batch, {
                ...toVars,
                duration: toVars.duration || 0.8,
                ease: toVars.ease || 'power3.out',
                stagger: toVars.stagger || 0.12,
                overwrite: true,
            });
        },
    });
}

// ========== CUSTOM CURSOR ==========
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

if (cursor && cursorFollower && window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    gsap.ticker.add(() => {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        followerX += (mouseX - followerX) * 0.08;
        followerY += (mouseY - followerY) * 0.08;
        gsap.set(cursor, { x: cursorX - 4, y: cursorY - 4 });
        gsap.set(cursorFollower, { x: followerX - 18, y: followerY - 18 });
    });

    const hoverTargets = document.querySelectorAll('a, button, .btn, .service-card, .magnetic');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });
}

// ========== NAVBAR ==========
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// ==========================================
// HERO ANIMATIONS — Kinetic Character Split
// ==========================================

const heroTl = gsap.timeline({
    defaults: { ease: 'power4.out' },
    delay: 0.3,
});

// Split hero title into characters with staggered kinetic entrance
document.querySelectorAll('.hero-title .title-line').forEach(line => {
    const chars = splitTextIntoChars(line);

    heroTl.from(chars, {
        y: 80,
        opacity: 0,
        rotateX: -90,
        rotateZ: () => gsap.utils.random(-8, 8),
        scale: 0.5,
        duration: 1.2,
        stagger: { each: 0.03, from: 'random' },
        ease: 'back.out(1.7)',
    }, heroTl.duration() > 0 ? '-=0.8' : 0);
});

heroTl
    .from('.hero-badge', { y: 30, opacity: 0, scale: 0.8, duration: 0.8 }, 0)
    .from('.hero-subtitle', { y: 40, opacity: 0, duration: 1 }, '-=0.5')
    .from('.hero-buttons .btn', { y: 30, opacity: 0, duration: 0.8, stagger: 0.15 }, '-=0.6')
    .from('.hero-scroll-indicator', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3');

// ========== HERO PARALLAX ==========

// Background gradient layer — moves slower (depth)
gsap.to('.parallax-gradient', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
    },
    y: 150,
    ease: 'none',
});

// Each floating shape — independent parallax speed
document.querySelectorAll('.hero-bg-shapes .shape').forEach(shape => {
    const speed = parseFloat(shape.dataset.speed) || 0.2;
    gsap.to(shape, {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.3,
        },
        y: () => speed * window.innerHeight * 0.7,
        ease: 'none',
    });
});

// Floating animation for shapes (ambient, independent of scroll)
document.querySelectorAll('.hero-bg-shapes .shape').forEach((shape, i) => {
    gsap.to(shape, {
        y: `+=${gsap.utils.random(15, 35)}`,
        x: `+=${gsap.utils.random(-20, 20)}`,
        duration: gsap.utils.random(4, 7),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.5,
    });
});

// Hero content — foreground scrolls faster (parallax depth)
gsap.to('.hero-content', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
    },
    y: -80,
    opacity: 0.3,
    ease: 'none',
});

// ==============================================
// SCROLL-TRIGGERED ANIMATIONS — Reliable
// ==============================================

// --- Section Label Clip-Path Reveals ---
document.querySelectorAll('.reveal-text').forEach(el => {
    gsap.set(el, { clipPath: 'inset(0 100% 0 0)' });
    ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () => {
            gsap.to(el, {
                clipPath: 'inset(0 0% 0 0)',
                duration: 0.8,
                ease: 'power3.inOut',
            });
        },
    });
});

// --- Section Title Word Reveals ---
document.querySelectorAll('.split-words').forEach(el => {
    const words = splitTextIntoWords(el);
    // word-inner starts at translateY(110%) via CSS
    ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
            gsap.to(words, {
                y: 0,
                duration: 0.9,
                stagger: 0.06,
                ease: 'power4.out',
            });
        },
    });
});

// --- Generic reveal-up elements ---
document.querySelectorAll('.reveal-up').forEach(el => {
    gsap.set(el, { opacity: 0, y: 50 });
    ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () => {
            gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
        },
    });
});

// --- Card reveals using batch (most reliable for fast scrolling) ---
batchReveal('.step-card', { opacity: 0, y: 80, scale: 0.85, rotate: -2 }, { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 1.1, ease: 'back.out(1.4)', stagger: 0.15 });
batchReveal('.service-card', { opacity: 0, y: 80, scale: 0.85, rotate: 2 }, { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 1.1, ease: 'back.out(1.4)', stagger: 0.12 });
batchReveal('.testimonial-card', { opacity: 0, y: 60, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'back.out(1.2)', stagger: 0.15 });
batchReveal('.tarot-card-wrapper', { opacity: 0, y: 100, scale: 0.8, rotate: () => gsap.utils.random(-8, 8) }, { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 1.3, ease: 'back.out(1.6)', stagger: 0.18 });

// ========== ABOUT SECTION ==========

scrollReveal('.about', '.about-image',
    { x: -80, opacity: 0 },
    { x: 0, opacity: 1, duration: 1.2 }
);

scrollReveal('.about', '.about-text',
    { x: 80, opacity: 0 },
    { x: 0, opacity: 1, duration: 1.2, delay: 0.15 }
);

// About image parallax (scroll-linked)
gsap.to('.about-image', {
    scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
    },
    y: -40,
    ease: 'none',
});

gsap.to('.image-decoration', {
    scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
    },
    y: -80,
    x: 20,
    ease: 'none',
});

// ========== COUNTER ANIMATIONS ==========

document.querySelectorAll('.stat-number[data-count]').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'), 10);
    counter.textContent = '0';

    ScrollTrigger.create({
        trigger: counter,
        start: 'top 92%',
        once: true,
        onEnter: () => {
            gsap.to(counter, {
                textContent: target,
                duration: 2,
                ease: 'power2.out',
                snap: { textContent: 1 },
                onUpdate() {
                    counter.textContent = Math.round(parseFloat(counter.textContent));
                },
            });
        },
    });
});

// ========== APPROACH SECTION ==========

// Deco circle entrance
gsap.set('.deco-circle', { scale: 0.3, opacity: 0, rotation: -180 });
ScrollTrigger.create({
    trigger: '.approach',
    start: 'top 85%',
    once: true,
    onEnter: () => {
        gsap.to('.deco-circle', {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 1.5,
            ease: 'power3.out',
        });
    },
});

// Deco circle slow rotation on scroll
gsap.to('.deco-circle', {
    scrollTrigger: {
        trigger: '.approach',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
    },
    rotation: 360,
    ease: 'none',
});

// Approach floating elements — parallax + ambient float
document.querySelectorAll('.float-el').forEach(el => {
    const speed = parseFloat(el.dataset.speed) || 0.2;
    gsap.to(el, {
        scrollTrigger: {
            trigger: '.approach',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
        },
        y: () => speed * -300,
        ease: 'none',
    });

    gsap.to(el, {
        y: `+=${gsap.utils.random(10, 25)}`,
        x: `+=${gsap.utils.random(-15, 15)}`,
        duration: gsap.utils.random(3, 6),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
    });
});

// Quote lines reveal
gsap.set('.approach-quote .quote-line', { y: 60, opacity: 0, rotateX: -15 });
ScrollTrigger.create({
    trigger: '.approach-quote',
    start: 'top 88%',
    once: true,
    onEnter: () => {
        gsap.to('.approach-quote .quote-line', {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power4.out',
        });
    },
});

// ========== CONTACT SECTION ==========

scrollReveal('.contact', '.contact-info',
    { x: -60, opacity: 0 },
    { x: 0, opacity: 1, duration: 1 }
);

scrollReveal('.contact', '.contact-form-wrapper',
    { x: 60, opacity: 0 },
    { x: 0, opacity: 1, duration: 1, delay: 0.15 }
);

batchReveal('.form-group', { y: 25, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08 }, { start: 'top 92%' });

// ========== FOOTER ==========

batchReveal('.footer-grid > div', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1 }, { start: 'top 96%' });

// ========== MAGNETIC BUTTONS ==========

if (window.innerWidth > 768) {
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
        });
    });
}

// ========== WHATSAPP FLOAT ==========

const whatsappFloat = document.querySelector('.whatsapp-float');
gsap.set(whatsappFloat, { scale: 0, opacity: 0 });

ScrollTrigger.create({
    trigger: '.about',
    start: 'top 80%',
    once: true,
    onEnter: () => {
        gsap.to(whatsappFloat, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' });
    },
});

// ========== CONTACT FORM HANDLING ==========

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    if (!data.name || !data.email || !data.service || !data.message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
        showFormMessage('Thank you! Your message has been sent. Dr. Gargee will get back to you soon.', 'success');
        contactForm.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    }, 1500);
});

function showFormMessage(message, type) {
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();

    const msgEl = document.createElement('div');
    msgEl.className = `form-message form-message-${type}`;
    msgEl.textContent = message;
    msgEl.style.cssText = `
        padding: 14px 20px; border-radius: 8px; margin-top: 16px; font-size: 0.95rem;
        ${type === 'success'
            ? 'background: #E8F5E9; color: #2E7D32; border: 1px solid #A5D6A7;'
            : 'background: #FFEBEE; color: #C62828; border: 1px solid #EF9A9A;'}
    `;
    contactForm.appendChild(msgEl);
    gsap.from(msgEl, { y: 10, opacity: 0, duration: 0.4, ease: 'power3.out' });

    setTimeout(() => {
        if (msgEl.parentNode) {
            gsap.to(msgEl, { opacity: 0, y: -10, duration: 0.3, onComplete: () => msgEl.remove() });
        }
    }, 5000);
}

// ========== HOVER SCRAMBLE EFFECT ON SERVICE CARD TITLES ==========

document.querySelectorAll('.service-card h3').forEach(title => {
    const originalText = title.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let scrambleInterval = null;

    title.addEventListener('mouseenter', () => {
        let iteration = 0;
        clearInterval(scrambleInterval);
        scrambleInterval = setInterval(() => {
            title.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iteration) return originalText[index];
                    if (char === ' ') return ' ';
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iteration >= originalText.length) clearInterval(scrambleInterval);
            iteration += 0.5;
        }, 30);
    });

    title.addEventListener('mouseleave', () => {
        clearInterval(scrambleInterval);
        title.textContent = originalText;
    });
});

// ==========================================
// IMMERSIVE & KINETIC HOOKS — Dr. Gargee Gadgil
// ==========================================

// 1. DYNAMIC BACKGROUND THEME SWAPPER (ScrollTrigger Mood Shift)
const sections = [
    { id: 'hero', theme: 'theme-lavender' },
    { id: 'about', theme: 'theme-lavender' },
    { id: 'steps', theme: 'theme-lavender' },
    { id: 'services', theme: 'theme-lavender' },
    { id: 'tarot-reading', theme: 'theme-midnight' }, // Surprise midnight depth for Tarot!
    { id: 'approach', theme: 'theme-sage' }, // Tranquil natural sage for breathing guide!
    { id: 'testimonials', theme: 'theme-lavender' },
    { id: 'contact', theme: 'theme-lavender' }
];

sections.forEach(sec => {
    const el = document.getElementById(sec.id);
    if (el) {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => updateBodyTheme(sec.theme),
            onEnterBack: () => updateBodyTheme(sec.theme),
        });
    }
});

function updateBodyTheme(themeName) {
    document.body.classList.remove('theme-lavender', 'theme-midnight', 'theme-gold', 'theme-sage', 'theme-dusk');
    document.body.classList.add(themeName);
}

// 2. DAILY AFFIRMATION GENERATOR
const affirmations = [
    "I am worthy of peace, healing, and a quiet mind.",
    "I release what I cannot control and choose to be present.",
    "My feelings are valid, and I allow myself space to feel them.",
    "I honor my boundary lines and trust my inner guidance.",
    "Every step I take is a step toward my healing and growth.",
    "I welcome calm into my body and let go of tension with every breath.",
    "Healing is a journey, and I am patient with my own process.",
    "I am breathing in strength, and breathing out hesitation."
];

const refreshBtn = document.getElementById('refreshAffirmation');
const affirmationText = document.getElementById('affirmationText');

if (refreshBtn && affirmationText) {
    refreshBtn.addEventListener('click', () => {
        // Spin the refresh button elastically
        gsap.to(refreshBtn, {
            rotation: '+=360',
            duration: 0.8,
            ease: 'back.out(1.5)'
        });

        // Fade text out, choose a random new affirmation, then fade back in with a bounce
        gsap.to(affirmationText, {
            opacity: 0,
            y: -10,
            duration: 0.25,
            onComplete: () => {
                let current = affirmationText.textContent.replace(/^"|"$/g, '');
                let next = current;
                while (next === current) {
                    next = affirmations[Math.floor(Math.random() * affirmations.length)];
                }
                affirmationText.textContent = `"${next}"`;
                
                gsap.to(affirmationText, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power3.out'
                });
            }
        });
    });
}

// 3. INTERACTIVE 3D TAROT CARD FLIPS & READING REVEAL
const tarotCards = document.querySelectorAll('.tarot-card-wrapper');
const tarotReveal = document.getElementById('tarotReveal');
const readingTitle = document.getElementById('readingTitle');
const readingText = document.getElementById('readingText');

const tarotReadings = {
    star: {
        title: "The Star — Hope & Healing",
        text: "A beautiful symbol of renewed hope and spiritual recovery. The Star suggests you are entering a period of gentle healing, peace, and clarity. It asks you to trust that the universe is guiding you, letting you release past weights so your light can shine once more."
    },
    sun: {
        title: "The Sun — Clarity & Vitality",
        text: "The Sun brings warmth, success, and clear understanding. It suggests positive energy, truth, and growth are surrounding you. Any lingering clouds of doubt are dissolving. Embrace the present moment with a joyful, playful, and open heart."
    },
    empress: {
        title: "The Empress — Nurturing & Abundance",
        text: "Representing mother nature, self-care, and creative growth. The Empress invites you to connect with your senses, practice kindness toward yourself, and nurture your inner child. It is a sign of abundance, showing that what you plant now is growing beautifully."
    }
};

tarotCards.forEach(cardWrapper => {
    cardWrapper.addEventListener('click', () => {
        const cardKey = cardWrapper.getAttribute('data-card');
        const reading = tarotReadings[cardKey];

        if (!reading) return;

        // If card is already flipped, we flip it back
        if (cardWrapper.classList.contains('flipped')) {
            cardWrapper.classList.remove('flipped');
            gsap.to(tarotReveal, { opacity: 0, y: 15, duration: 0.4, onComplete: () => tarotReveal.classList.remove('show') });
            return;
        }

        // Unflip all cards first
        tarotCards.forEach(c => c.classList.remove('flipped'));

        // Flip this card
        cardWrapper.classList.add('flipped');

        // Populate and animate the reading box with a kinetic surprise pop
        readingTitle.textContent = reading.title;
        readingText.textContent = reading.text;
        
        tarotReveal.classList.add('show');
        gsap.killTweensOf(tarotReveal);
        gsap.fromTo(tarotReveal, 
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.4)' }
        );
        
        // Scroll slightly to the reading box so it's fully visible
        setTimeout(() => {
            tarotReveal.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
    });
});

// 4. GUIDED BREATHING EXERCISE (MINDFULNESS CIRCLE)
const breathingCircle = document.getElementById('breathingCircle');
const breathingInstruction = document.getElementById('breathingInstruction');
const breathingTimer = document.getElementById('breathingTimer');
const toggleBreathingBtn = document.getElementById('toggleBreathing');
const breathingWrapper = document.querySelector('.breathing-guide-wrapper');

let breathingActive = false;
let breathingTimeline = null;
let countdownInterval = null;

if (toggleBreathingBtn && breathingCircle && breathingInstruction && breathingTimer && breathingWrapper) {
    toggleBreathingBtn.addEventListener('click', () => {
        if (!breathingActive) {
            startBreathingExercise();
        } else {
            stopBreathingExercise();
        }
    });
}

function startBreathingExercise() {
    breathingActive = true;
    breathingWrapper.classList.add('active');
    toggleBreathingBtn.textContent = "Stop Exercise";
    
    // Create the repeating GSAP breathing timeline (Inhale 4s, Hold 7s, Exhale 8s)
    breathingTimeline = gsap.timeline({ repeat: -1 });

    breathingTimeline
        // Stage 1: Inhale (4 seconds)
        .to(breathingCircle, {
            scale: 1.8,
            duration: 4,
            ease: 'sine.inOut',
            onStart: () => {
                breathingInstruction.textContent = "Inhale Deeply...";
                startCountdown(4);
            }
        })
        // Stage 2: Hold (7 seconds)
        .to(breathingCircle, {
            scale: 1.8, // Hold scale
            duration: 7,
            onStart: () => {
                breathingInstruction.textContent = "Hold your Breath...";
                startCountdown(7);
            }
        })
        // Stage 3: Exhale (8 seconds)
        .to(breathingCircle, {
            scale: 1.0,
            duration: 8,
            ease: 'sine.inOut',
            onStart: () => {
                breathingInstruction.textContent = "Exhale slowly...";
                startCountdown(8);
            }
        });
}

function stopBreathingExercise() {
    breathingActive = false;
    breathingWrapper.classList.remove('active');
    toggleBreathingBtn.textContent = "Start Breathing";
    
    if (breathingTimeline) {
        breathingTimeline.kill();
    }
    clearInterval(countdownInterval);
    
    // Reset visual elements
    gsap.to(breathingCircle, { scale: 1, duration: 0.8, ease: 'power3.out' });
    breathingInstruction.textContent = "Breathe & Center";
    breathingTimer.textContent = "Press Start";
}

function startCountdown(seconds) {
    clearInterval(countdownInterval);
    let count = seconds;
    breathingTimer.textContent = `${count} seconds remaining`;
    
    countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            breathingTimer.textContent = `${count} seconds remaining`;
        } else {
            clearInterval(countdownInterval);
        }
    }, 1000);
}

// 5. MOUSE DYNAMIC FLOATING DECORS (SURPRISE REACTION ON MOUSE MOVE)
if (window.innerWidth > 768) {
    const floatContainer = document.querySelector('.approach-floating');
    if (floatContainer) {
        window.addEventListener('mousemove', (e) => {
            const rx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            const ry = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
            
            gsap.to('.float-1', { x: rx * 45, y: ry * 45, duration: 1.2, ease: 'power2.out' });
            gsap.to('.float-2', { x: -rx * 30, y: -ry * 30, duration: 1.2, ease: 'power2.out' });
            gsap.to('.float-3', { x: rx * 20, y: -ry * 20, duration: 1.2, ease: 'power2.out' });
        });
    }
}

// ========== REFRESH ON LOAD ==========
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});
