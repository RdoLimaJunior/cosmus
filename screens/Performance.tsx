import React, { useState, useEffect } from 'react';
import { PerformanceData, Subject } from '../types';
import { performanceHistory } from '../data/mockData';
import { generatePerformanceSummary } from '../services/geminiService';
import { useAppContext } from '../context/AppContext';
import GalacticLayout from '../components/GalacticLayout';
import { SparklesIcon } from '../components/icons/SparklesIcon';

// A simple chart component using divs for bars
const PerformanceChart: React.FC<{ data: PerformanceData[] }> = ({ data }) => {
    const { t } = useAppContext();
    const subjects = Object.values(Subject);

    const groupedData = data.reduce((acc, item) => {
        const date = item.date;
        if (!acc[date]) {
            acc[date] = {};
        }
        acc[date][item.subject] = item.score;
        return acc;
    }, {} as Record<string, Record<string, number>>);

    const dates = Object.keys(groupedData).sort();

    const subjectColors: Record<Subject, string> = {
        [Subject.Biology]: 'bg-green-500',
        [Subject.Chemistry]: 'bg-blue-500',
        [Subject.Physics]: 'bg-red-500',
    };

    return (
        <div className="bg-surface-dark/50 border border-primary/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-primary-light mb-6">{t('scoreOverTime')}</h2>
            <div className="flex justify-between gap-4" style={{ height: '200px' }}>
                {dates.map(date => (
                    <div key={date} className="flex-1 flex flex-col items-center justify-end gap-2">
                        <div className="flex items-end justify-center gap-1 w-full h-full">
                            {subjects.map(subject => (
                                <div
                                    key={subject}
                                    className={`w-1/3 rounded-t-sm transition-all duration-500 ease-out ${subjectColors[subject]}`}
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
                        <div className={`w-3 h-3 rounded-sm ${subjectColors[subject]}`}></div>
                        <span className="text-sm text-text-dark">{t(subject.toLowerCase())}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const Performance: React.FC = () => {
    const { t, language } = useAppContext();
    const [summary, setSummary] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Do not send an empty history to the API
                if (performanceHistory.length > 0) {
                    const generatedSummary = await generatePerformanceSummary(performanceHistory, language);
                    setSummary(generatedSummary);
                } else {
                    setSummary("No performance data yet. Complete some practice sessions to see your progress!");
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load AI summary. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummary();
    }, [language]);
    
    return (
        <GalacticLayout>
            <h1 className="text-4xl font-bold mb-8 text-primary-light text-center">{t('performanceTitle')}</h1>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-surface-dark/50 border border-primary/30 rounded-lg p-6 min-h-[120px]">
                     <h2 className="flex items-center gap-2 text-xl font-bold text-primary-light mb-4">
                        <SparklesIcon className="w-6 h-6" />
                        {t('aiSummaryTitle')}
                    </h2>
                    {isLoading && (
                        <div className="flex items-center gap-2 text-muted-dark">
                            <div className="w-5 h-5 border-2 border-primary-light border-t-transparent rounded-full animate-spin"></div>
                            <span>Generating your performance analysis...</span>
                        </div>
                    )}
                    {error && <p className="text-red-400">{error}</p>}
                    {!isLoading && !error && <p className="text-text-dark leading-relaxed">{summary}</p>}
                </div>
                {performanceHistory.length > 0 && <PerformanceChart data={performanceHistory} />}
            </div>
        </GalacticLayout>
    );
};

export default Performance;
