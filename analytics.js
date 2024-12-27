// Cloudflare Web Analytics Enhanced Tracking
class CFAnalytics {
    constructor() {
        this.viewedSections = new Set();
        this.scrollDepthMarkers = [25, 50, 75, 100];
        this.maxScrollDepth = 0;
    }

    trackEvent(eventName, eventData) {
        // Use Cloudflare's built-in tracking
        if (typeof window.cfAnalytics !== 'undefined') {
            window.cfAnalytics.trackEvent(eventName, eventData);
        } else {
            console.warn('Cloudflare Analytics not initialized');
        }
    }

    trackSectionVisibility(section) {
        if (!this.viewedSections.has(section.id)) {
            this.viewedSections.add(section.id);
            this.trackEvent('section_view', {
                sectionId: section.id,
                sectionName: section.getAttribute('data-section-name') || section.id,
                timeOnPage: Math.round((Date.now() - performance.timing.navigationStart) / 1000)
            });
        }
    }

    getScrollPercentage() {
        const h = document.documentElement;
        const b = document.body;
        const st = 'scrollTop';
        const sh = 'scrollHeight';
        return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
    }

    initEnhancedScrollTracking() {
        // Track sections in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.trackSectionVisibility(entry.target);
                }
            });
        }, {
            threshold: 0.5 // 50% of section must be visible
        });

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });

        // Track scroll depth
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }

            scrollTimeout = window.requestAnimationFrame(() => {
                const scrollPercentage = Math.round(this.getScrollPercentage());
                
                // Update max scroll depth
                if (scrollPercentage > this.maxScrollDepth) {
                    this.maxScrollDepth = scrollPercentage;
                    
                    // Check if we've passed any depth markers
                    this.scrollDepthMarkers.forEach(marker => {
                        if (scrollPercentage >= marker && 
                            !this.viewedSections.has(`scroll-${marker}`)) {
                            this.viewedSections.add(`scroll-${marker}`);
                            this.trackEvent('scroll_depth', {
                                depth: marker,
                                path: window.location.pathname
                            });
                        }
                    });
                }
            });
        });
    }

    initCTATracking() {
        document.querySelectorAll('.cta-button, .contact-cta a').forEach(cta => {
            cta.addEventListener('click', (e) => {
                this.trackEvent('cta_click', {
                    ctaId: cta.id || 'unnamed_cta',
                    ctaText: cta.innerText,
                    sectionId: cta.closest('section')?.id || 'unknown_section'
                });
            });
        });
    }

    init() {
        // Wait for Cloudflare Analytics to load
        const checkCF = setInterval(() => {
            if (typeof window.cfAnalytics !== 'undefined') {
                clearInterval(checkCF);
                this.initEnhancedScrollTracking();
                this.initCTATracking();
                console.log('CF Analytics initialized');
            }
        }, 100);

        // Timeout after 5 seconds
        setTimeout(() => {
            clearInterval(checkCF);
            if (typeof window.cfAnalytics === 'undefined') {
                console.error('Cloudflare Analytics failed to load');
            }
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const analytics = new CFAnalytics();
    analytics.init();
}); 
}); 