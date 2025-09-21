import React from 'react';
import { StudyModule } from '../types';
import { useAppContext } from '../context/AppContext';
import { RocketLaunchIcon } from './icons/RocketLaunchIcon';
import { XIcon } from './icons/XIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface MissionBriefingPanelProps {
    module: StudyModule;
    onLaunch: () => void;
    onClose: () => void;
}

const MissionBriefingPanel: React.FC<MissionBriefingPanelProps> = ({ module, onLaunch, onClose }) => {
    const { t } = useAppContext();

    return (
        <div className="fixed bottom-4 left-4 md:bottom-8 md:left-8 w-[calc(100%-2rem)] max-w-sm z-20">
            <div className="bg-surface-dark/80 backdrop-blur-md border border-primary/50 rounded-xl shadow-2xl shadow-primary/20 text-text-dark animate-fade-in-up">
                <header className="flex items-center justify-between p-4 border-b border-primary/30">
                    <h2 className="text-lg font-bold text-primary-light uppercase tracking-widest">{t('missionBriefing')}</h2>
                    <button onClick={onClose} className="p-1 text-muted-dark hover:text-primary-light transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                </header>
                <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{module.title}</h3>
                    <div className="flex items-center gap-2 mb-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${module.subject === 'Biology' ? 'bg-green-500/20 text-green-300' : module.subject === 'Chemistry' ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-300'}`}>
                            {t(module.subject.toLowerCase())}
                        </span>
                        {module.isCompleted && (
                            <span className="flex items-center gap-1 text-xs text-secondary-light">
                                <CheckCircleIcon className="w-4 h-4" />
                                COMPLETED
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-muted-dark mb-6 leading-relaxed">{module.summary}</p>
                    
                    <button 
                        onClick={onLaunch}
                        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-lg shadow-lg shadow-secondary/30 transform hover:scale-105 transition-all duration-300"
                    >
                        <RocketLaunchIcon className="w-6 h-6" />
                        <span>{t('launchSequence')}</span>
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default MissionBriefingPanel;