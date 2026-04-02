

## Plan: Replicate Reference Hero Section Exactly

The reference image shows a specific design that differs from the current implementation in several key ways. Here is what needs to change:

### 1. Replace the cow image
The current `hero-cow.jpg` shows a cow in a cardboard box. The reference shows a white/beige cow standing in a green field at golden hour. The uploaded image is a screenshot of a finished design, not the raw photo itself -- so we need to either find or use a similar cow image. Since the user uploaded this as a reference of how their site looked before, the actual cow photo is likely already `hero-cow.jpg` from a previous version, or we need the user to provide the raw cow photo.

**Question needed**: The uploaded image is a screenshot of a finished website, not a raw photo. The cow image in the current codebase (`hero-cow.jpg`) shows a cow in a box. We need the original cow-in-field photo to match the reference.

### 2. Navbar changes (to match reference exactly)
- Nav links: "Priča", "Proizvodi", "Farmeri" (not "Početna", "Proizvodi", "Farmeri", "Postani Partner")
- Right side: single yellow filled button "Postani Partner" (not login/signup buttons)
- Transparent background over hero (not solid dark bar)
- Font style matches: "Mlečni" bold + "*put*" handwritten italic in warm white

### 3. Hero text layout
- Subtitle "~ od srca do praga ~" centered, handwritten yellow -- already matches
- "Mlečni" in large white serif + "*put*" in large yellow handwritten italic -- already matches
- Small sunglasses/squiggle doodle before the quote
- Quote text in yellow handwritten italic with better shadow/visibility
- Two CTA buttons side by side: "Postani Partner 🤝" (yellow filled) and "Istraži Priču ↓" (dark outline with white text)

### 4. Doodle positions (match reference)
- Crown doodle: left side, roughly 20% from top
- Star doodle: top-right area, near nav
- Cloud doodle: two clouds on right side
- Star doodle: left side, below center

### 5. Files to modify
- **`src/components/Navbar.tsx`**: Change nav links to "Priča", "Proizvodi", "Farmeri". Replace login/signup with single "Postani Partner" yellow button. Make navbar transparent over hero.
- **`src/components/HeroSection.tsx`**: Adjust text sizing, doodle positions, button styling, add squiggle before quote. Ensure quote text has strong drop shadow for visibility.
- **`src/assets/hero-cow.jpg`**: Needs to be replaced with the cow-in-field image (not cow-in-box).

### Important note
The uploaded image is a **screenshot** of the desired design, not the raw cow photo. The current `hero-cow.jpg` in the project appears to be a different image (cow in a box). To get the exact same look, we either need:
- The original raw cow photo file from the user
- Or to use the uploaded screenshot itself as the background (which would include the text/UI baked in and look wrong)

I will proceed assuming we should use the uploaded image as the new hero background (copying `image-3.png` as the new hero image) -- but since it contains UI elements baked into it, I will ask the user to clarify.

