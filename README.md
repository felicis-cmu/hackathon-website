# VentureHack Website

![VentureHacks Overview](public/overview.png)

A modern, responsive website for VentureHack on March 14, built with Next.js 14, TypeScript, and Tailwind CSS. Sponsored by Felicis Ventures.

## Features

- **Modern Design**: Inspired by Felicis brand with gradient accents and clean typography
- **Responsive**: Mobile-first design that works on all devices
- **Apply Flow**: OAuth sign-in (Google) + application form with short answers, MCQs, resume upload
- **Admin Export**: Download all applications as CSV at `/admin` for review in Sheets or Excel
- **Decision Emails**: Admin accept/reject actions can send Resend-based decision emails to applicants
- **Supabase**: Auth, database, and storage configured

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

2. Set up Supabase (required for `/apply` and `/admin`):

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with:
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase Dashboard → Settings → API
- `SUPABASE_SERVICE_ROLE_KEY` (for admin export)
- `ADMIN_PASSWORD` (password for admin login)
- `ADMIN_SECRET` (used for admin session signing and admin-to-backend API requests)
- `RESEND_API_KEY` and `RESEND_FROM_EMAIL` (for acceptance/rejection emails from the admin dashboard)
- Optional: `RESEND_FROM_NAME` (defaults to `VentureHacks`)

Enable OAuth in Supabase → Authentication → Providers (Google). Add redirect URL: `http://localhost:3000/auth/callback`

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
