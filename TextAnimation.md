# MoonMoon Text Animation Documentation

## Data Attributes Overview

The MoonMoon Text Animation library uses HTML data attributes to control various aspects of text animations. Here's a comprehensive list of all available attributes and their options.

### Core Attributes

#### `data-scroll-text-reveal`
- Required attribute to initialize text animation
- Usage: `data-scroll-text-reveal`
- Example: `<h2 data-scroll-text-reveal>`

#### `data-splitting`
- Defines how the text should be split for animation
- Values:
  - `"chars"` - Split text into individual characters
  - `"words"` - Split text into words
  - `"lines"` - Split text into lines
- Example: `data-splitting="words"`

### Animation Types

#### `data-animate`
- Defines the type of animation(s) to apply
- Can combine multiple values with spaces
- Values:
  - `"fade-in"` - Fade in animation
  - `"slide"` - Slide animation (requires data-axis)
  - `"shutter-word"` - Shutter effect (works with words splitting)
  - `"lines-up"` - Lines sliding up (works with lines splitting)
- Example: `data-animate="fade-in slide"`

### Animation Controls

#### `data-duration`
- Controls the animation duration in seconds
- Default: 1.0
- Example: `data-duration="1.5"`

#### `data-delay`
- Sets a delay before the animation starts (in seconds)
- Default: 0
- Example: `data-delay="0.5"`

#### `data-stagger`
- Controls the delay between each animated element
- Default: 0.1
- Example: `data-stagger="0.15"`

#### `data-easing`
- Controls the animation easing
- Accepts:
  - Standard GSAP easings (e.g., "power2.inOut")
  - Custom cubic-bezier values (comma-separated)
- Example: `data-easing="0.7,0,0.3,1"`

### Direction and Position

#### `data-axis`
- Controls the direction of slide animations
- Values:
  - `"x"` - Slide from right
  - `"-x"` - Slide from left
  - `"y"` - Slide from bottom
  - `"-y"` - Slide from top
- Example: `data-axis="x"`

### Special Effects

#### `data-color`
- Sets the color for shutter effect
- Used with `shutter-word` animation
- Accepts any CSS color value
- Example: `data-color="#ff0000"`

#### `data-fade-start`
- Sets the starting opacity for fade animations
- Value between 0 and 1
- Default: 0
- Example: `data-fade-start="0.3"`

## Usage Examples

### Basic Fade In 