import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import i18nData from '../i18n';

type Language = 'pt' | 'en' | 'es';
type Theme = 'light' | 'dark';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
  installPromptEvent: any | null;
  showInstallPrompt: boolean;
  triggerInstallPrompt: () => void;
  dismissInstallPrompt: () => void;
  handleInstall: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');
  const [theme, setTheme] = useState<Theme>('light');
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('vanda-theme') as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('vanda-theme', theme);
  }, [theme]);
  
  useEffect(() => {
    const handler = (e: Event) => {
        e.preventDefault();
        setInstallPromptEvent(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const triggerInstallPrompt = () => {
    const lastDismissed = localStorage.getItem('cosmus-pwa-dismissed');
    if (lastDismissed) {
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - parseInt(lastDismissed, 10) < oneWeek) {
            return; // Don't show if dismissed within the last week
        }
    }
    if (installPromptEvent) {
        setShowInstallPrompt(true);
    }
  };

  const dismissInstallPrompt = () => {
      setShowInstallPrompt(false);
      localStorage.setItem('cosmus-pwa-dismissed', Date.now().toString());
  };

  const handleInstall = async () => {
      if (!installPromptEvent) return;
      const result = await installPromptEvent.prompt();
      console.log(`Install prompt was: ${result.outcome}`);
      setShowInstallPrompt(false);
      setInstallPromptEvent(null); // Prompt can only be used once
  };


  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const t = useCallback((key: string, options?: { [key: string]: string | number }): string => {
    let translation = i18nData[language][key] || key;
    if (options) {
      Object.keys(options).forEach(optionKey => {
        const regex = new RegExp(`{{${optionKey}}}`, 'g');
        translation = translation.replace(regex, String(options[optionKey]));
      });
    }
    return translation;
  }, [language]);

  const value = { language, setLanguage, theme, toggleTheme, t, installPromptEvent, showInstallPrompt, triggerInstallPrompt, dismissInstallPrompt, handleInstall };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};