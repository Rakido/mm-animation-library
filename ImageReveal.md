# MoonMoon Image Reveal Documentation

## Data Attributes Overview

The MoonMoon Image Reveal library uses HTML data attributes to control various aspects of image reveal animations. Here's a comprehensive list of all available attributes and their options.

### Core Attributes

#### `data-scroll-image-reveal`
- Required attribute to initialize image reveal animation
- Applied to the container element
- Usage: `data-scroll-image-reveal`
- Example: `<div data-scroll-image-reveal>`

#### `data-scroll-image-reveal-target`
- Required attribute to identify the target image
- Applied to the image element
- Example: `<img data-scroll-image-reveal-target>`

### Animation Types

#### `data-scroll-image-reveal-animation`
- Defines the type of reveal animation
- Values:
  - Not set (default slide animation)
  - `"zoom-in"` - Zoom in effect
  - `"zoom-out"` - Zoom out effect
  - `"shutter"` - Shutter reveal effect
  - `"zoom-window"` - Zoom window effect (experimental)
- Example: `data-scroll-image-reveal-animation="zoom-in"`

### Animation Controls

#### `data-duration`
- Controls the animation duration in seconds
- Default: 1.5
- Example: `data-duration="1.35"`

#### `data-delay`
- Sets a delay before the animation starts (in seconds)
- Default: 0
- Example: `data-delay="0.3"`

#### `data-easing`
- Controls the animation easing
- Accepts:
  - Standard GSAP easings (e.g., "power3.inOut")
  - Custom cubic-bezier values (comma-separated)
- Example: `data-easing=".25,.01,.5,1"`

### Direction and Position

#### `data-scroll-image-reveal-axis`
- Controls the direction of slide animations
- Values:
  - `"x"` - Slide from left
  - `"-x"` - Slide from right
  - `"y"` - Slide from top
  - `"-y"` - Slide from bottom
- Default: "y"
- Example: `data-scroll-image-reveal-axis="x"`

### Special Effects

#### `data-scroll-zoom-percentage`
- Sets the zoom scale for zoom animations
- Default: 1.2
- Used with zoom-in/zoom-out animations
- Example: `data-scroll-zoom-percentage="1.8"`

#### `data-shutter-axis`
- Controls the shutter animation direction
- Values: "x" or "y"
- Used with shutter animation
- Example: `data-shutter-axis="x"`

#### `data-color`
- Sets the color for shutter effect
- Accepts any CSS color value
- Default: "#000000"
- Example: `data-color="#ff4444"`

### Legacy Support

#### `data-image-reveal`
- Legacy attribute for basic reveal animation
- Simple slide-up effect
- Example: `<img data-image-reveal>`

## HTML Structure

### Basic Slide Animation 