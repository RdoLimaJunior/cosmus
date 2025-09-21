import React from 'react';
import { StudyModule } from '../types';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

interface ModuleViewProps {
    module: StudyModule;
    onExit: () => void;
}

const ModuleView: React.FC<ModuleViewProps> = ({ module, onExit }) => {
    const { t } = useAppContext();

    return (
        <div className="fixed inset-0 bg-background-dark/95 backdrop-blur-sm z-30 flex flex-col p-4 md:p-8 animate-fade-in">
            <header className="flex-shrink-0 mb-8 z-10">
                <button 
                    onClick={onExit}
                    className="flex items-center gap-2 text-primary-light hover:text-white font-bold transition-colors"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                    <span>{t('returnToStarMap')}</span>
                </button>
            </header>

            <main className="flex-1 overflow-y-auto pr-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 text-primary-light">{module.title}</h1>
                    <p className="text-lg text-muted-dark mb-8 tracking-wider">{t('starSystem')}: {t(module.subject.toLowerCase())}</p>
                    
                    <div className="prose prose-lg prose-invert max-w-none text-text-dark font-mono leading-loose">
                        {module.content.split('\\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            </main>
            <style>{`
                @keyframes fade-in {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ModuleView;