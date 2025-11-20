import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                H
                            </div>
                            <span className="font-bold text-xl text-slate-900 tracking-tight">HalalHorizons</span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Empowering families with a comprehensive homeschooling curriculum and a supportive community.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Resources</h3>
                        <ul className="space-y-3">
                            <li><Link to="/resources" className="text-slate-500 hover:text-accent text-sm">Curriculum</Link></li>
                            <li><Link to="/books" className="text-slate-500 hover:text-accent text-sm">Book Reviews</Link></li>
                            <li><Link to="/community" className="text-slate-500 hover:text-accent text-sm">Community</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="text-slate-500 hover:text-accent text-sm">About Us</Link></li>
                            <li><Link to="/contact" className="text-slate-500 hover:text-accent text-sm">Contact</Link></li>
                            <li><Link to="/privacy" className="text-slate-500 hover:text-accent text-sm">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-slate-400 hover:text-accent">
                                <span className="sr-only">Twitter</span>
                                <Twitter className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-accent">
                                <span className="sr-only">GitHub</span>
                                <Github className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-accent">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-slate-400 text-sm">
                        &copy; {new Date().getFullYear()} HalalHorizons. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
