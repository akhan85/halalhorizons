import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, BookOpen, Star, AlertTriangle, CheckCircle } from 'lucide-react';

const Account = () => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(null);
    const [reviews, setReviews] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const loadUserAndReviews = async () => {
            try {
                setLoading(true);
                setError(null);

                const { data: userData } = await supabase.auth.getUser();
                const currentUser = userData?.user || null;
                setUser(currentUser);

                if (!currentUser) {
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('book_reviews')
                    .select(`
                        id,
                        book_id,
                        rating_overall,
                        age_appropriateness_rating,
                        strengths,
                        concerns,
                        themes,
                        content_categories,
                        status,
                        created_at,
                        books (
                            id,
                            title,
                            author,
                            age_band
                        )
                    `)
                    .eq('reviewer_id', currentUser.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setReviews(data || []);
            } catch (err) {
                console.error('Error loading account data', err);
                setError('Unable to load your account data.');
            } finally {
                setLoading(false);
            }
        };

        loadUserAndReviews();
    }, []);

    const statusBadgeClass = (status) => {
        if (status === 'approved') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        if (status === 'rejected') return 'bg-red-50 text-red-700 border-red-100';
        return 'bg-amber-50 text-amber-700 border-amber-100';
    };

    if (loading) {
        return (
            <div className="bg-slate-50 min-h-screen py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-slate-500">Loading your account...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="bg-slate-50 min-h-screen py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">My account</h1>
                    <p className="text-slate-600 mb-4">You need to be logged in to view your account.</p>
                    <Link
                        to="/login"
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
                    >
                        Go to login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">My account</h1>
                    <p className="text-slate-600 mb-4 text-sm">Manage your profile and see your book reviews.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-slate-500">Email</p>
                            <p className="font-medium text-slate-900">{user.email}</p>
                        </div>
                        {user.user_metadata?.full_name && (
                            <div>
                                <p className="text-slate-500">Name</p>
                                <p className="font-medium text-slate-900">{user.user_metadata.full_name}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-accent" /> My book reviews
                        </h2>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 mb-4">{error}</p>
                    )}

                    {reviews.length === 0 ? (
                        <p className="text-slate-500 text-sm">
                            You haven&apos;t submitted any reviews yet. Visit the{' '}
                            <Link to="/books" className="text-accent hover:text-blue-500 font-medium">
                                books page
                            </Link>{' '}
                            to share your first review.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="border border-slate-100 rounded-xl p-4 flex flex-col gap-2"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-slate-900 text-sm">
                                                    {review.books?.title || 'Book'}
                                                </h3>
                                                {review.books?.author && (
                                                    <span className="text-xs text-slate-500">
                                                        by {review.books.author}
                                                    </span>
                                                )}
                                            </div>
                                            {review.books?.age_band && (
                                                <p className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                                                    Age band: {review.books.age_band}
                                                </p>
                                            )}
                                        </div>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${statusBadgeClass(
                                                review.status
                                            )}`}
                                        >
                                            {review.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                                            {review.status === 'rejected' && <AlertTriangle className="h-3 w-3 mr-1" />}
                                            {review.status === 'pending' && <AlertTriangle className="h-3 w-3 mr-1" />}
                                            {review.status ? review.status.charAt(0).toUpperCase() + review.status.slice(1) : 'Pending'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-slate-600">
                                        <span className="inline-flex items-center gap-1">
                                            <Star className="h-3 w-3 text-brand-orange fill-current" />
                                            Overall: {review.rating_overall}/5
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-slate-500">
                                            Age: {review.age_appropriateness_rating}/5
                                        </span>
                                        {review.created_at && (
                                            <span className="text-slate-400">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>

                                    {review.strengths && (
                                        <p className="text-slate-700 text-xs">
                                            <span className="font-semibold">Strengths:</span> {review.strengths}
                                        </p>
                                    )}
                                    {review.concerns && (
                                        <p className="text-slate-700 text-xs">
                                            <span className="font-semibold">Concerns:</span> {review.concerns}
                                        </p>
                                    )}

                                    {(review.themes?.length || 0) > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {review.themes.map((t, index) => (
                                                <span
                                                    key={`${review.id}-theme-${index}`}
                                                    className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {(review.content_categories?.length || 0) > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {review.content_categories.map((c, index) => (
                                                <span
                                                    key={`${review.id}-cat-${index}`}
                                                    className="text-[11px] px-2 py-0.5 rounded-full bg-red-50 text-red-700"
                                                >
                                                    {c.replace(/_/g, ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                        <Link
                                            to={review.books ? `/books/${review.books.id}` : '/books'}
                                            className="inline-flex items-center px-3 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                                        >
                                            View book
                                        </Link>
                                        <Link
                                            to={review.books ? `/books/${review.books.id}` : '/books'}
                                            className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-medium"
                                        >
                                            Edit review
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Account;
