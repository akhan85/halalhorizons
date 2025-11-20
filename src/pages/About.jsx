import React from 'react';
import { Heart, Shield, Zap } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-white">
            {/* Hero */}
            <section className="bg-slate-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold text-slate-900 mb-6">Empowering the Next Generation</h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        HalalHorizons is dedicated to providing high-quality, values-based education resources for homeschooling families worldwide.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                We believe that every child deserves an education that not only challenges their intellect but also nurtures their character. Our mission is to bridge the gap between academic excellence and moral development.
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                By combining modern pedagogical methods with timeless values, we create a learning environment where children can thrive academically and spiritually.
                            </p>
                        </div>
                        <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                            <img
                                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80"
                                alt="Students learning"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="bg-slate-900 py-20 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-slate-800 p-8 rounded-xl">
                            <Heart className="h-10 w-10 text-accent mb-6" />
                            <h3 className="text-xl font-bold mb-4">Integrity</h3>
                            <p className="text-slate-300">
                                We uphold the highest standards of honesty and ethical conduct in everything we do.
                            </p>
                        </div>
                        <div className="bg-slate-800 p-8 rounded-xl">
                            <Shield className="h-10 w-10 text-accent mb-6" />
                            <h3 className="text-xl font-bold mb-4">Excellence</h3>
                            <p className="text-slate-300">
                                We strive for excellence in our curriculum, platform, and community support.
                            </p>
                        </div>
                        <div className="bg-slate-800 p-8 rounded-xl">
                            <Zap className="h-10 w-10 text-accent mb-6" />
                            <h3 className="text-xl font-bold mb-4">Innovation</h3>
                            <p className="text-slate-300">
                                We embrace new technologies and teaching methods to enhance the learning experience.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
