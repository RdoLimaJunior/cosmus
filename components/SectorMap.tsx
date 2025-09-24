
import React, { useMemo } from 'react';
import { CelestialBody } from '../types';
import { CelestialBodyIcon } from './icons/CelestialBodyIcon';
import { useAppContext } from '../context/AppContext';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { StarIcon } from './icons/StarIcon';

interface SectorMapProps {
    bodies: CelestialBody[];
    onSelectBody: (body: CelestialBody) => void;
    activeBodyId?: string | null;
    favorites: string[];
    onToggleFavorite: (id: string) => void;
    filterActive: boolean;
}

const buildJourney = (allBodies: CelestialBody[]): CelestialBody[] => {
    const journey: CelestialBody[] = [];
    const bodyMap = new Map(allBodies.map(b => [b.id, b]));
    let currentId: string | undefined = 'sol';

    while (currentId && bodyMap.has(currentId)) {
        const body = bodyMap.get(currentId)!;
        journey.push(body);
        bodyMap.delete(currentId);
        currentId = body.unlocks;
    }
    
    const remainingBodies = Array.from(bodyMap.values())
        .filter(b => b.bodyType !== 'Star')
        .sort((a,b) => a.x - b.x);

    return [...journey, ...remainingBodies];
};

const SectorMap: React.FC<SectorMapProps> = ({ bodies, onSelectBody, activeBodyId, favorites, onToggleFavorite, filterActive }) => {
    const { t } = useAppContext();
    
    const journeyBodies = useMemo(() => buildJourney(bodies), [bodies]);

    const findPreviousBody = (currentIndex: number) => {
        if (currentIndex === 0) return null;
        const currentBody = journeyBodies[currentIndex];
        return bodies.find(b => b.unlocks === currentBody.id) || null;
    }

    return (
        <div 
            className="w-full h-full overflow-y-auto overflow-x-hidden"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#0AF #080812' }}
        >
            <div className="relative flex flex-col items-center w-full min-h-full px-20 py-10">
                {journeyBodies.map((body, index) => {
                    const prevBody = findPreviousBody(index);
                    const isLocked = prevBody ? !prevBody.isCompleted : false;
                    const isAvailable = !isLocked && !body.isCompleted;
                    const isPathActive = prevBody ? prevBody.isCompleted : false;

                    const isFavorited = favorites.includes(body.id);
                    const isFilteredOut = filterActive && !isFavorited;

                    let pathColor = 'bg-gray-700';
                    if (isPathActive) pathColor = 'bg-primary/50';

                    return (
                        <div key={body.id} className={`flex flex-col items-center w-full transition-opacity duration-300 ${isFilteredOut ? 'opacity-20 pointer-events-none' : ''}`}>
                            {/* Path from previous body */}
                            {index > 0 && (
                                <div className={`w-1 h-24 md:h-32 relative overflow-hidden ${pathColor}`}>
                                    {isPathActive && !body.isCompleted && (
                                        <div 
                                            className="absolute inset-0 bg-gradient-to-b from-primary/0 via-primary-light to-primary/0 opacity-80"
                                            style={{
                                                animation: `path-flow 3s ease-in-out infinite`,
                                                animationName: 'path-flow-vertical'
                                            }}
                                        ></div>
                                    )}
                                </div>
                            )}

                            {/* Celestial Body Node */}
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={() => onSelectBody(body)}
                                    disabled={isLocked}
                                    className={`relative flex flex-col items-center group transition-transform duration-300 my-4 ${isLocked ? 'cursor-not-allowed' : 'hover:scale-105'}`}
                                >
                                    <div className={`transition-all duration-300 p-2 border-2 rounded-full ${activeBodyId === body.id ? 'border-secondary' : 'border-transparent'}`}>
                                        <CelestialBodyIcon
                                            body={body}
                                            isActive={isAvailable}
                                            size={body.bodyType === 'Star' ? 128 : body.bodyType === 'GasGiant' ? 96 : 64}
                                        />
                                    </div>
                                    
                                    <h3 className={`mt-2 text-base uppercase whitespace-nowrap ${isLocked ? 'text-muted-dark' : 'text-white'}`}>
                                        {t(body.title)}
                                    </h3>

                                    {isLocked && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                                            <LockClosedIcon className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                    {body.isCompleted && (
                                        <div className="absolute -top-2 -right-2 bg-background-dark p-1 rounded-full drop-shadow-[0_0_5px_#2dd4bf]">
                                             <CheckCircleIcon className="w-8 h-8 text-teal-400" />
                                        </div>
                                    )}
                                    {!isLocked && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleFavorite(body.id);
                                            }}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onToggleFavorite(body.id); } }}
                                            className="absolute top-2 left-2 p-1 text-gray-600 bg-black/50 rounded-full hover:bg-black/70 z-10"
                                            aria-label={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                                        >
                                            <StarIcon className={`w-5 h-5 transition-colors duration-200 ${isFavorited ? 'text-yellow-400' : 'hover:text-yellow-300'}`} />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
             <style>{`
                @keyframes path-flow-vertical {
                    0% { transform: translateY(-101%); }
                    100% { transform: translateY(101%); }
                }
            `}</style>
        </div>
    );
};

export default SectorMap;
