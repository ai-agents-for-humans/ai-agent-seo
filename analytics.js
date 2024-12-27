// Cloudflare Web Analytics Enhanced Tracking
class CFAnalytics {
    constructor() {
        this.beacon = 'https://cloudflareinsights.com/cdn-cgi/rum';
    }

    // Track section views
    trackSectionView(sectionId, sectionName) {
        if (typeof navigator.sendBeacon !== 'undefined') {
            const data = {
                type: 'section_view',
                sectionId: sectionId,
                sectionName: sectionName,
                timestamp: Date.now()
            };
            
            navigator.sendBeacon(this.beacon, JSON.stringify(data));
        }
    }

    // Track CTA clicks
    trackCTAClick(ctaId, ctaText, sectionId) {
        if (typeof navigator.sendBeacon !== 'undefined') {
            const data = {
                type: 'cta_click',
                ctaId: ctaId,
                ctaText: ctaText,
                sectionId: sectionId,
                timestamp: Date.now()
            };
            
            navigator.sendBeacon(this.beacon, JSON.stringify(data));
        }
    }

    // Initialize scroll tracking
    initScrollTracking() {
        const sections = document.querySelectorAll('section');
        const sectionViews = new Set();
        
        const isElementInViewport = (el) => {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        };

        const trackVisibleSections = () => {
            sections.forEach(section => {
                if (isElementInViewport(section) && !sectionViews.has(section.id)) {
                    sectionViews.add(section.id);
                    this.trackSectionView(
                        section.id,
                        section.getAttribute('data-section-name') || section.id
                    );
                }
            });
        };

        // Debounced scroll listener
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(trackVisibleSections);
        });

        // Initial check
        trackVisibleSections();
    }

    // Initialize CTA tracking
    initCTATracking() {
        document.querySelectorAll('.cta-button, .contact-cta a').forEach(cta => {
            cta.addEventListener('click', (e) => {
                this.trackCTAClick(
                    cta.id || 'unnamed_cta',
                    cta.innerText,
                    cta.closest('section')?.id || 'unknown_section'
                );
            });
        });
    }

    // Initialize all tracking
    init() {
        this.initScrollTracking();
        this.initCTATracking();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const analytics = new CFAnalytics();
    analytics.init();
}); 