/**
 * Populates service detail pages from SITE_CONFIG.
 * Page must have: data-service="slug" on body or #servicePageRoot
 */
(function () {
    // Dictionary of interactive visual showcase HTML for each service.
    // Uses relative paths (../img/...) since detail pages reside in /services/ subfolder.
    const serviceVisuals = {
        'tarot-reading': `
            <div class="service-detail-visual reveal-up" style="margin-bottom: 40px; width: 100%;">
                <div class="tarot-interactive-box" style="margin: 0 auto;">
                    <p class="tarot-hint">✦ Focus on a question, then select a card to reveal its reflection</p>
                    <div class="tarot-cards-container" style="height: 230px;">
                        <!-- Card 1: The Star -->
                        <div class="tarot-card-wrapper" data-card="star">
                            <div class="tarot-card magnetic">
                                <div class="tarot-card-inner">
                                    <div class="tarot-card-front">
                                        <img src="../img/tarot_card_back.png" alt="Tarot Card Back">
                                    </div>
                                    <div class="tarot-card-back">
                                        <img src="../img/tarot_star.png" alt="The Star">
                                    </div>
                                </div>
                            </div>
                            <span class="card-hint">The Star</span>
                        </div>

                        <!-- Card 2: The Sun -->
                        <div class="tarot-card-wrapper" data-card="sun">
                            <div class="tarot-card magnetic">
                                <div class="tarot-card-inner">
                                    <div class="tarot-card-front">
                                        <img src="../img/tarot_card_back.png" alt="Tarot Card Back">
                                    </div>
                                    <div class="tarot-card-back">
                                        <img src="../img/tarot_sun.png" alt="The Sun">
                                    </div>
                                </div>
                            </div>
                            <span class="card-hint">The Sun</span>
                        </div>

                        <!-- Card 3: The Empress -->
                        <div class="tarot-card-wrapper" data-card="empress">
                            <div class="tarot-card magnetic">
                                <div class="tarot-card-inner">
                                    <div class="tarot-card-front">
                                        <img src="../img/tarot_card_back.png" alt="Tarot Card Back">
                                    </div>
                                    <div class="tarot-card-back">
                                        <img src="../img/tarot_empress.png" alt="The Empress">
                                    </div>
                                </div>
                            </div>
                            <span class="card-hint">The Empress</span>
                        </div>
                    </div>

                    <!-- Reading Reveal Area -->
                    <div class="tarot-reading-reveal" id="tarotReveal">
                        <div class="reading-content-box">
                            <h3 class="reading-card-title" id="readingTitle">Choose a card to begin your reading</h3>
                            <p class="reading-card-text" id="readingText">Take a deep breath. Hold a question in your mind. Choose the card you feel drawn to.</p>
                        </div>
                        <div class="tarot-journal-prompt" id="tarotJournalPrompt" style="display:none; margin-top:16px;">
                            <label for="tarotJournal" style="font-size:0.85rem;font-weight:600;display:block;margin-bottom:6px;">Reflection prompt:</label>
                            <p id="tarotPromptText" style="color:var(--text-light);margin-bottom:8px;font-style:italic;font-size:0.9rem;"></p>
                            <textarea id="tarotJournal" placeholder="Write your thoughts here (saved locally in your browser)..." style="width:100%;height:80px;padding:10px;font-size:0.9rem;border-radius:6px;"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        `,
        'child-healing': `
            <div class="service-detail-visual reveal-up" style="margin-bottom: 40px; width: 100%;">
                <div class="child-scene-wrapper upscaled" style="margin: 0 auto;">
                    <img class="child-scene-img" src="../img/service_child_healing_scene.png" alt="A warm counseling scene between a therapist and a child">
                    <div class="speech-bubble bubble-counselor">"Let's explore this together, at your pace."</div>
                    <div class="speech-bubble bubble-child">"I feel safe here."</div>
                </div>
                <div class="child-emotion-selector" style="margin-top: 20px; display: flex; gap: 8px; justify-content: center; width: 100%; flex-wrap: wrap;">
                    <button class="emotion-badge-btn active" data-emotion="explore">Explore 🌱</button>
                    <button class="emotion-badge-btn" data-emotion="anxious">Anxious 🌧️</button>
                    <button class="emotion-badge-btn" data-emotion="angry">Angry ⚡</button>
                    <button class="emotion-badge-btn" data-emotion="sad">Sad 💧</button>
                </div>
            </div>
        `,
        'trauma-healing': `
            <div class="service-detail-visual reveal-up" style="margin-bottom: 40px; width: 100%;">
                <div class="heart-stage upscaled" style="margin: 0 auto; cursor: pointer;">
                    <div class="heart-svg-wrap">
                        <svg viewBox="0 0 130 120" width="160" height="150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path class="heart-main" d="M65 105 C65 105 15 72 15 42 C15 24 28 12 42 12 C52 12 60 18 65 25 C70 18 78 12 88 12 C102 12 115 24 115 42 C115 72 65 105 65 105Z"/>
                            <path class="heart-crack" d="M60 30 L68 45 L58 55 L66 70 L60 82"/>
                            <path class="heart-glow-path" d="M55 28 C60 36 70 42 62 56 C56 65 65 75 62 85"/>
                        </svg>
                        <span class="heart-label">Healing begins here</span>
                    </div>
                </div>
            </div>
        `,
        'parenting-guidance': `
            <div class="service-detail-visual reveal-up" style="margin-bottom: 40px; width: 100%;">
                <div class="book-stage upscaled" style="cursor: pointer; margin: 0 auto;" id="wisdomBook">
                    <div class="book-wrap" aria-hidden="true">
                        <div class="book-page left-page">
                            <div class="book-page-content" id="bookLeftText">
                                <strong>Co-regulation</strong>
                                <p>Calm is contagious. Share your calm, don't join their chaos.</p>
                            </div>
                            <span class="page-icon">🌱</span>
                        </div>
                        <div class="book-spine"></div>
                        <div class="book-page right-page">
                            <div class="book-page-content" id="bookRightText">
                                <strong>Connection First</strong>
                                <p>Seek understanding first. Listen to the feeling behind the behavior.</p>
                            </div>
                            <span class="page-icon">🤝</span>
                        </div>
                    </div>
                    <p class="book-hint" style="position: absolute; bottom: 12px; font-size: 0.8rem; opacity: 0.7; font-style: italic; margin: 0; color: var(--text-light);">✦ Click book to flip parenting insights</p>
                </div>
            </div>
        `,
        'career-counselling': `
            <div class="service-detail-visual reveal-up" style="margin-bottom: 40px; width: 100%;">
                <div class="compass-stage upscaled" style="margin: 0 auto;">
                    <div class="compass-wrap" aria-hidden="true">
                        <div class="compass-ring">
                            <div class="compass-directions">
                                <span class="compass-dir north">▲</span>
                                <span class="compass-dir south">S</span>
                                <span class="compass-dir east">E</span>
                                <span class="compass-dir west">W</span>
                            </div>
                            <div class="compass-needle-group">
                                <div class="compass-needle">
                                    <div class="needle-n"></div>
                                    <div class="needle-s"></div>
                                </div>
                                <div class="compass-center-dot"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        'holistic-wellness': `
            <div class="service-detail-visual reveal-up" style="margin-bottom: 40px; width: 100%;">
                <div class="venn-stage upscaled" style="cursor: pointer; margin: 0 auto;">
                    <div class="venn-wrap" aria-hidden="true">
                        <div class="venn-circle venn-mind" data-venn="mind"><span class="circle-label">Mind</span></div>
                        <div class="venn-circle venn-body" data-venn="body"><span class="circle-label">Body</span></div>
                        <div class="venn-circle venn-spirit" data-venn="spirit"><span class="circle-label">Spirit</span></div>
                        <div class="venn-center-glow" data-venn="center"></div>
                        <div class="venn-center-text" data-venn="center"><span>Whole</span><span>Being</span></div>
                    </div>
                </div>
                <div class="venn-details-box" id="vennDetails" style="margin: 20px auto 0;">
                    ✦ Hover or tap Mind, Body, or Spirit circles to see integration.
                </div>
            </div>
        `
    };

    const serviceThemes = {
        'tarot-reading': 'theme-midnight',
        'child-healing': 'theme-lavender',
        'trauma-healing': 'theme-dusk',
        'parenting-guidance': 'theme-lavender',
        'career-counselling': 'theme-lavender',
        'holistic-wellness': 'theme-sage'
    };

    function animateEntrance(slug) {
        if (typeof gsap === 'undefined') return;

        if (slug === 'tarot-reading') {
            gsap.from('#servicePageRoot .tarot-card-wrapper', {
                opacity: 0,
                y: 60,
                rotate: () => gsap.utils.random(-8, 8),
                duration: 0.8,
                stagger: 0.15,
                ease: 'back.out(1.5)'
            });
        } else if (slug === 'child-healing') {
            gsap.from('#servicePageRoot .bubble-counselor, #servicePageRoot .bubble-child', {
                opacity: 0,
                scale: 0.6,
                y: 20,
                duration: 0.8,
                delay: 0.3,
                stagger: 0.2,
                ease: 'back.out(1.5)'
            });
        } else if (slug === 'trauma-healing') {
            gsap.from('#servicePageRoot .heart-main', {
                scale: 0,
                opacity: 0,
                duration: 1,
                ease: 'elastic.out(1, 0.5)'
            });
            gsap.from('#servicePageRoot .heart-crack', {
                opacity: 0,
                duration: 0.8,
                delay: 0.5
            });
        } else if (slug === 'parenting-guidance') {
            gsap.from('#servicePageRoot .book-page', {
                rotateY: 90,
                duration: 0.8,
                ease: 'power2.out'
            });
        } else if (slug === 'career-counselling') {
            gsap.from('#servicePageRoot .compass-needle-group', {
                rotation: 360,
                duration: 1.2,
                ease: 'back.out(1.5)',
                delay: 0.2
            });
        } else if (slug === 'holistic-wellness') {
            gsap.timeline()
                .from('#servicePageRoot .venn-mind', { x: -50, opacity: 0, duration: 0.8 })
                .from('#servicePageRoot .venn-spirit', { x: 50, opacity: 0, duration: 0.8 }, 0)
                .from('#servicePageRoot .venn-body', { y: 50, opacity: 0, duration: 0.8 }, 0.2)
                .from('#servicePageRoot .venn-center-glow', { opacity: 0, scale: 0.5, duration: 0.6 }, 0.4)
                .from('#servicePageRoot .venn-center-text', { opacity: 0, duration: 0.4 }, 0.6);
        }
    }

    function initServicePage() {
        const root = document.getElementById('servicePageRoot');
        if (!root) return;

        const slug = document.body.dataset.service || root.dataset.service;
        const service = getService(slug);
        if (!service) {
            root.innerHTML = '<p>Service not found.</p>';
            return;
        }

        const prefix = siteRoot();
        document.title = `${service.name} — ${SITE_CONFIG.doctor.name}`;

        // Set body theme color class dynamically
        const themeClass = serviceThemes[slug] || 'theme-lavender';
        document.body.className = themeClass;

        const visualHtml = serviceVisuals[slug] || '';

        root.innerHTML = `
            <section class="page-hero compact">
                <div class="container">
                    <span class="section-label reveal-text">Service</span>
                    <h1 class="section-title split-words">${service.name}</h1>
                    <p class="section-subtitle reveal-up">${service.headline}</p>
                </div>
            </section>

            <section class="section">
                <div class="container">
                    <div class="two-col-grid">
                        <div class="content-block">
                            <!-- Immersive Visual Showcase -->
                            ${visualHtml}

                            <h3>About this service</h3>
                            <p>${service.description}</p>

                            <h3>Who is this for?</h3>
                            <ul class="content-list">
                                ${service.forWho.map(item => `<li>${item}</li>`).join('')}
                            </ul>

                            <h3>Your first session</h3>
                            <p>${service.sessionOne}</p>

                            <h3>What follows</h3>
                            <p>${service.sessionFlow}</p>

                            <div class="content-callout">
                                <p><strong>Important:</strong> ${service.isNot}</p>
                            </div>
                        </div>
                        <div>
                            <div class="service-sidebar-card" style="background:var(--white);padding:32px;border-radius:var(--radius);box-shadow:var(--shadow);position:sticky;top:100px;">
                                <h3 style="font-family:var(--font-heading);margin-bottom:20px;">Session details</h3>
                                <p style="margin-bottom:12px;color:var(--text-light);"><strong>Format:</strong> ${service.format} <span class="tbc-badge">TBC</span></p>
                                <p style="margin-bottom:12px;color:var(--text-light);"><strong>Duration:</strong> ${service.duration}</p>
                                <p style="margin-bottom:24px;color:var(--text-light);"><strong>Location:</strong> ${SITE_CONFIG.contact.location}</p>
                                <a href="${prefix}contact.html?service=${service.slug}" class="btn btn-primary btn-full magnetic" style="width:100%;justify-content:center;margin-bottom:12px;">Book This Service</a>
                                <a href="${buildWhatsAppUrl(`Hi ${SITE_CONFIG.doctor.shortName}, I am interested in ${service.name}.`)}" class="btn btn-secondary btn-full" style="width:100%;justify-content:center;" target="_blank" rel="noopener">WhatsApp</a>
                                <p style="margin-top:20px;font-size:0.85rem;color:var(--text-light);">Payment via UPI after booking confirmation. <a href="${prefix}contact.html#payment" style="color:var(--secondary);">See payment info</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Run animations after inserting HTML
        setTimeout(() => animateEntrance(slug), 50);
    }

    // Initialize immediately so elements are in DOM when main.js executes
    initServicePage();
})();
