// Moon-Moon SVG Animation Library
class MoonMoonSVG {
    constructor() {
        this.init();
    }

    init() {
        gsap.registerPlugin(ScrollTrigger, CustomEase);
        this.initSVGAnimation();
    }

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

    // Add method to play animation
    playSVGAnimation(wrapper) {
        const svg = wrapper.querySelector('svg');
        if (!svg) return;

        const paths = svg.querySelectorAll('path, circle, rect, line, polyline, polygon');
        const delay = parseFloat(wrapper.dataset.staggerDelay) || 0.1;
        const initialDelay = parseFloat(wrapper.dataset.delay) || 0;
        const staggerMethod = wrapper.dataset.stagger || 'start';
        const duration = parseFloat(wrapper.dataset.duration) || 0.8;
        const ease = this.parseEasing(wrapper.dataset.easing);

        // Order paths based on stagger method
        let pathsArray = Array.from(paths);
        switch(staggerMethod) {
            case 'end':
                pathsArray = pathsArray.reverse();
                break;
            case 'center':
                pathsArray.sort((a, b) => {
                    return Math.abs(pathsArray.length / 2 - pathsArray.indexOf(a)) - 
                           Math.abs(pathsArray.length / 2 - pathsArray.indexOf(b));
                });
                break;
            case 'random':
                pathsArray.sort(() => Math.random() - 0.5);
                break;
        }

        // Reset to initial state
        gsap.set(pathsArray, { opacity: 0 });

        // Create and play animation
        return gsap.to(pathsArray, {
            opacity: 1,
            duration: duration,
            stagger: delay,
            delay: initialDelay,
            ease: ease
        });
    }

    initSVGAnimation() {
        const svgWrappers = document.querySelectorAll('[data-svg-stagger]');

        svgWrappers.forEach(wrapper => {
            const isClickEvent = wrapper.dataset.clickEvent === 'true';
            const isHoverEvent = wrapper.dataset.hover === 'true';
            const rotate = parseFloat(wrapper.dataset.rotate) || 0;
            const loop = wrapper.dataset.loop === 'true';
            const scrub = wrapper.dataset.scrub === 'true';
            
            // Handle constant rotation if loop is true
            if (rotate && loop) {
                const svg = wrapper.querySelector('svg');
                if (!svg) return;
                
                gsap.to(svg, {
                    rotation: rotate,
                    duration: 2,
                    ease: "none",
                    repeat: -1
                });
                return;
            }
            
            // Handle scroll-based rotation if scrub is true
            if (rotate && scrub) {
                const svg = wrapper.querySelector('svg');
                if (!svg) return;
                
                gsap.to(svg, {
                    rotation: rotate,
                    ease: "none",
                    scrollTrigger: {
                        trigger: wrapper,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
                return;
            }

            if (isHoverEvent) {
                const svg = wrapper.querySelector('svg');
                if (!svg) return;

                const paths = svg.querySelectorAll('path, circle, rect, line, polyline, polygon');
                const delay = parseFloat(wrapper.dataset.staggerDelay) || 0.1;
                const staggerMethod = wrapper.dataset.stagger || 'start';
                const duration = parseFloat(wrapper.dataset.duration) || 0.8;
                const ease = this.parseEasing(wrapper.dataset.easing);

                // Order paths based on stagger method
                let pathsArray = Array.from(paths);
                switch(staggerMethod) {
                    case 'end':
                        pathsArray = pathsArray.reverse();
                        break;
                    case 'center':
                        pathsArray.sort((a, b) => {
                            return Math.abs(pathsArray.length / 2 - pathsArray.indexOf(a)) - 
                                   Math.abs(pathsArray.length / 2 - pathsArray.indexOf(b));
                        });
                        break;
                    case 'random':
                        pathsArray.sort(() => Math.random() - 0.5);
                        break;
                }

                // Set initial state to visible
                gsap.set(pathsArray, { opacity: 1 });

                // Create hover timeline
                const tl = gsap.timeline({ paused: true })
                    .to(pathsArray, {
                        opacity: 0,
                        duration: duration/2,
                        stagger: delay,
                        ease: ease
                    })
                    .to(pathsArray, {
                        opacity: 1,
                        duration: duration/2,
                        stagger: delay,
                        ease: ease
                    });

                // Add hover events
                wrapper.addEventListener('mouseenter', () => tl.play());
                wrapper.addEventListener('mouseleave', () => tl.reverse());
            } 
            else if (!isClickEvent) {
                // Normal scroll-triggered animation
                const svg = wrapper.querySelector('svg');
                if (!svg) return;

                const paths = svg.querySelectorAll('path, circle, rect, line, polyline, polygon');
                const delay = parseFloat(wrapper.dataset.staggerDelay) || 0.1;
                const initialDelay = parseFloat(wrapper.dataset.delay) || 0;
                const staggerMethod = wrapper.dataset.stagger || 'start';
                const duration = parseFloat(wrapper.dataset.duration) || 0.8;
                const ease = this.parseEasing(wrapper.dataset.easing);

                // Order paths based on stagger method
                let pathsArray = Array.from(paths);
                switch(staggerMethod) {
                    case 'end':
                        pathsArray = pathsArray.reverse();
                        break;
                    case 'center':
                        pathsArray.sort((a, b) => {
                            return Math.abs(pathsArray.length / 2 - pathsArray.indexOf(a)) - 
                                   Math.abs(pathsArray.length / 2 - pathsArray.indexOf(b));
                        });
                        break;
                    case 'random':
                        pathsArray.sort(() => Math.random() - 0.5);
                        break;
                }

                gsap.set(pathsArray, { opacity: 0 });

                gsap.to(pathsArray, {
                    opacity: 1,
                    duration: duration,
                    stagger: delay,
                    delay: initialDelay,
                    ease: ease,
                    scrollTrigger: {
                        trigger: wrapper,
                        start: "top bottom-=10%",
                        toggleActions: "play none none reverse"
                    }
                });
            }
        });
    }
}

// Initialize library
window.moonMoonSVG = new MoonMoonSVG();

// Add global function to play animation
window.playSVGAnimation = function(id) {
    const wrapper = document.getElementById(id);
    if (wrapper) {
        window.moonMoonSVG.playSVGAnimation(wrapper);
    }
} 