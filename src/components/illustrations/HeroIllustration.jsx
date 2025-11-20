import React from 'react';
import { motion } from 'framer-motion';

const HeroIllustration = () => {
    return (
        <div className="relative w-full aspect-square max-w-lg mx-auto">
            {/* Background Glow - Brand Colors */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-green to-brand-olive rounded-3xl rotate-3 opacity-20 blur-xl"></div>

            {/* Main Container */}
            <div className="relative bg-slate-800 rounded-3xl border border-slate-700 p-8 shadow-2xl overflow-hidden h-full flex flex-col items-center justify-center">

                {/* Grid Background */}
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'linear-gradient(#Cbb686 1px, transparent 1px), linear-gradient(90deg, #Cbb686 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                <svg viewBox="0 0 400 400" className="w-full h-full z-10">

                    {/* 1. Graph Plotting Itself */}
                    <motion.path
                        d="M 50 350 L 350 350"
                        stroke="#94a3b8" strokeWidth="2"
                    />
                    <motion.path
                        d="M 50 350 L 50 50"
                        stroke="#94a3b8" strokeWidth="2"
                    />
                    <motion.path
                        d="M 50 350 Q 150 350 200 200 T 350 50"
                        stroke="#faca4f" strokeWidth="4" fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    />

                    {/* 2. Animated Compass Drawing a Circle */}
                    <motion.g
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        style={{ originX: "200px", originY: "200px" }}
                    >
                        {/* The Circle being drawn */}
                        <motion.circle
                            cx="200" cy="200" r="80"
                            stroke="#F27b21" strokeWidth="2" strokeDasharray="4 4" fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        />
                        {/* The Compass Tool */}
                        <g transform="translate(200, 200)">
                            <line x1="0" y1="0" x2="0" y2="-100" stroke="#Cbb686" strokeWidth="4" />
                            <line x1="0" y1="-100" x2="80" y2="0" stroke="#Cbb686" strokeWidth="4" />
                            <circle cx="0" cy="-100" r="5" fill="#fff" />
                        </g>
                    </motion.g>

                    {/* 3. Ruler Sliding */}
                    <motion.g
                        animate={{ x: [0, 50, 0], y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <rect x="50" y="50" width="300" height="40" fill="#f1f5f9" opacity="0.9" rx="4" transform="rotate(15, 200, 70)" />
                        {[...Array(15)].map((_, i) => (
                            <line
                                key={i}
                                x1={70 + i * 20} y1={50}
                                x2={70 + i * 20} y2={65}
                                stroke="#6f7750" strokeWidth="2"
                                transform="rotate(15, 200, 70)"
                            />
                        ))}
                    </motion.g>

                    {/* 4. Floating Pencil (New Request) */}
                    <motion.g
                        initial={{ x: 100, y: 200, rotate: -45 }}
                        animate={{
                            x: [100, 120, 100],
                            y: [200, 180, 200],
                            rotate: [-45, -35, -45]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        {/* Pencil Body */}
                        <rect x="0" y="0" width="20" height="100" fill="#faca4f" rx="2" />
                        <rect x="0" y="0" width="20" height="10" fill="#F27b21" rx="2" /> {/* Eraser */}
                        <polygon points="0,100 20,100 10,120" fill="#Cbb686" /> {/* Tip Wood */}
                        <polygon points="7,120 13,120 10,125" fill="#3b646a" /> {/* Lead */}
                    </motion.g>

                    {/* 5. Floating Eraser / Cube */}
                    <motion.rect
                        x="300" y="250" width="60" height="40" fill="#F27b21" rx="4"
                        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.rect
                        x="300" y="250" width="20" height="40" fill="#faca4f" rx="4"
                        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* 6. Floating Symbols */}
                    <motion.text x="320" y="100" fill="#fff" fontSize="30" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }}>+</motion.text>
                    <motion.text x="80" y="300" fill="#fff" fontSize="30" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>÷</motion.text>

                </svg>
            </div>
        </div>
    );
};

export default HeroIllustration;
