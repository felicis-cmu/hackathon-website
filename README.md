# Felicis Hackathon Website

A modern, responsive website for the Felicis Hackathon event on March 14, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Modern Design**: Inspired by Felicis brand with gradient accents and clean typography
- **Responsive**: Mobile-first design that works on all devices
- **Fast Performance**: Built with Next.js 14 App Router for optimal performance
- **Supabase Ready**: Pre-configured for future RSVP and registration features

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (configured for future use)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:

```bash
npm install
```

2. (Optional) Set up Supabase environment variables:

Copy `.env.local.example` to `.env.local` and add your Supabase credentials:

```bash
cp .env.local.example .env.local
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Hero.tsx            # Hero section
│   ├── Prizes.tsx          # Prizes section
│   ├── Schedule.tsx        # Event schedule
│   ├── Speakers.tsx        # Speakers and activities
│   ├── Footer.tsx          # Footer
│   └── ui/                 # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Container.tsx
├── lib/
│   └── supabase.ts         # Supabase client
└── public/                 # Static assets
```

## Event Details

- **Date**: March 14
- **Schedule**: 10:00 AM - 7:15 PM
- **Prizes**:
  - 1st Place: $2,500
  - 2nd Place: Meta Ray Bans
  - 3rd Place: Nintendo Switches

## Customization

### Colors

The color palette can be customized in `tailwind.config.ts`:

- Primary Purple: `#7C3AED` to `#A78BFA`
- Accent Orange: `#FB923C` to `#FDBA74`

### Content

Edit the component files in the `components/` directory to update event information, schedule, prizes, and speaker details.

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This project can be deployed to Vercel, Netlify, or any platform that supports Next.js:

```bash
npm run build
```

## Future Enhancements

- RSVP/Registration form with Supabase
- Team formation features
- Live updates during the event
- Photo gallery
- Sponsor showcase

## License

MIT
