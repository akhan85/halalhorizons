-- Halal Horizons - Merged Supabase Schema
-- Combines local simplified schema with remote comprehensive schema

-- Enable Row Level Security by default
alter default privileges revoke execute on functions from public;

-- ============================================================================
-- PROFILES TABLE (Enhanced from both versions)
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  username text unique,
  full_name text,
  name text, -- kept for compatibility
  avatar_url text,
  location_city text,
  location_country text,
  role text not null default 'parent', -- 'parent', 'admin', 'moderator'
  created_at timestamptz not null default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- ============================================================================
-- RESOURCES TABLE (From remote - Curriculum materials)
-- ============================================================================
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  grade_level text not null,
  subject text not null,
  description text,
  file_url text not null,
  file_source_type text not null check (file_source_type in ('supabase', 'drive')),
  is_published boolean not null default false,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.resources enable row level security;

create policy "Published resources are viewable by everyone."
  on resources for select
  using ( is_published = true or auth.uid() = created_by );

create policy "Admins can manage resources."
  on resources for all
  using ( 
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- BLOG POSTS TABLE (From remote)
-- ============================================================================
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,
  author_id uuid references auth.users (id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

create policy "Published blog posts are viewable by everyone."
  on blog_posts for select
  using ( published_at is not null );

create policy "Admins can manage blog posts."
  on blog_posts for all
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- BLOG COMMENTS TABLE (From remote - Moderated)
-- ============================================================================
create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  status text not null default 'pending', -- 'pending', 'approved', 'rejected'
  created_at timestamptz not null default now()
);

alter table public.blog_comments enable row level security;

create policy "Approved comments are viewable by everyone."
  on blog_comments for select
  using ( status = 'approved' );

create policy "Users can create comments."
  on blog_comments for insert
  with check ( auth.role() = 'authenticated' );

create policy "Admins can manage comments."
  on blog_comments for all
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- COMMUNITY THREADS TABLE (From remote)
-- ============================================================================
create table if not exists public.community_threads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null, -- 'meetups', 'curriculum-help', 'general'
  location text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.community_threads enable row level security;

create policy "Threads are viewable by everyone."
  on community_threads for select
  using ( true );

create policy "Authenticated users can create threads."
  on community_threads for insert
  with check ( auth.role() = 'authenticated' );

-- ============================================================================
-- COMMUNITY POSTS TABLE (Merged - renamed from local 'posts')
-- ============================================================================
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.community_threads (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  parent_post_id uuid references public.community_posts (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.community_posts enable row level security;

create policy "Posts are viewable by everyone."
  on community_posts for select
  using ( true );

create policy "Authenticated users can create posts."
  on community_posts for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update their own posts."
  on community_posts for update
  using ( auth.uid() = author_id );

-- ============================================================================
-- LEGACY POSTS VIEW (For backward compatibility with existing frontend)
-- Maps threaded community structure to flat posts format
-- NOTE: This is a temporary bridge - frontend should be updated to use threads properly
-- ============================================================================
create view public.posts as
select 
  ct.id::bigint as id,
  ct.title as title,
  coalesce(
    (select content from community_posts where thread_id = ct.id and parent_post_id is null limit 1),
    ''
  ) as content,
  ct.category,
  ct.created_by as author_id,
  ct.created_at,
  (select count(*)::integer from community_posts where thread_id = ct.id) as views
from public.community_threads ct;

-- ============================================================================
-- COMMENTS TABLE (Local version - kept for compatibility)
-- ============================================================================
create table if not exists public.comments (
  id bigint generated by default as identity primary key,
  post_id bigint not null,
  author_id uuid references public.profiles(id) not null,
  content text not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;

create policy "Comments are viewable by everyone."
  on comments for select
  using ( true );

create policy "Authenticated users can create comments."
  on comments for insert
  with check ( auth.role() = 'authenticated' );

-- ============================================================================
-- MEETUPS TABLE (Local version - kept as is)
-- ============================================================================
create table if not exists public.meetups (
  id bigint generated by default as identity primary key,
  title text not null,
  description text,
  date timestamptz not null,
  location text not null,
  organizer_id uuid references public.profiles(id) not null,
  attendees_count integer default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.meetups enable row level security;

create policy "Meetups are viewable by everyone."
  on meetups for select
  using ( true );

create policy "Authenticated users can create meetups."
  on meetups for insert
  with check ( auth.role() = 'authenticated' );

-- ============================================================================
-- BOOKS TABLE (From remote - separate from reviews)
-- ============================================================================
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  age_band text not null,
  description text,
  cover_image_url text,
  created_at timestamptz not null default now()
);

alter table public.books enable row level security;

create policy "Books are viewable by everyone."
  on books for select
  using ( true );

create policy "Admins can manage books."
  on books for all
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- BOOK REVIEWS TABLE (Merged from both versions)
-- ============================================================================
create table if not exists public.book_reviews (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books (id) on delete cascade,
  reviewer_id uuid not null references auth.users (id) on delete cascade,
  rating_overall integer not null check (rating_overall between 1 and 5),
  age_appropriateness_rating integer check (age_appropriateness_rating between 1 and 5),
  strengths text,
  concerns text,
  themes text,
  content_categories text[], -- e.g. ['mature_language', 'violence']
  created_at timestamptz not null default now()
);

alter table public.book_reviews enable row level security;

create policy "Reviews are viewable by everyone."
  on book_reviews for select
  using ( true );

create policy "Authenticated users can create reviews."
  on book_reviews for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update their own reviews."
  on book_reviews for update
  using ( auth.uid() = reviewer_id );

-- ============================================================================
-- LEGACY REVIEWS TABLE (For backward compatibility)
-- Maps book_reviews to simpler format expected by current frontend
-- ============================================================================
create view public.reviews as
select 
  id::bigint as id,
  (select title from public.books where id = book_reviews.book_id) as book_title,
  (select author from public.books where id = book_reviews.book_id) as book_author,
  rating_overall as rating,
  strengths || ' ' || coalesce(concerns, '') as content,
  (select age_band from public.books where id = book_reviews.book_id) as age_range,
  content_categories as tags,
  reviewer_id as user_id,
  created_at
from public.book_reviews;

-- ============================================================================
-- CONTENT FLAGS TABLE (From remote - Moderation)
-- ============================================================================
create table if not exists public.content_flags (
  id uuid primary key default gen_random_uuid(),
  item_type text not null, -- 'community_post', 'book_review', 'blog_comment'
  item_id uuid not null,
  flagged_by uuid not null references auth.users (id) on delete cascade,
  reason text,
  status text not null default 'open', -- 'open', 'resolved'
  created_at timestamptz not null default now()
);

alter table public.content_flags enable row level security;

create policy "Admins can view all flags."
  on content_flags for select
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role in ('admin', 'moderator')
    )
  );

create policy "Users can flag content."
  on content_flags for insert
  with check ( auth.role() = 'authenticated' );

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
