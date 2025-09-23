
import React, { useState, useEffect } from 'react';
import { CelestialBody } from '../types';
import { celestialBodies as initialCelestialBodies } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { useUserProgress } from '../context/UserProgressContext';
import SectorMap from '../components/SectorMap';
import MissionBriefingPanel from '../components/MissionBriefingPanel';
import ModuleView from '../components/ModuleView';
import ChatbotWidget from '../components/ChatbotWidget';
import { StarIcon } from '../components/icons/StarIcon';


const Study: React.FC = () => {
    const { t } = useAppContext();
    const { addXp } = useUserProgress();
    const [celestialBodies, setCelestialBodies] = useState<CelestialBody[]>(initialCelestialBodies);
    const [missionTarget, setMissionTarget] = useState<CelestialBody | null>(null);
    const [studyingBody, setStudyingBody] = useState<CelestialBody | null>(null);
    const [moduleStartTime, setModuleStartTime] = useState<number | null>(null);
    
    const [favorites, setFavorites] = useState<string[]>(() => {
        try {
            const savedFavorites = localStorage.getItem('cosmus-favorites');
            return savedFavorites ? JSON.parse(savedFavorites) : [];
        } catch (error) {
            console.error('Failed to parse favorites from localStorage', error);
            return [];
        }
    });
    
    const [filterActive, setFilterActive] = useState(false);

    useEffect(() => {
        localStorage.setItem('cosmus-favorites', JSON.stringify(favorites));
    }, [favorites]);

    const handleToggleFavorite = (bodyId: string) => {
        setFavorites(prevFavorites => {
            if (prevFavorites.includes(bodyId)) {
                return prevFavorites.filter(id => id !== bodyId);
            } else {
                return [...prevFavorites, bodyId];
            }
        });
    };

    const handleSelectBody = (body: CelestialBody) => {
        if (!studyingBody) {
            setMissionTarget(body);
        }
    };

    const handleLaunchMission = () => {
        if (missionTarget) {
            setStudyingBody(missionTarget);
            setMissionTarget(null);
            setModuleStartTime(Date.now());
        }
    };

    const endStudySession = (currentBody: CelestialBody | null) => {
        if (!currentBody || !moduleStartTime) return;

        const durationInMillis = Date.now() - moduleStartTime;
        const durationInSeconds = durationInMillis / 1000;

        // Define XP rewards and conditions
        const XP_PER_SECOND = 1;
        const MAX_TIME_XP = 120;
        const COMPLETION_BONUS_XP = 50;
        const MIN_DURATION_FOR_COMPLETION = 30; // seconds

        // 1. Award XP for the duration of the study session
        const timeXp = Math.min(Math.floor(durationInSeconds * XP_PER_SECOND), MAX_TIME_XP);
        if (timeXp > 0) {
            addXp(timeXp);
        }
        
        // 2. Award a fixed bonus for completing a module for the first time
        const bodyInState = celestialBodies.find(b => b.id === currentBody.id);
        
        if (bodyInState && !bodyInState.isCompleted && durationInSeconds >= MIN_DURATION_FOR_COMPLETION) {
            // This bonus is awarded in addition to the time-based XP
            addXp(COMPLETION_BONUS_XP); 
            setCelestialBodies(prevBodies => prevBodies.map(b => 
                b.id === currentBody.id ? { ...b, isCompleted: true } : b
            ));
        }
    };


    const handleCloseModuleView = () => {
        endStudySession(studyingBody);
        setStudyingBody(null);
        setModuleStartTime(null);
    };

    const handleCloseBriefing = () => {
        setMissionTarget(null);
    };
    
    const handleNextModule = (nextModuleId: string) => {
        endStudySession(studyingBody);

        const nextBody = celestialBodies.find(m => m.id === nextModuleId);
        if (nextBody) {
            setStudyingBody(null);
            setModuleStartTime(null);
            setMissionTarget(nextBody);
        }
    };


    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 flex justify-center gap-2 mb-4">
                <button
                    onClick={() => setFilterActive(false)}
                    className={`px-4 py-2 text-xs uppercase border-2 transition-colors ${!filterActive ? 'bg-primary text-white border-primary-light' : 'bg-transparent border-gray-600 text-muted-dark hover:bg-white/10 hover:border-primary'}`}
                >
                    {t('allModules')}
                </button>
                <button
                    onClick={() => setFilterActive(true)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs uppercase border-2 transition-colors ${filterActive ? 'bg-primary text-white border-primary-light' : 'bg-transparent border-gray-600 text-muted-dark hover:bg-white/10 hover:border-primary'}`}
                >
                    <StarIcon className="w-4 h-4" />
                    {t('favorites')}
                </button>
            </div>
            
            <div className="relative w-full h-full flex-grow">
                <h1 className="sr-only">{t('navSectorMap')}</h1>
                <SectorMap
                    bodies={celestialBodies}
                    onSelectBody={handleSelectBody}
                    activeBodyId={missionTarget?.id}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    filterActive={filterActive}
                />
            </div>

            {missionTarget && !studyingBody && (
                <MissionBriefingPanel
                    body={missionTarget}
                    onLaunch={handleLaunchMission}
                    onClose={handleCloseBriefing}
                />
            )}

            {studyingBody && (
                <ModuleView 
                    body={studyingBody} 
                    onClose={handleCloseModuleView} 
                    onNextModule={handleNextModule}
                />
            )}

            <ChatbotWidget selectedBody={studyingBody} />
        </div>
    );
};

export default Study;
