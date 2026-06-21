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
if (window.innerWidth <= 768) {
    batchReveal('.step-card', { opacity: 0, y: 80, scale: 0.85, rotate: -2 }, { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 1.1, ease: 'back.out(1.4)', stagger: 0.15 });
}
batchReveal('.service-card', { opacity: 0, y: 80, scale: 0.85, rotate: 2 }, { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 1.1, ease: 'back.out(1.4)', stagger: 0.12 });
batchReveal('.testimonial-card', { opacity: 0, y: 60, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'back.out(1.2)', stagger: 0.15 });
batchReveal('.tarot-card-wrapper', { opacity: 0, y: 100, scale: 0.8, rotate: () => gsap.utils.random(-8, 8) }, { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 1.3, ease: 'back.out(1.6)', stagger: 0.18 });

// ========== DESKTOP STEPS PINNING STACK (DESKTOP) ==========
if (window.innerWidth > 768) {
    const stepsSection = document.getElementById('steps');
    const stepsStack = document.getElementById('stepsStack');
    if (stepsSection && stepsStack) {
        const cards = gsap.utils.toArray('#stepsStack .step-card');
        
        // Setup initial absolute stack coordinates
        gsap.set(cards[0], { opacity: 1, y: 0, scale: 1, zIndex: 10 });
        gsap.set(cards.slice(1), { opacity: 0, y: 150, scale: 0.9, zIndex: (i) => 11 + i });
        
        const stepsTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#steps',
                id: 'stepsScrollTrigger',
                start: 'top top',
                end: '+=1500', // scroll height for pinning
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    let activeIndex = 0;
                    if (progress > 0.66) {
                        activeIndex = 2;
                    } else if (progress > 0.33) {
                        activeIndex = 1;
                    } else {
                        activeIndex = 0;
                    }
                    
                    const indicatorDots = document.querySelectorAll('#stepsIndicators .step-indicator');
                    indicatorDots.forEach((dot, index) => {
                        dot.classList.toggle('active', index === activeIndex);
                    });
                }
            }
        });
        
        // Card 1 slides up and overlays Card 0; Card 0 shrinks and fades
        stepsTl.to(cards[0], { scale: 0.95, opacity: 0.4, y: -20, duration: 1 })
               .to(cards[1], { opacity: 1, y: 0, scale: 1, duration: 1 }, '<')
               
               // Card 2 slides up and overlays Card 1; Card 1 shrinks/fades, Card 0 shrinks/fades more
               .to(cards[1], { scale: 0.95, opacity: 0.4, y: -20, duration: 1 })
               .to(cards[0], { scale: 0.9, opacity: 0.1, y: -40, duration: 1 }, '<')
               .to(cards[2], { opacity: 1, y: 0, scale: 1, duration: 1 }, '<');
    }
}

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
    cardWrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        const container = cardWrapper.closest('.tarot-cards-container');
        const cardKey = cardWrapper.getAttribute('data-card');
        const reading = tarotReadings[cardKey];
        if (!reading) return;

        // Toggle flip / select
        if (cardWrapper.classList.contains('selected')) {
            cardWrapper.classList.remove('selected', 'flipped');
            container.classList.remove('has-selected');
            if (tarotReveal) tarotReveal.classList.remove('show');
        } else {
            // Remove previous selections
            container.querySelectorAll('.tarot-card-wrapper').forEach(cw => {
                cw.classList.remove('selected', 'flipped');
            });
            cardWrapper.classList.add('selected');
            container.classList.add('has-selected');
            
            // Flip card after brief delay for sliding animation
            setTimeout(() => {
                cardWrapper.classList.add('flipped');
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
            }, 300);
        }
    });
});

// Click outside to reset tarot selection
document.addEventListener('click', (e) => {
    const activeContainer = document.querySelector('.tarot-cards-container.has-selected');
    if (activeContainer && !e.target.closest('.tarot-interactive-box')) {
        activeContainer.querySelectorAll('.tarot-card-wrapper').forEach(cw => {
            cw.classList.remove('selected', 'flipped');
        });
        activeContainer.classList.remove('has-selected');
        if (tarotReveal) tarotReveal.classList.remove('show');
    }
});

// 3b. CHILD HEALING EMOTION BADGES INTERACTION
const emotionBtns = document.querySelectorAll('.emotion-badge-btn');
const counselorBubble = document.querySelector('.bubble-counselor');
const childBubble = document.querySelector('.bubble-child');

const childEmotions = {
    explore: {
        child: "I feel safe here.",
        counselor: "Let's explore this together, at your pace."
    },
    anxious: {
        child: "I'm scared of making mistakes...",
        counselor: "It's okay to make mistakes. We learn and grow from them together."
    },
    angry: {
        child: "I just want to break everything!",
        counselor: "It's okay to feel angry. Let's find a safe way to release that energy."
    },
    sad: {
        child: "Everything feels heavy today...",
        counselor: "I hear you. Let's sit together. You don't have to carry it alone."
    }
};

emotionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const emotion = btn.getAttribute('data-emotion');
        const dialog = childEmotions[emotion];
        if (!dialog) return;

        emotionBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        gsap.timeline()
            .to([counselorBubble, childBubble], { opacity: 0, scale: 0.8, y: 10, duration: 0.2, stagger: 0.04 })
            .call(() => {
                childBubble.textContent = `"${dialog.child}"`;
                counselorBubble.textContent = `"${dialog.counselor}"`;
            })
            .to([counselorBubble, childBubble], { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(1.4)', stagger: 0.12 });
    });
});

// 3c. TRAUMA HEALING INTERACTIVE HEART
const heartStage = document.querySelector('.heart-stage');
const heartWrap = document.querySelector('.heart-svg-wrap');
const heartCrack = document.querySelector('.heart-crack');
const heartGlow = document.querySelector('.heart-glow-path');

if (heartStage && heartWrap) {
    heartWrap.style.cursor = 'pointer';
    heartWrap.addEventListener('click', () => {
        const ripple = document.createElement('div');
        ripple.className = 'heart-ripple';
        heartWrap.appendChild(ripple);
        
        gsap.timeline()
            .to('.heart-main', { scale: 1.15, fill: '#ff8da9', duration: 0.12, yoyo: true, repeat: 1, transformOrigin: 'center center' })
            .to(heartCrack, { opacity: 0, duration: 0.25 }, 0)
            .to(heartGlow, { strokeDashoffset: 0, stroke: '#D4A843', duration: 0.5 }, 0.1);
            
        gsap.fromTo(ripple, 
            { width: 30, height: 30, opacity: 0.8, xPercent: -50, yPercent: -50, left: '50%', top: '50%', position: 'absolute', borderRadius: '50%', border: '2px solid #D4A843' },
            { width: 260, height: 260, opacity: 0, duration: 1.1, ease: 'power2.out', onComplete: () => ripple.remove() }
        );
    });
}

// 3d. PARENTING GUIDANCE INTERACTIVE BOOK PAGES
const wisdomBook = document.getElementById('wisdomBook');
const bookLeftText = document.getElementById('bookLeftText');
const bookRightText = document.getElementById('bookRightText');

const bookPages = [
    {
        left: { title: "Co-regulation", text: "Calm is contagious. Share your calm, don't join their chaos." },
        right: { title: "Connection First", text: "Seek understanding first. Listen to the feeling behind the behavior." }
    },
    {
        left: { title: "Healthy Boundaries", text: "Clear limits provide safety. Say what you mean, with compassion." },
        right: { title: "Active Listening", text: "Validate their emotions before rushing to offer solutions." }
    },
    {
        left: { title: "Emotional Repair", text: "Apologize when you make mistakes. It teaches accountability." },
        right: { title: "Emotional Safety", text: "Let them feel all emotions, while guiding their behavior." }
    }
];

let currentBookPage = 0;

if (wisdomBook && bookLeftText && bookRightText) {
    wisdomBook.addEventListener('click', () => {
        const leftPage = wisdomBook.querySelector('.left-page');
        const rightPage = wisdomBook.querySelector('.right-page');
        
        gsap.timeline()
            .to(leftPage, { rotateY: 90, duration: 0.25, ease: 'power2.in' })
            .to(rightPage, { rotateY: -90, duration: 0.25, ease: 'power2.in' }, 0)
            .call(() => {
                currentBookPage = (currentBookPage + 1) % bookPages.length;
                const pageData = bookPages[currentBookPage];
                bookLeftText.innerHTML = `<strong>${pageData.left.title}</strong><p>${pageData.left.text}</p>`;
                bookRightText.innerHTML = `<strong>${pageData.right.title}</strong><p>${pageData.right.text}</p>`;
            })
            .to(leftPage, { rotateY: -6, duration: 0.35, ease: 'power2.out' })
            .to(rightPage, { rotateY: 6, duration: 0.35, ease: 'power2.out' }, '-=0.08');
    });
}

// 3e. CAREER COUNSELLING COMPASS NEEDLE TRACKING
const compassStage = document.querySelector('.compass-stage');
const needleGroup = document.querySelector('.compass-needle-group');

if (compassStage && needleGroup) {
    compassStage.addEventListener('mousemove', (e) => {
        const rect = needleGroup.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const angleRad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        let angleDeg = angleRad * (180 / Math.PI) + 90;
        
        gsap.to(needleGroup, {
            rotation: angleDeg,
            duration: 0.25,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    });

    compassStage.addEventListener('mouseleave', () => {
        gsap.to(needleGroup, {
            rotation: 0,
            duration: 0.75,
            ease: 'elastic.out(1, 0.4)',
            overwrite: 'auto'
        });
    });

    compassStage.addEventListener('click', () => {
        gsap.to(needleGroup, {
            rotation: '+=720',
            duration: 1.1,
            ease: 'power3.out',
            overwrite: 'auto'
        });
    });
}

// 3f. HOLISTIC WELLNESS VENN DIAGRAM HOVER
const vennCircles = document.querySelectorAll('.venn-circle, .venn-center-text, .venn-center-glow');
const vennDetails = document.getElementById('vennDetails');

const vennData = {
    mind: "<strong>Mind</strong><br>Cultivating emotional resilience, clarity, and cognitive peace through mindfulness and tarot reflection.",
    body: "<strong>Body</strong><br>Releasing stored somatic tension, regulating the nervous system, and restoring physical vitality.",
    spirit: "<strong>Spirit</strong><br>Connecting to inner purpose, processing existential crossroads, and fostering profound self-realization.",
    center: "<strong>Whole Being (Integration)</strong><br>Where mind, body, and spirit align in perfect harmony to support sustainable, long-term healing."
};

vennCircles.forEach(circle => {
    circle.addEventListener('mouseenter', () => {
        const type = circle.getAttribute('data-venn');
        const text = vennData[type];
        if (!text || !vennDetails) return;
        
        gsap.to(vennDetails, {
            opacity: 0,
            y: 4,
            duration: 0.1,
            onComplete: () => {
                vennDetails.innerHTML = text;
                gsap.to(vennDetails, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' });
            }
        });
    });
});

const vennStage = document.querySelector('.venn-stage');
if (vennStage && vennDetails) {
    vennStage.addEventListener('mouseleave', () => {
        gsap.to(vennDetails, {
            opacity: 0,
            y: 4,
            duration: 0.1,
            onComplete: () => {
                vennDetails.innerHTML = "✦ Hover or tap Mind, Body, or Spirit circles to see integration.";
                gsap.to(vennDetails, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' });
            }
        });
    });
}

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

// ========== HORIZONTAL STEPS SCROLL & CLICK NAVIGATION ==========
(function initStepsScroll() {
    const stepsStack = document.getElementById('stepsStack');
    const indicators = document.getElementById('stepsIndicators');
    
    if (!stepsStack || !indicators) return;

    const stepCards = stepsStack.querySelectorAll('.step-card');
    const indicatorDots = indicators.querySelectorAll('.step-indicator');

    // Mobile scroll listener (horizontal swipe fallback)
    stepsStack.addEventListener('scroll', () => {
        if (window.innerWidth <= 768 && stepCards.length > 0) {
            const scrollLeft = stepsStack.scrollLeft;
            const cardWidth = stepCards[0].offsetWidth;
            const gap = 24;
            const activeIndex = Math.round(scrollLeft / (cardWidth + gap));
            
            indicatorDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        }
    });

    // Unified click handler on indicators
    indicatorDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (window.innerWidth > 768) {
                // Desktop: scroll the page to match active step in pin timeline
                const scrollTriggerInstance = ScrollTrigger.getById('stepsScrollTrigger');
                if (scrollTriggerInstance) {
                    const start = scrollTriggerInstance.start;
                    const end = scrollTriggerInstance.end;
                    // Scale scroll based on step index (0, 0.5, 1.0)
                    const targetScroll = start + (index / (stepCards.length - 1)) * (end - start);
                    window.scrollTo({
                        top: targetScroll,
                        behavior: 'smooth'
                    });
                }
            } else {
                // Mobile: scroll the horizontal container
                if (stepCards.length > 0) {
                    const cardWidth = stepCards[0].offsetWidth;
                    const gap = 24;
                    const scrollPosition = index * (cardWidth + gap);
                    
                    stepsStack.scrollTo({
                        left: scrollPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
})();

