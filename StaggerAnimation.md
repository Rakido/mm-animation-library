# MoonMoon Stagger Animation Documentation

## Data Attributes Overview

The MoonMoon Stagger Animation library uses HTML data attributes to control various aspects of stagger animations. Here's a comprehensive list of all available attributes and their options.

### Core Attributes

#### `data-stagger-reveal`
- Required attribute to initialize stagger animation
- Usage: `data-stagger-reveal`
- Example: `<div data-stagger-reveal>`

#### `data-stagger-delay`
- Controls the delay between each animated element
- Default: 0.2
- Example: `data-stagger-delay="0.1"`

### Animation Controls

#### `data-duration`
- Controls the animation duration in seconds
- Default: 1.0
- Example: `data-duration="1.5"`

#### `data-easing`
- Controls the animation easing
- Accepts:
  - Standard GSAP easings (e.g., "power2.inOut")
  - Custom cubic-bezier values (comma-separated)
- Example: `data-easing="0.7,0,0.3,1"`

#### `data-start`
- Defines the ScrollTrigger start position
- Default: "top 80%"
- Example: `data-start="top center"`

#### `data-scrub`
- Enables scroll-driven animation
- Values: "true" or not set
- When true: animation follows scroll position
- When false/not set: plays once when in view
- Example: `data-scrub="true"`

### Direction and Movement

#### `data-direction`
- Controls the direction and type of animation
- Values:
  - `"up"` - Moves up from starting position
  - `"down"` - Moves down from starting position
  - `"left"` - Moves left from starting position
  - `"right"` - Moves right from starting position
  - `"scale-up"` - Scales up from smaller size
  - `"scale-down"` - Scales down from larger size
  - `"rotate-left"` - Rotates counterclockwise
  - `"rotate-right"` - Rotates clockwise
- Default: "up"
- Example: `data-direction="right"`

#### `data-distance`
- Sets the movement distance in pixels
- Default: 50
- Example: `data-distance="100"`

### Transform Properties

#### `data-rotate`
- Sets the rotation amount in degrees
- Default: 0
- Used with rotate-left/rotate-right directions
- Example: `data-rotate="45"`

#### `data-scale`
- Sets the scale value for scaling animations
- Default: 1
- Used with scale-up/scale-down directions
- Example: `data-scale="1.5"`

### Visual Properties

#### `data-opacity`
- Sets the starting opacity value
- Default: 0
- Value between 0 and 1
- Example: `data-opacity="0.3"`

## Usage Examples

### Basic Stagger Animation 