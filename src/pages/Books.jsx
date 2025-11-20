import React from 'react';
import { Star, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Books = () => {
    const [books, setBooks] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBooks(data || []);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Book Reviews</h1>
                    <p className="text-xl text-slate-600">Curated reviews with detailed content ratings for peace of mind.</p>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-500">Loading reviews...</div>
                ) : books.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">No reviews found. Check back soon!</div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {books.map((book) => (
                            <div key={book.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-48 h-64 md:h-auto relative bg-slate-200 flex items-center justify-center">
                                        {/* Placeholder for cover if not available, or use a generic book icon */}
                                        <BookOpen className="h-12 w-12 text-slate-400" />
                                    </div>
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 mb-1">{book.book_title}</h2>
                                                <p className="text-slate-600">by {book.book_author}</p>
                                            </div>
                                            <div className="flex items-center bg-brand-yellow/20 px-3 py-1 rounded-full">
                                                <Star className="h-5 w-5 text-brand-orange fill-current" />
                                                <span className="ml-1 font-bold text-brand-orange">{book.rating}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 mb-6">
                                            <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                                                Age: {book.age_range}
                                            </div>
                                            {/* Tags/Themes */}
                                            {book.tags && book.tags.map((tag) => (
                                                <div key={tag} className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-sm font-medium">
                                                    <CheckCircle className="h-4 w-4" />
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>

                                        <p className="text-slate-600 leading-relaxed mb-6">
                                            "{book.content}"
                                        </p>

                                        <div className="flex gap-4">
                                            <button className="px-6 py-2 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors">
                                                Read Full Review
                                            </button>
                                            <button className="px-6 py-2 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors">
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
