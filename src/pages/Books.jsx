import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Books = () => {
    const navigate = useNavigate();

    const [books, setBooks] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const [searchQuery, setSearchQuery] = React.useState('');
    const [ageBandFilter, setAgeBandFilter] = React.useState('all');
    const [themeFilter, setThemeFilter] = React.useState('all');

    React.useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);

            // Fetch books with their associated reviews
            const { data, error } = await supabase
                .from('books')
                .select(`
                    id,
                    title,
                    author,
                    age_band,
                    description,
                    book_reviews (
                        rating_overall,
                        age_appropriateness_rating,
                        strengths,
                        concerns,
                        themes,
                        content_categories,
                        created_at
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const mapped = (data || []).map((book) => {
                const reviews = book.book_reviews || [];

                let avgRating = null;
                if (reviews.length > 0) {
                    const sum = reviews.reduce((acc, r) => acc + (r.rating_overall || 0), 0);
                    avgRating = (sum / reviews.length).toFixed(1);
                }

                const allThemes = Array.from(
                    new Set(
                        reviews
                            .flatMap((r) => r.themes || [])
                            .filter(Boolean)
                    )
                );

                const allCategories = Array.from(
                    new Set(
                        reviews
                            .flatMap((r) => r.content_categories || [])
                            .filter(Boolean)
                    )
                );

                const latestReview = reviews[0] || null;

                return {
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    ageBand: book.age_band,
                    description: book.description,
                    avgRating,
                    themes: allThemes,
                    contentCategories: allCategories,
                    latestReview,
                };
            });

            setBooks(mapped);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const allThemes = Array.from(
        new Set(
            books
                .flatMap((b) => b.themes || [])
                .filter(Boolean)
        )
    );

    const filteredBooks = books.filter((book) => {
        if (ageBandFilter !== 'all' && book.ageBand !== ageBandFilter) {
            return false;
        }

        if (themeFilter !== 'all' && !(book.themes || []).includes(themeFilter)) {
            return false;
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const haystack = [
                book.title,
                book.author,
                book.description || '',
                ...(book.themes || []),
                ...(book.contentCategories || []),
            ]
                .join(' ')
                .toLowerCase();

            if (!haystack.includes(q)) {
                return false;
            }
        }

        return true;
    });

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Book Reviews</h1>
                    <p className="text-xl text-slate-600 mb-4">Curated reviews with detailed content ratings for peace of mind.</p>

                    <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by title, author, themes..."
                            className="w-full md:w-72 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-accent focus:border-accent outline-none"
                        />

                        <select
                            value={ageBandFilter}
                            onChange={(e) => setAgeBandFilter(e.target.value)}
                            className="w-full md:w-40 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-accent focus:border-accent outline-none"
                        >
                            <option value="all">All age bands</option>
                            <option value="K-2">K–2</option>
                            <option value="3-5">3–5</option>
                            <option value="6-8">6–8</option>
                            <option value="9-12">9–12</option>
                        </select>

                        <select
                            value={themeFilter}
                            onChange={(e) => setThemeFilter(e.target.value)}
                            className="w-full md:w-48 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-accent focus:border-accent outline-none"
                        >
                            <option value="all">All themes</option>
                            {allThemes.map((theme) => (
                                <option key={theme} value={theme}>
                                    {theme}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-500">Loading reviews...</div>
                ) : filteredBooks.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">No reviews found. Check back soon!</div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {filteredBooks.map((book) => (
                            <div key={book.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-48 h-64 md:h-auto relative bg-slate-200 flex items-center justify-center">
                                        <BookOpen className="h-12 w-12 text-slate-400" />
                                    </div>
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 mb-1">{book.title}</h2>
                                                <p className="text-slate-600">by {book.author}</p>
                                            </div>
                                            {book.avgRating && (
                                                <div className="flex items-center bg-brand-yellow/20 px-3 py-1 rounded-full">
                                                    <Star className="h-5 w-5 text-brand-orange fill-current" />
                                                    <span className="ml-1 font-bold text-brand-orange">{book.avgRating}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-4 mb-6">
                                            <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                                                Age band: {book.ageBand}
                                            </div>
                                            {book.themes && book.themes.map((tag, index) => (
                                                <div key={`${tag}-${index}`} className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-sm font-medium">
                                                    <CheckCircle className="h-4 w-4" />
                                                    {tag}
                                                </div>
                                            ))}
                                            {book.contentCategories && book.contentCategories.map((cat, index) => (
                                                <div key={`${cat}-${index}`} className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-sm font-medium">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    {cat.replace(/_/g, ' ')}
                                                </div>
                                            ))}
                                        </div>

                                        {book.latestReview && (
                                            <p className="text-slate-600 leading-relaxed mb-6">
                                                "{book.latestReview.strengths || book.latestReview.concerns || book.description}"
                                            </p>
                                        )}

                                        {!book.latestReview && book.description && (
                                            <p className="text-slate-600 leading-relaxed mb-6">
                                                {book.description}
                                            </p>
                                        )}

                                        <div className="flex gap-4">
                                            <button
                                                className="px-6 py-2 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
                                                onClick={() => navigate(`/books/${book.id}`)}
                                            >
                                                Read Full Review
                                            </button>
                                            <button
                                                type="button"
                                                className="px-6 py-2 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                                            >
                                                Add to Reading List
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Books;
