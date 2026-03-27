# Repository Guidelines

## Project Structure & Module Organization
This repository is split into three TypeScript apps:

- `frontend/`: public Next.js site and application flow (`app/`, `components/`, `contexts/`, `lib/`, `public/`)
- `admin/`: separate Next.js admin portal on port `3002` (`app/`, `lib/`, `middleware.ts`, `public/`)
- `backend/`: Express API and Supabase integration (`src/routes/`, `src/middleware/`, `src/__tests__/`)

Static assets live under each app’s `public/` directory. Supporting docs are at the repo root, including `README.md`, `QUICKSTART.md`, and `ASSETS_GUIDE.md`.

## Build, Test, and Development Commands
There is no root workspace runner; execute commands inside the target app directory.

- `cd frontend && npm run dev`: start the public site at `http://localhost:3000`
- `cd admin && npm run dev`: start the admin app at `http://localhost:3002`
- `cd backend && npm run dev`: start the Express API on `http://localhost:3001`
- `cd frontend && npm run build` or `cd admin && npm run build`: production Next.js build
- `cd backend && npm run build`: compile backend TypeScript to `dist/`
- `cd backend && npm test`: run Jest tests
- `cd backend && npm run test:coverage`: generate backend coverage

## Coding Style & Naming Conventions
Use TypeScript throughout. Follow the existing style in the file you touch: 2-space indentation, single quotes, and mostly semicolon-free app code. Keep React components and page-level modules in `PascalCase` files such as `Hero.tsx`; keep route handlers and middleware in lowercase names such as `applications.ts` and `auth.ts`. No shared Prettier config is checked in, so avoid repo-wide reformatting. Run `npm run lint` in `frontend/` and `admin/` before opening a PR.

## Testing Guidelines
Automated tests currently live in `backend/src/__tests__/` and use Jest with Supertest. Name new tests `*.test.ts` and keep them close to the API surface they cover. Add or update backend tests whenever routes, auth, uploads, or admin export behavior changes. Frontend and admin UI changes should be manually verified locally.

## Commit & Pull Request Guidelines
Recent commits use short, lowercase summaries such as `fixed admin login flow` and `admin and backend updates`. Prefer brief, descriptive messages focused on the behavior changed. PRs should include a clear summary, affected app(s), any required environment or Supabase changes, and screenshots for visible `frontend/` or `admin/` updates.

## Security & Configuration Tips
Secrets belong in local `.env` files and must not be committed. Review the environment variables documented in `README.md`, especially Supabase keys, `BACKEND_ADMIN_SECRET`, `ADMIN_SESSION_SECRET`, and `ADMIN_PASSWORD`.
