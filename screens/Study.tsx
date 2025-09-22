
import React, { useState } from 'react';
import { CelestialBody } from '../types';
import { celestialBodies as initialCelestialBodies } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { useUserProgress } from '../context/UserProgressContext';
import SectorMap from '../components/SectorMap';
import MissionBriefingPanel from '../components/MissionBriefingPanel';
import ModuleView from '../components/ModuleView';
import ChatbotWidget from '../components/ChatbotWidget';


const Study: React.FC = () => {
    const { t } = useAppContext();
    const { addXp } = useUserProgress();
    const [celestialBodies, setCelestialBodies] = useState<CelestialBody[]>(initialCelestialBodies);
    const [missionTarget, setMissionTarget] = useState<CelestialBody | null>(null);
    const [studyingBody, setStudyingBody] = useState<CelestialBody | null>(null);
    const [moduleStartTime, setModuleStartTime] = useState<number | null>(null);

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
        <>
            <div className="relative w-full h-full">
                <h1 className="sr-only">{t('navSectorMap')}</h1>
                <SectorMap
                    bodies={celestialBodies}
                    onSelectBody={handleSelectBody}
                    activeBodyId={missionTarget?.id}
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
        </>
    );
};

export default Study;