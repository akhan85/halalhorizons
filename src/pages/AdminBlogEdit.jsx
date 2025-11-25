import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Save } from 'lucide-react';

const AdminBlogEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // undefined or 'new' for new post

    const [user, setUser] = React.useState(null);
    const [isAdmin, setIsAdmin] = React.useState(false);

    const [title, setTitle] = React.useState('');
    const [slug, setSlug] = React.useState('');
    const [excerpt, setExcerpt] = React.useState('');
    const [content, setContent] = React.useState('');
    const [published, setPublished] = React.useState(false);

    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const isNew = !id || id === 'new';
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const { data } = await supabase.auth.getUser();
                const currentUser = data?.user || null;
                setUser(currentUser);

                const adminFlag = !!currentUser?.user_metadata?.is_admin;
                setIsAdmin(adminFlag);

                if (!currentUser || !adminFlag) {
                    setLoading(false);
                    return;
                }

                if (isNew) {
                    setLoading(false);
                    return;
                }

                const { data: post, error } = await supabase
                    .from('blog_posts')
                    .select('id, title, slug, content, published_at, created_at')
                    .eq('id', id)
                    .maybeSingle();

                if (error) throw error;
                if (!post) {
                    throw new Error('Post not found');
                }

                setTitle(post.title || '');
                setSlug(post.slug || '');
                setContent(post.content || '');
                setExcerpt('');
                setPublished(!!post.published_at);
            } catch (err) {
                console.error('Error loading blog post', err);
                setError('Unable to load post.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    const handleGenerateSlug = () => {
        if (!title) return;
        const base = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');
        setSlug(base);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!user || !isAdmin) return;

        try {
            setSaving(true);
            setError(null);

            const now = new Date().toISOString();
            let published_at = null;
            if (published) {
                published_at = now;
            }

            // For now we store excerpt only in the frontend and rely on content for body.
            // If you add an excerpt column in the DB, wire it here.

            const payload = {
                title,
                slug,
                content,
                published_at,
                author_id: user.id,
            };

            let error;

            const isNew = !id || id === 'new';

            if (isNew) {
                const { error: insertError } = await supabase
                    .from('blog_posts')
                    .insert(payload);
                error = insertError;
            } else {
                const { error: updateError } = await supabase
                    .from('blog_posts')
                    .update(payload)
                    .eq('id', id);
                error = updateError;
            }

            if (error) throw error;

            navigate('/admin/blog');
        } catch (err) {
            console.error('Error saving blog post', err);
            setError('Unable to save post.');
        } finally {
            setSaving(false);
        }
    };

    const isNew = !id || id === 'new';

    if (loading) {
        return (
            <div className="bg-slate-50 min-h-screen py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-slate-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return (
            <div className="bg-slate-50 min-h-screen py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin blog</h1>
                    <p className="text-slate-600 text-sm mb-2">
                        You must be an admin to access this page.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate('/admin/blog')}
                    className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to blog list
                </button>

                <form
                    onSubmit={handleSave}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-5"
                >
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                        {isNew ? 'New blog post' : 'Edit blog post'}
                    </h1>
                    <p className="text-slate-600 text-sm mb-4">
                        Use Markdown in the content field for formatting (headings, lists, bold/italic, links).
                    </p>

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-accent focus:border-accent outline-none"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-slate-700">Slug</label>
                                <button
                                    type="button"
                                    onClick={handleGenerateSlug}
                                    className="text-xs font-medium text-accent hover:text-blue-500"
                                >
                                    Generate from title
                                </button>
                            </div>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-accent focus:border-accent outline-none"
                                required
                            />
                            <p className="text-[11px] text-slate-400 mt-1">Used in the URL: /blog/&lt;slug&gt;</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Optional short excerpt (for planning)</label>
                            <textarea
                                rows={2}
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-accent focus:border-accent outline-none"
                                placeholder="Optional: write a 1–2 sentence summary to copy into SEO fields or social posts."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Content (Markdown)</label>
                            <textarea
                                rows={16}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono leading-relaxed focus:ring-accent focus:border-accent outline-none"
                                placeholder={'# Heading\n\nIntro paragraph...'}
                                required
                            />
                            <p className="text-[11px] text-slate-400 mt-1">
                                Supports Markdown syntax: headings, bullet and numbered lists, **bold**, *italic*, and links.
                            </p>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={published}
                                    onChange={(e) => setPublished(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
                                />
                                Published
                            </label>
                            <p className="text-[11px] text-slate-400 max-w-xs text-right">
                                When checked, the post becomes visible on the public blog listing after you save.
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {saving ? 'Saving...' : 'Save post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminBlogEdit;
