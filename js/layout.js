/**
 * Injects shared navigation and footer from SITE_CONFIG.
 * Call initLayout() on every page after config.js loads.
 */
function initLayout() {
    const root = typeof siteRoot === 'function' ? siteRoot() : '';
    const cfg = SITE_CONFIG;
    const waUrl = buildWhatsAppUrl();

    const navMount = document.getElementById('site-nav');
    const footerMount = document.getElementById('site-footer');
    const cursorMount = document.getElementById('site-cursor');

    if (cursorMount) {
        cursorMount.innerHTML = `
            <div class="cursor" id="cursor"></div>
            <div class="cursor-follower" id="cursorFollower"></div>
        `;
    }

    if (navMount) {
        navMount.innerHTML = `
            <nav class="navbar" id="navbar">
                <div class="nav-container">
                    <a href="${root}index.html" class="nav-logo">
                        <span class="logo-text">${cfg.doctor.name}</span>
                    </a>
                    <ul class="nav-links" id="navLinks">
                        <li><a href="${root}about.html" class="hover-text" data-text="About">About</a></li>
                        <li class="nav-dropdown">
                            <a href="${root}services.html" class="hover-text" data-text="Services">Services</a>
                            <ul class="dropdown-menu">
                                ${Object.values(cfg.services).map(s =>
                                    `<li><a href="${root}services/${s.slug}.html">${s.name}</a></li>`
                                ).join('')}
                            </ul>
                        </li>
                        <li><a href="${root}parents.html" class="hover-text" data-text="For Parents">For Parents</a></li>
                        <li><a href="${root}resources.html" class="hover-text" data-text="Resources">Resources</a></li>
                        <li><a href="${root}journal/index.html" class="hover-text" data-text="Journal">Journal</a></li>
                        <li><a href="${root}contact.html" class="nav-cta">Book a Session</a></li>
                    </ul>
                    <button class="hamburger" id="hamburger" aria-label="Toggle menu">
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </nav>
            <div class="mobile-menu" id="mobileMenu">
                <div class="mobile-menu-content">
                    <ul class="mobile-nav-links">
                        <li><a href="${root}about.html">About</a></li>
                        <li><a href="${root}services.html">Services</a></li>
                        <li><a href="${root}first-session.html">Your First Session</a></li>
                        <li><a href="${root}parents.html">For Parents</a></li>
                        <li><a href="${root}resources.html">Resources</a></li>
                        <li><a href="${root}journal/index.html">Journal</a></li>
                        <li><a href="${root}contact.html">Contact</a></li>
                    </ul>
                </div>
            </div>
        `;
    }

    if (footerMount) {
        const statsHtml = cfg.stats.yearsExperience
            ? `<li>${cfg.stats.yearsExperience}+ years of experience</li>`
            : '';

        footerMount.innerHTML = `
            <footer class="footer">
                <div class="container">
                    <div class="footer-grid">
                        <div class="footer-brand">
                            <span class="logo-text">${cfg.doctor.name}</span>
                            <p>Holistic healing for mind, body, and spirit. Your journey to wellness begins here.</p>
                        </div>
                        <div class="footer-links">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a href="${root}about.html">About</a></li>
                                <li><a href="${root}services.html">Services</a></li>
                                <li><a href="${root}first-session.html">Your First Session</a></li>
                                <li><a href="${root}parents.html">For Parents</a></li>
                                <li><a href="${root}resources.html">Resources</a></li>
                                <li><a href="${root}journal/index.html">Journal</a></li>
                                <li><a href="${root}contact.html">Contact</a></li>
                            </ul>
                        </div>
                        <div class="footer-links">
                            <h4>Services</h4>
                            <ul>
                                ${Object.values(cfg.services).map(s =>
                                    `<li><a href="${root}services/${s.slug}.html">${s.name}</a></li>`
                                ).join('')}
                            </ul>
                        </div>
                        <div class="footer-links">
                            <h4>Contact</h4>
                            <ul>
                                <li><a href="mailto:${cfg.contact.email}">${cfg.contact.email}</a></li>
                                <li>${cfg.contact.phone}</li>
                                <li>${cfg.contact.location}</li>
                                ${statsHtml}
                            </ul>
                        </div>
                    </div>
                    <div class="crisis-bar">
                        <p><strong>This website is not for emergencies.</strong> If you or someone you know is in crisis, please contact:
                        ${cfg.helplines.map(h => `${h.name}: ${h.number}`).join(' · ')}</p>
                    </div>
                    <div class="footer-bottom">
                        <p>&copy; ${new Date().getFullYear()} ${cfg.doctor.name}. All rights reserved.</p>
                    </div>
                </div>
            </footer>
            <a href="${waUrl}" class="whatsapp-float" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
        `;
    }
}
