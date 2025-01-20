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

            // Get elements array based on stagger method
            let elementsArray = Array.from(elements);
            
            // Apply stagger method ordering to all elements first
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

            // Create timeline for coordinated animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: start,
                    end: scrub ? 'bottom top' : undefined,
                    scrub: scrub,
                    toggleActions: revert ? "play reverse play reverse" : "play none none none",
                    once: !revert && !scrub
                }
            });

            // Animate each element in sequence
            elementsArray.forEach((element, index) => {
                const hasScale = element.hasAttribute('data-scale');
                
                if (hasScale) {
                    // Handle scale animation
                    const scaleValue = element.hasAttribute('data-scale') ? 
                        parseFloat(element.dataset.scale) : scale;
                    
                    const scaleAxis = element.dataset.scaleAxis || 'xy';
                    const scalePosition = element.dataset.scalePosition || 'center';
                    
                    // Set transform origin
                    let transformOrigin = 'center center';
                    switch(scalePosition) {
                        case 'left': transformOrigin = 'left center'; break;
                        case 'right': transformOrigin = 'right center'; break;
                        case 'top': transformOrigin = 'center top'; break;
                        case 'bottom': transformOrigin = 'center bottom'; break;
                    }

                    // Set initial state
                    const initialState = { transformOrigin };
                    switch(scaleAxis) {
                        case 'x': initialState.scaleX = scaleValue; break;
                        case 'y': initialState.scaleY = scaleValue; break;
                        default: initialState.scale = scaleValue;
                    }
                    
                    gsap.set(element, initialState);

                    // Animate to final state
                    const finalState = {
                        duration: duration,
                        ease: ease,
                        delay: index * delay // Apply stagger through delay
                    };
                    
                    switch(scaleAxis) {
                        case 'x': finalState.scaleX = 1; break;
                        case 'y': finalState.scaleY = 1; break;
                        default: finalState.scale = 1;
                    }

                    tl.to(element, finalState, 0);
                } else {
                    // Handle fade animation
                    gsap.set(element, { opacity: opacity });
                    tl.to(element, {
                        opacity: 1,
                        duration: duration,
                        ease: ease,
                        delay: index * delay // Apply stagger through delay
                    }, 0);
                }
            });
        });
    }
}

// Initialize library
window.moonMoonStagger = new MoonMoonStagger(); 