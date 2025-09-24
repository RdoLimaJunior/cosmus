import React, { ReactNode, useEffect } from 'react';
import AppHeader from './AppHeader';
import Starfield from './Starfield';
import BottomNavBar from './BottomNavBar';
import LevelUpNotification from './LevelUpNotification';
import { useUserProgress } from '../context/UserProgressContext';
import PWAPrompt from './PWAPrompt';

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
    <div className="relative min-h-screen bg-background-dark text-text-dark font-sans text-sm flex flex-col">
      {unlockedRank && (
        <LevelUpNotification 
          rank={unlockedRank} 
          onDismiss={() => setUnlockedRank(null)} 
        />
      )}
      <Starfield />
      <AppHeader />
      {/* 
        Main content area with padding-bottom for the fixed BottomNavBar.
        `flex-grow` allows this area to fill the available space between the header and footer.
        `relative` and `z-10` ensure the content is always above the Starfield background.
      */}
      <main className="relative z-10 flex-grow flex flex-col pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex-grow h-full animate-fade-in">
          {children}
        </div>
      </main>
      <BottomNavBar />
      <PWAPrompt />
    </div>
  );
};

export default MainLayout;