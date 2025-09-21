import React, { useEffect, useState } from 'react';
import { Badge } from '../types';
import { TrophyIcon } from './icons/TrophyIcon';
import { XIcon } from './icons/XIcon';
import { useAppContext } from '../context/AppContext';

interface BadgeNotificationProps {
  badge: Badge;
  onDismiss: () => void;
}

const BadgeNotification: React.FC<BadgeNotificationProps> = ({ badge, onDismiss }) => {
  const { t } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [badge]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Allow time for exit animation
  };

  return (
    <div
      className={`fixed top-5 right-5 z-[100] w-full max-w-sm p-4 bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl border-l-4 border-yellow-400 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <TrophyIcon className="w-8 h-8 text-yellow-500" />
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-bold text-primary dark:text-primary-light">{t('badgeUnlocked')}</p>
          <p className="mt-1 text-sm font-semibold text-text-light dark:text-text-dark">{badge.title}</p>
          <p className="mt-1 text-xs text-muted-light dark:text-muted-dark">{badge.description}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={handleDismiss}
            className="inline-flex text-muted-light dark:text-muted-dark rounded-md hover:text-text-light dark:hover:text-text-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <span className="sr-only">Close</span>
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadgeNotification;
