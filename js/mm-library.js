// Moon-Moon Animation Library
class MoonMoon {
    constructor() {
        this.init();
    }

    init() {
        this.initParallax();
        this.initImageReveal();
        this.initStagger();
        this.initTextAnimation();
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
            // Find the target image within the container
            const target = container.querySelector('[data-scroll-image-reveal-target]');
            if (!target) return;

            // Get animation parameters from data attributes
            const duration = parseFloat(target.dataset.duration) || 1.5;
            const delay = parseFloat(target.dataset.delay) || 0;
            const easingValue = parseEasing(target.dataset.easing);
            const axis = target.dataset.scrollImageRevealAxis || 'y';

            // Determine the transform values based on axis
            const transformValues = {
                'x': { x: '100%', y: '0%' },
                '-x': { x: '-100%', y: '0%' },
                'y': { x: '0%', y: '100%' },
                '-y': { x: '0%', y: '-100%' }
            }[axis] || { x: '0%', y: '100%' };

            // Create and style the reveal element
            const revealEl = container.querySelector('.reveal');
            if (!revealEl) return;

            // Set initial styles
            gsap.set(revealEl, {
                overflow: 'hidden',
                position: 'relative'
            });

            gsap.set(target, {
                scale: 1.2,
                ...transformValues,
                opacity: 0
            });

            // Create the animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                    end: 'bottom top',
                    toggleActions: 'play none none reverse'
                }
            });

            tl.to(target, {
                x: '0%',
                y: '0%',
                opacity: 1,
                duration: duration,
                delay: delay,
                ease: easingValue
            })
            .to(target, {
                scale: 1,
                duration: duration * 1.4,
                ease: easingValue
            }, `-=${duration}`);
        });

        // Handle simple image reveals (backwards compatibility)
        const simpleRevealElements = document.querySelectorAll('[data-image-reveal]');
        
        simpleRevealElements.forEach(element => {
            if (element.hasAttribute('data-scroll-image-reveal')) return; // Skip if using new system

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

    // Text Animation
    initTextAnimation() {
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

        // Select all elements with the data-scroll-text-reveal attribute
        const textRevealElements = document.querySelectorAll("[data-scroll-text-reveal]");

        textRevealElements.forEach((element) => {
            const staggerValue = parseFloat(element.getAttribute('data-stagger')) || 0.1;
            const delayValue = parseFloat(element.getAttribute('data-delay')) || 0;
            const durationValue = parseFloat(element.getAttribute('data-duration')) || 1;
            const easingValue = parseEasing(element.getAttribute('data-easing'));
            const animationTypes = element.getAttribute('data-animate') ? element.getAttribute('data-animate').split(' ') : [];
            const axisValue = element.getAttribute('data-axis');

            let textContent;
            if (element.getAttribute('data-splitting') === 'chars') {
                textContent = SplitType.create(element).chars;
            } else if (element.getAttribute('data-splitting') === 'words') {
                textContent = SplitType.create(element).words;
            } else if (element.getAttribute('data-splitting') === 'lines') {
                const linesResults = SplitType.create(element).lines;

                if (animationTypes.includes('lines-up')) {
                    const wrappedLines = linesResults.map(line => {
                        const wrapper = document.createElement('div');
                        wrapper.style.overflow = 'hidden';
                        line.parentNode.insertBefore(wrapper, line);
                        wrapper.appendChild(line);
                        return wrapper;
                    });

                    gsap.fromTo(linesResults, 
                        { y: "100%" },
                        {
                            y: "0%",
                            ease: easingValue,
                            delay: delayValue,
                            duration: durationValue,
                            stagger: staggerValue,
                            scrollTrigger: {
                                trigger: element,
                                start: "top bottom",
                                end: "bottom top",
                                toggleActions: "play none none reverse",
                            }
                        }
                    );
                    return; // Exit early for lines-up animation
                }

                textContent = linesResults;
            } else {
                textContent = [element];
            }

            let animations = [];

            animationTypes.forEach((animationType) => {
                let animation;

                switch (animationType) {
                    case "shutter-word":
                        if (element.getAttribute('data-splitting') === 'words') {
                            const shutterColor = element.getAttribute('data-color') || 'black';
                            const axis = element.getAttribute('data-axis') || 'x';
                            
                            const transformOrigin = {
                                'x': 'right center',
                                '-x': 'left center',
                                'y': 'center top',
                                '-y': 'center bottom'
                            }[axis] || 'right center';

                            textContent.forEach(word => {
                                word.style.position = 'relative';
                                word.style.display = 'inline-block';
                                word.style.overflow = 'hidden';
                                
                                const wordSpan = document.createElement('span');
                                wordSpan.textContent = word.textContent;
                                word.textContent = '';
                                word.appendChild(wordSpan);
                                
                                const shutterSpan = document.createElement('span');
                                shutterSpan.style.backgroundColor = shutterColor;
                                shutterSpan.style.position = 'absolute';
                                shutterSpan.style.top = '0';
                                shutterSpan.style.left = '0';
                                shutterSpan.style.width = '100%';
                                shutterSpan.style.height = '100%';
                                shutterSpan.style.transformOrigin = transformOrigin;
                                word.appendChild(shutterSpan);
                            });

                            const animationProperty = axis.includes('y') ? 'scaleY' : 'scaleX';
                            animation = {
                                [animationProperty]: 0,
                                duration: durationValue,
                                ease: easingValue,
                                stagger: staggerValue,
                                delay: delayValue
                            };
                        }
                        break;

                    case "fade-in":
                        const fadeStart = parseFloat(element.getAttribute('data-fade-start')) || 0;
                        animation = {
                            opacity: fadeStart,
                            duration: durationValue,
                            ease: easingValue,
                            stagger: staggerValue,
                            delay: delayValue
                        };
                        break;

                    case "slide":
                        textContent.forEach(item => {
                            const wrapper = document.createElement('div');
                            wrapper.style.overflow = 'hidden';
                            wrapper.style.display = 'inline-block';
                            item.parentNode.insertBefore(wrapper, item);
                            wrapper.appendChild(item);
                        });
                        
                        const slideAxis = element.getAttribute('data-axis') || 'y';
                        const slideValue = {
                            'x': { x: "100%" },
                            '-x': { x: "-100%" },
                            'y': { y: "100%" },
                            '-y': { y: "-100%" }
                        }[slideAxis] || { y: "100%" };

                        animation = {
                            ...slideValue,
                            duration: durationValue,
                            ease: easingValue,
                            stagger: staggerValue,
                            delay: delayValue
                        };
                        break;

                    default:
                        animation = {
                            opacity: 0,
                            duration: durationValue,
                            ease: easingValue,
                            stagger: staggerValue,
                            delay: delayValue
                        };
                }

                if (animation) {
                    animations.push(animation);
                }
            });

            // Add axis animation if specified
            if (axisValue) {
                const axisAnimation = {
                    'x': { x: "100%" },
                    '-x': { x: "-100%" },
                    'y': { y: "100%" },
                    '-y': { y: "-100%" }
                }[axisValue];
                
                if (axisAnimation) {
                    animations.push(axisAnimation);
                }
            }

            // Combine and apply animations
            const combinedAnimation = Object.assign({}, ...animations);

            if (animationTypes.includes('shutter-word')) {
                gsap.to(textContent.map(word => word.lastChild), {
                    ...combinedAnimation,
                    ease: easingValue,
                    scrollTrigger: {
                        trigger: element,
                        start: "top bottom-=10%",
                        end: "bottom top+=10%",
                        toggleActions: "play none none reverse"
                    }
                });
            } else {
                gsap.from(textContent, {
                    ...combinedAnimation,
                    ease: easingValue,
                    scrollTrigger: {
                        trigger: element,
                        start: "top bottom-=10%",
                        end: "bottom top+=10%",
                        toggleActions: "play none none reverse"
                    }
                });
            }
        });
    }
}

// Initialize library
window.moonMoon = new MoonMoon(); 