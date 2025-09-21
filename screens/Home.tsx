import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import AppHeader from '../components/AppHeader';
import Starfield from '../components/Starfield';

const Home: React.FC = () => {
  const { t } = useAppContext();
  
  // Force dark theme on home page for the sci-fi aesthetic
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-background-dark text-text-dark font-sans overflow-hidden">
      <Starfield />
      <AppHeader />
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center p-4">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary-light to-secondary-light text-transparent bg-clip-text animate-pulse-glow">
            {t('appName')}
          </h1>
          <p className="text-lg md:text-xl text-muted-dark max-w-2xl mx-auto mb-12">
            {t('appSubtitle')}
          </p>
          <Link
            to="/study"
            className="px-8 py-4 bg-secondary hover:bg-secondary-dark text-white font-bold text-lg rounded-lg shadow-lg shadow-secondary/40 transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            {t('startExploration')}
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;