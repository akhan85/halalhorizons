import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const FeatureSection = ({ title, description, children, reverse, color = 'bg-white' }) => {
    return (
        <section className={clsx('py-24 overflow-hidden', color)}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={clsx(
                    'flex flex-col lg:flex-row items-center gap-16',
                    reverse ? 'lg:flex-row-reverse' : ''
                )}>
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 text-center lg:text-left"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                            {title}
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed mb-8">
                            {description}
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 rounded-full border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-colors"
                        >
                            Learn more
                        </motion.button>
                    </motion.div>

                    {/* Visual Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1 w-full max-w-lg lg:max-w-none"
                    >
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 shadow-xl border border-slate-200/50">
                            {/* Abstract Background Decoration */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent z-10"></div>
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

                            {/* Content Container */}
                            <div className="relative z-20 w-full h-full flex items-center justify-center p-8">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
