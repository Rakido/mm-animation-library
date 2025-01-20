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
            const hasDirection = container.hasAttribute('data-direction');
            const direction = container.dataset.direction || 'fade';
            const distance = parseInt(container.dataset.distance) || 50;
            const rotate = parseInt(container.dataset.rotate) || 0;
            const hasScale = container.hasAttribute('data-scale');
            const scale = hasScale ? parseFloat(container.dataset.scale) : 1;
            const scalePosition = container.dataset.scalePosition || 'center';
            const scaleAxis = container.dataset.scaleAxis || 'xy';
            const opacity = parseFloat(container.dataset.opacity) || 0;
            const scrub = container.dataset.scrub === 'true';
            const staggerMethod = container.dataset.staggerMethod || 'start';
            const initialDelay = parseFloat(container.dataset.delay) || 0;
            const revert = container.dataset.revert === 'true';

            // Convert scale position to transform origin
            let transformOrigin = 'center center';
            switch(scalePosition) {
                case 'left':
                    transformOrigin = 'left center';
                    break;
                case 'right':
                    transformOrigin = 'right center';
                    break;
                case 'top':
                    transformOrigin = 'center top';
                    break;
                case 'bottom':
                    transformOrigin = 'center bottom';
                    break;
            }

            // Get elements array based on stagger method
            let elementsArray = Array.from(elements);
            switch(staggerMethod) {
                case 'end':
                    elementsArray = elementsArray.reverse();
                    break;
                case 'center':
                    elementsArray.sort((a, b) => {
                        return Math.abs(elementsArray.length / 2 - elementsArray.indexOf(a)) - 
                               Math.abs(elementsArray.length / 2 - elementsArray.indexOf(b));
                    });
                    break;
                case 'random':
                    elementsArray.sort(() => Math.random() - 0.5);
                    break;
            }

            // Set initial states based on direction
            const initialState = {
                opacity: opacity,
                transformOrigin: transformOrigin
            };

            if (hasDirection) {
                switch(direction) {
                    case 'x':
                        initialState.x = -distance;
                        break;
                    case '-x':
                        initialState.x = distance;
                        break;
                    case 'y':
                        initialState.y = -distance;
                        break;
                    case '-y':
                        initialState.y = distance;
                        break;
                }
            }

            if (hasScale) {
                switch(scaleAxis) {
                    case 'x':
                        initialState.scaleX = scale;
                        break;
                    case 'y':
                        initialState.scaleY = scale;
                        break;
                    default: // 'xy'
                        initialState.scale = scale;
                        break;
                }
            }

            if (direction.includes('rotate')) {
                initialState.rotation = direction.includes('left') ? rotate : -rotate;
            } else if (rotate) {
                initialState.rotation = rotate;
            }

            // Set initial state
            gsap.set(elements, initialState);

            // Define final animation state
            const finalState = {
                opacity: 1,
                duration: scrub ? undefined : duration,
                ease: scrub ? "none" : ease,
                stagger: delay,
                delay: initialDelay
            };

            if (hasDirection) {
                switch(direction) {
                    case 'x':
                    case '-x':
                        finalState.x = 0;
                        break;
                    case 'y':
                    case '-y':
                        finalState.y = 0;
                        break;
                }
            }

            if (hasScale) {
                switch(scaleAxis) {
                    case 'x':
                        finalState.scaleX = 1;
                        break;
                    case 'y':
                        finalState.scaleY = 1;
                        break;
                    default: // 'xy'
                        finalState.scale = 1;
                        break;
                }
            }

            if (direction.includes('rotate') || rotate) {
                finalState.rotation = 0;
            }

            // Configure ScrollTrigger
            finalState.scrollTrigger = {
                trigger: container,
                start: start,
                end: scrub ? 'bottom top' : undefined,
                scrub: scrub,
                toggleActions: revert ? "play reverse play reverse" : "play none none none",
                once: !revert && !scrub
            };

            // Use the ordered elements array for the animation
            gsap.to(elementsArray, finalState);
        });
    }
}

// Initialize library
window.moonMoonStagger = new MoonMoonStagger(); 