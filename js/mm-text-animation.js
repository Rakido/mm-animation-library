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
            const staggerValue = parseFloat(element.getAttribute('data-stagger')) || 0.05;
            const staggerMethod = element.getAttribute('data-stagger-method') || 'start';
            const delayValue = parseFloat(element.getAttribute('data-delay')) || 0;
            const durationValue = parseFloat(element.getAttribute('data-duration')) || 1;
            const easingValue = parseEasing(element.getAttribute('data-easing'));
            const animationTypes = element.getAttribute('data-animate') ? element.getAttribute('data-animate').split(' ') : [];
            const axis = element.getAttribute('data-axis');
            const axisValue = element.getAttribute('data-axis-value') || '100%';
            const rotateValue = parseFloat(element.getAttribute('data-rotate')) || 0;
            const skewValue = parseFloat(element.getAttribute('data-skew')) || 0;
            const scrubAttr = element.getAttribute('data-scrub');
            const scrub = scrubAttr === 'true' ? true : (scrubAttr ? parseFloat(scrubAttr) : false);
            const startTrigger = element.dataset.start || "top bottom-=10%";
            const endTrigger = element.dataset.end || "bottom top+=10%";
            const revert = element.hasAttribute('data-revert') ? 
                element.dataset.revert === 'false' : false; // Default to true if not specified

            // Create ScrollTrigger configuration first
            const scrollTriggerConfig = {
                trigger: element,
                start: startTrigger,
                end: endTrigger,
                scrub: scrub,
                toggleActions: revert ? 
                    "play reverse play reverse" : 
                    "play none none none",
                once: !revert
            };

            // Process the element to get textContent
            let textContent;
            
            if (element.getAttribute('data-splitting') === 'lines') {
                // Handle lines splitting - find target elements
                let targetElements;
                if (element.tagName.toLowerCase() === 'div') {
                    // If it's a div, find all p elements inside
                    targetElements = element.querySelectorAll('p');
                } else {
                    // Otherwise, use the element itself
                    targetElements = [element];
                }

                // Process each target element
                targetElements.forEach(targetElement => {
                    const splitResult = SplitType.create(targetElement, {
                        types: 'lines,words,chars',
                        tagName: 'div'
                    });

                    if (animationTypes.includes('lines-up')) {
                        // Get all lines
                        const lines = splitResult.lines;
                        
                        // For each line, wrap its contents in a div that will animate
                        lines.forEach(line => {
                            // Set styles on the line itself
                            line.style.overflow = 'hidden';
                            line.style.display = 'block';
                            line.style.lineHeight = 'normal';
                            line.style.position = 'relative';
                            
                            // Create inner div that will animate
                            const innerDiv = document.createElement('div');
                            innerDiv.style.display = 'block';
                            innerDiv.style.position = 'relative';
                            innerDiv.style.lineHeight = 'inherit';
                            
                            // Move all contents of the line into the inner div
                            while (line.firstChild) {
                                innerDiv.appendChild(line.firstChild);
                            }
                            
                            // Add the inner div to the line
                            line.appendChild(innerDiv);
                        });

                        // Create a new timeline for this animation
                        const tl = gsap.timeline({
                            scrollTrigger: {
                                ...scrollTriggerConfig,
                                onEnter: function() {
                                    if (!scrub) {
                                        tl.restart(true, false);
                                    }
                                },
                                onEnterBack: function() {
                                    if (!scrub && revert) {
                                        tl.restart(true, false);
                                    }
                                }
                            }
                        });

                        // Add the animation to the timeline
                        tl.fromTo(lines.map(line => line.firstChild), 
                            { y: "100%" },
                            {
                                y: "0%",
                                ease: easingValue,
                                delay: delayValue,
                                duration: durationValue,
                                skewX: skewValue,
                                rotate: rotateValue,
                                stagger: staggerValue
                            }
                        );
                    }
                    textContent = splitResult.lines;
                });
            } else if (element.getAttribute('data-splitting') === 'words') {
                // Handle words splitting
                const splitResult = SplitType.create(element, {
                    types: 'words',
                    tagName: 'div'
                });
                textContent = splitResult.words;
            } else if (element.getAttribute('data-splitting') === 'chars') {
                // Handle chars splitting
                const splitResult = SplitType.create(element, {
                    types: 'chars',
                    tagName: 'div'
                });
                textContent = splitResult.chars;
            } else {
                textContent = [element];
            }

            // Skip the rest of the animation setup if we've already handled lines-up
            if (animationTypes.includes('lines-up') && element.getAttribute('data-splitting') === 'lines') {
                return;
            }

            // Add CSS to ensure proper display
            if (element.getAttribute('data-splitting') === 'words') {
                textContent.forEach(word => {
                    word.style.display = 'inline-block';
                    if (animationTypes.includes('slide')) {
                        const wrapper = document.createElement('div');
                        wrapper.style.display = 'inline-block';
                        wrapper.style.overflow = 'hidden';
                        wrapper.style.verticalAlign = 'top';
                        
                        word.parentNode.insertBefore(wrapper, word);
                    }
                });
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
                            rotation: rotateValue,
                        };
                        break;

                    case "slide":
                        textContent.forEach(item => {
                            const wrapper = document.createElement('div');
                            wrapper.style.overflow = 'hidden';
                            wrapper.style.display = 'inline-block';
                            
                            if (element.getAttribute('data-splitting') === 'chars') {
                                item.style.display = 'inline-block';
                                item.style.transformOrigin = 'center center';
                            }
                            
                            item.parentNode.insertBefore(wrapper, item);
                            wrapper.appendChild(item);
                        });

                        // Direction handling for from -> to animation
                        let slideValue = {};
                        if (axis) {
                            const property = axis.replace('-', '');
                            const value = axisValue.replace('-', '');
                            
                            // Set the starting position based on axis direction
                            switch(axis) {
                                case 'x':
                                    slideValue.x = value;
                                    break;
                                case '-x':
                                    slideValue.x = `-${value}`;
                                    break;
                                case 'y':
                                    slideValue.y = value;
                                    break;
                                case '-y':
                                    slideValue.y = `-${value}`;
                                    break;
                            }
                        } else {
                            slideValue.y = axisValue;
                        }

                        // Create animation object
                        animation = {
                            ...slideValue,
                            duration: durationValue,
                            ease: easingValue,
                            stagger: staggerValue,
                            delay: delayValue
                        };

                        // Add rotation and skew if needed
                        if (rotateValue) animation.rotation = rotateValue;
                        if (skewValue) animation.skewX = skewValue;

                        // Add transform origin for characters
                        if (element.getAttribute('data-splitting') === 'chars') {
                            animation.transformOrigin = 'center center';
                        }
                        break;

                    case "scale":
                        // Set transform origin on elements
                        textContent.forEach(item => {
                            item.style.transformOrigin = 'center center';
                            // For lines, ensure proper scaling
                            if (element.getAttribute('data-splitting') === 'lines') {
                                item.style.display = 'block';
                            } else {
                                item.style.display = 'inline-block';
                            }
                        });

                        animation = {
                            scale: 0,
                            duration: durationValue,
                            ease: easingValue,
                            stagger: staggerValue,
                            delay: delayValue,
                            transformOrigin: "center center"
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
                            rotation: rotateValue,
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

            // Create a new timeline for this animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    ...scrollTriggerConfig,
                    onEnter: function() {
                        if (!scrub) {
                            tl.restart(true, false);
                        }
                    },
                    onEnterBack: function() {
                        if (!scrub && revert) {
                            tl.restart(true, false);
                        }
                    }
                }
            });

            if (animationTypes.includes('shutter-word')) {
                tl.to(textContent.map(word => word.lastChild), {
                    ...combinedAnimation,
                    ease: easingValue
                });
            } else {
                tl.from(textContent, {
                    ...combinedAnimation,
                    ease: easingValue
                });
            }

            if (element.getAttribute('data-hover') === 'true') {
                // Create hover animation instead of scroll animation
                this.createHoverAnimation(element, textContent, animationTypes[0], {
                    duration: durationValue,
                    ease: easingValue,
                    stagger: staggerValue
                });
                return; // Skip regular scroll animation
            }
        });
    }

    // Add this helper function at the class level
    createHoverAnimation(element, textContent, animationType, animationConfig) {
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        wrapper.style.overflow = 'hidden';
        
        // Clone the text elements and split them
        const staticText = element.cloneNode(true);
        const hoverText = element.cloneNode(true);
        
        // Split both texts
        const splitType = element.getAttribute('data-splitting') || 'chars';
        const staticSplit = SplitType.create(staticText, { types: splitType });
        const hoverSplit = SplitType.create(hoverText, { types: splitType });
        
        // Style the wrapper
        wrapper.style.width = 'fit-content';
        
        // Style both text layers
        staticText.style.position = 'relative';
        hoverText.style.position = 'absolute';
        hoverText.style.top = '0';
        hoverText.style.left = '0';
        hoverText.style.width = '100%';
        
        // Add to wrapper
        wrapper.appendChild(staticText);
        wrapper.appendChild(hoverText);
        
        // Replace original element with wrapper
        element.parentNode.replaceChild(wrapper, element);

        // Get the elements to animate based on splitting type
        const getElements = (container, type) => {
            switch(type) {
                case 'chars':
                    return container.querySelectorAll('.char');
                case 'words':
                    return container.querySelectorAll('.word');
                case 'lines':
                    return container.querySelectorAll('.line');
                default:
                    return container.querySelectorAll('.char');
            }
        };

        const staticElements = getElements(staticText, splitType);
        const hoverElements = getElements(hoverText, splitType);

        // Set initial states
        if (animationType === 'slide') {
            // Make static text fully visible initially
            gsap.set(staticElements, {
                yPercent: 0
            });
            
            // Set hover text initially hidden below
            gsap.set(hoverElements, {
                yPercent: 100
            });

            // Ensure both layers are visible
            gsap.set([staticElements, hoverElements], {
                opacity: 1
            });
        }

        // Create hover timeline
        const hoverTl = gsap.timeline({ paused: true });

        if (animationType === 'slide') {
            hoverTl
                .to(staticElements, {
                    yPercent: 100, // Move original text down
                    duration: animationConfig.duration || 0.5,
                    ease: animationConfig.ease || "power2.out",
                    stagger: animationConfig.stagger || 0.02
                })
                .to(hoverElements, {
                    yPercent: 0, // Move hover text to original position
                    duration: animationConfig.duration || 0.5,
                    ease: animationConfig.ease || "power2.out",
                    stagger: animationConfig.stagger || 0.02
                }, "<"); // Start at same time as previous animation
        }

        // Add hover events
        wrapper.addEventListener('mouseenter', () => hoverTl.play());
        wrapper.addEventListener('mouseleave', () => hoverTl.reverse());
    }
}

// Initialize library
window.moonMoonText = new MoonMoonText(); 