// Moon-Moon Stagger Animation Library
class MoonMoonStagger {
    constructor() {
        // Wait for DOM to be ready before initializing
        document.addEventListener('DOMContentLoaded', () => {
            this.init();
        });
    }

    init() {
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
            
            // Get all animation parameters from the container
            const staggerValue = parseFloat(container.getAttribute('data-stagger-delay')) || 0.05;
            const staggerMethod = container.getAttribute('data-stagger-method') || 'start';
            const delayValue = parseFloat(container.getAttribute('data-delay')) || 0;
            const durationValue = parseFloat(container.getAttribute('data-duration')) || 1;
            const easingValue = this.parseEasing(container.getAttribute('data-easing'));
            const hasDirection = container.hasAttribute('data-direction');
            const direction = container.getAttribute('data-direction') || 'fade';
            const distance = parseInt(container.getAttribute('data-distance')) || 50;
            const rotateValue = parseFloat(container.getAttribute('data-rotate')) || 0;
            const skewValue = parseFloat(container.getAttribute('data-skew')) || 0;
            const opacity = parseFloat(container.dataset.opacity) || 0;
            const scrub = container.dataset.scrub === 'true';
            const replay = container.dataset.replay === 'true';
            const start = container.dataset.start || 'top 80%';

            // Skip scroll-based animation if it's a click-only event
            if (isClickEvent) {
                // Just set initial states
                const elements = container.children;
                Array.from(elements).forEach(element => {
                    if (element.classList.contains('line')) {
                        const scaleAxis = element.dataset.scaleAxis || 'xy';
                        gsap.set(element, {
                            transformOrigin: element.dataset.scalePosition === 'left' ? 'left center' : 'center center',
                            scaleX: scaleAxis === 'x' ? 0 : 1,
                            scaleY: scaleAxis === 'y' ? 0 : 1,
                            scale: scaleAxis === 'xy' ? 0 : 1
                        });
                    } else {
                        gsap.set(element, { opacity: 0 });
                    }
                });
                return;
            }

            let elementsArray = Array.from(container.children);
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

            // Create timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: start,
                    end: scrub ? 'bottom top' : undefined,
                    scrub: scrub,
                    toggleActions: replay ? 
                        "play reverse play reverse" : 
                        "play none none none",
                    once: !replay
                }
            });

            // Set initial states and animate elements
            elementsArray.forEach((element, index) => {
                const initialState = {
                    opacity: opacity,
                    rotation: rotateValue,
                    skewX: skewValue,
                    transformOrigin: "center center"
                };

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
                else if (container.hasAttribute('data-scale')) {
                    const containerScale = parseFloat(container.dataset.scale);
                    const containerScaleAxis = container.dataset.scaleAxis || 'xy';
                    const containerScalePosition = container.dataset.scalePosition || 'center';

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

                const finalState = {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotation: 0,
                    skewX: 0,
                    duration: durationValue,
                    ease: easingValue,
                    delay: index * staggerValue + delayValue,
                    transformOrigin: "center center"
                };

                // Handle scale animation
                if (hasElementScale) {
                    const elementScaleAxis = element.dataset.scaleAxis || 'xy';
                    const scaleValue = parseFloat(element.dataset.scale) || 0;
                    
                    switch(elementScaleAxis) {
                        case 'x':
                            initialState.scaleX = scaleValue;
                            finalState.scaleX = 1;
                            break;
                        case 'y':
                            initialState.scaleY = scaleValue;
                            finalState.scaleY = 1;
                            break;
                        default:
                            initialState.scale = scaleValue;
                            finalState.scale = 1;
                    }
                }
                else if (container.hasAttribute('data-scale')) {
                    switch(container.dataset.scaleAxis) {
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
    playStaggerAnimation(container, reverse = false) {
        const elements = container.children;
        const delay = parseFloat(container.dataset.staggerDelay) || 0.2;
        const duration = parseFloat(container.dataset.duration) || 1;
        const ease = this.parseEasing(container.dataset.easing);
        const hasDirection = container.hasAttribute('data-direction');
        const direction = container.dataset.direction || 'fade';
        const distance = parseInt(container.dataset.distance) || 50;
        const shouldReverse = container.dataset.clickReverse === 'true';

        // Get elements array
        let elementsArray = Array.from(elements);
        
        // Create animation timeline
        const tl = gsap.timeline();

        // Always reset initial states for lines when opening
        if (!reverse) {
            elementsArray.forEach(element => {
                if (element.classList.contains('line')) {
                    const scalePosition = element.dataset.scalePosition || 'center';
                    const transformOrigin = (() => {
                        switch(scalePosition) {
                            case 'left': return 'left center';
                            case 'right': return 'right center';
                            case 'top': return 'center top';
                            case 'bottom': return 'center bottom';
                            default: return 'center center';
                        }
                    })();

                    // Set initial state with proper transform origin
                    gsap.set(element, {
                        transformOrigin: transformOrigin,
                        scaleX: 0,
                        immediateRender: true
                    });
                } else {
                    const initialState = { opacity: 0 };
                    if (hasDirection) {
                        switch(direction) {
                            case 'x': initialState.x = -distance; break;
                            case '-x': initialState.x = distance; break;
                            case 'y': initialState.y = -distance; break;
                            case '-y': initialState.y = distance; break;
                        }
                    }
                    gsap.set(element, initialState);
                }
            });
        }

        if (reverse && shouldReverse) {
            elementsArray = elementsArray.reverse();
            
            elementsArray.forEach((element, index) => {
                if (element.hasAttribute('data-scale')) {
                    const scaleAxis = element.dataset.scaleAxis || 'x';
                    const scaleProperty = `scale${scaleAxis.toUpperCase()}`;
                    const scalePosition = element.dataset.scalePosition || 'center';
                    const transformOrigin = (() => {
                        switch(scalePosition) {
                            case 'left': return 'left center';
                            case 'right': return 'right center';
                            case 'top': return 'center top';
                            case 'bottom': return 'center bottom';
                            default: return 'center center';
                        }
                    })();
                    
                    tl.to(element, {
                        [scaleProperty]: 0,
                        transformOrigin: transformOrigin,
                        duration: duration * 0.5,
                        ease: "power1.in"
                    }, index * (delay * 0.5));
                } else {
                    tl.to(element, {
                        opacity: 0,
                        y: 20,
                        duration: duration * 0.5,
                        ease: "power1.in"
                    }, index * (delay * 0.5));
                }
            });
        } else if (reverse && !shouldReverse) {
            tl.to(elementsArray, {
                opacity: 0,
                duration: duration * 0.5,
                ease: "power1.in"
            });
        } else {
            // Normal opening animation
            elementsArray.forEach((element, index) => {
                if (element.hasAttribute('data-scale')) {
                    const scaleAxis = element.dataset.scaleAxis || 'x';
                    const scaleProperty = `scale${scaleAxis.toUpperCase()}`;
                    const scalePosition = element.dataset.scalePosition || 'center';
                    const transformOrigin = (() => {
                        switch(scalePosition) {
                            case 'left': return 'left center';
                            case 'right': return 'right center';
                            case 'top': return 'center top';
                            case 'bottom': return 'center bottom';
                            default: return 'center center';
                        }
                    })();
                    
                    tl.to(element, {
                        [scaleProperty]: 1,
                        transformOrigin: transformOrigin,
                        duration: duration,
                        opacity: 1,
                        ease: ease
                    }, index * delay);
                } else {
                    tl.to(element, {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        duration: duration,
                        ease: ease
                    }, index * delay);
                }
            });
        }

        return new Promise(resolve => {
            tl.eventCallback("onComplete", resolve);
        });
    }

    initClickTriggers() {
        document.addEventListener('click', (e) => {
            const clickTarget = e.target;
            
            // Handle opening
            if (clickTarget.hasAttribute('data-stagger-trigger')) {
                const targetIds = clickTarget.getAttribute('data-stagger-trigger').split(' ');
                
                targetIds.forEach(targetId => {
                    const targetContainer = document.getElementById(targetId);
                    if (targetContainer && targetContainer.hasAttribute('data-stagger-reveal')) {
                        this.playStaggerAnimation(targetContainer);
                    }
                });
            }
            
            // Handle closing
            if (clickTarget.hasAttribute('data-stagger-close')) {
                const targetIds = clickTarget.getAttribute('data-stagger-close').split(' ');
                
                targetIds.forEach(targetId => {
                    const targetContainer = document.getElementById(targetId);
                    if (targetContainer && targetContainer.hasAttribute('data-stagger-reveal')) {
                        this.playStaggerAnimation(targetContainer, true);
                    }
                });
            }
        });
    }
}

// Initialize library
window.moonMoonStagger = new MoonMoonStagger(); 