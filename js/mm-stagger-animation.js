// Moon-Moon Stagger Animation Library
class MoonMoonStagger {
    constructor() {
        this.init();
    }

    init() {
        gsap.registerPlugin(ScrollTrigger, CustomEase);
        this.initStaggerAnimation();
        this.initClickTriggers();
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
        const staggerElements = document.querySelectorAll('[data-stagger-reveal]');
        
        staggerElements.forEach(container => {
            const isClickEvent = container.dataset.clickEvent === 'true';
            
            // Skip scroll-based animation if it's a click-only event
            if (isClickEvent) {
                const elements = container.children;
                const delay = parseFloat(container.dataset.staggerDelay) || 0.2;
                const duration = parseFloat(container.dataset.duration) || 1;
                const hasDirection = container.hasAttribute('data-direction');
                const direction = container.dataset.direction || 'fade';
                const distance = parseInt(container.dataset.distance) || 50;

                // Set initial states
                const initialState = { opacity: 0 };
                if (hasDirection) {
                    switch(direction) {
                        case 'x': initialState.x = -distance; break;
                        case '-x': initialState.x = distance; break;
                        case 'y': initialState.y = -distance; break;
                        case '-y': initialState.y = distance; break;
                    }
                }
                gsap.set(elements, initialState);
                return; // Skip scroll trigger setup
            }

            const elements = container.children;
            const delay = parseFloat(container.dataset.staggerDelay) || 0.2;
            const duration = parseFloat(container.dataset.duration) || 1;
            const start = container.dataset.start || 'top 80%';
            const ease = this.parseEasing(container.dataset.easing);
            const hasDirection = container.hasAttribute('data-direction');
            const direction = container.dataset.direction || 'fade';
            const distance = parseInt(container.dataset.distance) || 50;
            const rotate = parseInt(container.dataset.rotate) || 0;
            
            // Get container scale parameters
            const containerScale = container.hasAttribute('data-scale') ? 
                parseFloat(container.dataset.scale) : null;
            const containerScaleAxis = container.dataset.scaleAxis || 'xy';
            const containerScalePosition = container.dataset.scalePosition || 'center';
            const opacity = parseFloat(container.dataset.opacity) || 0;
            const scrub = container.dataset.scrub === 'true';
            const staggerMethod = container.dataset.staggerMethod || 'start';
            const initialDelay = parseFloat(container.dataset.delay) || 0;
            const replay = container.dataset.replay === 'true';

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

            // Create timeline for coordinated animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: start,
                    end: scrub ? 'bottom top' : undefined,
                    scrub: scrub,
                    toggleActions: replay ? 
                        "play reverse play reverse" : // For replay
                        "play none none none", // Default behavior
                    once: !replay // Only play once if no replay
                }
            });

            // Set initial states for all elements
            elementsArray.forEach(element => {
                const initialState = {
                    opacity: opacity
                };

                // Handle direction
                if (hasDirection) {
                    switch(direction) {
                        case 'x': initialState.x = -distance; break;
                        case '-x': initialState.x = distance; break;
                        case 'y': initialState.y = -distance; break;
                        case '-y': initialState.y = distance; break;
                    }
                }

                // Check if element has its own scale settings
                const hasElementScale = element.hasAttribute('data-scale');
                if (hasElementScale) {
                    const elementScale = parseFloat(element.dataset.scale);
                    const elementScaleAxis = element.dataset.scaleAxis || 'xy';
                    const elementScalePosition = element.dataset.scalePosition || 'center';

                    // Set transform origin for element
                    initialState.transformOrigin = (() => {
                        switch(elementScalePosition) {
                            case 'left': return 'left center';
                            case 'right': return 'right center';
                            case 'top': return 'center top';
                            case 'bottom': return 'center bottom';
                            default: return 'center center';
                        }
                    })();

                    // Set scale based on element's axis
                    switch(elementScaleAxis) {
                        case 'x':
                            initialState.scaleX = elementScale;
                            break;
                        case 'y':
                            initialState.scaleY = elementScale;
                            break;
                        default:
                            initialState.scale = elementScale;
                    }
                }
                // If no element scale, use container scale if available
                else if (containerScale !== null) {
                    initialState.transformOrigin = (() => {
                        switch(containerScalePosition) {
                            case 'left': return 'left center';
                            case 'right': return 'right center';
                            case 'top': return 'center top';
                            case 'bottom': return 'center bottom';
                            default: return 'center center';
                        }
                    })();

                    switch(containerScaleAxis) {
                        case 'x':
                            initialState.scaleX = containerScale;
                            break;
                        case 'y':
                            initialState.scaleY = containerScale;
                            break;
                        default:
                            initialState.scale = containerScale;
                    }
                }

                gsap.set(element, initialState);
            });

            // Animate each element
            elementsArray.forEach((element, index) => {
                const finalState = {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    duration: duration,
                    ease: ease,
                    delay: index * delay + initialDelay
                };

                // Handle scale animation
                const hasElementScale = element.hasAttribute('data-scale');
                if (hasElementScale) {
                    const elementScaleAxis = element.dataset.scaleAxis || 'xy';
                    switch(elementScaleAxis) {
                        case 'x':
                            finalState.scaleX = 1;
                            break;
                        case 'y':
                            finalState.scaleY = 1;
                            break;
                        default:
                            finalState.scale = 1;
                    }
                }
                else if (containerScale !== null) {
                    switch(containerScaleAxis) {
                        case 'x':
                            finalState.scaleX = 1;
                            break;
                        case 'y':
                            finalState.scaleY = 1;
                            break;
                        default:
                            finalState.scale = 1;
                    }
                }

                tl.to(element, finalState, 0);
            });
        });
    }

    // Add method to play stagger animation
    playStaggerAnimation(container) {
        const elements = container.children;
        const delay = parseFloat(container.dataset.staggerDelay) || 0.2;
        const duration = parseFloat(container.dataset.duration) || 1;
        const ease = this.parseEasing(container.dataset.easing);
        const hasDirection = container.hasAttribute('data-direction');
        const direction = container.dataset.direction || 'fade';
        const distance = parseInt(container.dataset.distance) || 50;
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
        }

        // Set initial states
        const initialState = { opacity: 0 };
        if (hasDirection) {
            switch(direction) {
                case 'x': initialState.x = -distance; break;
                case '-x': initialState.x = distance; break;
                case 'y': initialState.y = -distance; break;
                case '-y': initialState.y = distance; break;
            }
        }

        gsap.set(elementsArray, initialState);

        // Create and play animation
        return gsap.to(elementsArray, {
            opacity: 1,
            x: 0,
            y: 0,
            duration: duration,
            stagger: delay,
            ease: ease
        });
    }

    initClickTriggers() {
        // Handle click events that target stagger animations
        document.addEventListener('click', (e) => {
            const clickTarget = e.target;
            if (clickTarget.hasAttribute('data-stagger-trigger')) {
                const targetId = clickTarget.getAttribute('data-stagger-trigger');
                const targetContainer = document.getElementById(targetId);
                
                if (targetContainer && targetContainer.hasAttribute('data-stagger-reveal')) {
                    this.playStaggerAnimation(targetContainer);
                }
            }
        });
    }
}

// Initialize library
window.moonMoonStagger = new MoonMoonStagger(); 