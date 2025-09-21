import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { TargetIcon } from './icons/TargetIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { GlobeIcon } from './icons/GlobeIcon';

const AppHeader: React.FC = () => {
    const { t, language, setLanguage } = useAppContext();
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const langMenuRef = useRef<HTMLDivElement>(null);

    const navItems = [
        { to: '/study', title: t('navStarMap'), icon: <BookOpenIcon className="w-6 h-6" /> },
        { to: '/practice', title: t('navPractice'), icon: <TargetIcon className="w-6 h-6" /> },
        { to: '/performance', title: t('navPerformance'), icon: <ChartBarIcon className="w-6 h-6" /> },
        { to: '/settings', title: t('navSettings'), icon: <SettingsIcon className="w-6 h-6" /> },
    ];

    const languages = [
        { code: 'pt', name: t('portuguese') },
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
        <header className="fixed top-0 left-0 right-0 z-50 p-4">
            <div className="container mx-auto flex justify-between items-center bg-black/30 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <NavLink to="/" className="text-2xl font-bold text-primary-light hover:text-white transition-colors">
                    COSMUS
                </NavLink>

                <nav className="hidden md:flex items-center space-x-2">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                isActive ? 'bg-primary/80 text-white' : 'hover:bg-white/10 text-text-dark'
                                }`
                            }
                        >
                            {item.icon}
                            <span className="text-sm">{item.title}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="relative" ref={langMenuRef}>
                    <button
                        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                        className="p-2 rounded-full hover:bg-white/10 text-text-dark transition-colors"
                        aria-label={t('changeLanguage')}
                    >
                        <GlobeIcon className="w-6 h-6" />
                    </button>
                    {isLangMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-surface-dark border border-white/10 rounded-lg shadow-lg py-1">
                            {languages.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code as 'pt' | 'en' | 'es');
                                        setIsLangMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
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
            </div>
        </header>
    );
};

export default AppHeader;