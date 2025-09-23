import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Starfield from '../components/Starfield';
import { RocketLaunchIcon } from '../components/icons/RocketLaunchIcon';

type FormMode = 'login' | 'register';

const Auth: React.FC = () => {
    const { t } = useAppContext();
    const { login, register, currentUser } = useAuth();
    const navigate = useNavigate();

    const [mode, setMode] = useState<FormMode>('login');
    const [callsign, setCallsign] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // If the user is already logged in, redirect them away from the auth page.
        if (currentUser) {
            navigate('/performance', { replace: true });
        }
    }, [currentUser, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            let result;
            if (mode === 'login') {
                result = await login(callsign, password);
            } else {
                result = await register(callsign, password);
                if (result.success) {
                    setMessage(t('auth.success.register'));
                }
            }
            
            if (result.success) {
                // The useEffect above will handle the redirect after currentUser is set
            } else {
                setError(t(result.errorKey));
            }

        } catch (err) {
            setError(t('auth.error.generic'));
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(prev => (prev === 'login' ? 'register' : 'login'));
        setError('');
        setMessage('');
        setCallsign('');
        setPassword('');
    };
    
    const title = mode === 'login' ? t('auth.login.title') : t('auth.register.title');
    const buttonText = mode === 'login' ? t('auth.login.button') : t('auth.register.button');
    const toggleText = mode === 'login' ? t('auth.login.noAccount') : t('auth.register.hasAccount');
    const toggleLinkText = mode === 'login' ? t('auth.register') : t('auth.login');

    // Don't render the form if the user is logged in and about to be redirected.
    if (currentUser) {
        return (
            <div className="min-h-screen bg-background-dark">
                <Starfield />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark text-text-dark font-sans flex items-center justify-center p-4">
            <Starfield />
            <div className="relative z-10 w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-5xl text-white tracking-widest flex items-center justify-center gap-4">
                        <RocketLaunchIcon className="w-10 h-10 transform -rotate-45" />
                        {t('appNameShort')}
                    </h1>
                    <p className="text-primary-light text-sm mt-2">{t('appName')}</p>
                </div>

                <div className="pixelated-panel">
                    <div className="flex mb-6 border-b-2 border-primary/30">
                        <button 
                            onClick={() => setMode('login')}
                            className={`w-1/2 py-2 text-sm uppercase transition-colors ${mode === 'login' ? 'bg-primary text-white' : 'text-muted-dark hover:bg-white/10'}`}
                        >
                            {t('auth.login')}
                        </button>
                        <button 
                            onClick={() => setMode('register')}
                            className={`w-1/2 py-2 text-sm uppercase transition-colors ${mode === 'register' ? 'bg-primary text-white' : 'text-muted-dark hover:bg-white/10'}`}
                        >
                            {t('auth.register')}
                        </button>
                    </div>

                    <h2 className="text-lg text-white text-center mb-6">{title}</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="callsign" className="block text-sm text-muted-dark mb-1">{t('auth.callsign')}</label>
                            <input
                                id="callsign"
                                type="text"
                                value={callsign}
                                onChange={e => setCallsign(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-black/50 border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-light text-text-dark text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm text-muted-dark mb-1">{t('auth.password')}</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-black/50 border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-light text-text-dark text-sm"
                            />
                        </div>
                        
                        {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                        {message && <p className="text-green-400 text-xs text-center">{message}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full pixelated-button pixelated-button-primary disabled:bg-gray-600 disabled:border-gray-400"
                        >
                            {isLoading ? '...' : buttonText}
                        </button>
                    </form>

                    <p className="text-center text-xs text-muted-dark mt-6">
                        {toggleText}{' '}
                        <button onClick={toggleMode} className="text-primary-light hover:underline">
                            {toggleLinkText}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;