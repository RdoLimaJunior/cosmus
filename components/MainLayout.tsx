



import React, { ReactNode, useEffect } from 'react';
import AppHeader from './AppHeader';
import Starfield from './Starfield';
import BottomNavBar from './BottomNavBar';
import LevelUpNotification from './LevelUpNotification';
import { useUserProgress } from '../context/UserProgressContext';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { unlockedRank, setUnlockedRank } = useUserProgress();
  
  // Force dark theme for the sci-fi aesthetic
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-background-dark text-text-dark font-sans text-sm">
      {unlockedRank && (
        <LevelUpNotification 
          rank={unlockedRank} 
          onDismiss={() => setUnlockedRank(null)} 
        />
      )}
      <Starfield />
      <AppHeader />
      {/* 
        Main content area with padding-top to account for the fixed AppHeader 
        and padding-bottom for the fixed BottomNavBar.
        The `h-screen` and `flex` properties ensure the content area fills the available space.
      */}
      <main className="relative z-10 flex flex-col h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex-grow h-full animate-fade-in">
          {children}
        </div>
      </main>
      <BottomNavBar />
    </div>
  );
};

export default MainLayout;