import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { SunIcon } from '../components/icons/SunIcon';
import { MoonIcon } from '../components/icons/MoonIcon';
import { BellIcon } from '../components/icons/BellIcon';

type Language = 'pt' | 'en' | 'es';

const Settings: React.FC = () => {
    const { t, theme, toggleTheme, language, setLanguage } = useAppContext();

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
        { code: 'pt', name: t('português') },
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
                            <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-dark peer-checked:bg-primary"></div>
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
             <style>{`
                .peer:checked + div:before {
                    transform: translateX(1.25rem);
                    background-color: white;
                }
                .peer + div:before {
                    content: '';
                    position: absolute;
                    top: 0.25rem;
                    left: 0.25rem;
                    width: 1.25rem;
                    height: 1.25rem;
                    background-color: #A0AEC0;
                    transition: all 0.2s;
                }
             `}</style>
        </div>
    );
};

export default Settings;