import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = React.useState(null);
    const [reviews, setReviews] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const [user, setUser] = React.useState(null);

    const [ratingOverall, setRatingOverall] = React.useState(5);
    const [ageRating, setAgeRating] = React.useState(5);
    const [strengths, setStrengths] = React.useState('');
    const [concerns, setConcerns] = React.useState('');
    const [themesInput, setThemesInput] = React.useState('');
    const [categoriesInput, setCategoriesInput] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [isEditing, setIsEditing] = React.useState(false);

    React.useEffect(() => {
        fetchData();
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        const { data } = await supabase.auth.getUser();
        setUser(data?.user || null);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('books')
                .select(`
                    id,
                    title,
                    author,
                    age_band,
                    description,
                    book_reviews (
                        id,
                        reviewer_id,
                        rating_overall,
                        age_appropriateness_rating,
                        strengths,
                        concerns,
                        themes,
                        content_categories,
                        status,
                        created_at
                    )
                `)
                .eq('id', id)
                .single();

            if (error) throw error;

            setBook({
                id: data.id,
                title: data.title,
                author: data.author,
                ageBand: data.age_band,
                description: data.description,
            });
            setReviews(data.book_reviews || []);
        } catch (err) {
            console.error('Error loading book', err);
            setError('Unable to load book details.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            setSubmitting(true);

            const themes = themesInput
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);

            const categories = categoriesInput
                .split(',')
                .map((c) => c.trim().toLowerCase().replace(/\s+/g, '_'))
                .filter(Boolean);

            let error;

            if (userReview) {
                const updateResult = await supabase
                    .from('book_reviews')
                    .update({
                        rating_overall: Number(ratingOverall),
                        age_appropriateness_rating: Number(ageRating),
                        strengths: strengths || null,
                        concerns: concerns || null,
                        themes: themes.length ? themes : null,
                        content_categories: categories.length ? categories : null,
                        status: 'pending',
                    })
                    .eq('id', userReview.id);

                error = updateResult.error;
            } else {
                const insertResult = await supabase.from('book_reviews').insert({
                    book_id: id,
                    reviewer_id: user.id,
                    rating_overall: Number(ratingOverall),
                    age_appropriateness_rating: Number(ageRating),
                    strengths: strengths || null,
                    concerns: concerns || null,
                    themes: themes.length ? themes : null,
                    content_categories: categories.length ? categories : null,
                    status: 'pending',
                });

                error = insertResult.error;
            }

            if (error) throw error;

            setRatingOverall(5);
            setAgeRating(5);
            setStrengths('');
            setConcerns('');
            setThemesInput('');
            setCategoriesInput('');
            setIsEditing(false);
            setSuccessMessage('Thank you. Your review has been submitted and will be visible once it has been approved by the admins.');

            await fetchData();
        } catch (err) {
            console.error('Error submitting review', err);
            setError('Unable to submit review.');
        } finally {
            setSubmitting(false);
        }
    };

    const approvedReviews = reviews.filter((r) => r.status === 'approved');

    const userReview = React.useMemo(() => {
        if (!user) return null;

        const userReviews = reviews.filter((r) => r.reviewer_id === user.id);
        if (userReviews.length === 0) return null;

        return userReviews.reduce((latest, current) => {
            if (!latest) return current;
            if (!latest.created_at) return current;
            if (!current.created_at) return latest;
            return new Date(current.created_at) > new Date(latest.created_at) ? current : latest;
        }, null);
    }, [reviews, user]);

    const computeAverageRating = () => {
        if (!approvedReviews.length) return null;
        const sum = approvedReviews.reduce((acc, r) => acc + (r.rating_overall || 0), 0);
        return (sum / approvedReviews.length).toFixed(1);
    };

    const allThemes = Array.from(
        new Set(
            approvedReviews
                .flatMap((r) => r.themes || [])
                .filter(Boolean)
        )
    );

    const allCategories = Array.from(
        new Set(
            approvedReviews
                .flatMap((r) => r.content_categories || [])
                .filter(Boolean)
        )
    );

    if (loading) {
        return (
            <div className="bg-slate-50 min-h-screen py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-slate-500">Loading book...</p>
                </div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="bg-slate-50 min-h-screen py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </button>
                    <p className="text-red-600">{error || 'Book not found.'}</p>
                </div>
            </div>
        );
    }

    const avgRating = computeAverageRating();

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to books
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">{book.title}</h1>
                            <p className="text-slate-600 mb-1">by {book.author}</p>
                            <p className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                                Age band: {book.ageBand}
                            </p>
                        </div>
                        {avgRating && (
                            <div className="flex items-center bg-brand-yellow/20 px-3 py-1 rounded-full">
                                <Star className="h-5 w-5 text-brand-orange fill-current" />
                                <span className="ml-1 font-bold text-brand-orange">{avgRating}</span>
                            </div>
                        )}
                    </div>

                    {book.description && (
                        <p className="text-slate-600 mb-4">{book.description}</p>
                    )}

                    <div className="flex flex-wrap gap-3 mb-2">
                        {allThemes.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-sm font-medium"
                            >
                                <CheckCircle className="h-4 w-4" />
                                {tag}
                            </span>
                        ))}
                        {allCategories.map((cat) => (
                            <span
                                key={cat}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-sm font-medium"
                            >
                                <AlertTriangle className="h-4 w-4" />
                                {cat.replace(/_/g, ' ')}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Parent reviews</h2>
                        {userReview && (
                            <p className="text-xs text-slate-500 mb-2">
                                You have submitted a review for this book. You can edit it using the form on the right; any changes will be re-submitted for approval.
                            </p>
                        )}
                        {approvedReviews.length === 0 ? (
                            <p className="text-slate-500 text-sm">No reviews yet. Be the first to share your thoughts.</p>
                        ) : (
                            <div className="space-y-4">
                                {approvedReviews.map((r) => (
                                    <div key={r.id} className="bg-white rounded-xl border border-slate-100 p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Star className="h-4 w-4 text-brand-orange fill-current" />
                                                <span className="font-semibold">{r.rating_overall}/5 overall</span>
                                                <span className="text-slate-400">· Age: {r.age_appropriateness_rating}/5</span>
                                            </div>
                                            <span className="text-xs text-slate-400">
                                                {r.created_at && new Date(r.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {r.strengths && (
                                            <p className="text-slate-700 text-sm mb-1"><span className="font-semibold">Strengths:</span> {r.strengths}</p>
                                        )}
                                        {r.concerns && (
                                            <p className="text-slate-700 text-sm mb-1"><span className="font-semibold">Concerns:</span> {r.concerns}</p>
                                        )}
                                        {(r.themes?.length || 0) > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {r.themes.map((t, index) => (
                                                    <span key={`${t}-${index}`} className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">{t}</span>
                                                ))}
                                            </div>
                                        )}
                                        {(r.content_categories?.length || 0) > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {r.content_categories.map((c, index) => (
                                                    <span key={`${c}-${index}`} className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-700">{c.replace(/_/g, ' ')}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Add your review</h2>
                        {!user ? (
                            <p className="text-slate-500 text-sm">
                                Please log in to add a review.
                            </p>
                        ) : (
                            <form className="bg-white rounded-xl border border-slate-100 p-4 space-y-4" onSubmit={handleSubmitReview}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Overall rating (1-5)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={ratingOverall}
                                            onChange={(e) => setRatingOverall(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-accent focus:border-accent outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Age appropriateness (1-5)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={ageRating}
                                            onChange={(e) => setAgeRating(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-accent focus:border-accent outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Strengths</label>
                                    <textarea
                                        rows="2"
                                        value={strengths}
                                        onChange={(e) => setStrengths(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-accent focus:border-accent outline-none"
                                        placeholder="What did you appreciate about this book?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Concerns</label>
                                    <textarea
                                        rows="2"
                                        value={concerns}
                                        onChange={(e) => setConcerns(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-accent focus:border-accent outline-none"
                                        placeholder="Anything parents should be aware of?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Themes (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={themesInput}
                                        onChange={(e) => setThemesInput(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-accent focus:border-accent outline-none"
                                        placeholder="e.g. family, courage, curiosity"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Content categories (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={categoriesInput}
                                        onChange={(e) => setCategoriesInput(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-accent focus:border-accent outline-none"
                                        placeholder="e.g. mild violence, romantic themes"
                                    />
                                </div>

                                {successMessage && (
                                    <p className="text-sm text-emerald-600">{successMessage}</p>
                                )}

                                {error && (
                                    <p className="text-sm text-red-600">{error}</p>
                                )}

                                <div className="flex flex-col gap-2">
                                    {userReview && !isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setRatingOverall(userReview.rating_overall || 5);
                                                setAgeRating(userReview.age_appropriateness_rating || 5);
                                                setStrengths(userReview.strengths || '');
                                                setConcerns(userReview.concerns || '');
                                                setThemesInput((userReview.themes || []).join(', '));
                                                setCategoriesInput((userReview.content_categories || []).join(', '));
                                                setSuccessMessage('');
                                                setIsEditing(true);
                                            }}
                                            className="w-full py-2 px-4 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
                                        >
                                            Edit your existing review
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-2.5 px-4 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? 'Submitting...' : isEditing && userReview ? 'Update review' : 'Submit review'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;
