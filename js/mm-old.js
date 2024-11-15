// Moon-Moon Animation Library (Legacy)
class MoonMoon {
    constructor() {
        this.init();
    }

    init() {
        this.initParallax();
        this.initImageReveal();
        this.initStagger();
    }

    // Image Parallax
    initParallax() {
        const parallaxElements = document.querySelectorAll('[data-image-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            
            gsap.to(element, {
                y: () => (element.offsetHeight * speed),
                ease: "none",
                scrollTrigger: {
                    trigger: element,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    }

    // Image Reveal
    initImageReveal() {
        // Register necessary plugins
        gsap.registerPlugin(ScrollTrigger, CustomEase);

        // Function to parse easing value
        const parseEasing = (easingValue) => {
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
        };

        // Select all elements with data-scroll-image-reveal
        const imageRevealElements = document.querySelectorAll('[data-scroll-image-reveal]');

        imageRevealElements.forEach(container => {
            // ... rest of image reveal code ...
        });

        // Handle simple image reveals (backwards compatibility)
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
                    start: 'top 80%',
                    end: 'bottom top',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }

    // Stagger Animation
    initStagger() {
        const staggerElements = document.querySelectorAll('[data-stagger]');
        
        staggerElements.forEach(container => {
            const elements = container.children;
            const delay = container.dataset.staggerDelay || 0.2;

            gsap.from(elements, {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: delay,
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%'
                }
            });
        });
    }
}

// Initialize library
window.moonMoon = new MoonMoon(); 