import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';
import { Rank } from '../types';
import { useAppContext } from './AppContext';

// Import rank icons
import { RocketLaunchIcon } from '../components/icons/RocketLaunchIcon';
import { StarIcon } from '../components/icons/StarIcon';
import { TrophyIcon } from '../components/icons/TrophyIcon';
import { GlobeIcon } from '../components/icons/GlobeIcon';

// Define Ranks
const RANKS: Rank[] = [
    { nameKey: 'rank.spaceCadet', minLevel: 0, icon: RocketLaunchIcon },
    { nameKey: 'rank.pilot', minLevel: 5, icon: StarIcon },
    { nameKey: 'rank.captain', minLevel: 10, icon: TrophyIcon },
    { nameKey: 'rank.starCommander', minLevel: 15, icon: GlobeIcon },
];

interface LevelData {
    level: number;
    rank: Rank;
    xpForCurrentLevel: number;
    xpForNextLevel: number;
    progressPercentage: number;
}

interface UserProgressContextType {
    totalXp: number;
    levelData: LevelData;
    addXp: (amount: number) => void;
    unlockedRank: Rank | null;
    setUnlockedRank: (rank: Rank | null) => void;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

// Helper function to calculate level from XP
const calculateLevelData = (xp: number): LevelData => {
    let level = 1;
    let xpForNextLevel = 100;
    let xpForCurrentLevel = 0;

    while (xp >= xpForNextLevel) {
        xpForCurrentLevel = xpForNextLevel;
        level++;
        xpForNextLevel += level * 100;
    }

    const progressPercentage = xpForNextLevel > xpForCurrentLevel ? 
        ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100 
        : 0;
        
    const rank = RANKS.slice().reverse().find(r => level >= r.minLevel) || RANKS[0];

    return { level, rank, xpForCurrentLevel, xpForNextLevel, progressPercentage };
};

export const UserProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { t } = useAppContext();
    const [totalXp, setTotalXp] = useState<number>(() => {
        const savedXp = localStorage.getItem('cosmus-xp');
        return savedXp ? JSON.parse(savedXp) : 0;
    });
    const [unlockedRank, setUnlockedRank] = useState<Rank | null>(null);

    useEffect(() => {
        localStorage.setItem('cosmus-xp', JSON.stringify(totalXp));
    }, [totalXp]);

    const levelData = useMemo(() => calculateLevelData(totalXp), [totalXp]);

    const addXp = (amount: number) => {
        const oldRank = levelData.rank;
        const newTotalXp = totalXp + amount;
        const newLevelData = calculateLevelData(newTotalXp);
        
        if (newLevelData.rank.minLevel > oldRank.minLevel) {
            setUnlockedRank(newLevelData.rank);
        }
        setTotalXp(newTotalXp);
    };

    const value = { totalXp, levelData, addXp, unlockedRank, setUnlockedRank };

    return (
        <UserProgressContext.Provider value={value}>
            {children}
        </UserProgressContext.Provider>
    );
};

export const useUserProgress = (): UserProgressContextType => {
    const context = useContext(UserProgressContext);
    if (context === undefined) {
        throw new Error('useUserProgress must be used within a UserProgressProvider');
    }
    return context;
};
