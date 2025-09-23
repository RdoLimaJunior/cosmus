import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import { UserProgressProvider } from './context/UserProgressContext';
import { AuthProvider } from './context/AuthContext';
import AnimatedAtomLoader from './components/AnimatedAtomLoader';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load all screens to improve initial load time and robustness
const Auth = lazy(() => import('./screens/Auth'));
const Study = lazy(() => import('./screens/Study'));
const Practice = lazy(() => import('./screens/Practice'));
const Performance = lazy(() => import('./screens/Performance'));
const Settings = lazy(() => import('./screens/Settings'));
const About = lazy(() => import('./screens/About'));

const LoadingFallback: React.FC = () => (
    <div className="flex items-center justify-center min-h-screen bg-background-dark">
        <AnimatedAtomLoader />
    </div>
);

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <AuthProvider>
        <UserProgressProvider>
          <HashRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Navigate to="/auth" />} />
                <Route path="/auth" element={<Auth />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute><MainLayout><Outlet /></MainLayout></ProtectedRoute>}>
                  <Route path="/study" element={<Study />} />
                  <Route path="/practice" element={<Practice />} />
                  <Route path="/performance" element={<Performance />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/about" element={<About />} />
                </Route>
              </Routes>
            </Suspense>
          </HashRouter>
        </UserProgressProvider>
      </AuthProvider>
    </AppContextProvider>
  );
};

export default App;