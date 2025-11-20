import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import FeatureSection from '../components/FeatureSection';
import CurriculumIllustration from '../components/illustrations/CurriculumIllustration';
import CommunityIllustration from '../components/illustrations/CommunityIllustration';
import BookIllustration from '../components/illustrations/BookIllustration';
import HeroIllustration from '../components/illustrations/HeroIllustration';

const Home = () => {
    return (
        <div className="flex flex-col overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative bg-slate-900 text-white overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 5, 0]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="hidden lg:block absolute top-20 right-[10%] w-64 h-64 rounded-full border-4 border-brand-green/30"
                    />
                    <motion.div
                        animate={{
                            y: [0, 30, 0],
                            x: [0, 20, 0]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="hidden lg:block absolute bottom-20 left-[5%] w-48 h-48 rounded-full bg-brand-orange/20 blur-3xl"
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 text-center lg:text-left">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight"
                            >
                                Master Your Child's <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-olive">
                                    Future
                                </span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                            >
                                Interactive learning for the modern family. Join a community dedicated to academic excellence and character development.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            >
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-slate-900 bg-brand-yellow hover:bg-brand-orange transition-all duration-200 shadow-[0_0_20px_rgba(250,202,79,0.3)] hover:shadow-[0_0_30px_rgba(242,123,33,0.5)]"
                                >
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                                <Link
                                    to="/resources"
                                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-white border-2 border-brand-light-olive hover:bg-brand-light-olive/20 transition-all duration-200"
                                >
                                    View Curriculum
                                </Link>
                            </motion.div>
                        </div>

                        {/* Hero Visual */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 relative"
                        >
                            <HeroIllustration />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Feature 1: Curriculum */}
            <FeatureSection
                title="Concepts that click"
                description="Our K-12 curriculum moves beyond memorization. We use interactive problem-solving to build deep understanding in Math, Science, and Language Arts."
                color="bg-white"
            >
                <CurriculumIllustration />
            </FeatureSection>

            {/* Feature 2: Community */}
            <FeatureSection
                title="Learn with friends"
                description="Homeschooling doesn't mean learning alone. Join local meetups, participate in online forums, and connect with a global community of learners."
                reverse={true}
                color="bg-slate-50"
            >
                <CommunityIllustration />
            </FeatureSection>

            {/* Feature 3: Books */}
            <FeatureSection
                title="Curated for character"
                description="Find the perfect book for your child. Our reviews focus on content, values, and age-appropriateness, so you can build a library you trust."
                color="bg-white"
            >
                <BookIllustration />
            </FeatureSection>

            {/* CTA Section */}
            <section className="bg-slate-900 py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                        Ready to transform your homeschooling?
                    </h2>
                    <Link
                        to="/signup"
                        className="inline-flex items-center justify-center px-10 py-4 text-xl font-bold rounded-full text-slate-900 bg-brand-yellow hover:bg-brand-orange transition-all duration-200 shadow-xl hover:scale-105"
                    >
                        Join HalalHorizons
                    </Link>
                    <p className="mt-6 text-slate-400 text-sm">
                        No credit card required for free trial.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;
