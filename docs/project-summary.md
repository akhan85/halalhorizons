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
  - Frontend: Next.js (React).
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

---

## 3. Change Log

> Newest entries at the top. Keep entries short and factual.

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