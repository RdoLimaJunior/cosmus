import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MapIcon } from './icons/MapIcon';
import { TargetIcon } from './icons/TargetIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { SettingsIcon } from './icons/SettingsIcon';

const BottomNavBar: React.FC = () => {
    const { t } = useAppContext();

    const navItems = [
        { to: '/study', title: t('navSectorMap'), icon: <MapIcon className="w-6 h-6" /> },
        { to: '/practice', title: t('navPractice'), icon: <TargetIcon className="w-6 h-6" /> },
        { to: '/performance', title: t('navPerformance'), icon: <ChartBarIcon className="w-6 h-6" /> },
        { to: '/settings', title: t('navSettings'), icon: <SettingsIcon className="w-6 h-6" /> },
    ];

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200 ${
            isActive 
            ? 'text-primary-light' 
            : 'text-muted-dark hover:text-text-dark'
        }`;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 h-20 bg-black/80 border-t-2 border-white/20 md:hidden">
            <div className="container mx-auto h-full">
                <div className="flex justify-around items-center h-full">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={navLinkClasses}
                        >
                            {item.icon}
                            <span className="text-[10px] uppercase">{item.title}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default BottomNavBar;