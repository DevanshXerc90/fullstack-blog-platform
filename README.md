## Full-Stack Blogging Platform

This is a multi-user blogging platform built with Next.js 15, tRPC, Drizzle ORM, and PostgreSQL. It implements core blog features with categories, CRUD, filtering, and a clean responsive UI.

### Tech Stack
- Next.js 15 (App Router)
- tRPC v11 (+ React Query integration)
- Drizzle ORM + PostgreSQL (Neon/Supabase/Postgres)
- Zod for validation
- Tailwind CSS v4
- Zustand (global state for filters)

### Features
- Blog post CRUD with published/draft
- Category CRUD
- Assign multiple categories to posts
- Listing with category filter
- Individual post pages (`/posts/[slug]`)
- Basic responsive navigation

### Project Structure
- `src/server/routers` – tRPC routers (`post`, `category`, `_app`)
- `src/db` – Drizzle schema and migrator
- `src/app` – App Router pages, API route for tRPC
- `src/components` – UI and composite components
- `src/schemas` – Zod schemas shared across the stack

### tRPC Router Structure
- `post`:
  - `getAllPosts` (optional `categoryId`, `publishedOnly`)
  - `getBySlug` (`slug`)
  - `createPost`, `updatePost`, `deletePost`
- `category`:
  - `list`, `getBySlug`
  - `create`, `update`, `delete`

### Setup
1. Install deps:
```bash
npm install
```
2. Setup environment:
Create `.env` with:
```bash
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB
```
Use Neon or Supabase for quick Postgres.

3. Run migrations:
```bash
npm run db:push
```

4. Start dev server:
```bash
npm run dev
```

Open `http://localhost:3000`.

### Seeding (optional)
Use the UI at `/categories` to create categories, then create posts on the home page.

### Deployment
Deploy to Vercel. Ensure `DATABASE_URL` is set in Project Settings → Environment Variables. Drizzle migrations can be run locally and the generated SQL committed, or run via a one-off script using `npm run db:push` against the production database.

### Trade-offs & Notes
- Markdown editor omitted for speed; using simple textarea.
- No authentication by design per brief.
- Server components call tRPC via client boundary on detail page for simplicity.
