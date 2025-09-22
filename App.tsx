import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import { UserProgressProvider } from './context/UserProgressContext';
import AnimatedAtomLoader from './components/AnimatedAtomLoader';
import MainLayout from './components/MainLayout';

// Lazy load all screens to improve initial load time and robustness
const Study = lazy(() => import('./screens/Study'));
const Practice = lazy(() => import('./screens/Practice'));
const Performance = lazy(() => import('./screens/Performance'));
const Settings = lazy(() => import('./screens/Settings'));

const LoadingFallback: React.FC = () => (
    <div className="flex items-center justify-center min-h-screen bg-background-dark">
        <AnimatedAtomLoader />
    </div>
);


const App: React.FC = () => {
  return (
    <AppContextProvider>
      <UserProgressProvider>
        <HashRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="/performance" />} />
              <Route path="/study" element={<MainLayout><Study /></MainLayout>} />
              <Route path="/practice" element={<MainLayout><Practice /></MainLayout>} />
              <Route path="/performance" element={<MainLayout><Performance /></MainLayout>} />
              <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
            </Routes>
          </Suspense>
        </HashRouter>
      </UserProgressProvider>
    </AppContextProvider>
  );
};

export default App;