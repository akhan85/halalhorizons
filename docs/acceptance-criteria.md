# Halal Horizons – Acceptance Criteria

This document defines what “done” means for each major feature in the PRD.

---

## 1. Authentication & User Accounts

### 1.1 Signup, Login, and Roles

- **AC-Auth-1 – Signup with email/password**
  - Given I am a new user on the signup page:
    - When I enter a valid, non-disposable email and a valid password and submit,
    - Then:
      - My email domain is checked against a disposable-email blocklist.
      - If the domain is allowed, a Supabase user is created.
      - I see clear feedback (e.g. “Check your email to verify your account” if email verification is enabled).
      - If the domain is blocked, I see an error explaining that temporary emails are not allowed and the user is not created.

- **AC-Auth-2 – Login**
  - Given my email is verified:
    - When I enter the correct email/password on the login form and submit,
    - Then I am authenticated via Supabase and redirected to an appropriate page (e.g. home or dashboard).

- **AC-Auth-3 – Password reset**
  - Given I forgot my password:
    - When I request a password reset with my registered email,
    - Then:
      - I receive a reset link email from Supabase.
      - Following the link allows me to set a new password.
      - After setting a new password, I can log in successfully.

- **AC-Auth-4 – Roles**
  - The system supports at least these roles:
    - `parent` (default user role).
    - `admin`.
    - (Optionally `moderator` later; not required for initial MVP.)
  - New signups are assigned the `parent` role by default.
  - Only users with `admin` role can assign or change other users’ roles.

- **AC-Auth-5 – Authorization & RLS**
  - For any content entity (posts, reviews, comments):
    - A logged-in user can create content, which is stored with their `user.id`.
    - A user cannot edit or delete another user’s content (unless `admin`).
    - `admin` users can edit or delete any content where needed.

- **AC-Auth-6 – Profile basics (v1 minimal)**
  - Given I am logged in:
    - When I open the profile page (once implemented),
    - I can view and edit:
      - My name.
      - Optional city and country.
    - I cannot change my role field.

---

## 2. Public Marketing Pages

### 2.1 Landing Page (`/`)

- **AC-Landing-1 – Hero section**
  - When a visitor goes to `/` on desktop or mobile:
    - They see a hero with:
      - Clear headline explaining Halal Horizons.
      - Subheading that mentions curriculum + community + Islamic lens.
      - A primary CTA button (e.g., “Get Started” or “Sign Up Free”).

- **AC-Landing-2 – “How It Works” section**
  - The landing page includes a section titled “How it works” (or equivalent wording).
  - This section shows **3–4 clearly labeled steps**, for example:
    1. Create your free account.
    2. Choose your child’s grade and explore curriculum.
    3. Connect with other families and local meetups.
    4. Discover and review books through an Islamic lens.
  - Each step has:
    - A short title (2–4 words).
    - A short description (1–2 sentences).
  - On both mobile and desktop, steps are readable and visually distinct.

- **AC-Landing-3 – Feature highlights & footer**
  - The landing page highlights the three main pillars:
    - Curriculum (Resources).
    - Community.
    - Books & Reviews.
  - A footer is present with at least:
    - Links to About, Contact, Community/Resources.
    - Placeholder or real social media links.

### 2.2 About Page (`/about`)

- **AC-About-1**
  - When I visit `/about`, I can read:
    - A mission statement.
    - A vision section.
    - A list or section describing core values emphasizing:
      - Islamic ethos.
      - Academic rigor.
      - Respectful and safe community.

### 2.3 Contact Page (`/contact`)

- **AC-Contact-1 – Form presence**
  - When I visit `/contact`, I see a form with fields:
    - Name (required).
    - Email (required, validated for format).
    - Message (required).

- **AC-Contact-2 – Submission**
  - When I fill in valid values and submit:
    - Client-side validation prevents empty required fields.
    - On success, I see a confirmation message (e.g., “Thanks, we’ll be in touch”).
    - Errors (e.g., network) are displayed clearly.

---

## 3. Resources (`/resources`)

- **AC-Resources-1 – Browsing and filters**
  - When I visit `/resources`:
    - I can filter by grade (K, 1, …, 12).
    - I can filter by subject (e.g. Math, Science, Language Arts, Social Studies, Islamic Studies).

- **AC-Resources-2 – Resource cards**
  - Each listed resource displays:
    - Title.
    - Grade level.
    - Subject.
    - Short description.
    - A visible download or “View” action.

- **AC-Resources-3 – Access control**
  - For resources marked “login required”:
    - Logged-out users:
      - See the resource in the list.
      - Clicking Download/View prompts them to log in or sign up instead of downloading.
    - Logged-in users:
      - Can click Download/View and successfully access the file.

- **AC-Resources-4 – Storage handling**
  - For every resource:
    - Database stores `file_url` and `file_source_type` (`supabase` or `drive`).
    - If `supabase`, the system generates a working URL or signed URL.
    - If `drive`, the link opens the correct Google Drive resource.

- **AC-Resources-5 – Admin management**
  - Admin users can:
    - Create a resource (enter metadata + file link).
    - Edit an existing resource.
    - Toggle a `published` flag.
  - Only published resources show up to regular users.

---

## 4. Blog (`/blog`)

### 4.1 Posts

- **AC-Blog-1 – List view**
  - Visiting `/blog` shows a list of published posts with:
    - Title.
    - Short summary or excerpt.
    - Author name.
    - Publish date.

- **AC-Blog-2 – Detail view**
  - When I click a blog post:
    - I navigate to `/blog/[slug]`.
    - I see the full content, formatted correctly (headings, paragraphs).
    - If tags exist, they are displayed.

- **AC-Blog-3 – Admin post management**
  - Admin can:
    - Create new posts.
    - Edit existing posts.
    - Delete posts.
    - Set posts to `draft` or `published`.
  - Only `published` posts are visible to non-admin users.

### 4.2 Blog Comments (with moderation)

- **AC-Blog-Comments-1 – Comment submission**
  - Given I am logged in and viewing a blog post:
    - I see a comment form allowing me to write a comment.
    - Submitting a comment:
      - Creates a `blog_comment` entry with `status = 'pending'`.
      - Shows me a message like “Your comment is awaiting moderation.”

- **AC-Blog-Comments-2 – Visibility rules**
  - Comments with status `pending` or `rejected` are **not** shown to the public.
  - Only comments with `status = 'approved'` appear under the blog post for regular users.

- **AC-Blog-Comments-3 – Moderation UI**
  - Admin (and/or moderator role, if implemented) can:
    - See a list of pending comments (basic moderation queue).
    - Approve or reject each comment.
    - Once approved, the comment is visible on the blog post detail page.

---

## 5. Community (`/community`)

- **AC-Community-1 – Thread list**
  - Visiting `/community` shows a list of threads with:
    - Title.
    - Category (`meetups`, `curriculum-help`, `general`).
    - Author.
    - Creation date.
  - Category is clearly visible (e.g., as a badge or label).

- **AC-Community-2 – Thread detail**
  - Opening a thread:
    - Shows title, category, optional location, author, and creation time.
    - Shows posts in chronological order.
    - If replies use `parent_post_id`, replies are visually nested or otherwise clearly associated.

- **AC-Community-3 – Permissions**
  - Logged-out users:
    - Can view at least some community threads and posts.
    - Cannot create threads or replies.
    - See a clear prompt to log in/sign up if they attempt to post.
  - Logged-in users:
    - Can create new threads (choose category and optional location).
    - Can reply to threads.
    - Can edit/delete their own posts (as per chosen time-window rule).

- **AC-Community-4 – Reporting & moderation**
  - Any logged-in user can report a post:
    - Reporting creates a `content_flags` record capturing:
      - `item_type = 'community_post'`.
      - `item_id`.
      - `flagged_by`.
      - `reason`.
  - Admins (and/or moderators) can:
    - View a list of flagged posts.
    - Mark flags as resolved.
    - Hide or delete offending posts.

---

## 6. Books & Reviews (`/books`)

### 6.1 Books Listing & Detail

- **AC-Books-1 – List view**
  - Visiting `/books` shows a list of books with:
    - Title.
    - Author.
    - Age band (e.g., K–2, 3–5, 6–8, 9–12).
    - Short description (or truncated).
  - I can filter the list by age band.
  - I can search by book title or author.

- **AC-Books-2 – Detail view**
  - Opening a book:
    - Shows title, author, age band, full description, and optional cover image.
    - Shows a list of approved reviews for the book.

### 6.2 Book Reviews (with content categories)

- **AC-Reviews-1 – Review submission**
  - Given I am logged in and viewing a book:
    - I can submit a review that includes:
      - Overall rating (e.g., 1–5 stars).
      - Age appropriateness rating.
      - Strengths (text).
      - Concerns (text).
      - Themes or notes (optional).
      - One or more **content categories** from a predefined list, e.g.:
        - Mature language.
        - Violence.
        - Romantic themes.
        - Sexual themes.
    - Submitting a valid review saves it in the database with `status = 'pending'` and associates it with my user and the book.

- **AC-Reviews-2 – Content categories display**
  - On the book detail page:
    - Each review’s selected content categories are shown clearly (e.g., badges listing “Violence”, “Mature language”).
    - If no categories are selected, no badges are shown.

- **AC-Reviews-2b – Visibility rules**
  - Pending or rejected reviews are **not** shown to the public.
  - Only reviews with `status = 'approved'` appear in the public book detail view and are used in any aggregated rating.

- **AC-Reviews-3 – Permissions**
  - Logged-out users:
    - Can see books and approved reviews.
    - Cannot submit or edit reviews.
  - Logged-in users:
    - Can submit reviews.
    - Can edit or delete their own reviews.

- **AC-Reviews-4 – Reporting & moderation**
  - Any logged-in user can report a review:
    - Reporting creates a `content_flags` record with `item_type = 'book_review'`.
  - Admins (and/or moderators) can:
    - View flagged reviews.
    - Hide or delete inappropriate reviews.

---

## 7. Technical Architecture & Deployment

- **AC-Tech-1 – React SPA routing**
  - The app is a React single-page application (SPA) built with Vite and `react-router-dom`, where the following routes exist and render without errors:
    - `/`, `/about`, `/contact`, `/resources`, `/blog`, `/community`, `/books`.

- **AC-Tech-2 – Supabase integration**
  - Supabase is configured with:
    - Auth (used in the frontend).
    - Tables corresponding to PRD schema (users, resources, blog_posts, community_threads, community_posts, books, book_reviews, blog_comments, content_flags).
    - Basic RLS rules:
      - Public reads where intended (e.g. published content).
      - Auth-required writes.
      - Role-based admin control.

- **AC-Tech-3 – Deployment**
  - The application can be:
    - Run locally with documented steps.
    - Deployed on the chosen hosting (e.g. Vercel) with environment variables for Supabase configured.
  - All main pages load successfully in production without runtime errors.

---

## 8. Security & Compliance

- **AC-Security-1 – HTTPS**
  - In production, the site is served over HTTPS by default.

- **AC-Security-2 – Data protection**
  - No plain-text passwords are stored by our application; Supabase handles hashing.
  - Sensitive keys (Supabase keys, etc.) are stored in environment variables, not committed to the repo.

- **AC-Security-3 – RLS enforcement**
  - Tests or manual verification show:
    - Non-logged-in users cannot perform any write operations.
    - Logged-in users cannot modify or delete content that they do not own, except admins.
    - Admins can perform moderation actions as defined.

---

## 9. MVP Completion Criteria

- **AC-MVP-1 – Core user journey**
  - A brand-new visitor can:
    - Discover what Halal Horizons is on the landing page.
    - Sign up with a non-disposable email and log in.
    - Access at least one grade’s resources and download a file (if logged in).

- **AC-MVP-2 – Engagement features**
  - A logged-in `parent` can:
    - Create and reply to a community thread.
    - Submit a book review with content categories.
    - Submit a blog comment which enters the moderation queue.

- **AC-MVP-3 – Admin operations**
  - An `admin` can:
    - Add or edit a resource.
    - Add or edit a blog post.
    - Approve or reject blog comments.
    - Hide or delete at least one reported community post and one reported book review.

---