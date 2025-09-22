


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

    const completeModule = (bodyToComplete: CelestialBody) => {
        const bodyInState = celestialBodies.find(b => b.id === bodyToComplete.id);
        if (!bodyInState || bodyInState.isCompleted) return;

        addXp(75); // Award XP for module completion
        setCelestialBodies(prevBodies => prevBodies.map(b => 
            b.id === bodyToComplete.id ? { ...b, isCompleted: true } : b
        ));
    };

    const handleCloseModuleView = () => {
        const MIN_STUDY_DURATION = 5000; // 5 seconds for a "successful" session.
        if (studyingBody && moduleStartTime && (Date.now() - moduleStartTime > MIN_STUDY_DURATION)) {
            completeModule(studyingBody);
        }
        setStudyingBody(null);
        setModuleStartTime(null);
    };

    const handleCloseBriefing = () => {
        setMissionTarget(null);
    };
    
    const handleNextModule = (nextModuleId: string) => {
        const currentBody = studyingBody;
        const nextBody = celestialBodies.find(m => m.id === nextModuleId);

        if (nextBody && currentBody) {
            const MIN_STUDY_DURATION = 5000; // 5 seconds
            if (moduleStartTime && (Date.now() - moduleStartTime > MIN_STUDY_DURATION)) {
                completeModule(currentBody);
            }

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