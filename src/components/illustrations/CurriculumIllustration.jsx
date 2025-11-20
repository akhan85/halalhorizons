import React from 'react';
import { motion } from 'framer-motion';

const CurriculumIllustration = () => {
    return (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(#6f7750 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {/* Removed max-w constraint to make it bigger */}
            <svg viewBox="0 0 300 300" className="w-full h-full">
                {/* Central Nucleus */}
                <motion.circle
                    cx="150"
                    cy="150"
                    r="30"
                    fill="#3b646a"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Electron Orbits */}
                {[0, 60, 120].map((angle, i) => (
                    <motion.ellipse
                        key={i}
                        cx="150"
                        cy="150"
                        rx="130"
                        ry="45"
                        stroke="#Cbb686"
                        strokeWidth="2"
                        fill="none"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
                        style={{ rotate: angle }}
                    />
                ))}

                {/* Orbiting Particles */}
                <motion.g animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} style={{ originX: "150px", originY: "150px" }}>
                    <circle cx="280" cy="150" r="8" fill="#F27b21" />
                </motion.g>
                <motion.g animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} style={{ originX: "150px", originY: "150px", rotate: 60 }}>
                    <circle cx="280" cy="150" r="8" fill="#faca4f" />
                </motion.g>
                <motion.g animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} style={{ originX: "150px", originY: "150px", rotate: 120 }}>
                    <circle cx="280" cy="150" r="8" fill="#6f7750" />
                </motion.g>


                {/* Floating Math/Science Symbols */}
                {[
                    { char: '∑', x: 250, y: 50, delay: 0, color: '#3b646a' },
                    { char: 'π', x: 50, y: 250, delay: 1, color: '#F27b21' },
                    { char: '√', x: 250, y: 250, delay: 2, color: '#6f7750' },
                    { char: '∞', x: 50, y: 50, delay: 3, color: '#faca4f' },
                    { char: '∫', x: 150, y: 30, delay: 1.5, color: '#Cbb686' },
                ].map((item, i) => (
                    <motion.text
                        key={i}
                        x={item.x}
                        y={item.y}
                        fill={item.color}
                        fontSize="32"
                        fontWeight="bold"
                        animate={{
                            y: [0, -15, 0],
                            opacity: [0.6, 1, 0.6],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 4, delay: item.delay, repeat: Infinity }}
                    >
                        {item.char}
                    </motion.text>
                ))}
            </svg>
        </div>
    );
};

export default CurriculumIllustration;
