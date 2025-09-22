import React from 'react';
import { CelestialBody } from '../types';
import { useAppContext } from '../context/AppContext';
import { XIcon } from './icons/XIcon';
import { RocketLaunchIcon } from './icons/RocketLaunchIcon';

interface MissionBriefingPanelProps {
    body: CelestialBody;
    onLaunch: () => void;
    onClose: () => void;
}

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
            <aside className={`relative w-full max-w-lg bg-black/90 border-2 ${subjectColors[body.subject]} flex flex-col p-6`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl text-white uppercase tracking-widest">{t('missionDetails')}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 text-muted-dark transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <span className={`text-sm font-semibold uppercase ${subjectTextColors[body.subject]}`}>{t(body.subject.toLowerCase())}</span>
                    <h3 className="text-xl text-primary-light mt-1 mb-3">{t(body.title)}</h3>
                    <p className="text-text-dark leading-relaxed text-sm">{t(body.description)}</p>
                    
                    <div className="mt-6 p-4 bg-black/50 border border-gray-700">
                        <h4 className="font-semibold text-white mb-2 uppercase text-sm">{t('missionSummary')}</h4>
                        <p className="text-xs text-muted-dark leading-normal">{t(body.summary)}</p>
                    </div>
                </div>

                <div className="mt-6">
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