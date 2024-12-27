// Moon-Moon Text Animation Library
class MoonMoonText {
    constructor() {
        this.init();
    }

    init() {
        this.initTextAnimation();
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

        // Function to determine stagger order
        const getStaggerOrder = (elements, method) => {
            switch (method) {
                case 'start':
                    return elements; // No change needed
                case 'end':
                    return Array.from(elements).reverse();
                case 'center':
                    return elements.sort((a, b) => Math.abs(elements.length / 2 - Array.from(elements).indexOf(a)) - Math.abs(elements.length / 2 - Array.from(elements).indexOf(b)));
                case 'random':
                    return elements.sort(() => Math.random() - 0.5);
                default:
                    return elements;
            }
        };

        // Select all elements with the data-scroll-text-reveal attribute
        const textRevealElements = document.querySelectorAll("[data-scroll-text-reveal]");

        textRevealElements.forEach((element) => {
            const staggerValue = parseFloat(element.getAttribute('data-stagger')) || 0.1;
            const delayValue = parseFloat(element.getAttribute('data-delay')) || 0;
            const durationValue = parseFloat(element.getAttribute('data-duration')) || 1;
            const easingValue = parseEasing(element.getAttribute('data-easing'));
            const animationTypes = element.getAttribute('data-animate') ? element.getAttribute('data-animate').split(' ') : [];
            const axis = element.getAttribute('data-axis');
            const axisValue = element.getAttribute('data-axis-value') || (axis?.startsWith('-') ? '-100%' : '100%');
            const rotateValue = parseFloat(element.getAttribute('data-rotate')) || 0;
            const skewValue = parseFloat(element.getAttribute('data-skew')) || 0;
            const scrubAttr = element.getAttribute('data-scrub');
            const scrub = scrubAttr === 'true' ? true : (scrubAttr ? parseFloat(scrubAttr) : false);
            const startTrigger = element.dataset.start || "top bottom-=10%";
            const endTrigger = element.dataset.end || "bottom top+=10%";
            const staggerMethod = element.getAttribute('data-stagger-method') || 'start';

            // Update ScrollTrigger configuration in animations
            const scrollTriggerConfig = {
                trigger: element,
                start: startTrigger,
                end: endTrigger,
                scrub: scrub,
                toggleActions: "play none none reverse"
            };

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
                            skewX: skewValue,
                            rotate: rotateValue,
                            stagger: staggerValue,
                            scrollTrigger: scrollTriggerConfig
                        }
                    );
                    return; // Exit early for lines-up animation
                }

                textContent = linesResults;
            } else {
                textContent = [element];
            }

            // Apply stagger order
            textContent = getStaggerOrder(textContent, staggerMethod);

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
                                delay: delayValue,
                                skewX: skewValue,
                                rotate: rotateValue,
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
                            delay: delayValue,
                            skewX: skewValue,
                            rotate: rotateValue,
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

                        const slideValue = {
                            'x': { x: axisValue },
                            '-x': { x: `-${axisValue}` },
                            'y': { y: axisValue }, 
                            '-y': { y: `-${axisValue}` }
                        }[axis] || { y: axisValue };
                        
                        animation = {
                            ...slideValue,
                            duration: durationValue,
                            ease: easingValue,
                            stagger: staggerValue,
                            delay: delayValue,
                            skewX: skewValue,
                            rotate: rotateValue,
                        };
                        break;

                    default:
                        animation = {
                            opacity: 0,
                            duration: durationValue,
                            ease: easingValue,
                            stagger: staggerValue,
                            delay: delayValue,
                            skewX: skewValue,
                            rotate: rotateValue,
                        };
                }

                if (animation) {
                    animations.push(animation);
                }
            });

            // Add axis animation if specified
            if (axis) {
                const axisAnimation = {
                    'x': { x: axisValue },
                    '-x': { x: `-${axisValue}` },
                    'y': { y: axisValue }, 
                    '-y': { y: `-${axisValue}` }
                }[axis];
                
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
                    scrollTrigger: scrollTriggerConfig
                });
            } else {
                gsap.from(textContent, {
                    ...combinedAnimation,
                    ease: easingValue,
                    scrollTrigger: scrollTriggerConfig
                });
            }
        });
    }
}

// Initialize library
window.moonMoonText = new MoonMoonText(); 