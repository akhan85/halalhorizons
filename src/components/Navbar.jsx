// Mobile-optimized UI
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, Users, Library, Info, Mail } from 'lucide-react';
import clsx from 'clsx';
import { supabase } from '../lib/supabase';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Resources', path: '/resources', icon: BookOpen },
        { name: 'Community', path: '/community', icon: Users },
        { name: 'Blog', path: '/blog', icon: BookOpen },
        { name: 'Books', path: '/books', icon: Library },
        { name: 'About', path: '/about', icon: Info },
        { name: 'Contact', path: '/contact', icon: Mail },
    ];

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        let mounted = true;

        const loadUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (mounted) {
                setUser(data?.user || null);
            }
        };

        loadUser();

        const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            mounted = false;
            subscription?.subscription?.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        navigate('/');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="hidden md:flex w-8 h-8 bg-accent rounded-lg items-center justify-center text-white font-bold text-xl">
                                H
                            </div>
                            <span className="font-bold text-xl text-slate-900 tracking-tight">HalalHorizons</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={clsx(
                                    'text-sm font-medium transition-colors duration-200 flex items-center gap-1.5',
                                    isActive(item.path)
                                        ? 'text-accent'
                                        : 'text-slate-600 hover:text-slate-900'
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.name}
                            </Link>
                        ))}
                        <div className="flex items-center gap-4 ml-4">
                            {user ? (
                                <>
                                    <span className="text-sm text-slate-600">
                                        Signed in
                                    </span>
                                    {user?.user_metadata?.is_admin && (
                                        <Link
                                            to="/admin/reviews"
                                            className="text-xs font-semibold uppercase tracking-wide text-emerald-700 hover:text-emerald-800"
                                        >
                                            Admin
                                        </Link>
                                    )}
                                    <Link
                                        to="/account"
                                        className="text-sm font-medium text-slate-700 hover:text-slate-900"
                                    >
                                        My account
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
                                    >
                                        Log out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-slate-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={clsx(
                                    'block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2',
                                    isActive(item.path)
                                        ? 'bg-slate-50 text-accent'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        ))}
                        <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-2 px-3">
                            {user ? (
                                <>
                                    {user?.user_metadata?.is_admin && (
                                        <Link
                                            to="/admin/reviews"
                                            onClick={() => setIsOpen(false)}
                                            className="block text-center px-4 py-2 border border-emerald-500 text-emerald-700 rounded-md text-base font-medium hover:bg-emerald-50"
                                        >
                                            Admin
                                        </Link>
                                    )}
                                    <Link
                                        to="/account"
                                        onClick={() => setIsOpen(false)}
                                        className="block text-center px-4 py-2 border border-slate-300 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        My account
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            handleLogout();
                                        }}
                                        className="block text-center px-4 py-2 border border-slate-300 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        Log out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="block text-center px-4 py-2 border border-slate-300 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setIsOpen(false)}
                                        className="block text-center px-4 py-2 border border-transparent rounded-md text-base font-medium text-white bg-slate-900 hover:bg-slate-800"
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
