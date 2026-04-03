# Design System Specification: The Ethereal Command

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Ethereal Command."** 

In a world of flat, clinical productivity tools, this system seeks to provide a cinematic, high-end editorial experience. It moves away from the "grid-of-boxes" mentality, instead treating the UI as a curated space where information breathes. We achieve this through **Intentional Asymmetry**—placing high-density KPI cards against expansive, open typography—and **Atmospheric Depth**, using light and blur to guide the user’s eye rather than rigid structural lines. This is not just a dashboard; it is a professional cockpit designed for focus and prestige.

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep, cosmic navies and slates, punctuated by high-energy indigo and emerald.

### The "No-Line" Rule
Standard 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined solely through background color shifts or tonal transitions. To separate a sidebar from a main content area, use `surface_container_low` (#131b2e) against the main `background` (#0b1326).

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface_container` tiers to create "nested" depth:
- **Base Level:** `background` (#0b1326)
- **Secondary Regions:** `surface_container_low` (#131b2e)
- **Primary Cards:** `surface_container_high` (#222a3d)
- **Floating/Active Elements:** `surface_container_highest` (#2d3449)

### The "Glass & Gradient" Rule
To achieve the premium glassmorphism aesthetic, interactive cards should use a semi-transparent fill of `surface_container_highest` with a `backdrop-filter: blur(24px)`. 

### Signature Textures
Main Actions (CTAs) should never be flat. Use a linear gradient transitioning from `primary_container` (#6b4cff) at the top-left to `primary` (#c8bfff) at the bottom-right. This creates a "glowing" internal energy that flat hex codes cannot replicate.

---

## 3. Typography
We utilize a dual-font strategy to balance editorial sophistication with functional precision.

- **Headlines & Display (Manrope):** Chosen for its geometric modernism. Use `display-lg` (3.5rem) for hero stats and `headline-md` (1.75rem) for section titles. The wide apertures of Manrope convey a sense of openness.
- **Labels & Functional UI (Inter):** Use `label-md` (0.75rem) and `label-sm` (0.6875rem) for metadata, tooltips, and small button text. Inter provides the legibility required for high-density data.

**Editorial Tip:** Create "Visual Tension" by pairing a `display-sm` headline with a `label-sm` sub-header. The drastic difference in scale creates a high-end, magazine-style layout.

---

## 4. Elevation & Depth
Depth in this system is a result of light simulation, not just "drop shadows."

### Tonal Layering
Stack containers to create natural lift. Place a `surface_container_lowest` (#060e20) card inside a `surface_container_high` (#222a3d) area to create an "inset" feel, perfect for search bars or input fields.

### Ambient Shadows
For floating glass cards, shadows must be ultra-diffused. 
- **Blur:** 40px to 60px.
- **Color:** Use a 6% opacity version of `primary_container` (#6b4cff). This creates a "purple bloom" rather than a grey shadow, making the card feel like it is emitting light onto the slate surface.

### The "Ghost Border" Fallback
If accessibility requires a container edge, use a **Ghost Border**. Use the `outline_variant` (#474556) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### KPI Cards (The Signature Component)
- **Background:** Glassmorphism (`surface_container_highest` @ 60% opacity + blur).
- **Corner Radius:** `xl` (1.5rem) for the outer container, `lg` (1rem) for internal elements.
- **Accents:** Use `secondary` (#4edea3) for positive trends and `primary` (#c8bfff) for neutral data points.
- **Note:** Never use dividers. Separate the "Label" from the "Value" using `spacing-3` (1rem).

### Buttons
- **Primary:** Gradient fill (`primary_container` to `primary`). 1.4rem padding (Spacing 4) on horizontal axis.
- **Secondary:** Ghost style. No fill, `Ghost Border` (outline-variant @ 20%), text color `primary`.
- **States:** On hover, increase the `backdrop-blur` and slightly increase the shadow bloom.

### Custom Checkboxes
- **Unchecked:** `surface_container_highest` with a 1px Ghost Border.
- **Checked:** Solid `secondary` (#4edea3) fill with an `on_secondary` (#003824) icon.
- **Corner Radius:** `sm` (0.25rem) to maintain a crisp, professional look.

### Progress Bars
- **Track:** `surface_variant` (#2d3449) with a height of `0.35rem` (Spacing 1).
- **Indicator:** `secondary` (#4edea3) with a subtle outer glow shadow of the same color.

---

## 6. Do's and Don'ts

### Do:
- **Use White Space as a Tool:** Use `spacing-12` (4rem) or `spacing-16` (5.5rem) between major dashboard modules to allow the "glass" to feel light.
- **Embrace Tonal Contrast:** Use `on_surface_variant` (#c9c4d9) for secondary text to ensure the hierarchy is clear against the dark background.
- **Subtle Motion:** Animate the "bloom" of the shadows when a user hovers over a glass card.

### Don't:
- **Don't use pure black:** The deepest dark should be `surface_container_lowest` (#060e20), never #000000.
- **Don't use Dividers:** Avoid horizontal rules. If you need to separate list items, use a background shift to `surface_container_low` on every other item or simply increase the vertical spacing.
- **Don't Over-Glow:** Only one or two elements on a screen should have the "Indigo Glow" shadow to maintain its status as a high-priority signifier.
