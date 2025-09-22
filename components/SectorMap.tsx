import React, { useMemo } from 'react';
import { CelestialBody } from '../types';
import { CelestialBodyIcon } from './icons/CelestialBodyIcon';
import { useAppContext } from '../context/AppContext';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface SectorMapProps {
    bodies: CelestialBody[];
    onSelectBody: (body: CelestialBody) => void;
    activeBodyId?: string | null;
}

const buildJourney = (allBodies: CelestialBody[]): CelestialBody[] => {
    const journey: CelestialBody[] = [];
    const bodyMap = new Map(allBodies.map(b => [b.id, b]));
    let currentId: string | undefined = 'earth';

    // Build the main quest line
    while (currentId && bodyMap.has(currentId)) {
        const body = bodyMap.get(currentId)!;
        journey.push(body);
        bodyMap.delete(currentId);
        currentId = body.unlocks;
    }
    
    // Add any remaining bodies that aren't part of the main unlock path
    const remainingBodies = Array.from(bodyMap.values())
        .filter(b => b.bodyType !== 'Star')
        .sort((a,b) => a.x - b.x); // Simple sort for some consistency

    return [...journey, ...remainingBodies];
};

const SectorMap: React.FC<SectorMapProps> = ({ bodies, onSelectBody, activeBodyId }) => {
    const { t } = useAppContext();
    
    const journeyBodies = useMemo(() => buildJourney(bodies), [bodies]);
    const bodyMap = useMemo(() => new Map(bodies.map(b => [b.id, b])), [bodies]);

    const findPreviousBody = (currentIndex: number) => {
        if (currentIndex === 0) return null;
        const currentBody = journeyBodies[currentIndex];
        // Find a body that unlocks the current one
        return bodies.find(b => b.unlocks === currentBody.id) || null;
    }

    return (
        <div 
            className="w-full h-full overflow-y-auto"
            style={{
                background: 'linear-gradient(to bottom, #0c0a1f, #000000 50%)'
            }}
        >
            <div className="relative flex flex-col items-center max-w-sm mx-auto pt-10 pb-20">
                {journeyBodies.map((body, index) => {
                    const prevBody = findPreviousBody(index);
                    const isLocked = prevBody ? !prevBody.isCompleted : false;
                    const isAvailable = !isLocked && !body.isCompleted;

                    let pathColor = 'bg-gray-700';
                    if (body.isCompleted) pathColor = 'bg-teal-500';
                    if (isAvailable) pathColor = 'bg-primary';

                    return (
                        <div key={body.id} className="flex flex-col items-center w-full">
                            {/* Path from previous body */}
                            {index > 0 && (
                                <div className={`w-1 flex-grow h-24 ${pathColor}`}></div>
                            )}

                            {/* Celestial Body Node */}
                            <button
                                onClick={() => onSelectBody(body)}
                                disabled={isLocked}
                                className={`relative flex flex-col items-center group transition-transform duration-300 ${isLocked ? 'cursor-not-allowed' : 'hover:scale-105'}`}
                            >
                                <div className={`transition-all duration-300 p-2 border-2 ${activeBodyId === body.id ? 'border-secondary' : 'border-transparent'}`}>
                                    <CelestialBodyIcon
                                        body={body}
                                        isActive={isAvailable}
                                        size={body.bodyType === 'GasGiant' ? 96 : body.bodyType === 'Terrestrial' ? 64 : 48}
                                    />
                                </div>
                                
                                <h3 className={`mt-2 text-base uppercase ${isLocked ? 'text-muted-dark' : 'text-white'}`}>
                                    {t(body.title)}
                                </h3>

                                {isLocked && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <LockClosedIcon className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}
                                {body.isCompleted && (
                                    <div className="absolute -top-2 -right-2 bg-background-dark p-1">
                                         <CheckCircleIcon className="w-8 h-8 text-teal-400" />
                                    </div>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SectorMap;