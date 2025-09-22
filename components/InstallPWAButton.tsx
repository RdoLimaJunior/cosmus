import React, { useState, useEffect } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { useAppContext } from '../context/AppContext';

const InstallPWAButton: React.FC = () => {
    const { t } = useAppContext();
    const [installPrompt, setInstallPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) {
            return;
        }
        const result = await installPrompt.prompt();
        console.log(`Install prompt was: ${result.outcome}`);
        setInstallPrompt(null); // The prompt can only be used once
    };

    if (!installPrompt) {
        return null;
    }

    return (
        <button
            onClick={handleInstallClick}
            className="p-2 rounded-full hover:bg-white/10 text-text-dark transition-colors"
            aria-label={t('installApp')}
            title={t('installApp')}
        >
            <DownloadIcon className="w-6 h-6" />
        </button>
    );
};

export default InstallPWAButton;
