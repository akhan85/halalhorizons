# Halal Horizons

A homeschooling platform for Muslim families, providing Islamically-aligned curriculum, community connections, and book reviews.

## Project Overview

Halal Horizons helps Muslim parents:
- Access grade-level curriculum resources (K-12) that meet state requirements while maintaining Islamic values
- Connect with local homeschooling families through community forums and meetups
- Discover and evaluate books through an Islamic lens with detailed content reviews

## Tech Stack

- **Frontend**: Vite + React + JavaScript
- **Styling**: Tailwind CSS + Framer Motion for animations
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Project Structure

```
halal-horizons/
├── docs/                          # Project documentation
│   ├── prd.md                     # Product Requirements Document
│   ├── acceptance-criteria.md     # Detailed acceptance criteria
│   └── project-summary.md         # Living project summary
├── src/
│   ├── components/                # Reusable React components
│   │   ├── illustrations/         # Custom SVG animations
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── Layout.jsx
│   ├── pages/                     # Page components
│   │   ├── Home.jsx               # Landing page with animations
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Resources.jsx          # Curriculum resources
│   │   ├── Community.jsx          # Forum and meetups
│   │   ├── Books.jsx              # Book reviews
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── lib/
│   │   └── supabase.js            # Supabase client config
│   ├── App.jsx                    # Main app with routing
│   └── index.css                  # Global styles
├── supabase/
│   └── schema.sql                 # Database schema
└── package.json

```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akhan85/halalhorizons.git
   cd halalhorizons
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the database:
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Run the SQL to create all tables, policies, and functions

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## Database Schema

The application uses a comprehensive Supabase schema with the following main tables:

- **profiles** - User profiles extending Supabase auth
- **resources** - Curriculum materials with grade/subject filtering
- **blog_posts** - Blog articles and tips
- **blog_comments** - Moderated blog comments
- **community_threads** - Forum discussion threads
- **community_posts** - Posts and replies within threads
- **meetups** - Local meetup events
- **books** - Book catalog
- **book_reviews** - Detailed book reviews with content ratings
- **content_flags** - Moderation system for flagged content

For detailed schema information, see `supabase/schema.sql`.

## Key Features

### 1. Animated Landing Page
Custom SVG illustrations with Framer Motion animations:
- Mathematical symbols floating animation (Hero section)
- Growing vine with blooming flower (Books section)
- Connected circles representing community
- Brand color palette (Green, Yellow, Orange, Olive)

### 2. Community Forum
- Discussion threads with categories (meetups, curriculum-help, general)
- Location-based filtering for meetups
- User profiles with post history
- Moderation system with content flagging

### 3. Book Reviews
- Structured reviews with Islamic perspectives
- Content category tags (e.g., mature language, violence)
- Age appropriateness ratings
- Strengths and concerns fields

### 4. Curriculum Resources
- Grade-level filtering (K-12)
- Subject categorization
- Supabase Storage or Google Drive links
- Admin-only upload and management

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment.

## Deployment

The app can be deployed to:
- **Vercel** (recommended for Vite apps)
- **Netlify**
- **Cloudflare Pages**

Make sure to set the environment variables in your deployment platform's settings.

## Documentation

- **PRD**: See `docs/prd.md` for detailed product requirements
- **Acceptance Criteria**: See `docs/acceptance-criteria.md` for feature completion criteria
- **Project Summary**: See `docs/project-summary.md` for living development notes

## Contributing

This is a community-focused project for Muslim homeschooling families. Contributions are welcome!

## License

[To be determined]

## Contact

For questions or feedback, please use the Contact form within the application or open an issue on GitHub.
