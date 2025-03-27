// Moon-Moon Image Reveal Animation Library
class MoonMoonImageReveal {
    constructor() {
        this.init();
    }

    init() {
        // Initialize reveals
        this.initImageReveal();
    }

    // Parse easing value helper
    parseEasing(easingValue) {
        if (!easingValue) return "power4";

        // Check if it's a comma-separated bezier
        if (/^[\d.,]+$/.test(easingValue)) {
            const values = easingValue.split(',').map(Number);
            if (values.length === 4) {
                const easeName = `customEase${Math.random().toString(36).substr(2, 9)}`;
                CustomEase.create(easeName, `M0,0 C${values[0]},${values[1]} ${values[2]},${values[3]} 1,1`);
                return easeName;
            }
        }

        // Check if it's an SVG path
        if (easingValue.startsWith('M') || easingValue.startsWith('m')) {
            const easeName = `customEase${Math.random().toString(36).substr(2, 9)}`;
            CustomEase.create(easeName, easingValue);
            return easeName;
        }

        // Return the easing value as is (for GSAP built-in easings)
        return easingValue;
    }

    initImageReveal() {
        const revealContainers = document.querySelectorAll('[data-scroll-image-reveal]');
        
        revealContainers.forEach(container => {
            const image = container.querySelector('img');
            if (!image) return;

            // Get parameters with new defaults
            const animation = container.dataset.animate;
            const axis = container.dataset.axis || 'y';
            const duration = parseFloat(container.dataset.duration) || 0.95;
            const easing = this.parseEasing(container.dataset.scrollImageEasing);
            const zoom = container.dataset.zoom;
            const hasZoom = zoom !== 'false';
            const zoomValue = parseFloat(zoom) || 1.3;
            const scrubAttr = container.getAttribute('data-scrub');
            const scrub = scrubAttr === 'true' ? true : (scrubAttr ? parseFloat(scrubAttr) : false);
            const start = container.dataset.start || "top bottom";
            const end = container.dataset.end || "bottom top";

            // Handle grid animation
            if (animation === 'grid') {
                this.handleGridAnimation(container, image, duration, easing, scrub);
                return;
            }

            // Handle shutter animation
            if (animation === 'shutter') {
                this.handleShutterAnimation(container, image, duration, easing, scrub);
                return;
            }

            // Handle stripes animation
            if (animation === 'stripes') {
                this.handleStripesAnimation(container, image, duration, easing, scrub);
                return;
            }

            const scrollConfig = {
                trigger: container,
                toggleActions: scrub ? undefined : "restart none none reset",
                start: start,
                end: end
            };

            if (scrub) {
                scrollConfig.scrub = scrub;
            }

            const tl = gsap.timeline({
                scrollTrigger: scrollConfig
            });

            // Set initial visibility and clip-path
            tl.set(container, { autoAlpha: 1 });

            // Define clip-path animations based on axis
            let fromClip, toClip;
            switch(axis) {
                case 'y':
                    fromClip = "inset(100% 0% 0% 0%)";
                    toClip = "inset(0% 0% 0% 0%)";
                    break;
                case '-y':
                    fromClip = "inset(0% 0% 100% 0%)";
                    toClip = "inset(0% 0% 0% 0%)";
                    break;
                case 'x':
                    fromClip = "inset(0% 0% 0% 100%)";
                    toClip = "inset(0% 0% 0% 0%)";
                    break;
                case '-x':
                    fromClip = "inset(0% 100% 0% 0%)";
                    toClip = "inset(0% 0% 0% 0%)";
                    break;
            }

            // Set initial clip-path
            gsap.set(container, { clipPath: fromClip });

            // Build the animation
            tl.to(container, {
                clipPath: toClip,
                duration: scrub ? 1 : duration,
                ease: scrub ? "none" : easing
            });

            // Add zoom if enabled
            if (hasZoom) {
                tl.from(image, {
                    scale: zoomValue,
                    duration: scrub ? 1 : duration,
                    ease: scrub ? "none" : easing
                }, 0);
            }
        });
    }

    handleStripesAnimation(container, image, duration, easing, scrub) {
        const direction = container.dataset.stripesDirection || 'y'; // Default to 'y'
        const stripesNumber = parseInt(container.dataset.stripesNumber) || 4; // Default to 4 stripes
        const delay = parseFloat(container.dataset.delay) || 0.25; // Default to 250ms
        const stripeColor = container.dataset.stripeColor || '#000'; // Default color
        const stripesEasing = this.parseEasing(container.dataset.stripesEasing) || 'power1.out'; // Use parseEasing
        const stripesDuration = parseFloat(container.dataset.stripesDuration) || duration; // Use stripesDuration if specified
        const scrubAttrStripes = container.getAttribute('data-scrub');
        const scrubStripes = scrubAttrStripes === 'true' ? true : (scrubAttrStripes ? parseFloat(scrubAttrStripes) : false);
        const stripesStaggerDirection = container.dataset.stripesStaggerDirection || 'start'; // Default to 'start'

        const stripesContainer = document.createElement('div');
        stripesContainer.className = 'stripes-container';

        // Set flexbox direction based on stripes direction
        stripesContainer.style.display = 'flex';
        stripesContainer.style.flexDirection = (direction === 'x' || direction === '-x') ? 'column' : 'row';
        stripesContainer.style.width = '100%';
        stripesContainer.style.height = '100%';

        const stripeSize = 100 / stripesNumber;
        const stripes = [];

        for (let i = 0; i < stripesNumber; i++) {
            const stripe = document.createElement('div');
            stripe.className = 'stripe';

            // Set size and color
            stripe.style.backgroundColor = stripeColor;
            stripe.style.flex = '1';

            // Set initial transform based on direction
            if (direction === 'x' || direction === '-x') {
                stripe.style.width = '100%';
                stripe.style.height = `${stripeSize}%`;
                gsap.set(stripe, { x: '0%' });
            } else {
                stripe.style.width = `${stripeSize}%`;
                stripe.style.height = '100%';
                gsap.set(stripe, { y: '0%' });
            }

            stripesContainer.appendChild(stripe);
            stripes.push(stripe);
        }

        container.appendChild(stripesContainer);

        // Determine stagger order based on direction
        let staggerOrder;
        switch (stripesStaggerDirection) {
            case 'center':
                staggerOrder = stripes.map((_, i) => Math.abs(i - Math.floor(stripes.length / 2)));
                break;
            case 'end':
                staggerOrder = stripes.map((_, i) => stripes.length - i);
                break;
            case 'random':
                staggerOrder = stripes.map(() => Math.random());
                break;
            default: // 'start'
                staggerOrder = stripes.map((_, i) => i);
                break;
        }

        // Sort stripes based on stagger order
        const sortedStripes = stripes.map((stripe, i) => ({ stripe, order: staggerOrder[i] }))
                                      .sort((a, b) => a.order - b.order)
                                      .map(item => item.stripe);

        const calculatedStagger = stripesDuration / stripesNumber;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top bottom",
                toggleActions: "play none none reverse",
                scrub: scrubStripes
            }
        });

        gsap.set(container, { autoAlpha: 1 });
        gsap.set(image, { scale: 1.3 });

        tl.to(sortedStripes, {
            x: direction === 'x' ? '-100%' : (direction === '-x' ? '100%' : undefined),
            y: direction === 'y' ? '-100%' : (direction === '-y' ? '100%' : undefined),
            duration: stripesDuration,
            ease: stripesEasing,
            stagger: calculatedStagger,
            delay: delay
        })
        .to(image, {
            scale: 1,
            duration: duration,
            ease: easing
        }, `-=${stripesDuration}`);

        return tl;
    }

    handleShutterAnimation(container, image, duration, easing, scrub) {
        const shutterDelay = parseFloat(container.dataset.shutterDelay) || 0.25; // Default to 250ms
        const shutterColor = container.dataset.shutterColor || '#000'; // Default color
        const shutterDuration = parseFloat(container.dataset.shutterDuration) || duration; // Use shutterDuration if specified
        const shutterDirection = container.dataset.shutterDirection || 'x'; // Default to 'x'
        const shutterEasing = this.parseEasing(container.dataset.shutterEasing) || 'power1.out'; // Use parseEasing
        const scrubShutterAttr = container.dataset.shutterScrub
        const scrubShutter = scrubShutterAttr === 'true' ? true : (scrubShutterAttr ? parseFloat(scrubShutterAttr) : false);

        const shutterContainer = document.createElement('div');
        shutterContainer.className = 'shutter-container';
        shutterContainer.style.position = 'absolute';
        shutterContainer.style.top = '0';
        shutterContainer.style.left = '0';
        shutterContainer.style.width = '100%';
        shutterContainer.style.height = '100%';
        shutterContainer.style.backgroundColor = shutterColor;
        gsap.set(shutterContainer, { x: shutterDirection === 'x' ? '0%' : undefined, y: shutterDirection === 'y' ? '0%' : undefined });

        container.appendChild(shutterContainer);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top bottom",
                toggleActions: "play none none reverse",
                scrub: scrub
            }
        });

        gsap.set(container, { autoAlpha: 1 });
        gsap.set(image, { scale: 1.3 });

        tl.to(shutterContainer, {
            x: shutterDirection === 'x' ? '-100%' : undefined,
            y: shutterDirection === 'y' ? '-100%' : undefined,
            duration: shutterDuration,
            ease: shutterEasing,
            delay: shutterDelay
        })
        .to(image, {
            scale: 1,
            duration: duration,
            ease: easing
        }, `-=${shutterDuration}`);

        return tl;
    }

    handleGridAnimation(container, image, duration, easing, scrub) {
        const gridCells = parseInt(container.dataset.gridCells) || 9; // Default to 9 cells
        const gridColor = container.dataset.gridColor || '#000'; // Default color
        const gridStagger = parseFloat(container.dataset.gridStagger) || 0.1; // Default stagger
        const gridDuration = parseFloat(container.dataset.gridDuration) || duration; // Use gridDuration if specified
        const gridEasing = this.parseEasing(container.dataset.gridEasing) || 'power1.out'; // Use parseEasing
        const scrubAttrGrid = container.getAttribute('data-grid-scrub');
        const scrubGrid = scrubAttrGrid === 'true' ? true : (scrubAttrGrid ? parseFloat(scrubAttrGrid) : false);
        const gridColumns = parseInt(container.dataset.gridColumns) || Math.sqrt(gridCells); // Default to square grid
        const staggerDirection = container.dataset.gridStaggerDirection || 'start'; // Default to 'start'

        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid-container';
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
        gridContainer.style.gridTemplateRows = `repeat(${Math.ceil(gridCells / gridColumns)}, 1fr)`;
        gridContainer.style.width = '100%';
        gridContainer.style.height = '100%';
        gridContainer.style.position = 'absolute';
        gridContainer.style.top = '0';
        gridContainer.style.left = '0';

        const cells = [];
        for (let i = 0; i < gridCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.style.backgroundColor = gridColor;
            cell.style.border = "transparent";
            cell.style.opacity = '1'; // Start fully visible
            gridContainer.appendChild(cell);
            cells.push(cell);
        }

        container.appendChild(gridContainer);

        // Determine stagger order based on direction
        let staggerOrder;
        switch (staggerDirection) {
            case 'center':
                staggerOrder = cells.map((_, i) => Math.abs(i - Math.floor(cells.length / 2)));
                break;
            case 'end':
                staggerOrder = cells.map((_, i) => cells.length - i);
                break;
            case 'random':
                staggerOrder = cells.map(() => Math.random());
                break;
            default: // 'start'
                staggerOrder = cells.map((_, i) => i);
                break;
        }

        // Sort cells based on stagger order
        const sortedCells = cells.map((cell, i) => ({ cell, order: staggerOrder[i] }))
                                  .sort((a, b) => a.order - b.order)
                                  .map(item => item.cell);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top bottom",
                toggleActions: "play none none reverse",
                scrub: scrubGrid
            }
        });

        gsap.set(container, { autoAlpha: 1 });
        gsap.set(image, { scale: 1.3 });

        tl.to(sortedCells, {
            opacity: 0, // Fade to hidden
            duration: gridDuration,
            ease: gridEasing,
            stagger: gridStagger,
            delay: 0
        })
        .to(image, {
            scale: 1,
            duration: duration,
            ease: easing
        }, `-=${gridDuration}`);

        return tl;
    }
}

// Initialize library
window.moonMoonImageReveal = new MoonMoonImageReveal(); 