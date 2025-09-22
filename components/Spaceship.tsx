import React from 'react';

interface SpaceshipProps {
    x: number;
    y: number;
}

export const Spaceship: React.FC<SpaceshipProps> = ({ x, y }) => {
    return (
        <g 
            transform={`translate(${x}, ${y})`} 
            style={{ transition: 'transform 1s ease-in-out' }}
        >
            <g className="animate-launch-effect">
                <path d="M0 -10 L6 6 H2 L2 10 L-2 10 L-2 6 H-6 Z" fill="#EC4899" />
                <path d="M0 12 L2 10 H-2 Z" fill="#F472B6" className="animate-pulse" style={{ animationDelay: '0.2s' }}/>
                <circle cx="0" cy="0" r="3" fill="#FFF" />
            </g>
        </g>
    );
};