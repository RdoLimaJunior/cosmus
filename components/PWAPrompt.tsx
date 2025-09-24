import React from 'react';
import { useAppContext } from '../context/AppContext';
import { DownloadIcon } from './icons/DownloadIcon';
import { XIcon } from './icons/XIcon';

const PWAPrompt: React.FC = () => {
    const { t, showInstallPrompt, handleInstall, dismissInstallPrompt } = useAppContext();

    if (!showInstallPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-24 md:bottom-5 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-md animate-fade-in-up">
            <div className="pixelated-panel flex items-center justify-between gap-4 !p-3">
                <div className="flex items-center gap-3">
                    <DownloadIcon className="w-8 h-8 text-primary-light flex-shrink-0" />
                    <p className="text-text-dark text-xs sm:text-sm">{t('pwa.prompt.title')}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={handleInstall} className="pixelated-button pixelated-button-primary !px-3 !py-1 text-xs">
                        {t('pwa.prompt.install')}
                    </button>
                    <button onClick={dismissInstallPrompt} className="p-2 text-muted-dark hover:text-white transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <style>{`
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translate(-50%, 20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
            `}</style>
        </div>
    );
};

export default PWAPrompt;
