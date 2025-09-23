import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// MOCK USER TYPE
interface User {
    callsign: string;
    password_hash: string; // In a real app, this would be a hash
}

// AUTH CONTEXT TYPE
interface AuthContextType {
    currentUser: User | null;
    isLoading: boolean;
    login: (callsign: string, password: string) => Promise<{ success: boolean; errorKey?: string }>;
    register: (callsign: string, password: string) => Promise<{ success: boolean; errorKey?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// LOCAL STORAGE KEYS
const USERS_STORAGE_KEY = 'cosmus-users';
const SESSION_STORAGE_KEY = 'cosmus-session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On initial load, check for an existing session
    useEffect(() => {
        try {
            const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
            if (savedSession) {
                setCurrentUser(JSON.parse(savedSession));
            }
        } catch (error) {
            console.error("Failed to parse session from localStorage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getMockUsers = (): User[] => {
        try {
            const users = localStorage.getItem(USERS_STORAGE_KEY);
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error("Failed to parse users from localStorage", error);
            return [];
        }
    };

    const saveMockUsers = (users: User[]) => {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    };

    const login = async (callsign: string, password: string): Promise<{ success: boolean; errorKey?: string }> => {
        const users = getMockUsers();
        const user = users.find(u => u.callsign.toLowerCase() === callsign.toLowerCase());

        // Simple password check (no hashing for this mock)
        if (user && user.password_hash === password) {
            setCurrentUser(user);
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
            return { success: true };
        }
        
        return { success: false, errorKey: 'auth.error.invalidCredentials' };
    };

    const register = async (callsign: string, password: string): Promise<{ success: boolean; errorKey?: string }> => {
        const users = getMockUsers();
        const existingUser = users.find(u => u.callsign.toLowerCase() === callsign.toLowerCase());

        if (existingUser) {
            return { success: false, errorKey: 'auth.error.callsignTaken' };
        }

        const newUser: User = { callsign, password_hash: password }; // No hashing
        saveMockUsers([...users, newUser]);
        
        // Automatically log in after registration
        return login(callsign, password);
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem(SESSION_STORAGE_KEY);
    };

    const value = { currentUser, isLoading, login, register, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};