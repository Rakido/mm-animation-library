# MoonMoon Parallax Documentation

A lightweight, flexible parallax animation library powered by GSAP.

## Installation

Required dependencies:
- GSAP (3.12.2 or higher)
- ScrollTrigger plugin

## Core Features

- Simple parallax movement
- Image parallax with zoom effects 
- Infinite marquee animations
- Corner pin positioning
- Scroll-based animations

## Basic Parallax Movement

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| data-parallax | boolean | - | Enables parallax effect |
| data-parallax-direction | string | "y" | Direction of movement ("x", "y", "xy") |
| data-speed | number | 0.5 | Movement speed multiplier |
| data-scrub | boolean/number | false | Smooth scrolling control |
| data-start | string | "top bottom" | Start trigger position |
| data-end | string | "bottom top" | End trigger position |

## Image Parallax

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| data-image-parallax | boolean | - | Activates image parallax mode |
| data-direction | string | "y" | Movement direction ("y", "-y", "x", "-x") |
| data-speed | number | 35 | Movement intensity |
| data-zoom | boolean | false | Enable zoom effect |
| data-zoom-percentage | number | 1.5 | Zoom intensity multiplier |
| data-scrub | boolean/number | true | Smooth scrolling control |

## Marquee Animation

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| data-animate | string | - | Set to "marquee" |
| data-direction | string | "-x" | Scroll direction ("-x", "x", "-y", "y") |
| data-marquee-infinite | boolean | false | Enable infinite loop |
| data-marquee-speed | number | 50 | Animation speed |
| data-easing | string | "none" | Animation easing |
| data-scrub | boolean/number | false | Link to scroll position |

## Pin Position

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| data-parallax-pin | string | - | Pin position ("top-left", "top-right", "bottom-left", "bottom-right") |
| data-speed | number | 0.5 | Movement speed |
| data-scrub | boolean/number | false | Smooth scrolling control |

## Easing Options

- GSAP built-in: "none", "power1.out", "power2.inOut", etc.
- Custom bezier: "0.7,0,0.3,1" format
- Elastic: "elastic.out(1,0.3)"

## Scroll Trigger Positions

Start/End position values:
- "top top"
- "top center" 
- "top bottom"
- "center top"
- "center center"
- "center bottom" 
- "bottom top"
- "bottom center"
- "bottom bottom"

Can be offset with +=/-= pixels:
- "top bottom+=100"
- "bottom top-=200"

## Performance Considerations

1. Use will-change: transform sparingly
2. Optimize image sizes for performance
3. Limit number of parallax elements
4. Use reasonable scrub values (0.5-2)
5. Consider mobile performance
6. Use loading="lazy" for images below fold

## Browser Support

- Modern browsers supporting GSAP
- Chrome, Firefox, Safari, Edge (latest versions)
- JavaScript required
- No IE11 support

## Known Limitations

1. Heavy parallax effects may impact performance on low-end devices
2. Marquee animations require careful handling of clone elements
3. Complex pin positions may need manual adjustment on resize
4. Zoom effects work best with high-resolution images 