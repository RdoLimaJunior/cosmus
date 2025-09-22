import React, { useState, useEffect, useMemo } from 'react';
import { PerformanceData, Subject } from '../types';
import { performanceHistory as mockPerformanceHistory } from '../data/mockData';
import { generatePerformanceSummary } from '../services/geminiService';
import { useAppContext } from '../context/AppContext';
import { useUserProgress } from '../context/UserProgressContext';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { FireIcon } from '../components/icons/FireIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';

// MOCK DATA & HELPERS
const VANDA_COMPETITION_DATE = new Date('2024-12-15T09:00:00Z');

const calculateTimeLeft = () => {
    const difference = +VANDA_COMPETITION_DATE - +new Date();
    let timeLeft: { [key: string]: number } = {};

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }
    return timeLeft;
};

const calculateStreak = (history: PerformanceData[]): number => {
    if (history.length === 0) return 0;
    
    const studyDates = new Set(history.map(item => item.date));
    const formatDate = (d: Date) => {
        const date = new Date(d);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString().split('T')[0];
    }
    
    let streak = 0;
    let currentDate = new Date();
    
    if (!studyDates.has(formatDate(currentDate))) {
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    while (studyDates.has(formatDate(currentDate))) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
};

// SUB-COMPONENTS
const PerformanceChart: React.FC<{ data: PerformanceData[] }> = ({ data }) => {
    const { t } = useAppContext();
    const subjects = Object.values(Subject);

    const groupedData = data.reduce((acc, item) => {
        const date = item.date;
        if (!acc[date]) acc[date] = {};
        acc[date][item.subject] = item.score;
        return acc;
    }, {} as Record<string, Record<string, number>>);

    const dates = Object.keys(groupedData).sort().slice(-7); // Show last 7 entries

    const subjectColors: Record<Subject, string> = {
        [Subject.Biology]: 'bg-green-500',
        [Subject.Chemistry]: 'bg-blue-500',
        [Subject.Physics]: 'bg-red-500',
    };

    return (
        <div className="bg-black/50 border-2 border-primary/50 p-6">
            <h2 className="text-xl font-bold text-primary-light mb-6 uppercase tracking-widest">{t('scoreOverTime')}</h2>
            <div className="flex justify-between gap-4" style={{ height: '200px' }}>
                {dates.map(date => (
                    <div key={date} className="flex-1 flex flex-col items-center justify-end gap-2">
                        <div className="flex items-end justify-center gap-1 w-full h-full">
                            {subjects.map(subject => (
                                <div
                                    key={subject}
                                    className={`w-1/3 transition-all duration-500 ease-out ${subjectColors[subject]}`}
                                    style={{ height: `${groupedData[date][subject] || 0}%` }}
                                    title={`${t(subject.toLowerCase())}: ${groupedData[date][subject] || 0}%`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-muted-dark mt-2">{new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                ))}
            </div>
             <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-primary/20">
                {subjects.map(subject => (
                    <div key={subject} className="flex items-center gap-2">
                        <div className={`w-3 h-3 ${subjectColors[subject]}`}></div>
                        <span className="text-sm text-text-dark uppercase">{t(subject.toLowerCase())}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StudyActivityCalendar: React.FC<{ history: PerformanceData[]; language: string }> = ({ history, language }) => {
    const { t } = useAppContext();
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const studyDates = useMemo(() => new Set(history.map(item => new Date(item.date).toDateString())), [history]);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const calendarDays = [...Array(firstDayOfMonth).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
    const dayHeaders = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    return (
        <div className="bg-black/50 border-2 border-primary/50 p-4 sm:p-6">
            <h3 className="text-lg text-white mb-4 text-center tracking-widest uppercase">{today.toLocaleString(language, { month: 'long', year: 'numeric' })}</h3>
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
                {dayHeaders.map(day => <div key={day} className="text-xs font-bold text-muted-dark uppercase">{t(`date.${day}`)}</div>)}
                {calendarDays.map((day, index) => {
                    if (!day) return <div key={`e-${index}`} />;
                    const date = new Date(year, month, day);
                    const isToday = date.toDateString() === today.toDateString();
                    const hasActivity = studyDates.has(date.toDateString());
                    return (
                        <div key={day} className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto flex items-center justify-center text-xs border-2 rounded-full ${isToday ? 'border-secondary' : 'border-transparent'} ${hasActivity ? 'bg-primary/80 text-white' : 'text-muted-dark'}`}>
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const CountdownCard: React.FC = () => {
    const { t } = useAppContext();
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeComponents = [
        { label: 'days', value: timeLeft.days },
        { label: 'hours', value: timeLeft.hours },
        { label: 'minutes', value: timeLeft.minutes },
        { label: 'seconds', value: timeLeft.seconds },
    ];

    return (
         <div className="bg-black/50 border-2 border-primary/50 p-6">
            <h3 className="text-lg text-white mb-4 text-center tracking-widest uppercase">{t('performance.countdownTitle')}</h3>
            <div className="grid grid-cols-4 gap-2 text-center">
                {timeComponents.map(({label, value}) => (
                    <div key={label} className="bg-black/40 p-2">
                        <div className="text-3xl font-bold text-secondary-light">{String(value || 0).padStart(2, '0')}</div>
                        <div className="text-xs text-muted-dark uppercase">{t(`performance.${label}`)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// MAIN COMPONENT
const Performance: React.FC = () => {
    const { t, language } = useAppContext();
    const { levelData } = useUserProgress();
    const [summary, setSummary] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [performanceHistory] = useState<PerformanceData[]>(mockPerformanceHistory);

    useEffect(() => {
        const fetchSummary = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (performanceHistory.length > 0) {
                    const generatedSummary = await generatePerformanceSummary(performanceHistory, language);
                    setSummary(generatedSummary);
                } else {
                    setSummary(t('performanceNoData'));
                }
            } catch (err) {
                console.error(err);
                setError(t('performanceError'));
            } finally {
                setIsLoading(false);
            }
        };
        fetchSummary();
    }, [language, t, performanceHistory]);

    const streak = useMemo(() => calculateStreak(performanceHistory), [performanceHistory]);
    const studyDaysThisMonth = useMemo(() => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        return new Set(performanceHistory.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
        }).map(item => item.date)).size;
    }, [performanceHistory]);
    
    return (
        <div className="max-w-4xl mx-auto">
             <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                {t('performance.welcome', { rank: t(levelData.rank.nameKey) })}
            </h1>
            <div className="space-y-6">
                <div className="bg-black/50 border-2 border-primary/50 p-6 min-h-[120px]">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-primary-light mb-4 uppercase tracking-widest">
                        <SparklesIcon className="w-6 h-6" /> {t('aiSummaryTitle')}
                    </h2>
                    {isLoading && <div className="flex items-center gap-2 text-muted-dark"><div className="w-5 h-5 border-2 border-primary-light border-t-transparent rounded-full animate-spin"></div><span>{t('performanceGenerating')}</span></div>}
                    {error && <p className="text-red-400">{error}</p>}
                    {!isLoading && !error && <p className="text-text-dark leading-relaxed text-sm">{summary}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black/50 border-2 border-primary/50 p-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg text-white uppercase tracking-widest">{t('performance.streakTitle')}</h3>
                            <p className="text-sm text-muted-dark">
                                {streak > 0 
                                    ? t('performance.streakDescriptionActive', { streak }) 
                                    : t('performance.streakDescriptionInactive')}
                            </p>
                        </div>
                        <div className="text-center">
                            <FireIcon className={`w-12 h-12 ${streak > 0 ? 'text-orange-500' : 'text-gray-600'}`} />
                            <p className="text-2xl font-bold text-primary-light">{streak} <span className="text-sm">{t('performance.days')}</span></p>
                        </div>
                    </div>
                     <div className="bg-black/50 border-2 border-primary/50 p-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg text-white uppercase tracking-widest">{t('performance.totalSessionsTitle')}</h3>
                            <p className="text-sm text-muted-dark">{t('performance.totalSessionsDescription')}</p>
                        </div>
                        <div className="text-center">
                             <CalendarIcon className="w-12 h-12 text-primary-light" />
                            <p className="text-2xl font-bold text-primary-light">{studyDaysThisMonth} <span className="text-sm">{t('performance.days')}</span></p>
                        </div>
                    </div>
                </div>

                <CountdownCard />
                <StudyActivityCalendar history={performanceHistory} language={language} />

                {performanceHistory.length > 0 && <PerformanceChart data={performanceHistory} />}
            </div>
        </div>
    );
};

export default Performance;