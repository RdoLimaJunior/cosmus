
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SunIcon } from '../components/icons/SunIcon';
import { MoonIcon } from '../components/icons/MoonIcon';
import { BellIcon } from '../components/icons/BellIcon';
import { LogoutIcon } from '../components/icons/LogoutIcon';
import { InfoIcon } from '../components/icons/InfoIcon';
import { QuestionMarkCircleIcon } from '../components/icons/QuestionMarkCircleIcon';

type Language = 'pt' | 'en' | 'es';

const Settings: React.FC = () => {
    const { t, theme, toggleTheme, language, setLanguage } = useAppContext();
    const { logout } = useAuth();

    const [remindersEnabled, setRemindersEnabled] = useState(false);
    const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
    const [time, setTime] = useState('19:00');
    const [reminderStatus, setReminderStatus] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('cosmus-reminder');
        if (saved) {
            const { enabled, freq, t: savedTime } = JSON.parse(saved);
            setRemindersEnabled(enabled);
            setFrequency(freq);
            setTime(savedTime);
            if (enabled) {
                setReminderStatus(t('reminderSet', { frequency: t(freq), time: savedTime }));
            }
        }
    }, [t]);
    
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
    
    const handleSetReminder = async () => {
        if (!('Notification' in window) || !('serviceWorker' in navigator)) {
            alert('Your browser does not support notifications.');
            return;
        }

        if (Notification.permission === 'denied') {
            alert(t('notificationPermissionDenied'));
            return;
        }

        if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                return;
            }
        }
        
        const settingsToSave = { enabled: true, freq: frequency, t: time };

        navigator.serviceWorker.ready.then(registration => {
            registration.active?.postMessage({
                type: 'schedule-reminder',
                payload: { 
                    frequency, 
                    time,
                    title: t('notificationTitle'),
                    body: t('notificationBody')
                }
            });
            localStorage.setItem('cosmus-reminder', JSON.stringify(settingsToSave));
            setRemindersEnabled(true);
            setReminderStatus(t('reminderSet', { frequency: t(frequency), time: time }));
        });
    };

    const handleToggleReminders = (enabled: boolean) => {
        setRemindersEnabled(enabled);
        if (enabled) {
            handleSetReminder();
        } else {
            navigator.serviceWorker.ready.then(registration => {
                registration.active?.postMessage({ type: 'cancel-reminder' });
                localStorage.removeItem('cosmus-reminder');
                setReminderStatus('');
            });
        }
    };

    const formControlClasses = "w-full px-4 py-2 bg-black/50 border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-light text-text-dark text-sm";


    return (
        <div className="max-w-md mx-auto space-y-10 pixelated-panel">

            {/* Theme Settings */}
            <div>
                <h2 className="text-xl text-white mb-4 uppercase tracking-widest">{t('changeTheme')}</h2>
                <div className="flex items-center bg-black/30 p-1 border-2 border-gray-600">
                    <button
                        onClick={() => handleThemeChange('light')}
                        className={`w-1/2 flex items-center justify-center gap-2 py-2 transition-colors text-sm ${theme === 'light' ? 'bg-primary text-white' : 'text-muted-dark hover:bg-white/10'}`}
                    >
                        <SunIcon className="w-6 h-6" />
                        {t('lightTheme')}
                    </button>
                    <button
                        onClick={() => handleThemeChange('dark')}
                        className={`w-1/2 flex items-center justify-center gap-2 py-2 transition-colors text-sm ${theme === 'dark' ? 'bg-primary text-white' : 'text-muted-dark hover:bg-white/10'}`}
                    >
                        <MoonIcon className="w-6 h-6" />
                        {t('darkTheme')}
                    </button>
                </div>
                 <p className="text-xs text-muted-dark mt-2 text-center">{t('settingsThemeNote')}</p>
            </div>

            {/* Reminder Settings */}
            <div>
                <h2 className="text-xl text-white mb-4 uppercase tracking-widest">{t('studyReminders')}</h2>
                <div className="bg-black/30 p-4 border-2 border-gray-600 space-y-4">
                    <div className="flex items-center justify-between">
                        <label htmlFor="reminder-toggle" className="flex items-center gap-2 text-text-dark cursor-pointer">
                            <BellIcon className="w-5 h-5" />
                            <span>{t('enableReminders')}</span>
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="reminder-toggle" className="sr-only peer" checked={remindersEnabled} onChange={(e) => handleToggleReminders(e.target.checked)} />
                            <div className="pixel-toggle-track">
                                <div className="pixel-toggle-thumb"></div>
                            </div>
                        </label>
                    </div>

                    {remindersEnabled && (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <label htmlFor="frequency" className="block text-sm text-muted-dark mb-1">{t('frequency')}</label>
                                <select id="frequency" value={frequency} onChange={e => setFrequency(e.target.value as 'daily' | 'weekly')} className={formControlClasses}>
                                    <option value="daily">{t('daily')}</option>
                                    <option value="weekly">{t('weekly')}</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="time" className="block text-sm text-muted-dark mb-1">{t('time')}</label>
                                <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} className={formControlClasses} />
                            </div>
                            <button onClick={handleSetReminder} className="w-full pixelated-button pixelated-button-primary">
                                {t('setReminder')}
                            </button>
                        </div>
                    )}
                    {reminderStatus && <p className="text-xs text-primary-light text-center">{reminderStatus}</p>}
                </div>
            </div>


            {/* Language Settings */}
            <div>
                <h2 className="text-xl text-white mb-4 uppercase tracking-widest">{t('changeLanguage')}</h2>
                 <div className="flex items-center bg-black/30 p-1 border-2 border-gray-600">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                            className={`w-1/3 py-2 transition-colors text-sm uppercase ${
                                language === lang.code ? 'bg-primary text-white' : 'text-muted-dark hover:bg-white/10'
                            }`}
                        >
                            {lang.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* General Settings */}
            <div>
                <h2 className="text-xl text-white mb-4 uppercase tracking-widest">{t('general')}</h2>
                <div className="space-y-2">
                    <Link
                        to="/about"
                        className="w-full text-left p-3 border-2 bg-surface-dark border-gray-600 hover:bg-primary/20 hover:border-primary-light text-text-dark flex items-center gap-3 transition-colors text-sm"
                    >
                        <InfoIcon className="w-5 h-5" />
                        {t('navAbout')}
                    </Link>
                    <Link
                        to="/manual"
                        className="w-full text-left p-3 border-2 bg-surface-dark border-gray-600 hover:bg-primary/20 hover:border-primary-light text-text-dark flex items-center gap-3 transition-colors text-sm"
                    >
                        <QuestionMarkCircleIcon className="w-5 h-5" />
                        {t('navUserManual')}
                    </Link>
                </div>
            </div>

            {/* Logout Section */}
            <div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 pixelated-button"
                >
                    <LogoutIcon className="w-5 h-5" />
                    {t('auth.logout')}
                </button>
            </div>
             <style>{`
                /* Pixelated Toggle Switch */
                .pixel-toggle-track {
                    width: 52px;
                    height: 28px;
                    background-color: #2D3748; /* dark gray */
                    border: 2px solid #4A5568;
                    box-shadow: inset 2px 2px 0 0 #1A202C;
                    position: relative;
                    transition: background-color 0.2s;
                }
                .pixel-toggle-thumb {
                    width: 20px;
                    height: 20px;
                    background-color: #A0AEC0; /* gray */
                    border: 2px solid #E2E8F0;
                    box-shadow: inset -2px -2px 0 0 #718096;
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    transition: transform 0.2s ease-in-out;
                }
                .peer:checked + .pixel-toggle-track {
                    background-color: #08D; /* primary-dark */
                    box-shadow: inset 2px 2px 0 0 #06A;
                }
                .peer:checked + .pixel-toggle-track .pixel-toggle-thumb {
                    transform: translateX(24px);
                    background-color: #67E8F9; /* primary-light */
                    border-color: #FFFFFF;
                    box-shadow: inset -2px -2px 0 0 #0AF;
                }
             `}</style>
        </div>
    );
};

export default Settings;