import React from 'react';
import { motion } from 'framer-motion';

const CommunityIllustration = () => {
    return (
        <div className="w-full h-full flex items-center justify-center relative">
            {/* Removed max-w constraint */}
            <svg viewBox="0 0 300 300" className="w-full h-full">
                {/* Network Lines */}
                {[
                    { x1: 150, y1: 50, x2: 50, y2: 150 },
                    { x1: 150, y1: 50, x2: 250, y2: 150 },
                    { x1: 150, y1: 50, x2: 150, y2: 180 },
                    { x1: 50, y1: 150, x2: 100, y2: 250 },
                    { x1: 50, y1: 150, x2: 150, y2: 180 },
                    { x1: 250, y1: 150, x2: 200, y2: 250 },
                    { x1: 250, y1: 150, x2: 150, y2: 180 },
                    { x1: 100, y1: 250, x2: 200, y2: 250 },
                    { x1: 150, y1: 180, x2: 100, y2: 250 },
                    { x1: 150, y1: 180, x2: 200, y2: 250 },
                ].map((line, i) => (
                    <motion.line
                        key={i}
                        x1={line.x1} y1={line.y1}
                        x2={line.x2} y2={line.y2}
                        stroke="#Cbb686"
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0.5 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: i * 0.1 }}
                    />
                ))}

                {/* Nodes */}
                {[
                    { cx: 150, cy: 50, color: '#3b646a', r: 18 },
                    { cx: 50, cy: 150, color: '#6f7750', r: 14 },
                    { cx: 250, cy: 150, color: '#F27b21', r: 14 },
                    { cx: 150, cy: 180, color: '#faca4f', r: 22 }, // Central hub
                    { cx: 100, cy: 250, color: '#3b646a', r: 14 },
                    { cx: 200, cy: 250, color: '#F27b21', r: 14 },
                ].map((node, i) => (
                    <React.Fragment key={i}>
                        {/* Pulsing Ring */}
                        <motion.circle
                            cx={node.cx} cy={node.cy} r={node.r + 10}
                            stroke={node.color}
                            strokeWidth="2"
                            fill="none"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        />
                        {/* Solid Node */}
                        <motion.circle
                            cx={node.cx} cy={node.cy} r={node.r}
                            fill={node.color}
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ type: "spring", delay: i * 0.1 + 0.5 }}
                        />
                        <circle cx={node.cx} cy={node.cy} r={node.r / 3} fill="white" opacity="0.8" />
                    </React.Fragment>
                ))}

                {/* Moving Data Packets */}
                <motion.circle r="5" fill="#3b646a">
                    <animateMotion
                        path="M 150 50 L 50 150 L 100 250 L 200 250 L 250 150 L 150 50"
                        dur="6s"
                        repeatCount="indefinite"
                    />
                </motion.circle>
                <motion.circle r="5" fill="#F27b21">
                    <animateMotion
                        path="M 150 50 L 250 150 L 200 250 L 100 250 L 50 150 L 150 50"
                        dur="8s"
                        repeatCount="indefinite"
                    />
                </motion.circle>
            </svg>
        </div>
    );
};

export default CommunityIllustration;
