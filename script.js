// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Clear dropdown state when mobile menu is toggled
        localStorage.removeItem('lastOpenDropdown');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    });
});

// Dropdown State Management
document.addEventListener('DOMContentLoaded', () => {
    // Get all dropdown toggles
    const dropdownToggles = document.querySelectorAll('.nav-link.dropdown-toggle');
    
    // Initialize Bootstrap dropdowns
    dropdownToggles.forEach(toggle => {
        // Listen for Bootstrap's show.bs.dropdown event (when dropdown starts to open)
        toggle.addEventListener('show.bs.dropdown', (e) => {
            // Save the ID of the dropdown being opened
            const dropdownId = toggle.id;
            if (dropdownId) {
                localStorage.setItem('lastOpenDropdown', dropdownId);
            }
        });

        // Listen for Bootstrap's hide.bs.dropdown event (when dropdown starts to close)
        toggle.addEventListener('hide.bs.dropdown', (e) => {
            const dropdownId = toggle.id;
            // Only remove if this dropdown was the one stored
            if (dropdownId && localStorage.getItem('lastOpenDropdown') === dropdownId) {
                localStorage.removeItem('lastOpenDropdown');
            }
        });
    });

    // Check for last open dropdown and reopen it
    const lastOpenDropdownId = localStorage.getItem('lastOpenDropdown');
    if (lastOpenDropdownId) {
        const dropdownToOpen = document.getElementById(lastOpenDropdownId);
        if (dropdownToOpen && dropdownToOpen.classList.contains('dropdown-toggle')) {
            // Use Bootstrap's Dropdown API to show the dropdown
            const dropdown = new bootstrap.Dropdown(dropdownToOpen);
            dropdown.show();
        }
    }

    // Clear dropdown state when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            localStorage.removeItem('lastOpenDropdown');
        }
    });
});

// Handle back/forward navigation
window.addEventListener('pageshow', (event) => {
    // Check if the page is being loaded from cache
    if (event.persisted) {
        const lastOpenDropdownId = localStorage.getItem('lastOpenDropdown');
        if (lastOpenDropdownId) {
            const dropdownToOpen = document.getElementById(lastOpenDropdownId);
            if (dropdownToOpen && dropdownToOpen.classList.contains('dropdown-toggle')) {
                // Use Bootstrap's Dropdown API to show the dropdown
                const dropdown = new bootstrap.Dropdown(dropdownToOpen);
                dropdown.show();
            }
        }
    }
});

// Tab functionality for company section
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Show corresponding content
        const targetTab = btn.getAttribute('data-tab');
        const targetElement = document.getElementById(targetTab);
        if (targetElement) {
            targetElement.classList.add('active');
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animate stats on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-item h3');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 50);
    });
}

// Form validation and submission
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.classList.add('error');
                isValid = false;
            }
        }
        
        // Phone validation
        if (input.type === 'tel' && input.value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(input.value.replace(/[\s\-\(\)]/g, ''))) {
                input.classList.add('error');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Handle form submissions
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateForm(form)) {
                // Show success message
                showMessage('Thank you for your inquiry! We will contact you soon.', 'success');
                form.reset();
            } else {
                showMessage('Please fill in all required fields correctly.', 'error');
            }
        });
    });
});

// Show message function
function showMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = text;
    
    // Add styles
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        messageDiv.style.background = '#27ae60';
    } else {
        messageDiv.style.background = '#e74c3c';
    }
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
            document.body.removeChild(messageDiv);
            }
        }, 300);
    }, 5000);
}

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 5px rgba(231, 76, 60, 0.3) !important;
    }
`;
document.head.appendChild(style);

// Lazy loading for images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.className = 'back-to-top';
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 18px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
`;

document.body.appendChild(backToTopBtn);

// Show/hide back to top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }
});

// Back to top functionality
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Enhanced button hover effects
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.05)';
        btn.style.transition = 'transform 0.3s ease';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
    });
});

// Enhanced card hover effects
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// SIMPLIFIED SCROLL ANIMATIONS - NO EXTERNAL DEPENDENCIES
function initScrollAnimations() {
    // Create intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animation || 'fadeInUp';
                
                // Add animation class
                element.classList.add('animated');
                
                // Apply specific animation using CSS classes
                element.classList.add(animationType);
                
                // Unobserve after animation
                scrollObserver.unobserve(element);
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animatedElements = [
        '.hero-text',
        '.hero-buttons',
        '.about-text',
        '.feature',
        '.stat-item',
        '.service-card',
        '.case-study-card',
        '.company-content',
        '.footer-section'
    ];

    animatedElements.forEach(selector => {
        document.querySelectorAll(selector).forEach((element, index) => {
            element.classList.add('animate-on-scroll');
            element.dataset.animation = 'fadeInUp';
            element.style.animationDelay = `${index * 0.1}s`;
            scrollObserver.observe(element);
        });
    });

    // Special animations for different sections
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.dataset.animation = 'scaleIn';
        card.style.animationDelay = `${index * 0.2}s`;
    });

    document.querySelectorAll('.stat-item').forEach((stat, index) => {
        stat.dataset.animation = 'bounceIn';
        stat.style.animationDelay = `${index * 0.1}s`;
    });

    document.querySelectorAll('.case-study-card').forEach((card, index) => {
        card.dataset.animation = 'fadeInUp';
        card.style.animationDelay = `${index * 0.2}s`;
    });
}

// SIMPLIFIED PAGE LOAD ANIMATIONS
function initPageLoadAnimations() {
    // Add page load class to body
    document.body.classList.add('page-load');
    
    // Animate header elements
    const headerElements = document.querySelectorAll('.header-top, .navbar');
    headerElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Animate hero section
    const heroText = document.querySelector('.hero-text');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (heroText) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            heroText.style.transition = 'all 1s ease-out';
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateY(0)';
        }, 500);
    }

    if (heroButtons) {
        heroButtons.style.opacity = '0';
        heroButtons.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroButtons.style.transition = 'all 0.8s ease-out';
            heroButtons.style.opacity = '1';
            heroButtons.style.transform = 'translateY(0)';
        }, 800);
    }

    // Animate logo with special effect
    const logo = document.querySelector('.navbar-brand h2');
    if (logo) {
        logo.style.opacity = '0';
        logo.style.transform = 'scale(0.5) rotate(-10deg)';
        
        setTimeout(() => {
            logo.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            logo.style.opacity = '1';
            logo.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    }
}

// SIMPLIFIED LOADING SCREEN
function initLoadingScreen() {
    // Add loading animation
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-logo">Alpha Solutions Hub</div>
            <div class="loader-spinner"></div>
        </div>
    `;
    
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        color: white;
        font-size: 24px;
        font-weight: bold;
    `;
    
    document.body.appendChild(loader);
    
    // Remove loader after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => {
                if (document.body.contains(loader)) {
                    document.body.removeChild(loader);
                }
            }, 500);
        }, 1000);
    });
}

// Add CSS for loader
const loaderStyle = document.createElement('style');
loaderStyle.textContent = `
    .loader-content {
        text-align: center;
    }
    
    .loader-logo {
        margin-bottom: 30px;
        font-size: 28px;
        font-weight: bold;
    }
    
    .loader-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(255,255,255,0.3);
        border-top: 4px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(loaderStyle);

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initPageLoadAnimations();
    initLoadingScreen();
});

// Page load handler
window.addEventListener('load', () => {
    initScrollAnimations();
    initPageLoadAnimations();
});

/* =========================
   Call-to-Pay Popup (mobile full-screen / desktop modal)
   - Appears 2 seconds after page load
   - Full-screen overlay on mobile (<=768px)
   - Centered modal card on desktop (>=992px)
   - Header with red bar, phone and close button
   - Body: logo, short text, call button (body scrollable)
   - Sticky footer button with call action
   - When open: background page scrolling disabled (.no-scroll on body)
   - Once closed, recorded in sessionStorage so it won't reappear this session
   - Close via (×) or Escape key
   ========================= */

(function () {
    // Only show this popup on specific provider pages
    try {
        const allowed = ['verizon.html', 'optimum.html', 'spectrum.html'];
        const path = window.location.pathname.split('/').pop();
        if (!allowed.includes(path)) return; // exit early on other pages
    } catch (e) {
        // If anything goes wrong, fail safe: do not show popup
        return;
    }
    // Default phone (fallback)
    let PHONE_DISPLAY = '+1 (844) 209-4073';
    let PHONE_TEL = '+18442094073';
    // Optional per-page overrides (explicit mapping). Use when a page needs a specific number/brand.
    const PAGE_OVERRIDES = {
        'spectrum.html': {
            tel: '+18332689840',
            display: '+1 (833) 268-9840',
            brand: 'Spectrum',
            logo: 'img/spectrum.png'
        }
        , 'verizon.html': {
            // no phone override here, just use the per-page logo
            logo: 'img/verizo.png'
        }
        , 'optimum.html': {
            logo: 'img/optimum.png'
        }
        // add more overrides here if needed
    };

    // Create the popup DOM and append to body
    function buildPopup() {
        const overlay = document.createElement('div');
        overlay.className = 'site-popup-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        // allow replacing logo with a per-page logo or textual brand label if provided (e.g. "of Spectrum")
        const brandLabel = (window.__popupSiteBrand || '').trim();
        const brandLogo = (window.__popupSiteLogo || '').trim();
        let brandHtml = '';
        if (brandLogo) {
            // try the per-page logo first; if it fails to load the onerror will hide it
            brandHtml = `<img src="${brandLogo}" alt="Logo" class="logo" onerror="this.style.display='none'">`;
        } else if (brandLabel) {
            brandHtml = `<div class="popup-brand">${brandLabel}</div>`;
        } else {
            brandHtml = `<img src="img/logo.svg" alt="Logo" class="logo" onerror="this.style.display='none'">`;
        }

        overlay.innerHTML = `
            <div class="site-popup-card" role="dialog" aria-modal="true" aria-label="Call to Pay Popup">
                <div class="site-popup-header">
                    <div class="phone">${PHONE_DISPLAY}</div>
                    <button class="close-btn" aria-label="Close popup">&times;</button>
                </div>
                <div class="site-popup-body">
                    ${brandHtml}
                    <h4>Call to Pay Your Bill Now</h4>
                    <p>Fast and secure payments over the phone. Our team is available 24/7 to assist.</p>
                    <a href="tel:${PHONE_TEL}" class="btn btn-danger call-btn">Call Now</a>
                </div>
                <div class="site-popup-footer">
                    <a href="tel:${PHONE_TEL}" class="sticky-call">Call Now ${PHONE_DISPLAY}</a>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        return overlay;
    }

    
        // Show popup: add open class and disable background scroll (robust on mobile)
        let _savedScrollY = 0;
        function showPopup(overlay) {
            if (!overlay) return;
            overlay.classList.add('open');
            overlay.setAttribute('aria-hidden', 'false');

            // Save current scroll position and lock the page by using fixed positioning.
            try {
                _savedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
                // apply lock styles
                document.documentElement.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.top = `-${_savedScrollY}px`;
                document.body.classList.add('no-scroll');
            } catch (e) {
                // fallback to simple class toggle
                document.body.classList.add('no-scroll');
            }

            // Ensure popup body fits viewport and is scrollable separately
            const card = overlay.querySelector('.site-popup-card');
            const body = overlay.querySelector('.site-popup-body');
            const header = overlay.querySelector('.site-popup-header');
            const footer = overlay.querySelector('.site-popup-footer');

            function updateBodyMaxHeight() {
                if (!body) return;
                const vh = window.innerHeight;
                const headerH = header ? header.getBoundingClientRect().height : 0;
                const footerH = footer ? footer.getBoundingClientRect().height : 0;
                // Give a little spacing
                body.style.maxHeight = (vh - headerH - footerH - 24) + 'px';
            }

            updateBodyMaxHeight();
            window.addEventListener('resize', updateBodyMaxHeight);

            // Set focus for accessibility
            const closeBtn = overlay.querySelector('.close-btn');
            if (closeBtn) closeBtn.focus();
        }

    // Hide popup and restore scroll
    function closePopup(overlay) {
        if (!overlay) return;
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        try {
            // restore scroll positioning
            document.body.classList.remove('no-scroll');
            document.body.style.position = '';
            document.body.style.top = '';
            document.documentElement.style.overflow = '';
            // restore previous scroll position
            if (typeof _savedScrollY === 'number' && _savedScrollY) {
                window.scrollTo(0, _savedScrollY);
            }
        } catch (e) {
            document.body.classList.remove('no-scroll');
        }
        // Do not persist close state so popup will reappear on refresh or on other pages
    }

    // Initialize behavior
    document.addEventListener('DOMContentLoaded', () => {
        // Determine phone number from page if available so the popup matches the page
        try {
            const telAnchors = Array.from(document.querySelectorAll('a[href^="tel:"]'));
            let chosen = null;

            // Prefer an anchor whose visible text contains digits (likely the phone number)
            for (const a of telAnchors) {
                const txt = (a.textContent || '').trim();
                if (/[0-9]/.test(txt)) {
                    chosen = a;
                    break;
                }
            }

            // Fallback to the first tel anchor if none had visible digits
            if (!chosen && telAnchors.length) chosen = telAnchors[0];

            if (chosen) {
                const href = chosen.getAttribute('href') || '';
                const raw = href.replace(/^tel:\s*/i, '');
                PHONE_TEL = raw.replace(/[^+0-9]/g, '');

                // Determine a friendly display string. Prefer visible text if it contains digits,
                // otherwise format the raw number.
                const visible = (chosen.textContent || '').trim();
                if (visible && /[0-9]/.test(visible)) {
                    PHONE_DISPLAY = visible;
                } else {
                    // Format common US numbers for nicer display
                    const digits = PHONE_TEL.replace(/[^0-9]/g, '');
                    if (digits.length === 11 && digits.startsWith('1')) {
                        const d = digits.slice(1);
                        PHONE_DISPLAY = `+1 (${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
                    } else if (digits.length === 10) {
                        PHONE_DISPLAY = `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
                    } else {
                        PHONE_DISPLAY = PHONE_TEL || PHONE_DISPLAY;
                    }
                }
            } else {
                // fallback: try to parse first phone-like text in header or body
                const headerText = (document.querySelector('.header-top') || document.body).textContent || '';
                const m = headerText.match(/\+?\d[\d\s\-\(\)]{6,}\d/);
                if (m) {
                    PHONE_DISPLAY = m[0].trim();
                    PHONE_TEL = m[0].replace(/[^+0-9]/g, '');
                }
            }
        } catch (e) {
            // ignore and use defaults
        }

        // Apply any explicit per-page overrides (useful for provider pages with fixed numbers)
        try {
            const pageFile = window.location.pathname.split('/').pop();
            if (PAGE_OVERRIDES && PAGE_OVERRIDES[pageFile]) {
                const o = PAGE_OVERRIDES[pageFile];
                if (o.display) PHONE_DISPLAY = o.display;
                if (o.tel) PHONE_TEL = o.tel.replace(/[^+0-9]/g, '');
                // expose brand label and optional logo path for use in the popup
                window.__popupSiteBrand = o.brand || '';
                window.__popupSiteLogo = o.logo || '';
            } else {
                window.__popupSiteBrand = '';
                window.__popupSiteLogo = '';
            }
        } catch (e) {
            window.__popupSiteBrand = '';
            window.__popupSiteLogo = '';
        }

        const overlay = buildPopup();

        // wire up close button
        overlay.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList && target.classList.contains('close-btn')) {
                closePopup(overlay);
            }
        });

        // handle Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closePopup(overlay);
            }
        });

        // show after 2s (no sessionStorage persistence so it will appear on refresh and on other pages)
        setTimeout(() => {
            showPopup(overlay);
        }, 2000);
    });
})();