import React, { useEffect, useState } from 'react';
import { Rank } from '../types';
import { XIcon } from './icons/XIcon';
import { useAppContext } from '../context/AppContext';

interface LevelUpNotificationProps {
  rank: Rank;
  onDismiss: () => void;
}

const LevelUpNotification: React.FC<LevelUpNotificationProps> = ({ rank, onDismiss }) => {
  const { t } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);
  const RankIcon = rank.icon;

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [rank]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Allow time for exit animation
  };

  return (
    <div
      className={`fixed top-5 right-5 z-[100] w-full max-w-sm p-4 bg-surface-dark border-2 border-secondary-light transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[-200%]'
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <RankIcon className="w-8 h-8 text-secondary-light" />
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-bold text-primary-light uppercase">{t('levelUp')}</p>
          <p className="mt-1 text-xs text-muted-dark">{t('newRankAchieved', { rank: t(rank.nameKey) })}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={handleDismiss}
            className="inline-flex text-muted-dark hover:text-text-dark"
          >
            <span className="sr-only">Close</span>
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelUpNotification;
