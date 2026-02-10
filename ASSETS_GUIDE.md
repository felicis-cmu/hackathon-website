# Assets Guide

## Where to Put Images, Logos, and Other Assets

In Next.js, static assets like images, logos, fonts, and other files go in the **`public`** folder.

### Directory Structure

```
public/
├── logos/
│   └── felicis.png          ✓ Already added
├── images/
│   ├── hero-background.jpg
│   ├── speakers/
│   │   ├── speaker1.jpg
│   │   └── speaker2.jpg
│   └── prizes/
│       ├── meta-raybans.jpg
│       └── nintendo-switch.jpg
├── fonts/
│   └── custom-font.woff2
└── favicon.ico
```

### How to Reference Assets

Assets in the `public` folder are served from the root `/` path:

#### Images (using Next.js Image component - recommended)

```tsx
import Image from 'next/image'

<Image 
  src="/logos/felicis.png"
  alt="Felicis Logo"
  width={100}
  height={100}
/>
```

#### Regular img tag (not recommended for images)

```html
<img src="/logos/felicis.png" alt="Felicis Logo" />
```

#### Background images in CSS

```css
.hero {
  background-image: url('/images/hero-background.jpg');
}
```

### Best Practices

1. **Use Next.js Image Component**: Always use `<Image>` from `next/image` for automatic optimization
   - Lazy loading
   - Responsive images
   - Automatic format conversion (WebP, AVIF)

2. **Organize by Type**: Create subfolders for different asset types
   - `/public/logos/` - Company and partner logos
   - `/public/images/` - Photos and graphics
   - `/public/icons/` - Icon files
   - `/public/fonts/` - Custom fonts

3. **Image Optimization Tips**:
   - Compress images before adding them (use tools like TinyPNG, ImageOptim)
   - Use appropriate formats: 
     - PNG for logos and graphics with transparency
     - JPG for photos
     - SVG for simple icons and logos
   - Keep file sizes under 200KB when possible

4. **Naming Convention**:
   - Use lowercase
   - Use hyphens instead of spaces: `meta-ray-bans.jpg`
   - Be descriptive: `speaker-profile-john-doe.jpg`

### Example: Adding Prize Images

If you want to add images for prizes:

1. Create folder: `public/images/prizes/`
2. Add images:
   - `public/images/prizes/meta-ray-bans.jpg`
   - `public/images/prizes/nintendo-switch.jpg`
3. Use in component:

```tsx
<Image 
  src="/images/prizes/meta-ray-bans.jpg"
  alt="Meta Ray Bans"
  width={400}
  height={300}
/>
```

### Current Assets

Your project currently has:
- ✓ `public/logos/felicis.png` - Felicis logo (used in header)

### Need More Assets?

Common assets you might want to add:
- Partner logos
- Speaker headshots
- Prize product photos
- Background images or patterns
- Custom favicon
- Social sharing image (og:image)
