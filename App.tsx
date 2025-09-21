
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import AnimatedAtomLoader from './components/AnimatedAtomLoader';

import Home from './screens/Home';

// Lazy load all other screens to improve initial load time and robustness
const Study = lazy(() => import('./screens/Study'));
const Practice = lazy(() => import('./screens/Practice'));
const Performance = lazy(() => import('./screens/Performance'));
const Settings = lazy(() => import('./screens/Settings'));

const LoadingFallback: React.FC = () => (
    <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <AnimatedAtomLoader />
    </div>
);


const App: React.FC = () => {
  return (
    <AppContextProvider>
      <HashRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/study" element={<Study />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </AppContextProvider>
  );
};

export default App;