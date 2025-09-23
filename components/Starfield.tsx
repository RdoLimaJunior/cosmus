import React, { useMemo } from 'react';
import './Starfield.css';

const STAR_COUNT = 70;
const ASTEROID_COUNT = 100;

interface CelestialObject {
  top: string;
  left: string;
  size: number;
  animationDelay: string;
}

const Starfield: React.FC = () => {
    const generateRandomStyle = (isAsteroid: boolean = false): CelestialObject => {
        const size = isAsteroid 
            ? Math.random() * 3 + 1
            : Math.random() * 2 + 1;
        return {
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size,
            animationDelay: `${Math.random() * 5}s`,
        };
    };

    const stars = useMemo(() => Array.from({ length: STAR_COUNT }).map(() => generateRandomStyle()), []);
    const asteroids = useMemo(() => Array.from({ length: ASTEROID_COUNT }).map(() => generateRandomStyle(true)), []);

    const distantPlanets = useMemo(() => [
        { top: '15%', left: '20%', size: 10, color: 'rgba(236, 72, 153, 0.5)' }, // secondary
        { top: '80%', left: '85%', size: 12, color: 'rgba(10, 175, 255, 0.4)' }, // primary
        { top: '50%', left: '90%', size: 8, color: 'rgba(246, 224, 94, 0.5)' }, // yellow-400
    ], []);

    return (
        <div className="starfield">
            {stars.map((star, i) => (
                <div
                    key={`star-${i}`}
                    className="star"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDelay: star.animationDelay,
                    }}
                />
            ))}
            
            {distantPlanets.map((planet, i) => (
                 <div
                    key={`planet-${i}`}
                    className="planet"
                    style={{
                        top: planet.top,
                        left: planet.left,
                        width: `${planet.size}px`,
                        height: `${planet.size}px`,
                        backgroundColor: planet.color,
                        animationDelay: `${i * 1.5}s`,
                    }}
                />
            ))}
            
            <div className="asteroid-belt">
                {asteroids.map((asteroid, i) => (
                    <div
                        key={`asteroid-${i}`}
                        className="asteroid"
                        style={{
                            top: asteroid.top,
                            left: asteroid.left,
                            width: `${asteroid.size}px`,
                            height: `${asteroid.size * (Math.random() * 0.5 + 0.5)}px`, // more irregular shapes
                            transform: `rotate(${Math.random() * 360}deg)`,
                        }}
                    />
                ))}
            </div>

            <div className="comet-container">
                <div className="comet"></div>
            </div>
        </div>
    );
};

export default Starfield;
