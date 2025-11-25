import React from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Star, AlertTriangle, BookOpen, User as UserIcon } from 'lucide-react';

const AdminReviews = () => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(null);
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [reviews, setReviews] = React.useState([]);
    const [statusFilter, setStatusFilter] = React.useState('all'); // all | pending | rejected
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [updatingId, setUpdatingId] = React.useState(null);

    React.useEffect(() => {
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

                const { data: pending, error } = await supabase
                    .from('book_reviews')
                    .select(`
                        id,
                        book_id,
                        reviewer_id,
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
                    .in('status', ['pending', 'rejected'])
                    .order('created_at', { ascending: true });

                if (error) throw error;

                setReviews(pending || []);
            } catch (err) {
                console.error('Error loading admin reviews', err);
                setError('Unable to load reviews for moderation.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const handleUpdateStatus = async (id, nextStatus) => {
        try {
            setUpdatingId(id);
            setError(null);

            const { error } = await supabase
                .from('book_reviews')
                .update({ status: nextStatus })
                .eq('id', id);

            if (error) throw error;

            setReviews((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error('Error updating review status', err);
            setError('Unable to update review status.');
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="bg-slate-50 min-h-screen py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-slate-500">Loading reviews for moderation...</p>
                </div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return (
            <div className="bg-slate-50 min-h-screen py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin reviews</h1>
                    <p className="text-slate-600 text-sm mb-2">
                        You must be an admin to access this page.
                    </p>
                </div>
            </div>
        );
    }

    let filteredReviews = reviews;
    if (statusFilter === 'pending') {
        filteredReviews = reviews.filter((r) => r.status === 'pending');
    } else if (statusFilter === 'rejected') {
        filteredReviews = reviews.filter((r) => r.status === 'rejected');
    }

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </button>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-1">Review moderation</h1>
                        <p className="text-slate-600 text-sm">
                            Approve or reject pending book reviews. Only approved reviews appear publicly.
                        </p>
                    </div>
                    <div className="hidden sm:flex flex-col items-end text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                            <UserIcon className="h-3 w-3" /> {user?.email}
                        </span>
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                            <CheckCircle className="h-3 w-3" /> Admin
                        </span>
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-red-600 mb-4">{error}</p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs">
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                        <span className="text-slate-500">Filter by status:</span>
                        <button
                            type="button"
                            onClick={() => setStatusFilter('all')}
                            className={`px-2 py-0.5 rounded-full font-medium ${
                                statusFilter === 'all'
                                    ? 'bg-slate-900 text-white'
                                    : 'text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            All
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter('pending')}
                            className={`px-2 py-0.5 rounded-full font-medium ${
                                statusFilter === 'pending'
                                    ? 'bg-amber-500 text-white'
                                    : 'text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            Pending
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter('rejected')}
                            className={`px-2 py-0.5 rounded-full font-medium ${
                                statusFilter === 'rejected'
                                    ? 'bg-red-500 text-white'
                                    : 'text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            Rejected
                        </button>
                    </div>
                    <span className="text-slate-500">Showing {filteredReviews.length} review(s)</span>
                </div>

                {filteredReviews.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 text-sm text-slate-500 flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                        <span>No reviews match the current filter.</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredReviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-3"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                                                <BookOpen className="h-4 w-4 text-accent" />
                                                {review.books?.title || 'Book'}
                                            </h2>
                                            {review.books?.author && (
                                                <span className="text-xs text-slate-500">by {review.books.author}</span>
                                            )}
                                        </div>
                                        {review.books?.age_band && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                                                Age band: {review.books.age_band}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-1 text-xs text-slate-500">
                                        <span className="inline-flex items-center gap-1">
                                            <Star className="h-3 w-3 text-brand-orange fill-current" />
                                            {review.rating_overall}/5 overall · Age {review.age_appropriateness_rating}/5
                                        </span>
                                        {review.created_at && (
                                            <span>{new Date(review.created_at).toLocaleString()}</span>
                                        )}
                                        <span className="inline-flex items-center gap-1">
                                            <UserIcon className="h-3 w-3" />
                                            {review.reviewer_id}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                                            {review.status === 'rejected' ? 'Previously rejected' : 'Pending approval'}
                                        </span>
                                    </div>
                                </div>

                                {review.strengths && (
                                    <p className="text-xs text-slate-700">
                                        <span className="font-semibold">Strengths:</span> {review.strengths}
                                    </p>
                                )}
                                {review.concerns && (
                                    <p className="text-xs text-slate-700">
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

                                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                    <Link
                                        to={review.books ? `/books/${review.books.id}` : '/books'}
                                        className="inline-flex items-center px-3 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                                    >
                                        View book page
                                    </Link>
                                    <button
                                        type="button"
                                        disabled={updatingId === review.id}
                                        onClick={() => handleUpdateStatus(review.id, 'approved')}
                                        className="inline-flex items-center px-3 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <CheckCircle className="h-3 w-3 mr-1" /> Approve
                                    </button>
                                    <button
                                        type="button"
                                        disabled={updatingId === review.id}
                                        onClick={() => handleUpdateStatus(review.id, 'rejected')}
                                        className="inline-flex items-center px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <XCircle className="h-3 w-3 mr-1" /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6 text-xs text-slate-500 flex items-start gap-2">
                    <AlertTriangle className="h-3 w-3 mt-0.5" />
                    <p>
                        Only reviews with <code className="px-1 rounded bg-slate-100">status = 'approved'</code> are visible to visitors.
                        Pending and rejected reviews are only visible to reviewers themselves and admins.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminReviews;
