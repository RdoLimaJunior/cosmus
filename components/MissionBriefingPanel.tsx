import React from 'react';
import { CelestialBody } from '../types';
import { useAppContext } from '../context/AppContext';
import { XIcon } from './icons/XIcon';
import { RocketLaunchIcon } from './icons/RocketLaunchIcon';
import { CelestialBodyIcon } from './icons/CelestialBodyIcon';

interface MissionBriefingPanelProps {
    body: CelestialBody;
    onLaunch: () => void;
    onClose: () => void;
}

const TargetingReticule: React.FC = () => (
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 border-2 border-primary/50 rounded-full animate-pulse-glow"></div>
        <div className="absolute w-full h-px bg-primary/50"></div>
        <div className="absolute h-full w-px bg-primary/50"></div>
    </div>
);

const MissionBriefingPanel: React.FC<MissionBriefingPanelProps> = ({ body, onLaunch, onClose }) => {
    const { t } = useAppContext();

    const subjectColors: Record<string, string> = {
        Biology: 'border-green-500/80',
        Chemistry: 'border-blue-500/80',
        Physics: 'border-red-500/80',
    };

    const subjectTextColors: Record<string, string> = {
        Biology: 'text-green-400',
        Chemistry: 'text-blue-400',
        Physics: 'text-red-400',
    };
    
    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center animate-fade-in p-4">
            <aside className={`relative w-full max-w-lg bg-black/90 border-2 ${subjectColors[body.subject]} flex flex-col`}>
                <div className="flex justify-between items-center p-6 border-b-2 border-primary/20">
                    <h2 className="text-2xl text-white uppercase tracking-widest">{t('missionDetails')}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 text-muted-dark transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-grow flex flex-col md:flex-row max-h-[70vh]">
                    <div className="md:w-1/3 p-6 flex flex-col items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-primary/20">
                        <div className="relative w-28 h-28 mb-4">
                           <TargetingReticule />
                           <div className="absolute inset-0 flex items-center justify-center">
                               <CelestialBodyIcon body={body} isActive={true} size={64} />
                           </div>
                        </div>
                        <span className={`text-sm font-semibold uppercase ${subjectTextColors[body.subject]}`}>{t(body.subject.toLowerCase())}</span>
                        <h3 className="text-lg text-primary-light mt-1 text-center">{t(body.title)}</h3>
                    </div>
                    
                    <div className="md:w-2/3 p-6 overflow-y-auto">
                        <p className="text-text-dark leading-relaxed text-sm mb-6">{t(body.description)}</p>
                        
                        <div className="p-4 bg-black/50 border border-gray-700">
                            <h4 className="font-semibold text-white mb-2 uppercase text-sm">{t('missionSummary')}</h4>
                            <p className="text-xs text-muted-dark leading-normal">{t(body.summary)}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t-2 border-primary/20">
                     <button 
                        onClick={onLaunch}
                        className="w-full flex items-center justify-center gap-2 pixelated-button pixelated-button-primary text-lg"
                     >
                        <RocketLaunchIcon className="w-6 h-6" />
                        {t('startMission')}
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default MissionBriefingPanel;