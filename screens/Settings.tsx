import React from 'react';
import { useAppContext } from '../context/AppContext';
import GalacticLayout from '../components/GalacticLayout';
import { SunIcon } from '../components/icons/SunIcon';
import { MoonIcon } from '../components/icons/MoonIcon';

type Language = 'pt' | 'en' | 'es';

const Settings: React.FC = () => {
    const { t, theme, toggleTheme, language, setLanguage } = useAppContext();
    
    const languages: { code: Language, name: string }[] = [
        { code: 'pt', name: t('portuguese') },
        { code: 'en', name: t('english') },
        { code: 'es', name: t('spanish') },
    ];

    const handleThemeChange = (selectedTheme: 'light' | 'dark') => {
        if (theme !== selectedTheme) {
            toggleTheme();
        }
    };

    return (
        <GalacticLayout>
            <h1 className="text-4xl font-bold mb-8 text-primary-light text-center">{t('settingsTitle')}</h1>
            <div className="max-w-md mx-auto space-y-10 bg-surface-dark/50 border border-primary/30 rounded-lg p-8 shadow-lg">

                {/* Theme Settings */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">{t('changeTheme')}</h2>
                    <div className="flex items-center bg-black/30 rounded-full p-1">
                        <button
                            onClick={() => handleThemeChange('light')}
                            className={`w-1/2 flex items-center justify-center gap-2 py-2 rounded-full transition-colors ${theme === 'light' ? 'bg-primary text-white' : 'text-muted-dark hover:bg-white/10'}`}
                        >
                            <SunIcon className="w-5 h-5" />
                            {t('lightTheme')}
                        </button>
                        <button
                            onClick={() => handleThemeChange('dark')}
                            className={`w-1/2 flex items-center justify-center gap-2 py-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-primary text-white' : 'text-muted-dark hover:bg-white/10'}`}
                        >
                            <MoonIcon className="w-5 h-5" />
                            {t('darkTheme')}
                        </button>
                    </div>
                     <p className="text-xs text-muted-dark mt-2 text-center">Note: Some screens use a fixed dark theme for a better immersive experience.</p>
                </div>

                {/* Language Settings */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">{t('changeLanguage')}</h2>
                    <div className="space-y-3">
                        {languages.map(lang => (
                             <button
                                key={lang.code}
                                onClick={() => setLanguage(lang.code)}
                                className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                                    language === lang.code
                                        ? 'bg-primary/80 border-primary-light text-white font-semibold'
                                        : 'bg-surface-dark border-gray-600 hover:bg-primary/20 hover:border-primary-light text-text-dark'
                                }`}
                            >
                                {lang.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </GalacticLayout>
    );
};

export default Settings;
