// Moon-Moon Parallax Animation Library
class MoonMoonParallax {
    constructor() {
        this.init();
    }

    init() {
        // Register necessary plugins
        gsap.registerPlugin(ScrollTrigger);
        
        // Initialize parallax elements
        this.initParallax();
        // Initialize color transitions
        this.initColorTransitions();
    }

    initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        parallaxElements.forEach(element => {
            // Skip transform animations if element has data-parallax-color
            if (element.hasAttribute('data-parallax-color')) {
                return;
            }

            // Get animation parameters
            const direction = element.dataset.parallaxDirection || 'y';
            const speed = parseFloat(element.dataset.speed) || 0.5;
            const scrubAttr = element.getAttribute('data-scrub');
            const scrub = scrubAttr === 'true' ? true : (scrubAttr ? parseFloat(scrubAttr) : false);
            const pinPosition = element.dataset.parallaxPin;
            const animate = element.dataset.animate;
            const hasImageParallax = element.hasAttribute('data-image-parallax');
            const hasVideoParallax = element.hasAttribute('data-video-parallax');

            // If it's a video parallax
            if (hasVideoParallax) {
                const video = element.querySelector('video');
                if (video) {
                    const direction = element.dataset.direction || 'y';
                    const speed = parseFloat(element.dataset.speed) || 35;
                    const zoomPercentage = parseFloat(element.dataset.zoomPercentage) || 1.3;

                    const initVideoAnimation = () => {
                        // Set initial state with scale
                        gsap.set(video, {
                            scale: zoomPercentage,
                            yPercent: -speed/2,
                            force3D: true,
                            transformOrigin: "center center",
                            backfaceVisibility: "hidden"
                        });

                        // Create a smoother animation
                        gsap.to(video, {
                            yPercent: speed/2,
                            ease: "none",
                            force3D: true,
                            scrollTrigger: {
                                trigger: element,
                                start: "top bottom",
                                end: "bottom+=20% top",
                                scrub: 2,
                                invalidateOnRefresh: true,
                                fastScrollEnd: true,
                                preventOverlaps: true,
                                anticipatePin: 1,
                                onUpdate: (self) => {
                                    if (self.progress <= 0.01) {
                                        gsap.set(video, { yPercent: -speed/2 });
                                    } else if (self.progress >= 0.99) {
                                        gsap.set(video, { yPercent: speed/2 });
                                    }
                                },
                                onLeave: (self) => {
                                    gsap.to(video, {
                                        yPercent: speed/2,
                                        duration: 0.1,
                                        overwrite: true
                                    });
                                },
                                onLeaveBack: (self) => {
                                    gsap.to(video, {
                                        yPercent: -speed/2,
                                        duration: 0.1,
                                        overwrite: true
                                    });
                                }
                            }
                        });

                        // Separate ScrollTrigger for performance optimization
                        ScrollTrigger.create({
                            trigger: element,
                            start: "top bottom",
                            end: "bottom+=20% top",
                            onEnter: () => {
                                video.style.willChange = 'transform';
                            },
                            onLeave: () => {
                                video.style.willChange = 'auto';
                                gsap.set(video, { yPercent: speed/2 });
                            },
                            onEnterBack: () => {
                                video.style.willChange = 'transform';
                            },
                            onLeaveBack: () => {
                                video.style.willChange = 'auto';
                                gsap.set(video, { yPercent: -speed/2 });
                            }
                        });
                    };

                    // Initialize when video is ready
                    if (video.readyState >= 2) {
                        initVideoAnimation();
                    } else {
                        video.addEventListener('loadeddata', initVideoAnimation);
                    }
                }
                return;
            }

            // If it's an image parallax
            if (hasImageParallax) {
                const image = element.querySelector('img');
                if (image) {
                    const direction = element.dataset.direction || 'y';
                    const speed = parseFloat(element.dataset.speed) || 35;
                    const scrubAttr = element.getAttribute('data-scrub');
                    const scrub = scrubAttr === 'true' ? true : (scrubAttr ? parseFloat(scrubAttr) : true);
                    const hasZoom = element.getAttribute('data-zoom') === 'true';
                    const zoomPercentage = parseFloat(element.dataset.zoomPercentage) || 1.5;

                    // Set initial position and scale
                    const initialState = {
                        scale: hasZoom ? 1 : undefined,
                        transformOrigin: 'center center'
                    };

                    // Add direction-based initial position
                    switch(direction) {
                        case 'x': initialState.xPercent = -speed/2; break;
                        case '-x': initialState.xPercent = speed/2; break;
                        case 'y': initialState.yPercent = -speed/2; break;
                        case '-y': initialState.yPercent = speed/2; break;
                    }

                    // Set initial state
                    gsap.set(image, initialState);

                    // Create final state
                    const finalState = {
                        ease: "none",
                        scrollTrigger: {
                            trigger: element,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: scrub,
                            invalidateOnRefresh: true
                        }
                    };

                    // Add direction-based final position
                    switch(direction) {
                        case 'x': finalState.xPercent = speed/2; break;
                        case '-x': finalState.xPercent = -speed/2; break;
                        case 'y': finalState.yPercent = speed/2; break;
                        case '-y': finalState.yPercent = -speed/2; break;
                    }

                    // Add zoom if enabled
                    if (hasZoom) {
                        finalState.scale = zoomPercentage;
                    }

                    // Create the animation
                    gsap.to(image, finalState);
                }
                return;
            }

            // If it's a marquee animation
            if (animate === 'marquee') {
                const direction = element.dataset.direction || 'y';
                this.initMarquee(element);
                return;
            }

            // New scroll trigger parameters
            const startTrigger = element.dataset.start || "top bottom";
            const endTrigger = element.dataset.end || "bottom top";

            // Handle pinned elements
            if (pinPosition) {
                // Set initial styles
                gsap.set(element, {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    xPercent: -50,
                    yPercent: -50,
                });

                // Calculate target positions based on pin position
                let targetX, targetY;
                const section = element.closest('section');
                const sectionWidth = section.offsetWidth;
                const sectionHeight = section.offsetHeight;
                const padding = 40; // Padding from edges

                switch(pinPosition) {
                    case 'top-left':
                        targetX = -sectionWidth/2 + padding;
                        targetY = -sectionHeight/2 + padding;
                        break;
                    case 'top-right':
                        targetX = sectionWidth/2 - padding;
                        targetY = -sectionHeight/2 + padding;
                        break;
                    case 'bottom-left':
                        targetX = -sectionWidth/2 + padding;
                        targetY = sectionHeight/2 - padding;
                        break;
                    case 'bottom-right':
                        targetX = sectionWidth/2 - padding;
                        targetY = sectionHeight/2 - padding;
                        break;
                }

                // Create animation
                gsap.to(element, {
                    x: targetX,
                    y: targetY,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: startTrigger,
                        end: endTrigger,
                        scrub: scrub,
                        invalidateOnRefresh: true
                    }
                });
            } else {
                // Original parallax code for non-pinned elements
                const range = window.innerHeight * speed;
                let transformFrom = {};
                let transformTo = {};

                switch(direction) {
                    case 'x':
                        transformFrom = { x: -range };
                        transformTo = { x: range };
                        break;
                    case 'y':
                        transformFrom = { y: -range };
                        transformTo = { y: range };
                        break;
                    case 'xy':
                        transformFrom = { x: -range, y: -range };
                        transformTo = { x: range, y: range };
                        break;
                    default:
                        transformFrom = { y: -range };
                        transformTo = { y: range };
                }

                gsap.fromTo(element, 
                    transformFrom,
                    {
                        ...transformTo,
                        ease: "none",
                        scrollTrigger: {
                            trigger: element.closest('section'),
                            start: startTrigger,
                            end: endTrigger,
                            scrub: scrub,
                            invalidateOnRefresh: true
                        }
                    }
                );
            }

            // Performance optimization
            element.style.willChange = 'transform';
        });

        // Cleanup will-change
        ScrollTrigger.addEventListener("refresh", () => {
            requestAnimationFrame(() => {
                parallaxElements.forEach(element => {
                    element.style.willChange = 'auto';
                });
            });
        });
    }

    initMarquee(element) {
        // Wait for images to load if any
        const images = element.querySelectorAll('img');
        const loadPromises = Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        });

        Promise.all(loadPromises).then(() => {
            const speed = parseFloat(element.dataset.marqueeSpeed) || 50;
            const direction = element.dataset.direction || 'y';
            const gap = parseInt(getComputedStyle(element).gap) || 0;
            const easingValue = element.dataset.easing || 'none';
            const scrubAttr = element.getAttribute('data-scrub');
            const scrub = scrubAttr === 'true' ? true : (scrubAttr ? parseFloat(scrubAttr) : false);

            // Create container for smooth scrolling
            const container = document.createElement('div');
            container.style.overflow = 'hidden';
            element.parentNode.insertBefore(container, element);
            container.appendChild(element);

            // Set flex direction based on axis
            if (direction.includes('y')) {
                element.style.flexDirection = 'column';
            }

            // Clone items immediately to ensure content
            const originalItems = Array.from(element.children);
            const itemWidth = originalItems[0].offsetWidth + gap;
            const itemHeight = originalItems[0].offsetHeight + gap;
            
            // Calculate how many sets we need to fill viewport plus buffer
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const containerWidth = direction.includes('x') ? viewportWidth * 2 : itemWidth * originalItems.length;
            const containerHeight = direction.includes('y') ? viewportHeight * 2 : itemHeight * originalItems.length;
            
            const setsNeededX = Math.ceil(containerWidth / (itemWidth * originalItems.length));
            const setsNeededY = Math.ceil(containerHeight / (itemHeight * originalItems.length));
            const setsNeeded = Math.max(3, direction.includes('y') ? setsNeededY : setsNeededX);

            // Clone sets
            for (let i = 0; i < setsNeeded; i++) {
                originalItems.forEach(item => {
                    const clone = item.cloneNode(true);
                    element.appendChild(clone);
                });
            }

            // Calculate total size for animation
            const totalSize = direction.includes('y') ? 
                itemHeight * originalItems.length :
                itemWidth * originalItems.length;

            // Animation configuration
            const animConfig = {
                ease: easingValue,
                repeat: -1,
                [direction.includes('y') ? 'y' : 'x']: direction.startsWith('-') ? -totalSize : totalSize
            };

            // Set initial position
            if (!direction.startsWith('-')) {
                gsap.set(element, {
                    [direction.includes('y') ? 'y' : 'x']: -totalSize
                });
            }

            if (scrub) {
                // Scroll-based animation
                gsap.to(element, {
                    ...animConfig,
                    scrollTrigger: {
                        trigger: container,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: scrub,
                        onUpdate: (self) => {
                            if (self.progress === 1) {
                                const prop = direction.includes('y') ? 'y' : 'x';
                                gsap.set(element, { [prop]: direction.startsWith('-') ? 0 : -totalSize });
                            }
                        }
                    }
                });
            } else {
                // Time-based animation
                gsap.to(element, {
                    ...animConfig,
                    duration: speed,
                    onRepeat: () => {
                        const prop = direction.includes('y') ? 'y' : 'x';
                        gsap.set(element, { 
                            [prop]: direction.startsWith('-') ? 0 : -totalSize 
                        });
                    }
                });

                // Hover controls
                element.addEventListener('mouseenter', () => {
                    gsap.to(element.getAnimations(), { timeScale: 0, duration: 0.5 });
                });

                element.addEventListener('mouseleave', () => {
                    gsap.to(element.getAnimations(), { timeScale: 1, duration: 0.5 });
                });
            }
        });
    }

    initColorTransitions() {
        const colorSections = document.querySelectorAll('[data-parallax][data-parallax-color]');
        
        // Create pairs of sections for color transitions
        for (let i = 0; i < colorSections.length - 1; i++) {
            const currentSection = colorSections[i];
            const nextSection = colorSections[i + 1];
            
            // Get colors
            const fromColor = currentSection.dataset.parallaxColor;
            const toColor = nextSection.dataset.parallaxColor;
            
            // Set initial background color for the first section
            currentSection.style.backgroundColor = fromColor;
            
            // Create the color transition
            gsap.to(currentSection, {
                backgroundColor: toColor,
                ease: "none",
                scrollTrigger: {
                    trigger: nextSection,
                    start: "top bottom",
                    end: "top center",
                    scrub: true,
                    invalidateOnRefresh: true,
                    onEnter: () => {
                        currentSection.style.willChange = 'background-color';
                    },
                    onLeave: () => {
                        currentSection.style.willChange = 'auto';
                    },
                    onEnterBack: () => {
                        currentSection.style.willChange = 'background-color';
                    },
                    onLeaveBack: () => {
                        currentSection.style.willChange = 'auto';
                    }
                }
            });

            // Set initial background color for the next section
            nextSection.style.backgroundColor = toColor;
        }

        // Set the last section's color
        if (colorSections.length > 0) {
            const lastSection = colorSections[colorSections.length - 1];
            lastSection.style.backgroundColor = lastSection.dataset.parallaxColor;
        }
    }

    // Utility method to handle window resize
    handleResize() {
        ScrollTrigger.refresh();
    }
}

// Initialize library
window.moonMoonParallax = new MoonMoonParallax();

// Handle window resize
window.addEventListener('resize', () => {
    window.moonMoonParallax.handleResize();
}); 