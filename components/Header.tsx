
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon } from './icons/HomeIcon';
import { useAppContext } from '../context/AppContext';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const location = useLocation();
  const { t } = useAppContext();

  return (
    <header className="bg-surface-light dark:bg-surface-dark shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl sm:text-2xl font-bold text-primary dark:text-primary-light">{title}</h1>
          {location.pathname !== '/' && (
            <Link 
              to="/" 
              className="flex items-center gap-2 px-3 py-2 bg-primary-light hover:bg-primary text-white rounded-lg transition-colors duration-200"
              aria-label={t('backToHome')}
            >
              <HomeIcon className="w-5 h-5" />
              <span className="hidden sm:inline">{t('backToHome')}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
