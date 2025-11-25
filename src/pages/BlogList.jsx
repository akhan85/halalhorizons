import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const BlogList = () => {
    const [posts, setPosts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('id, title, slug, content, published_at, created_at')
                    .not('published_at', 'is', null)
                    .order('published_at', { ascending: false });

                if (error) throw error;

                const mapped = (data || []).map((post) => {
                    const text = post.content || '';
                    const firstLineBreak = text.indexOf('\n\n');
                    const excerpt = firstLineBreak > 0 ? text.slice(0, firstLineBreak) : text.slice(0, 240);
                    return {
                        id: post.id,
                        title: post.title,
                        slug: post.slug,
                        excerpt,
                        publishedAt: post.published_at || post.created_at,
                    };
                });

                setPosts(mapped);
            } catch (err) {
                console.error('Error loading blog posts', err);
                setError('Unable to load blog posts.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Blog</h1>
                <p className="text-slate-600 mb-8 text-sm md:text-base">
                    Articles and reflections for Muslim homeschooling families.
                </p>

                {loading && (
                    <p className="text-slate-500 text-sm">Loading posts...</p>
                )}

                {error && !loading && (
                    <p className="text-sm text-red-600 mb-4">{error}</p>
                )}

                {!loading && !error && posts.length === 0 && (
                    <p className="text-slate-500 text-sm">No blog posts have been published yet. Check back soon.</p>
                )}

                {!loading && !error && posts.length > 0 && (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <article key={post.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                <header className="mb-2">
                                    <h2 className="text-xl font-semibold text-slate-900 mb-1">
                                        <Link to={`/blog/${post.slug}`} className="hover:text-accent">
                                            {post.title}
                                        </Link>
                                    </h2>
                                    {post.publishedAt && (
                                        <p className="text-xs text-slate-400">
                                            {new Date(post.publishedAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </header>
                                {post.excerpt && (
                                    <p className="text-sm text-slate-700 mb-3 line-clamp-3 whitespace-pre-line">
                                        {post.excerpt}
                                    </p>
                                )}
                                <footer>
                                    <Link
                                        to={`/blog/${post.slug}`}
                                        className="inline-flex items-center text-sm font-medium text-accent hover:text-blue-500"
                                    >
                                        Read more
                                    </Link>
                                </footer>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogList;
