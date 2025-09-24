import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { performanceHistory } from '../data/mockData';
import { badges as allBadges } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { useUserProgress } from '../context/UserProgressContext';
import { generatePerformanceSummary } from '../services/geminiService';
import { Subject, Badge } from '../types';
import { TrophyIcon } from '../components/icons/TrophyIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import BadgeNotification from '../components/BadgeNotification';

const Performance: React.FC = () => {
    const { t, language } = useAppContext();
    const { earnedBadges, addBadge } = useUserProgress();
    const [summary, setSummary] = useState('');
    const [isLoadingSummary, setIsLoadingSummary] = useState(true);
    const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);

    const userBadges = useMemo(() => {
        return allBadges.filter(badge => earnedBadges.includes(badge.id));
    }, [earnedBadges]);
    
    useEffect(() => {
        const fetchSummary = async () => {
            if (performanceHistory.length === 0) {
                setSummary(t('performance.noData'));
                setIsLoadingSummary(false);
                return;
            }
            setIsLoadingSummary(true);
            try {
                const generatedSummary = await generatePerformanceSummary(performanceHistory, language);
                setSummary(generatedSummary);
            } catch (error) {
                console.error("Failed to generate performance summary:", error);
                setSummary(t('performance.summaryError'));
            } finally {
                setIsLoadingSummary(false);
            }
        };
        fetchSummary();
    }, [language, t]);

    const subjectColors = {
        [Subject.Biology]: '#48BB78', // green-500
        [Subject.Chemistry]: '#4299E1', // blue-400
        [Subject.Physics]: '#E53E3E', // red-600
    };

    const overallAverage = useMemo(() => {
        if (performanceHistory.length === 0) return 0;
        const totalScore = performanceHistory.reduce((acc, curr) => acc + curr.score, 0);
        return Math.round(totalScore / performanceHistory.length);
    }, []);

    useEffect(() => {
        const checkPerformanceBadges = () => {
            for (const badge of allBadges) {
                if (badge.type !== 'performance' || earnedBadges.includes(badge.id)) continue;
    
                if (badge.criteria.scorePercentage && overallAverage >= badge.criteria.scorePercentage) {
                    setUnlockedBadge(badge);
                    addBadge(badge.id);
                    break; // Show one at a time
                }
            }
        };

        if (performanceHistory.length > 0) {
             checkPerformanceBadges();
        }
    }, [overallAverage, earnedBadges, addBadge]);

    const recentActivity = useMemo(() => {
        if (performanceHistory.length === 0) return t('performance.noRecentActivity');
        const lastSession = performanceHistory[performanceHistory.length - 1];
        return `${t(lastSession.subject.toLowerCase())}: ${lastSession.score}% ${t('on')} ${new Date(lastSession.date).toLocaleDateString(language)}`;
    }, [t, language]);

    const dataGroupedBySubject = useMemo(() => {
        const data = performanceHistory.reduce<Record<string, { date: string; score: number }[]>>((acc, item) => {
            if (!acc[item.subject]) {
                acc[item.subject] = [];
            }
            acc[item.subject].push({ date: item.date, score: item.score });
            return acc;
        }, {});
        return data;
    }, []);


    return (
        <>
            {unlockedBadge && <BadgeNotification badge={unlockedBadge} onDismiss={() => setUnlockedBadge(null)} />}
            <div className="space-y-8 animate-fade-in">
                {/* Page Header */}
                <h1 className="text-3xl text-white uppercase tracking-widest">{t('navPerformance')}</h1>

                {/* AI Summary Panel */}
                <div className="pixelated-panel">
                    <h2 className="flex items-center gap-2 text-xl text-primary-light mb-4 uppercase tracking-wider">
                        <SparklesIcon className="w-6 h-6" />
                        {t('performance.summaryTitle')}
                    </h2>
                    <div className="min-h-[6rem] p-4 bg-black/30">
                        {isLoadingSummary ? (
                            <div className="flex items-center justify-center h-full text-muted-dark">
                                <div className="animate-pulse">{t('performance.loadingSummary')}</div>
                            </div>
                        ) : (
                            <p className="text-text-dark leading-relaxed">{summary}</p>
                        )}
                    </div>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="pixelated-panel-tight">
                        <h3 className="text-sm text-muted-dark uppercase">{t('performance.overallAverage')}</h3>
                        <p className="text-3xl text-white font-bold">{overallAverage}%</p>
                    </div>
                    <div className="pixelated-panel-tight">
                        <h3 className="text-sm text-muted-dark uppercase">{t('performance.badgesEarned')}</h3>
                        <p className="text-3xl text-white font-bold">{userBadges.length}</p>
                    </div>
                    <div className="pixelated-panel-tight">
                        <h3 className="text-sm text-muted-dark uppercase">{t('performance.recentActivity')}</h3>
                        <p className="text-lg text-white">{recentActivity}</p>
                    </div>
                </div>

                {/* Performance Chart */}
                <div className="pixelated-panel">
                    <h2 className="text-xl text-white mb-4 uppercase tracking-wider">{t('performance.progressChart')}</h2>
                    <div className="w-full h-80 bg-black/30 p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={performanceHistory}
                                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="date" stroke="#A0AEC0" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#A0AEC0" domain={[0, 100]} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                        borderColor: '#4A5568',
                                        color: '#F7FAFC'
                                    }}
                                    labelStyle={{ color: '#A0AEC0' }}
                                />
                                <Legend wrapperStyle={{fontSize: "12px"}} />
                                {Object.values(Subject).map(subject => (
                                    <Line 
                                        key={subject}
                                        type="monotone" 
                                        data={dataGroupedBySubject[subject]}
                                        dataKey="score"
                                        name={t(subject.toLowerCase())}
                                        stroke={subjectColors[subject]}
                                        strokeWidth={2} 
                                        dot={{r: 4}} 
                                        activeDot={{r: 6}} 
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Badges Section */}
                <div className="pixelated-panel">
                    <h2 className="flex items-center gap-2 text-xl text-primary-light mb-4 uppercase tracking-wider">
                        <TrophyIcon className="w-6 h-6" />
                        {t('performance.earnedBadges')}
                    </h2>
                    {userBadges.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {userBadges.map(badge => (
                                <div key={badge.id} className="p-4 bg-black/30 border border-gray-700 flex items-center gap-4">
                                    <TrophyIcon className="w-8 h-8 text-yellow-400 flex-shrink-0"/>
                                    <div>
                                        <h3 className="font-bold text-white">{t(badge.title)}</h3>
                                        <p className="text-xs text-muted-dark mt-1">{t(badge.description)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-dark text-center py-4">{t('performance.noBadges')}</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Performance;