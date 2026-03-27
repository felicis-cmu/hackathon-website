# GEMINI.md - Project Context for VentureHack

## Project Overview
VentureHack is a modern hackathon platform built for Felicis Ventures. It features a main marketing website with a built-in application flow, an admin dashboard for application review, and a dedicated backend for data processing and exports.

### Main Technologies
- **Frontend/Admin:** Next.js (App Router), TypeScript, Tailwind CSS, Supabase SSR.
- **Backend:** Node.js, Express, TypeScript, Supabase Admin SDK, Jest for testing.
- **Database/Auth:** Supabase (PostgreSQL, Auth, Storage).

---

## Project Structure & Architecture

The project is structured as a monorepo with three main packages:

### 1. Frontend (`/frontend`)
- **Port:** 3000 (default Next.js)
- **Role:** Main landing page, user authentication (Google OAuth), and hackathon application form.
- **Key Files:**
  - `app/page.tsx`: Landing page with sections like Hero, Prizes, Schedule, etc.
  - `app/apply/page.tsx`: The application form for hackers.
  - `lib/supabase/client.ts`: Supabase client for client-side auth and DB access.

### 2. Admin (`/admin`)
- **Port:** 3002
- **Role:** Protected dashboard for organizers to review, filter, and export hacker applications.
- **Key Files:**
  - `app/dashboard/page.tsx`: Main application list view.
  - `app/api/proxy/`: Proxies requests to the backend for secure data retrieval and CSV exports.
  - `lib/auth.ts`: Custom admin session management.

### 3. Backend (`/backend`)
- **Port:** 3001
- **Role:** API server for application processing, file uploads, and admin-only exports.
- **Key Files:**
  - `src/index.ts`: Entry point with CORS and route configuration.
  - `src/routes/applications.ts`: Handles application submission and status.
  - `src/routes/admin.ts`: Secure admin endpoints for data export.
  - `src/supabase.ts`: Supabase client with Service Role access.

---

## Building and Running

### Development
To run all parts of the project simultaneously, you should open three terminals and run:

1. **Frontend:**
   ```bash
   cd frontend && npm run dev
   ```
2. **Backend:**
   ```bash
   cd backend && npm run dev
   ```
3. **Admin:**
   ```bash
   cd admin && npm run dev
   ```

### Testing
Backend tests are located in `backend/src/__tests__/`:
```bash
cd backend && npm test
```

### Production Build
Each package can be built independently:
```bash
# Example for frontend
cd frontend && npm run build && npm start
```

---

## Development Conventions

1. **Type Safety:** Use TypeScript for all new code. Ensure interfaces for applications and user profiles are shared or kept in sync across packages.
2. **Styling:** Use Tailwind CSS for all UI components. Theme colors (Purple/Orange) are defined in the respective `tailwind.config.ts` files.
3. **Authentication:**
   - **User:** Handled via Supabase (Google OAuth).
   - **Admin:** Handled via a shared secret (`BACKEND_ADMIN_SECRET`) and session cookies.
4. **Environment Variables:**
   - Each package has its own `.env.local.example`. Ensure keys like `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are configured.
5. **API Pattern:**
   - Frontend components use the Supabase client directly for simple queries.
   - Admin components proxy through `app/api/proxy` to the Backend to keep the `BACKEND_ADMIN_SECRET` secure on the server.

---

## Environment Configuration Checklist
Ensure the following variables are set across `.env.local` files:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (Backend/Admin only)
- `BACKEND_ADMIN_SECRET` (Shared between Admin and Backend)
- `ADMIN_PASSWORD` (For initial Admin login)
