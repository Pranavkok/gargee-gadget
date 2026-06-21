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
    // Inject label inside cursor
    cursor.innerHTML = '<span class="cursor-label" id="cursorLabel"></span>';
    const cursorLabel = document.getElementById('cursorLabel');

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
        
        // Offset based on cursor dimensions (changes when expanded)
        const isExpanded = cursor.classList.contains('play') || cursor.classList.contains('choose');
        const cOffset = isExpanded ? 32 : 4;
        
        gsap.set(cursor, { x: cursorX - cOffset, y: cursorY - cOffset });
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

    // Special Hover States
    document.querySelectorAll('.tarot-card-wrapper').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('choose');
            if (cursorLabel) cursorLabel.textContent = 'Flip';
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('choose');
            if (cursorLabel) cursorLabel.textContent = '';
        });
    });

    document.querySelectorAll('.media-placeholder, .media-play-btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('play');
            if (cursorLabel) cursorLabel.textContent = 'Play';
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('play');
            if (cursorLabel) cursorLabel.textContent = '';
        });
    });
}

// ========== NAVBAR ==========
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

if (hamburger && mobileMenu) {
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
}

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

if (document.querySelector('.hero-title')) {
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
    .from('.hero-meditating-art', { scale: 0.8, opacity: 0, duration: 1.5, ease: 'power3.out' }, 0.2)
    .from('.affirmation-container', { y: 30, opacity: 0, duration: 0.8 }, '-=0.4');

} // end hero animations

if (document.querySelector('.hero')) {

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

} // end hero parallax

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
    ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
            gsap.to(words, {
                y: 0,
                duration: 1.0,
                stagger: 0.07,
                ease: 'back.out(2)',
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
if (whatsappFloat) {
    gsap.set(whatsappFloat, { scale: 0, opacity: 0 });
    const waTrigger = document.querySelector('.about') || document.querySelector('.hero');
    if (waTrigger) {
        ScrollTrigger.create({
            trigger: waTrigger,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.to(whatsappFloat, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' });
            },
        });
    } else {
        gsap.set(whatsappFloat, { scale: 1, opacity: 1 });
    }
}

// Contact form handled in contact-form.js on contact page

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

// 1. DYNAMIC BACKGROUND THEME SWAPPER (ScrollTrigger Mood Shift) & SERVICE VISUALS
const sections = [
    { id: 'hero', theme: 'theme-lavender' },
    { id: 'about', theme: 'theme-lavender' },
    { id: 'steps', theme: 'theme-lavender' },
    { id: 'services', theme: 'theme-lavender' },
    { id: 'service-tarot-reading', theme: 'theme-midnight' },
    { id: 'service-child-healing', theme: 'theme-lavender' },
    { id: 'service-trauma-healing', theme: 'theme-dusk' },
    { id: 'service-parenting-guidance', theme: 'theme-lavender' },
    { id: 'service-career-counselling', theme: 'theme-lavender' },
    { id: 'service-holistic-wellness', theme: 'theme-sage' },
    { id: 'approach', theme: 'theme-sage' },
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

// 1b. ScrollTrigger animations for upscaled service section visuals
if (document.getElementById('service-child-healing')) {
    ScrollTrigger.create({
        trigger: '#service-child-healing',
        start: 'top 60%',
        once: true,
        onEnter: () => {
            gsap.to('#service-child-healing .speech-bubble', {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'back.out(1.5)',
            });
        }
    });
}

if (document.getElementById('service-trauma-healing')) {
    ScrollTrigger.create({
        trigger: '#service-trauma-healing',
        start: 'top 60%',
        once: true,
        onEnter: () => {
            gsap.timeline()
                .to('#service-trauma-healing .heart-main', { fill: '#e07090', scale: 1.1, duration: 0.5, yoyo: true, repeat: 1 })
                .to('#service-trauma-healing .heart-crack', { strokeDashoffset: 60, opacity: 0, duration: 0.6 }, 0)
                .to('#service-trauma-healing .heart-glow-path', { stroke: 'rgba(212, 168, 67, 0.6)', strokeDashoffset: 0, duration: 0.8 }, 0.2)
                .to('#service-trauma-healing .heart-label', { opacity: 1, duration: 0.4 }, 0.4);
        }
    });
}

if (document.getElementById('service-parenting-guidance')) {
    ScrollTrigger.create({
        trigger: '#service-parenting-guidance',
        start: 'top 60%',
        once: true,
        onEnter: () => {
            gsap.timeline()
                .to('#service-parenting-guidance .book-page', { rotate: -6, duration: 0.6 })
                .to('#service-parenting-guidance .right-page', { rotate: 6, duration: 0.6 }, 0)
                .to('#service-parenting-guidance .page-line', {
                    scaleX: 1,
                    duration: 0.4,
                    stagger: 0.08
                }, 0.2);
        }
    });
}

if (document.getElementById('service-career-counselling')) {
    ScrollTrigger.create({
        trigger: '#service-career-counselling',
        start: 'top 60%',
        once: true,
        onEnter: () => {
            gsap.to('#service-career-counselling .compass-needle-group', {
                rotation: 360,
                duration: 1.2,
                ease: 'back.out(1.5)'
            });
        }
    });
}

if (document.getElementById('service-holistic-wellness')) {
    ScrollTrigger.create({
        trigger: '#service-holistic-wellness',
        start: 'top 60%',
        once: true,
        onEnter: () => {
            gsap.timeline()
                .to('#service-holistic-wellness .venn-mind', { left: 50, duration: 0.8 })
                .to('#service-holistic-wellness .venn-spirit', { right: 50, duration: 0.8 }, 0)
                .to('#service-holistic-wellness .circle-label', { opacity: 1, duration: 0.4 }, 0.4)
                .to('#service-holistic-wellness .venn-center-glow', { opacity: 1, width: 70, height: 70, duration: 0.6 }, 0.4)
                .to('#service-holistic-wellness .venn-center-text', { opacity: 1, duration: 0.4 }, 0.6);
        }
    });
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

// 3. TAROT CARD INTERACTION
const tarotCards = document.querySelectorAll('.tarot-card-wrapper');
const tarotReveal = document.getElementById('tarotReveal');
const readingTitle = document.getElementById('readingTitle');
const readingText = document.getElementById('readingText');

const tarotReadings = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG.tarotCards : {
    star: { title: "The Star — Hope & Healing", text: "...", prompt: "" },
    sun: { title: "The Sun — Clarity & Vitality", text: "...", prompt: "" },
    empress: { title: "The Empress — Nurturing & Abundance", text: "...", prompt: "" },
};

tarotCards.forEach((cardWrapper) => {
    cardWrapper.addEventListener('click', () => {
        const cardKey = cardWrapper.getAttribute('data-card');
        const reading = tarotReadings[cardKey];
        if (!reading) return;

        // Toggle flip
        cardWrapper.classList.toggle('flipped');

        // Show reading if flipped
        if (cardWrapper.classList.contains('flipped')) {
            if (readingTitle) readingTitle.textContent = reading.title;
            if (readingText) readingText.textContent = reading.text;

            const promptEl = document.getElementById('tarotJournalPrompt');
            const promptText = document.getElementById('tarotPromptText');
            if (promptEl && promptText && reading.prompt) {
                promptText.textContent = reading.prompt;
                promptEl.style.display = 'block';
            }

            if (tarotReveal) {
                tarotReveal.classList.add('show');
            }
        } else {
            if (tarotReveal) {
                tarotReveal.classList.remove('show');
            }
        }
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

// ========== HORIZONTAL STEPS SCROLL ==========
(function initStepsScroll() {
    const stepsGrid = document.getElementById('stepsGrid');
    const indicators = document.getElementById('stepsIndicators');
    
    if (!stepsGrid || !indicators) return;

    const stepCards = stepsGrid.querySelectorAll('.step-card');
    const indicatorDots = indicators.querySelectorAll('.step-indicator');

    // Update active indicator on scroll
    stepsGrid.addEventListener('scroll', () => {
        const scrollLeft = stepsGrid.scrollLeft;
        const cardWidth = stepCards[0].offsetWidth;
        const gap = 24;
        const activeIndex = Math.round(scrollLeft / (cardWidth + gap));
        
        indicatorDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    });

    // Click on indicator to scroll to that step
    indicatorDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const cardWidth = stepCards[0].offsetWidth;
            const gap = 24;
            const scrollPosition = index * (cardWidth + gap);
            
            stepsGrid.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        });
    });
})();

