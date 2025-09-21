import React, { ReactNode, useEffect } from 'react';
import AppHeader from './AppHeader';
import Starfield from './Starfield';

interface GalacticLayoutProps {
  children: ReactNode;
}

const GalacticLayout: React.FC<GalacticLayoutProps> = ({ children }) => {
  // Force dark theme for the sci-fi aesthetic
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-background-dark text-text-dark font-sans">
      <Starfield />
      <AppHeader />
      <main className="relative z-10 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default GalacticLayout;
