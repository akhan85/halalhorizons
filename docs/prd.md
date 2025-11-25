# Halal Horizons – Product Requirements Document (PRD)

## 1. Overview

- **Name:** Halal Horizons
- **Audience:** Muslim parents (primarily in North America to start) who are homeschooling or supplementing schooling for their children.
- **Core Value:**
  - Provide trustworthy, Islamically-aligned curriculum and resources that still meet state requirements.
  - Enable community connection and local meetups.
  - Curate and discuss books through an Islamic lens (age-appropriateness, themes, concerns).

- **Primary Goals (v1–v2):**
  - Make it easy for a parent to:
    - Understand what Halal Horizons offers.
    - Access grade-level resources (K–12) that are clearly organized.
    - Find like-minded families and discussions.
    - Evaluate books for their children using Islamic criteria.

- **Out of Scope (for now):**
  - Advanced analytics and dashboards.
  - Deep integrations with external education databases/platforms.
  - Native mobile apps (focus on responsive web).

---

## 2. User Personas

- **Persona 1: “New Homeschooling Mom”**
  - Wants: A clear, guided path for each grade, reassurance that requirements are met, Islamic integration.
  - Key features:
    - Easy-to-browse resources by grade and subject.
    - Explanations of how materials relate to state standards.
    - Blog posts giving tips, routines, and encouragement.

- **Persona 2: “Experienced Homeschool Dad”**
  - Wants: To share and discuss ideas, discover new books, and coordinate local meetups.
  - Key features:
    - Community/forum.
    - Local meetups or at least location-tagged threads.
    - Book reviews with pros/cons from an Islamic perspective.

- **Persona 3: “Interested but not committed”**
  - Wants: To explore content without friction, then sign up if it resonates.
  - Key features:
    - Publicly viewable landing, About, some Blog and Community content (read-only).
    - Clear explanation of benefits to registering.

---

## 3. Core Features & Requirements

### 3.1 Authentication & User Accounts

- **Requirements:**
  - Users can register and log in using email/password.
  - Email verification flow (Supabase) for trust.
  - Password reset flow.
  - Roles:
    - `parent` (default).
    - `admin` (manual assignment).
  - Basic profile fields:
    - Name.
    - Location (optional city/country).
    - Children’s grade ranges (optional) for better recommendations (later).

- **Constraints / Rules:**
  - Use **Supabase Auth**.
  - Never store plain-text passwords.
  - Implement simple, tasteful UI for login/register (no dark patterns).

---

### 3.2 Public Marketing Pages

#### 3.2.1 Landing Page (`/`)

- **Goals:**
  - Clearly explain what Halal Horizons is and who it’s for.
  - Highlight 3 pillars: Curriculum, Community, Books.
  - Provide strong CTAs (Sign up / Explore resources).

- **Content sections:**
  - Hero: Clear headline and subheading; primary CTA.
  - “How it works” – simple 3–4 step explanation.
  - Highlights of features.
  - Short testimonials or “Why Muslim parents love this” (can be added later).
  - Footer with links and social media.

#### 3.2.2 About Page (`/about`)

- Mission, vision, and values.
- Emphasis on:
  - Islamic ethos.
  - Academic rigor.
  - Respectful community.

#### 3.2.3 Contact Page (`/contact`)

- Contact form:
  - Name.
  - Email.
  - Message.
- Simple spam protection (honeypot or basic captcha later).
- Confirmation message upon submission.

---

### 3.3 Resources (Curriculum) Page (`/resources`)

- **Goals:**
  - Let users browse and download curriculum resources by grade and subject.
  - Clearly separate Islamic Studies and secular subjects.
  - Optionally show which state requirements each resource supports (v2+).

- **Requirements (v1):**
  - Filter by:
    - Grade: K, 1, …, 12.
    - Subject: Math, Science, Language Arts, Social Studies, Islamic Studies, etc.
  - Each resource entry:
    - Title.
    - Grade level.
    - Subject.
    - Short description.
    - Download link (Supabase storage or Google Drive link).
  - Indication of access:
    - Public vs “Login required to download”.

- **Admin requirements:**
  - Admin can:
    - Create/edit/delete resources.
    - Mark as `published` or `draft`.

- **Storage strategy:**
  - Store file either in Supabase Storage or as a Google Drive link.
  - In DB, track file URL and type (`supabase` or `drive`).

---

### 3.4 Blog (`/blog`)

- **Goals:**
  - Share articles, tips, and reflections about homeschooling and Islamic education.
  - Drive organic traffic (SEO).

- **Requirements (v1):**
  - Blog list:
    - Title, summary, author, publish date.
  - Blog detail:
    - Full content.
    - Optional tags (e.g., `tarbiyah`, `planning`, `state-requirements`).
  - Only admins can create/edit/delete blog posts.

---

### 3.5 Community (`/community`)

- **Goals:**
  - Provide a respectful, Islamically-guided space for parents.
  - Support coordination for local meetups.

- **Requirements (v1):**
  - Thread categories:
    - `meetups`.
    - `curriculum-help`.
    - `general`.
  - For each thread:
    - Title.
    - Category.
    - Optional location field (city/region, especially for meetups).
    - Author and creation date.
  - Posts within thread:
    - Author.
    - Timestamp.
    - Content.
    - Optional replies via `parent_post_id`.

- **Permissions:**
  - Logged-out users:
    - Read-only access to selected threads/posts (configurable).
  - Logged-in users:
    - Create threads.
    - Reply to threads.
    - Edit/delete own posts (within short time window or always, to be defined).
  - Admins:
    - Edit/delete any post.
    - Close threads.
    - Moderate reported content.

- **Moderation (v1 minimal):**
  - Users can **report** a post (flag).
  - Admin moderation dashboard (even a simple list of flags) to resolve.

---

### 3.6 Books (`/books`)

- **Goals:**
  - Help parents decide if a book is suitable and beneficial Islamically.
  - Provide structured fields for Islamic concerns and themes.

- **Requirements (v1):**
  - Browse books:
    - Filter by age band (K–2, 3–5, 6–8, 9–12, etc.).
    - Search by title/author.
  - Each book entry:
    - Title, author.
    - Age band.
    - Description.
    - Optional cover image.
  - Reviews:
    - Overall rating (stars/1–5).
    - Age appropriateness rating.
    - Short text review.
    - Fields for:
      - Strengths.
      - Concerns (Islamic or content-related).
      - Themes (tags).

- **Permissions:**
  - Logged-in users:
    - Submit reviews.
    - Edit/delete own reviews.
  - Logged-out:
    - Browse books and read reviews.

- **Moderation:**
  - Reviews can be reported.
  - Admin can hide or remove problematic reviews.

---

## 4. Technical Architecture

### 4.1 High-Level Stack

- **Frontend:** React single-page application using Vite
  - Client-side routing via `react-router-dom` for the main pages.
  - Components for shared layout (navbar, footer, layout wrapper).
- **Backend / Data:**
  - Supabase:
    - Postgres database.
    - Auth.
    - Storage.
    - Row Level Security (RLS).
- **Hosting:**
  - Frontend deployed as a static Vite build (e.g. Vercel/Netlify or similar).
  - Supabase free tier initially.

### 4.2 Data Model (Initial)

- **users**
  - Fields:
    - `id` (UUID, from Supabase auth).
    - `email`.
    - `name`.
    - `location_city` (optional).
    - `location_country` (optional).
    - `role` (`parent`, `admin`).
    - `created_at`.

- **resources**
  - `id`, `title`, `grade_level`, `subject`, `description`.
  - `file_url` (Supabase or Drive link).
  - `file_source_type` (`supabase`, `drive`).
  - `is_published`.
  - `created_by`, `created_at`.

- **blog_posts**
  - `id`, `title`, `slug`, `content`, `author_id`, `published_at`.

- **community_threads**
  - `id`, `title`, `category`, `location`, `created_by`, `created_at`.

- **community_posts**
  - `id`, `thread_id`, `author_id`, `content`, `parent_post_id`, `created_at`.

- **books**
  - `id`, `title`, `author`, `age_band`, `description`, `cover_image_url`.

- **book_reviews**
  - `id`, `book_id`, `reviewer_id`, `rating_overall`, `age_appropriateness_rating`,
    `themes` (JSON or tags), `strengths`, `concerns`, `status` (`pending`, `approved`, `rejected`), `created_at`.

- **content_flags** (for moderation)
  - `id`, `item_type` (`book_review`, `community_post`), `item_id`, `flagged_by`,
    `reason`, `status`, `created_at`.

---

## 5. UX / UI & Styling

- **Inspiration:** brilliant.org landing page.
- **Design principles:**
  - Clean, modern, spacious layout.
  - Islamic color palette:
    - Greens, blues, subtle earth tones.
  - Emphasis on readability:
    - Strong hierarchy of headings.
    - Comfortable line length.

- **Layout rules:**
  - Global nav at top with:
    - Logo.
    - Links: Home, About, Resources, Blog, Community, Books, Contact.
    - Auth actions (Login / Sign up).
  - Consistent footer:
    - About, Contact, Community, etc.
    - Social links.

- **Components (reusable):**
  - `PageLayout` (nav + footer).
  - `HeroSection`.
  - `Section` wrapper.
  - `Card` for resources/blog posts/books/threads.
  - `Button`, `Input`, `Form` components.

---

## 6. Security & Compliance

- **Authentication & authorization:**
  - Supabase Auth for sign-in/up, password reset.
  - RLS policies:
    - Users can view public content.
    - Users can update only their own content.
    - Admins can manage all content.

- **Data protection:**
  - No storing sensitive PII beyond what is absolutely needed.
  - Use HTTPS everywhere (via hosting).

- **Backups & resilience:**
  - Rely on Supabase backups initially.
  - Later: periodic exports of critical tables as part of ops routine.

---

## 7. MVP Definition

- Auth (Supabase) and basic profile.
- Pages:
  - Landing, About, Contact, Resources, Blog, Community, Books.
- Core flows:
  - Browse resources (login required to download).
  - Read blog posts (public).
  - Basic community threads and replies.
  - Book list + reviews (users can add reviews).
- Admin capabilities:
  - Manage resources.
  - Manage blog posts.
  - Remove/Hide reported content.

---

## 8. Roadmap (High Level)

- **Phase 1 (MVP):**
  - Implement all core pages and flows above.
  - Setup Supabase schema, basic RLS.
  - Deploy on Vercel + Supabase.

- **Phase 2:**
  - Location-focused meetups and filtering.
  - Better admin moderation UI.
  - Curriculum “paths” (per grade sequence).

- **Phase 3:**
  - Enhanced analytics and reporting.
  - Deeper curriculum mapping to state standards.
  - PWA enhancements.

---

## 9. Development Rules

- **Rule 1 – PRD Stability:**
  - This PRD describes the product vision and baseline requirements.
  - Changes to scope or behavior must be:
    - Discussed.
    - Reflected here (with small diffs).
    - Also summarized in the “Living Summary” doc.

- **Rule 2 – Living Summary Updates:**
  - Maintain a separate `halal-horizons-summary.md` (see that file for rules).
  - For every meaningful feature change, add an entry there.

- **Rule 3 – Minimal Scope First:**
  - Prefer shipping a small, consistent version of each feature
    rather than partially implementing many features.

- **Rule 4 – Respectful Community:**
  - All community-facing features must include a plan for moderation,
    even if minimal (flags + admin delete).