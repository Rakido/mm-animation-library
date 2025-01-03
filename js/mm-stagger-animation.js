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
            const opacity = parseFloat(container.dataset.opacity) || 0;
            const scrub = container.dataset.scrub === 'true';
            const staggerMethod = container.dataset.staggerMethod || 'start';

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
                // 'start' is default, no need to modify array
            }

            // Set initial states based on direction
            const initialState = {
                opacity: opacity
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

            // Handle scale
            if (hasScale) {
                initialState.scale = scale;
            }

            // Handle rotation
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
                stagger: delay
            };

            // Add transformations to final state
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

            // Add scale to final state if specified
            if (hasScale) {
                finalState.scale = 1;
            }

            // Add rotation to final state if specified
            if (direction.includes('rotate') || rotate) {
                finalState.rotation = 0;
            }

            // Add ScrollTrigger configuration
            finalState.scrollTrigger = {
                trigger: container,
                start: start,
                end: scrub ? 'bottom top' : undefined,
                scrub: scrub,
                toggleActions: scrub ? undefined : 'play none none none',
                once: !scrub
            };

            // Use the ordered elements array for the animation
            gsap.to(elementsArray, finalState);
        });
    }
}

// Initialize library
window.moonMoonStagger = new MoonMoonStagger(); 