import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { RocketLaunchIcon } from '../components/icons/RocketLaunchIcon';

const About: React.FC = () => {
    const { t } = useAppContext();
    const navigate = useNavigate();

    return (
        <div className="max-w-md mx-auto animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary-light mb-4 hover:underline">
                <ChevronLeftIcon className="w-5 h-5" />
                <span>{t('about.back')}</span>
            </button>

            <div className="pixelated-panel space-y-6 text-center">
                 <div>
                    <RocketLaunchIcon className="w-16 h-16 text-primary-light mx-auto mb-4" />
                    <h1 className="text-3xl text-white tracking-widest">{t('appNameShort')}</h1>
                    <p className="text-sm text-muted-dark">{t('about.title')}</p>
                </div>

                <div>
                    <h2 className="text-lg text-primary-light mb-2 uppercase tracking-widest">{t('about.version')}</h2>
                </div>

                <div>
                    <p className="text-text-dark text-sm leading-relaxed">
                        {t('about.description')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
