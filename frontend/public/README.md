# Public Assets Folder

This folder contains static assets that are served directly by Next.js.

## Current Structure

```
public/
└── logos/
    └── felicis.png    - Felicis logo (used in header)
```

## How to Add More Assets

1. Create organized subfolders:
   - `images/` - Photos and graphics
   - `icons/` - Icon files
   - `fonts/` - Custom fonts

2. Reference them in your code using the root path `/`:
   ```tsx
   <Image src="/logos/felicis.png" alt="Logo" width={100} height={100} />
   ```

See `ASSETS_GUIDE.md` in the root directory for detailed instructions.
