# MoonMoon Image Reveal Documentation

## Data Attributes Overview

The MoonMoon Image Reveal library uses HTML data attributes to control various aspects of image reveal animations. Here's a comprehensive list of all available attributes and their options.

## 1. Basics

### Core Attributes

#### `data-scroll-image-reveal`
- Required attribute to initialize image reveal animation.
- Applied to the container element.
- Usage: `data-scroll-image-reveal`
- Example: `<div data-scroll-image-reveal>`

#### `data-scroll-image-reveal-target`
- Required attribute to identify the target image.
- Applied to the image element.
- Example: `<img data-scroll-image-reveal-target>`

### Animation Types

#### `data-animate`
- Defines the type of reveal animation.
- Values:
  - `"shutter"` - Shutter reveal effect.
  - `"grid"` - Grid reveal effect.
  - `"stripes"` - Stripes reveal effect.
- Example: `data-animate="shutter"`

## 2. Directions

#### `data-axis`
- Controls the direction of slide animations.
- Values:
  - `"x"` - Slide from left.
  - `"-x"` - Slide from right.
  - `"y"` - Slide from top.
  - `"-y"` - Slide from bottom.
- Default: `"y"`
- Example: `data-axis="x"`

#### `data-stripes-direction`
- Sets the direction for stripes animation.
- Values: `"x"`, `"-x"`, `"y"`, `"-y"`
- Example: `data-stripes-direction="x"`

#### `data-shutter-direction`
- Sets the direction for shutter animation.
- Values: `"x"` or `"y"`
- Example: `data-shutter-direction="x"`

## 3. Durée et délais

#### `data-duration`
- Controls the animation duration in seconds.
- Default: `1.5`
- Example: `data-duration="1.35"`

#### `data-delay`
- Sets a delay before the animation starts (in seconds).
- Default: `0`
- Example: `data-delay="0.3"`

#### `data-stripes-duration`
- Duration specific to stripes animation.
- Example: `data-stripes-duration="1.5"`

#### `data-shutter-duration`
- Duration specific to shutter animation.
- Example: `data-shutter-duration="1.5"`

#### `data-shutter-delay`
- Delay specific to shutter animation.
- Example: `data-shutter-delay="0.3"`

#### `data-grid-duration`
- Duration specific to grid animation.
- Example: `data-grid-duration="1.5"`

#### `data-grid-stagger`
- Stagger timing between grid cells.
- Example: `data-grid-stagger="0.1"`

## 4. Scroll Events

#### `data-scrub`
- Enables scrubbing. Can be set to `"true"`, a specific value, or defaults to `false`.
- Example: `data-scrub="true"`

#### `data-grid-scrub`
- Scrubbing specific to grid animation.
- Example: `data-grid-scrub="true"`

#### `data-start`
- Defines the start point for the scroll trigger.
- Example: `data-start="top bottom"`

#### `data-end`
- Defines the end point for the scroll trigger.
- Example: `data-end="bottom top"`

## 5. Shutter Effect

#### `data-shutter-color`
- Sets the color of the shutter.
- Accepts any CSS color value.
- Default: `"#000000"`
- Example: `data-shutter-color="#ff4444"`

#### `data-shutter-easing`
- Easing function for the shutter animation, parsed using `parseEasing`.
- Example: `data-shutter-easing="power3.inOut"`

## 6. Grid Effect

#### `data-grid-cells`
- Number of cells in the grid. Defaults to `8`.
- Example: `data-grid-cells="20"`

#### `data-grid-color`
- Color of the grid cells.
- Example: `data-grid-color="#ff4444"`

#### `data-grid-columns`
- Number of columns in the grid layout.
- Example: `data-grid-columns="5"`

#### `data-grid-stagger-direction`
- Determines the stagger pattern. Options are `"start"`, `"center"`, `"end"`, and `"random"`.
- Example: `data-grid-stagger-direction="center"`

#### `data-grid-easing`
- Easing function for the grid animation, parsed using `parseEasing`.
- Example: `data-grid-easing="power3.inOut"`

## 7. Stripes Effect

#### `data-stripes-number`
- Number of stripes. Defaults to `4`.
- Example: `data-stripes-number="6"`

#### `data-stripe-color`
- Color of the stripes.
- Example: `data-stripe-color="#ff4444"`

#### `data-stripes-stagger-direction`
- Determines the stagger pattern for stripes. Options are `"start"`, `"center"`, `"end"`, and `"random"`.
- Example: `data-stripes-stagger-direction="random"`

#### `data-stripes-easing`
- Easing function for the stripes animation, parsed using `parseEasing`.
- Example: `data-stripes-easing="power3.inOut"`

---

This documentation provides a comprehensive overview of the data attributes and parameters available for configuring the image reveal animations. 