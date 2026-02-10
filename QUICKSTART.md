# Quick Start Guide

## Get Started in 3 Steps

### 1. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the site.

### 2. (Optional) Configure Supabase

If you want to add registration features later:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials.

### 3. Build for Production

```bash
npm run build
npm start
```

## What's Included

- **Hero Section**: Eye-catching header with gradient text
- **Prizes Section**: Showcases the three prize tiers
- **Schedule Section**: Interactive timeline of the event
- **Speakers Section**: Information about talks and networking opportunities
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

## Customize

- **Content**: Edit files in `components/` directory
- **Styling**: Modify `tailwind.config.ts` for colors and themes
- **Schedule**: Update `components/Schedule.tsx` to change times
- **Prizes**: Edit `components/Prizes.tsx` to modify prize information

## Deploy

Deploy to Vercel in one click:

```bash
npm run build
```

Then push to GitHub and connect to Vercel for automatic deployments.

## Need Help?

- Check the main README.md for detailed documentation
- All components are in the `components/` directory
- Global styles are in `app/globals.css`
