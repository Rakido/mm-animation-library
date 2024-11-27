// Moon-Moon Image Reveal Animation Library
class MoonMoonImageReveal {
    constructor() {
        this.init();
    }

    init() {
        this.initImageReveal();
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

    initImageReveal() {
        // Register necessary plugins
        gsap.registerPlugin(ScrollTrigger, CustomEase);

        // Select all elements with data-scroll-image-reveal
        const imageRevealElements = document.querySelectorAll('[data-scroll-image-reveal]');

        imageRevealElements.forEach(container => {
            const target = container.querySelector('[data-scroll-image-reveal-target]');
            if (!target) return;

            // Get animation parameters
            const duration = parseFloat(target.dataset.duration) || 1.5;
            const delay = parseFloat(target.dataset.delay) || 0;
            const easingValue = this.parseEasing(target.dataset.easing);
            const axis = target.dataset.scrollImageRevealAxis || 'y';
            const animation = container.dataset.scrollImageRevealAnimation;
            const zoomPercentage = parseFloat(container.dataset.scrollZoomPercentage) || 1.2;
            const shutterAxis = container.dataset.shutterAxis || 'x';
            const shutterColor = container.dataset.color || '#000000';
            const scrub = container.dataset.scrub === 'true';

            // Base ScrollTrigger configuration
            const scrollTriggerConfig = {
                trigger: container,
                start: 'top bottom',
                toggleActions: 'play none none none',
                once: true
            };

            // Add scrub configuration if enabled
            if (scrub) {
                scrollTriggerConfig.end = 'bottom top';
                scrollTriggerConfig.scrub = 1;
                delete scrollTriggerConfig.once;
                delete scrollTriggerConfig.toggleActions;
            }

            // Handle different animation types
            switch (animation) {
                case 'zoom-in':
                case 'zoom-out':
                    this.handleZoomAnimation(container, target, animation, {
                        duration,
                        delay,
                        easingValue,
                        zoomPercentage,
                        scrollTriggerConfig
                    });
                    break;

                case 'shutter':
                    this.handleShutterAnimation(container, target, {
                        duration,
                        delay,
                        easingValue,
                        shutterAxis,
                        shutterColor,
                        scrollTriggerConfig
                    });
                    break;

                default:
                    this.handleSlideAnimation(container, target, axis, {
                        duration,
                        delay,
                        easingValue,
                        scrollTriggerConfig
                    });
            }
        });

        // Handle legacy reveals
        this.handleLegacyReveals();
    }

    handleSlideAnimation(container, target, axis, options) {
        const { duration, delay, easingValue, scrollTriggerConfig } = options;
        const revealEl = container.querySelector('.reveal');
        if (!revealEl) return;

        gsap.set(revealEl, {
            overflow: 'hidden',
            position: 'relative'
        });

        const transformValues = {
            'x': { x: '100%' },
            '-x': { x: '-100%' },
            'y': { y: '100%' },
            '-y': { y: '-100%' }
        }[axis] || { y: '100%' };

        gsap.from(target, {
            ...transformValues,
            duration: duration,
            delay: delay,
            ease: easingValue,
            scrollTrigger: scrollTriggerConfig
        });
    }

    handleZoomAnimation(container, target, type, options) {
        const { duration, delay, easingValue, zoomPercentage, scrollTriggerConfig } = options;
        const startScale = type === 'zoom-in' ? zoomPercentage : 1;
        const endScale = type === 'zoom-in' ? 1 : zoomPercentage;

        gsap.fromTo(target, 
            { scale: startScale, opacity: 0 },
            {
                scale: endScale,
                opacity: 1,
                duration: duration,
                delay: delay,
                ease: easingValue,
                scrollTrigger: scrollTriggerConfig
            }
        );
    }

    handleShutterAnimation(container, target, options) {
        const { duration, delay, easingValue, shutterAxis, shutterColor, scrollTriggerConfig } = options;
        const shutter = container.querySelector('[data-scroll-image-reveal-shutter]');
        
        if (!shutter) return;

        gsap.set(shutter, {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: shutterColor,
            transformOrigin: shutterAxis.includes('y') ? 'center top' : 'left center'
        });

        const tl = gsap.timeline({
            scrollTrigger: scrollTriggerConfig
        });

        tl.set(target, { opacity: 0 })
          .to(target, { opacity: 1, duration: 0.1 })
          .to(shutter, {
              scaleX: shutterAxis.includes('y') ? 1 : 0,
              scaleY: shutterAxis.includes('y') ? 0 : 1,
              duration: duration,
              delay: delay,
              ease: easingValue
          });
    }

    handleLegacyReveals() {
        const simpleRevealElements = document.querySelectorAll('[data-image-reveal]');
        
        simpleRevealElements.forEach(element => {
            if (element.hasAttribute('data-scroll-image-reveal')) return;

            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden';
            element.parentNode.insertBefore(wrapper, element);
            wrapper.appendChild(element);

            gsap.from(element, {
                y: '100%',
                scrollTrigger: {
                    trigger: wrapper,
                    start: 'top bottom',
                    toggleActions: 'play none none none',
                    once: true
                }
            });
        });
    }
}

// Initialize library
window.moonMoonImageReveal = new MoonMoonImageReveal(); 