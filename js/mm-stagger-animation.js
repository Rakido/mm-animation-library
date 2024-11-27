// Moon-Moon Stagger Animation Library
class MoonMoonStagger {
    constructor() {
        this.init();
    }

    init() {
        this.initStaggerAnimation();
    }

    // Parse easing value helper
    parseEasing(easingValue) {
        if (!easingValue) return "power2.inOut";

        if (/^[\d.,]+$/.test(easingValue)) {
            const values = easingValue.split(',').map(Number);
            if (values.length === 4) {
                const easeName = `customEase${Math.random().toString(36).substr(2, 9)}`;
                CustomEase.create(easeName, `M0,0 C${values[0]},${values[1]} ${values[2]},${values[3]} 1,1`);
                return easeName;
            }
        }
        return easingValue;
    }

    initStaggerAnimation() {
        // Register necessary plugins
        gsap.registerPlugin(ScrollTrigger, CustomEase);

        const staggerElements = document.querySelectorAll('[data-stagger-reveal]');
        
        staggerElements.forEach(container => {
            const elements = container.children;
            const delay = parseFloat(container.dataset.staggerDelay) || 0.2;
            const duration = parseFloat(container.dataset.duration) || 1;
            const start = container.dataset.start || 'top 80%';
            const ease = this.parseEasing(container.dataset.easing);
            const direction = container.dataset.direction || 'up';
            const distance = parseInt(container.dataset.distance) || 50;
            const rotate = parseInt(container.dataset.rotate) || 0;
            const scale = parseFloat(container.dataset.scale) || 1;
            const opacity = parseFloat(container.dataset.opacity) || 0;
            const scrub = container.dataset.scrub === 'true';

            // Define direction-based animations
            const directionValues = {
                up: { y: distance },
                down: { y: -distance },
                left: { x: distance },
                right: { x: -distance },
                'scale-up': { scale: scale - 0.5 },
                'scale-down': { scale: scale + 0.5 },
                'rotate-left': { rotation: -rotate },
                'rotate-right': { rotation: rotate }
            };

            const animation = {
                ...directionValues[direction],
                opacity: opacity,
                duration: scrub ? undefined : duration,
                ease: scrub ? "none" : ease,
                stagger: delay,
                scrollTrigger: {
                    trigger: container,
                    start: start,
                    end: scrub ? 'bottom top' : undefined,
                    scrub: scrub,
                    toggleActions: scrub ? undefined : 'play none none none',
                    once: !scrub
                }
            };

            gsap.from(elements, animation);
        });
    }
}

// Initialize library
window.moonMoonStagger = new MoonMoonStagger(); 