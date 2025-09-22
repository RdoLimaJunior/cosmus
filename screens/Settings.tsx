

import React from 'react';
import { useAppContext } from '../context/AppContext';
import { SunIcon } from '../components/icons/SunIcon';
import { MoonIcon } from '../components/icons/MoonIcon';

type Language = 'pt' | 'en' | 'es';

const Settings: React.FC = () => {
    const { t, theme, toggleTheme, language, setLanguage } = useAppContext();
    
    const languages: { code: Language, name: string }[] = [
        { code: 'pt', name: t('português') },
        { code: 'en', name: t('english') },
        { code: 'es', name: t('spanish') },
    ];

    const handleThemeChange = (selectedTheme: 'light' | 'dark') => {
        if (theme !== selectedTheme) {
            toggleTheme();
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-10 bg-black/50 border-2 border-primary/50 p-8">

            {/* Theme Settings */}
            <div>
                <h2 className="text-xl text-white mb-4 uppercase tracking-widest">{t('changeTheme')}</h2>
                <div className="flex items-center bg-black/30 p-1 border-2 border-gray-600">
                    <button
                        onClick={() => handleThemeChange('light')}
                        className={`w-1/2 flex items-center justify-center gap-2 py-2 transition-colors text-sm ${theme === 'light' ? 'bg-primary text-white' : 'text-muted-dark hover:bg-white/10'}`}
                    >
                        <SunIcon className="w-5 h-5" />
                        {t('lightTheme')}
                    </button>
                    <button
                        onClick={() => handleThemeChange('dark')}
                        className={`w-1/2 flex items-center justify-center gap-2 py-2 transition-colors text-sm ${theme === 'dark' ? 'bg-primary text-white' : 'text-muted-dark hover:bg-white/10'}`}
                    >
                        <MoonIcon className="w-5 h-5" />
                        {t('darkTheme')}
                    </button>
                </div>
                 <p className="text-xs text-muted-dark mt-2 text-center">{t('settingsThemeNote')}</p>
            </div>

            {/* Language Settings */}
            <div>
                <h2 className="text-xl text-white mb-4 uppercase tracking-widest">{t('changeLanguage')}</h2>
                <div className="space-y-3">
                    {languages.map(lang => (
                         <button
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                            className={`w-full text-left p-3 border-2 transition-colors text-sm ${
                                language === lang.code
                                    ? 'bg-primary/80 border-primary-light text-white'
                                    : 'bg-surface-dark border-gray-600 hover:bg-primary/20 hover:border-primary-light text-text-dark'
                            }`}
                        >
                            {lang.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Settings;