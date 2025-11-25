import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = React.useState(null);
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
                    .eq('slug', slug)
                    .maybeSingle();

                if (error) throw error;
                if (!data || !data.published_at) {
                    throw new Error('Post not found');
                }

                setPost({
                    id: data.id,
                    title: data.title,
                    slug: data.slug,
                    content: data.content || '',
                    publishedAt: data.published_at || data.created_at,
                });
            } catch (err) {
                console.error('Error loading blog post', err);
                setError('Unable to load this post.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [slug]);

    if (loading) {
        return (
            <div className="bg-slate-50 min-h-screen py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-slate-500">Loading post...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="bg-slate-50 min-h-screen py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </button>
                    <p className="text-red-600 text-sm">{error || 'Post not found.'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </button>

                <article className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
                    <header className="mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{post.title}</h1>
                        {post.publishedAt && (
                            <p className="text-xs text-slate-400">
                                {new Date(post.publishedAt).toLocaleDateString()}
                            </p>
                        )}
                    </header>

                    <div className="prose prose-slate max-w-none text-sm md:text-base">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default BlogPost;
