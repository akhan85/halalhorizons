# Halal Horizons – Living Summary & Development Journal

> This document is intentionally short. It is a **high-level snapshot**
> of what the system currently does and what changed recently.

---

## 0. Maintenance Rules (IMPORTANT)

- **Update frequency:**
  - Update this file whenever:
    - A feature is added, removed, or significantly changed.
    - A major architectural decision is made.
  - Try to make at least one update per active dev week.

- **Update format:**
  - Add a new entry under **Change Log** with:
    - Date.
    - Short description.
    - Affected areas (pages/tables).

- **Relationship to PRD:**
  - PRD = long-lived product contract.
  - This summary = “what is true **right now**” + history of key changes.

---

## 1. Current Snapshot (High-Level)

- **Architecture:**
  - Frontend: React single-page application using Vite and `react-router-dom`.
  - Styling: Tailwind CSS with custom design system (brand greens/yellows, modern marketing UI).
  - Backend/Data: Supabase (Postgres, Auth, Storage).
  - Hosting: (To be filled once deployed).

- **Key Features Implemented (KEEP UPDATED):**
  - Auth:
    - [ ] Email/password signup & login via Supabase.
    - [ ] Email verification.
    - [ ] Password reset.
  - Pages:
    - [ ] Landing (`/`).
    - [ ] About (`/about`).
    - [ ] Contact (`/contact`).
    - [ ] Resources (`/resources`).
    - [ ] Blog (`/blog`).
    - [ ] Community (`/community`).
    - [ ] Books (`/books`).
  - Community:
    - [ ] Threads + posts.
    - [ ] Basic moderation (delete/flag).
  - Books:
    - [ ] Browse books by age band.
    - [ ] Add/read reviews.

_Update the checkboxes above as features go live._

---

## 2. Database Snapshot (Simplified)

_Current plan: (edit if schema changes)_

- Users (`users`):
  - Basic profile + role.
- Resources (`resources`):
  - Grade, subject, file URL, published flag.
- Blog (`blog_posts`).
- Community:
  - Threads (`community_threads`).
  - Posts (`community_posts`).
  - Flags (`content_flags`).
- Books:
  - `books`, `book_reviews`.

If new tables are added or important columns change, mention them briefly here.

### 2.1 Admin & Moderation Model

- Admins are identified via Supabase Auth **user metadata**:
  - A user is treated as an admin when `user_metadata.is_admin` is truthy.
  - Frontend checks `user.user_metadata.is_admin` to show admin-only navigation and pages.
- Book review moderation:
  - `book_reviews.status` is one of `pending`, `approved`, `rejected`.
  - New and edited reviews are saved as `pending`.
  - Only `status = 'approved'` reviews are visible to anonymous visitors.
  - Admins can approve/reject reviews via `/admin/reviews`.
 - Blog moderation & visibility:
   - Blog posts live in `public.blog_posts` with `title`, `slug`, `content`, `author_id`, `published_at`, etc.
   - Public users (including anonymous) can only read posts where `published_at IS NOT NULL` ("published" posts).
   - Admins can create, edit, and delete posts via `/admin/blog` and `/admin/blog/new`.
   - Admin-only RLS uses the JWT `user_metadata.is_admin` flag so that only admins can insert/update/delete.

To upgrade a user to admin run the following script in supabase:

update auth.users
set raw_user_meta_data =
  coalesce(raw_user_meta_data, '{}'::jsonb)
  || jsonb_build_object('is_admin', true)
where email = 'you@example.com';

replace 'you@example.com' with users email
---

## 3. Change Log

> Newest entries at the top. Keep entries short and factual.

- **[2025-11-24]** – *Blog list/detail and admin editor wired with RLS.*
  - Implemented `/blog` list and `/blog/:slug` detail pages rendering Markdown content from `blog_posts`.
  - Added admin-only blog management at `/admin/blog` and `/admin/blog/new` (create, edit, delete, publish).
  - Finalized RLS so anonymous users can only read posts where `published_at IS NOT NULL`, while admins manage posts via `user_metadata.is_admin`.

- **[2025-11-22]** – *Admin review moderation for book reviews.*
  - Added `/admin/reviews` page for admins to view and approve/reject pending book reviews.
  - Navbar now exposes an **Admin** link only for users with `user_metadata.is_admin = true`.
  - Documented how to configure admin users in Supabase and clarified the `book_reviews.status` lifecycle.

- **[2025-11-22]** – *Initial Books & Reviews slice implemented on React/Vite frontend.*
  - Implemented `/books` listing page backed by Supabase `books` + `book_reviews` with age-band, theme, and text filters.
  - Added `/books/:id` detail page showing approved reviews, aggregated ratings, and content categories.
  - Wired logged-in users to submit book reviews which enter a pending state for later admin approval.

- **[2025-11-20]** – *Initial React + Vite SPA skeleton implemented.*
  - Implemented marketing pages and navigation as a Vite + React SPA using `react-router-dom`.
  - Added initial Supabase client and basic email/password signup + login screens.

- **[YYYY-MM-DD]** – *Initial PRD and architecture defined.*
  - Defined Next.js + Supabase stack.
  - Agreed on main pages and feature set (Resources, Blog, Community, Books).
  - Drafted initial schema and moderation approach.

(Add new entries here as development progresses.)

---

## 4. Open Questions / Future Considerations

- Which states to focus on first for explicit curriculum-state mapping?
- When to introduce more advanced analytics (e.g. resource usage, most-read articles)?
- At what point to consider upgrading Supabase tier vs offloading large files to Google Drive links?

(Keep this section short: only active open questions.)