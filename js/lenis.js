// Initialize Lenis
document.addEventListener('DOMContentLoaded', () => {
    const lenis = new Lenis({
        lerp: 0.05, // Set the lerp value to 0.05
        wheelMultiplier: 1,
        smooth: true, // Enable smooth scrolling
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}); 