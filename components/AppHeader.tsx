import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useUserProgress } from '../context/UserProgressContext';
import { MapIcon } from './icons/MapIcon';
import { TargetIcon } from './icons/TargetIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import InstallPWAButton from './InstallPWAButton';

const AppHeader: React.FC = () => {
    const { t, language, setLanguage } = useAppContext();
    const { levelData } = useUserProgress();
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const langMenuRef = useRef<HTMLDivElement>(null);

    const { level, rank, progressPercentage } = levelData;
    const RankIcon = rank.icon;

    const navItems = [
        { to: '/study', title: t('navSectorMap'), icon: <MapIcon className="w-5 h-5" /> },
        { to: '/practice', title: t('navPractice'), icon: <TargetIcon className="w-5 h-5" /> },
        { to: '/performance', title: t('navPerformance'), icon: <ChartBarIcon className="w-5 h-5" /> },
        { to: '/settings', title: t('navSettings'), icon: <SettingsIcon className="w-5 h-5" /> },
    ];

    const languages = [
        { code: 'pt', name: t('português') },
        { code: 'en', name: t('english') },
        { code: 'es', name: t('spanish') },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
                setIsLangMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-20 p-2 sm:p-4">
            <div className="container mx-auto grid grid-cols-3 items-center bg-black/80 p-2 sm:p-3 border-2 border-white/20 backdrop-blur-md">
                {/* Left Section: User Progress */}
                <div className="flex items-center gap-3">
                    <RankIcon className="w-8 h-8 text-primary-light hidden sm:block" />
                    <div className="flex-grow">
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="text-primary-light text-xs uppercase">{t(rank.nameKey)}</span>
                            <span className="text-muted-dark text-xs">{t('level')} {level}</span>
                        </div>
                        <div className="w-32 sm:w-48 h-4 bg-black border-2 border-gray-600 p-px overflow-hidden">
                            <div 
                                className="h-full bg-secondary transition-all duration-500"
                                style={{ 
                                    width: `${progressPercentage}%`,
                                    backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)`,
                                    backgroundSize: `20px 20px`,
                                }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Center Section: Branding & Desktop Nav */}
                <div className="hidden md:flex flex-col items-center justify-center">
                    <h1 className="text-2xl text-white tracking-widest">{t('appNameShort')}</h1>
                    <nav className="flex items-center space-x-1 mt-2">
                        {navItems.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-1 px-2 py-1 transition-colors text-xs uppercase ${
                                    isActive ? 'bg-primary/80 text-white' : 'hover:bg-white/10 text-muted-dark'
                                    }`
                                }
                            >
                                {item.icon}
                                <span>{item.title}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Right Section: Controls */}
                <div className="flex items-center gap-2 justify-end">
                    <div className="relative" ref={langMenuRef}>
                        <button
                            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                            className="p-2 hover:bg-white/10 text-text-dark transition-colors"
                            aria-label={t('changeLanguage')}
                        >
                            <GlobeIcon className="w-6 h-6" />
                        </button>
                        {isLangMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-surface-dark border-2 border-white/20 py-1 z-50">
                                {languages.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang.code as 'pt' | 'en' | 'es');
                                            setIsLangMenuOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors uppercase ${
                                            language === lang.code
                                                ? 'bg-primary/80 text-white'
                                                : 'text-text-dark hover:bg-white/10'
                                        }`}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <InstallPWAButton />
                </div>
            </div>
        </header>
    );
};

export default AppHeader;