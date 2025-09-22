import React from 'react';
import { CelestialBody } from '../../types';

interface CelestialBodyIconProps {
    body: CelestialBody;
    isActive: boolean;
    size?: number;
}

// Pixel art components using <rect> for crisp edges
const PixelArtSun: React.FC<{ size: number }> = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" shapeRendering="crispEdges">
        <rect x="8" y="2" width="8" height="2" fill="#F9BF2C"/>
        <rect x="6" y="4" width="12" height="2" fill="#F9BF2C"/>
        <rect x="4" y="6" width="16" height="2" fill="#FFF2A9"/>
        <rect x="2" y="8" width="20" height="8" fill="#FFF2A9"/>
        <rect x="4" y="16" width="16" height="2" fill="#FFF2A9"/>
        <rect x="6" y="18" width="12" height="2" fill="#F9BF2C"/>
        <rect x="8" y="20" width="8" height="2" fill="#F9BF2C"/>
    </svg>
);


const PixelArtEarth: React.FC<{ size: number, color: string }> = ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges">
        <rect x="4" y="0" width="8" height="1" fill={color}/>
        <rect x="2" y="1" width="12" height="1" fill={color}/>
        <rect x="1" y="2" width="14" height="12" fill={color}/>
        <rect x="2" y="14" width="12" height="1" fill={color}/>
        <rect x="4" y="15" width="8" height="1" fill={color}/>
        <rect x="5" y="4" width="2" height="2" fill="#9AE6B4" />
        <rect x="9" y="7" width="3" height="3" fill="#9AE6B4" />
        <rect x="3" y="9" width="3" height="2" fill="#9AE6B4" />
    </svg>
);


const PixelArtMars: React.FC<{ size: number, color: string }> = ({ size, color }) => (
     <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges">
        <rect x="4" y="0" width="8" height="1" fill={color}/>
        <rect x="2" y="1" width="12" height="1" fill={color}/>
        <rect x="1" y="2" width="14" height="12" fill={color}/>
        <rect x="2" y="14" width="12" height="1" fill={color}/>
        <rect x="4" y="15" width="8" height="1" fill={color}/>
        <rect x="6" y="1" width="4" height="1" fill="white" />
        <rect x="7" y="2" width="2" height="1" fill="white" />
    </svg>
);

const PixelArtJupiter: React.FC<{ size: number, color: string }> = ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" shapeRendering="crispEdges">
        <rect x="6" y="0" width="12" height="24" fill={color}/>
        <rect x="2" y="4" width="20" height="16" fill={color}/>
        <rect x="0" y="6" width="24" height="12" fill={color}/>
        <rect x="4" y="2" width="16" height="20" fill={color}/>
        <rect x="0" y="8" width="24" height="2" fill="#F6E05E" />
        <rect x="0" y="14" width="24" height="2" fill="#F6E05E" />
        <rect x="12" y="10" width="6" height="4" fill="#E53E3E" />
    </svg>
);

const PixelArtSaturn: React.FC<{ size: number, color: string }> = ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" shapeRendering="crispEdges">
        <rect x="8" y="4" width="8" height="16" fill={color}/>
        <rect x="6" y="6" width="12" height="12" fill={color}/>
        <rect x="4" y="8" width="16" height="8" fill={color}/>
        <rect x="0" y="10" width="24" height="4" fill="#F6E05E" />
        <rect x="2" y="8" width="2" height="8" fill="#F6E05E" />
        <rect x="20" y="8" width="2" height="8" fill="#F6E05E" />
    </svg>
);

const PixelArtMoon: React.FC<{ size: number, color: string }> = ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges">
        <rect x="4" y="0" width="8" height="16" fill={color}/>
        <rect x="2" y="2" width="12" height="12" fill={color}/>
        <rect x="0" y="4" width="16" height="8" fill={color}/>
        <rect x="4" y="3" width="2" height="2" fill="rgba(0,0,0,0.2)" />
        <rect x="9" y="8" width="3" height="3" fill="rgba(0,0,0,0.2)" />
    </svg>
);

const PixelArtGeneric: React.FC<{ size: number, color: string }> = ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges">
        <rect x="4" y="0" width="8" height="1" fill={color}/>
        <rect x="2" y="1" width="12" height="1" fill={color}/>
        <rect x="1" y="2" width="14" height="12" fill={color}/>
        <rect x="2" y="14" width="12" height="1" fill={color}/>
        <rect x="4" y="15" width="8" height="1" fill={color}/>
    </svg>
);

export const CelestialBodyIcon: React.FC<CelestialBodyIconProps> = ({ body, isActive, size = 40 }) => {
    const { isCompleted, id, color } = body;
    
    const finalColor = (isCompleted || isActive) ? (color || '#4A5568') : '#2D3748';

    const getBodyComponent = () => {
        switch (id) {
            case 'sol': return <PixelArtSun size={size} />;
            case 'earth': return <PixelArtEarth size={size} color={color || '#4299E1'} />;
            case 'mars': return <PixelArtMars size={size} color={finalColor} />;
            case 'jupiter': return <PixelArtJupiter size={size} color={finalColor} />;
            case 'saturn': return <PixelArtSaturn size={size} color={finalColor} />;
            case 'moon': return <PixelArtMoon size={size} color={finalColor} />;
            default:
                return <PixelArtGeneric size={size} color={finalColor} />;
        }
    };
    
    return (
      <div className={`${isActive ? 'animate-pulse-glow' : ''}`}>
        {getBodyComponent()}
      </div>
    );
};