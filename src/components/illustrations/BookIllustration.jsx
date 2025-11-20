import React from 'react';
import { motion } from 'framer-motion';

const BookIllustration = () => {
    return (
        <div className="w-full h-full flex items-center justify-center relative">
            <svg viewBox="0 0 300 300" className="w-full h-full">

                {/* Background Glow */}
                <motion.circle
                    cx="150" cy="150" r="120"
                    fill="#faca4f"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.05, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />

                {/* Corner Sun */}
                <motion.g
                    initial={{ x: 15, y: 15, scale: 0.8, opacity: 0, rotate: 0 }}
                    animate={{ scale: 1.2, opacity: 1, rotate: 360 }}
                    transition={{
                        scale: { duration: 2, repeat: Infinity, repeatType: "reverse" },
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        opacity: { duration: 1 }
                    }}
                >
                    <circle r="35" fill="#faca4f" />
                    <circle r="25" fill="#F27b21" opacity="0.8" />
                    {[...Array(12)].map((_, i) => (
                        <rect
                            key={i}
                            x="-4" y="-50" width="8" height="15"
                            fill="#faca4f"
                            transform={`rotate(${i * 30})`}
                        />
                    ))}
                </motion.g>

                {/* The Open Book Base */}
                <g transform="translate(75, 200)">
                    {/* Left Page */}
                    <path d="M0 20 Q 75 30 75 20 L 75 50 Q 75 60 0 50 Z" fill="#3b646a" />
                    <path d="M5 22 Q 70 30 70 22 L 70 48 Q 70 55 5 48 Z" fill="#f1f5f9" opacity="0.1" />

                    {/* Right Page */}
                    <path d="M75 20 Q 75 30 150 20 L 150 50 Q 75 60 75 50 Z" fill="#2a484d" />
                    <path d="M80 22 Q 145 30 145 22 L 145 48 Q 80 55 80 48 Z" fill="#f1f5f9" opacity="0.1" />

                    {/* Spine */}
                    <rect x="73" y="20" width="4" height="30" fill="#1e3539" />
                </g>

                {/* The Growing Vine */}
                {/* Quadratic Curve: Start(150,220) Control(100, 150) End(150, 80) */}
                <motion.path
                    d="M 150 220 Q 100 150 150 80"
                    fill="none"
                    stroke="#6f7750"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />

                {/* Leaves - Calculated points on the curve with alternating sides */}
                {[
                    // Leaf 1 (Bottom): Right side. t=0.2
                    { x: 134, y: 192, rotate: -20, delay: 1.0, scale: 0.8 },

                    // Leaf 2: Left side. t=0.4
                    { x: 126, y: 164, rotate: 170, delay: 1.3, scale: 1 },

                    // Leaf 3: Right side. t=0.55
                    { x: 125, y: 143, rotate: 5, delay: 1.6, scale: 0.9 },

                    // Leaf 4 (Top): Left side. t=0.75
                    // Lowered y position to 115 to avoid flower overlap (flower at y=80)
                    { x: 131, y: 115, rotate: -160, delay: 1.8, scale: 0.8 },
                ].map((leaf, i) => (
                    <motion.g
                        key={i}
                        initial={{ x: leaf.x, y: leaf.y, rotate: leaf.rotate, scale: 0, opacity: 0 }}
                        whileInView={{ scale: leaf.scale, opacity: 1 }}
                        transition={{ duration: 0.5, delay: leaf.delay, type: "spring" }}
                        style={{ originX: "0px", originY: "50%" }}
                    >
                        <path
                            d="M 0 0 Q 20 -15 40 0 Q 20 15 0 0"
                            fill="#6f7750"
                        />
                        <path
                            d="M 0 0 L 35 0"
                            stroke="#3b646a"
                            strokeWidth="1"
                            opacity="0.5"
                        />
                    </motion.g>
                ))}

                {/* The Fruit/Flower (Bloom) */}
                <motion.g
                    initial={{ x: 150, y: 80, scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.8, delay: 2.2, type: "spring" }}
                >
                    <motion.g animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                        {[...Array(6)].map((_, i) => (
                            <ellipse
                                key={i}
                                cx="0" cy="-20" rx="6" ry="15"
                                fill="#F27b21"
                                transform={`rotate(${i * 60})`}
                            />
                        ))}
                    </motion.g>
                    <circle r="12" fill="#faca4f" />
                    <circle r="8" fill="#F27b21" opacity="0.5" />
                </motion.g>

                {/* Floating Pollen */}
                {[...Array(6)].map((_, i) => (
                    <motion.circle
                        key={i}
                        cx={120 + Math.random() * 60}
                        cy={200}
                        r={2 + Math.random() * 2}
                        fill="#faca4f"
                        opacity="0.6"
                        animate={{
                            y: -150,
                            x: Math.sin(i) * 20,
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeOut"
                        }}
                    />
                ))}

            </svg>
        </div>
    );
};

export default BookIllustration;
