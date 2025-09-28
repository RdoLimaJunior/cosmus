import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { QuestionMarkCircleIcon } from '../components/icons/QuestionMarkCircleIcon';
import { MapIcon } from '../components/icons/MapIcon';
import { TargetIcon } from '../components/icons/TargetIcon';
import { ChartBarIcon } from '../components/icons/ChartBarIcon';
import { SettingsIcon } from '../components/icons/SettingsIcon';
import { RocketLaunchIcon } from '../components/icons/RocketLaunchIcon';

interface ManualSectionProps {
    title: string;
    content: string;
    icon: React.ReactNode;
}

const ManualSection: React.FC<ManualSectionProps> = ({ title, content, icon }) => (
    <div className="bg-black/30 p-4 border border-gray-700 flex items-start gap-4">
        <div className="flex-shrink-0 text-primary-light mt-1">{icon}</div>
        <div>
            <h2 className="text-lg text-white mb-2 uppercase tracking-wider">{title}</h2>
            <p className="text-text-dark text-sm leading-relaxed">{content}</p>
        </div>
    </div>
);

const UserManual: React.FC = () => {
    const { t } = useAppContext();
    const navigate = useNavigate();

    const sections = [
        {
            title: t('userManual.navigation.title'),
            content: t('userManual.navigation.content'),
            icon: <MapIcon className="w-6 h-6" />, // Generic nav icon
        },
        {
            title: t('userManual.study.title'),
            content: t('userManual.study.content'),
            icon: <RocketLaunchIcon className="w-6 h-6" />,
        },
        {
            title: t('userManual.practice.title'),
            content: t('userManual.practice.content'),
            icon: <TargetIcon className="w-6 h-6" />,
        },
        {
            title: t('userManual.performance.title'),
            content: t('userManual.performance.content'),
            icon: <ChartBarIcon className="w-6 h-6" />,
        },
        {
            title: t('userManual.settings.title'),
            content: t('userManual.settings.content'),
            icon: <SettingsIcon className="w-6 h-6" />,
        },
    ];

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary-light mb-4 hover:underline">
                <ChevronLeftIcon className="w-5 h-5" />
                <span>{t('about.back')}</span>
            </button>

            <div className="pixelated-panel space-y-6">
                 <div className="text-center">
                    <QuestionMarkCircleIcon className="w-16 h-16 text-primary-light mx-auto mb-4" />
                    <h1 className="text-3xl text-white tracking-widest uppercase">{t('userManual.title')}</h1>
                </div>

                <div className="space-y-4">
                    {sections.map(section => (
                        <ManualSection key={section.title} {...section} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserManual;