// Moon-Moon Parallax Animation Library
class MoonMoonParallax {
    constructor() {
        this.init();
    }

    init() {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);
        
        // Initialize parallax elements
        this.initParallax();
    }

    initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        parallaxElements.forEach(element => {
            // Get animation parameters
            const direction = element.dataset.parallaxDirection || 'y';
            const speed = parseFloat(element.dataset.speed) || 0.5;
            const scrubAttr = element.getAttribute('data-scrub');
            const scrub = scrubAttr === 'true' ? true : (scrubAttr ? parseFloat(scrubAttr) : false);
            const pinPosition = element.dataset.parallaxPin;

            // New scroll trigger parameters
            const startTrigger = element.dataset.start || "top bottom";
            const endTrigger = element.dataset.end || "bottom top";

            // Handle pinned elements
            if (pinPosition) {
                // Set initial styles
                gsap.set(element, {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    xPercent: -50,
                    yPercent: -50,
                });

                // Calculate target positions based on pin position
                let targetX, targetY;
                const section = element.closest('section');
                const sectionWidth = section.offsetWidth;
                const sectionHeight = section.offsetHeight;
                const padding = 40; // Padding from edges

                switch(pinPosition) {
                    case 'top-left':
                        targetX = -sectionWidth/2 + padding;
                        targetY = -sectionHeight/2 + padding;
                        break;
                    case 'top-right':
                        targetX = sectionWidth/2 - padding;
                        targetY = -sectionHeight/2 + padding;
                        break;
                    case 'bottom-left':
                        targetX = -sectionWidth/2 + padding;
                        targetY = sectionHeight/2 - padding;
                        break;
                    case 'bottom-right':
                        targetX = sectionWidth/2 - padding;
                        targetY = sectionHeight/2 - padding;
                        break;
                }

                // Create animation
                gsap.to(element, {
                    x: targetX,
                    y: targetY,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: startTrigger,
                        end: endTrigger,
                        scrub: scrub,
                        invalidateOnRefresh: true
                    }
                });
            } else {
                // Original parallax code for non-pinned elements
                const range = window.innerHeight * speed;
                let transformFrom = {};
                let transformTo = {};

                switch(direction) {
                    case 'x':
                        transformFrom = { x: -range };
                        transformTo = { x: range };
                        break;
                    case 'y':
                        transformFrom = { y: -range };
                        transformTo = { y: range };
                        break;
                    case 'xy':
                        transformFrom = { x: -range, y: -range };
                        transformTo = { x: range, y: range };
                        break;
                    default:
                        transformFrom = { y: -range };
                        transformTo = { y: range };
                }

                gsap.fromTo(element, 
                    transformFrom,
                    {
                        ...transformTo,
                        ease: "none",
                        scrollTrigger: {
                            trigger: element.closest('section'),
                            start: startTrigger,
                            end: endTrigger,
                            scrub: scrub,
                            invalidateOnRefresh: true
                        }
                    }
                );
            }

            // Performance optimization
            element.style.willChange = 'transform';
        });

        // Cleanup will-change
        ScrollTrigger.addEventListener("refresh", () => {
            requestAnimationFrame(() => {
                parallaxElements.forEach(element => {
                    element.style.willChange = 'auto';
                });
            });
        });
    }

    // Utility method to handle window resize
    handleResize() {
        ScrollTrigger.refresh();
    }
}

// Initialize library
window.moonMoonParallax = new MoonMoonParallax();

// Handle window resize
window.addEventListener('resize', () => {
    window.moonMoonParallax.handleResize();
}); 