


import React, { useState, useEffect, useCallback } from 'react';
import { PracticeQuestion, Subject, Badge } from '../types';
import { practiceQuestions, badges } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { useUserProgress } from '../context/UserProgressContext';
import { AtomIcon } from '../components/icons/AtomIcon';
import { FlaskIcon } from '../components/icons/FlaskIcon';
import { BookOpenIcon } from '../components/icons/BookOpenIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { XCircleIcon } from '../components/icons/XCircleIcon';
import BadgeNotification from '../components/BadgeNotification';

const Practice: React.FC = () => {
    const { t } = useAppContext();
    const { addXp } = useUserProgress();

    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [currentQuestions, setCurrentQuestions] = useState<PracticeQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);
    const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

    const shuffleArray = (array: any[]) => {
        // Simple shuffle
        return [...array].sort(() => Math.random() - 0.5);
    };

    const startPractice = (subject: Subject) => {
        const questionsForSubject = practiceQuestions.filter(q => q.subject === subject);
        setCurrentQuestions(shuffleArray(questionsForSubject));
        setSelectedSubject(subject);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setScore(0);
        setStreak(0);
        setCorrectCount(0);
        setIsFinished(false);
        setUnlockedBadge(null);
        // Not resetting earnedBadges to track across sessions
    };
    
    const checkBadges = useCallback((currentStreak: number, currentCorrectCount: number, currentScore: number, totalQuestions: number, sessionFinished: boolean) => {
        const scorePercentage = totalQuestions > 0 ? (currentScore / totalQuestions) * 100 : 0;

        for (const badge of badges) {
            if (earnedBadges.includes(badge.id)) continue;

            let criteriaMet = false;
            // Check for streak or correct answer count badges during the session
            if (!sessionFinished) {
                if (badge.criteria.streak && currentStreak >= badge.criteria.streak) {
                    criteriaMet = true;
                }
                if (badge.criteria.correctAnswers && currentCorrectCount >= badge.criteria.correctAnswers) {
                    criteriaMet = true;
                }
            }
            // Check for score percentage badges at the end of the session
            else if (sessionFinished && badge.criteria.scorePercentage && badge.criteria.minQuestions) {
                if (totalQuestions >= badge.criteria.minQuestions && scorePercentage >= badge.criteria.minQuestions) {
                    criteriaMet = true;
                }
            }
            
            if (criteriaMet) {
                setUnlockedBadge(badge);
                setEarnedBadges(prev => [...prev, badge.id]);
                break; // Show one badge at a time
            }
        }
    }, [earnedBadges]);
    
    useEffect(() => {
        if (isFinished) {
             checkBadges(streak, correctCount, score, currentQuestions.length, true);
             // Award XP bonus for finishing
             const bonusXp = score * 5;
             addXp(bonusXp);
        }
    }, [isFinished, streak, correctCount, score, currentQuestions.length, checkBadges, addXp]);


    const handleAnswerSelect = (answer: string) => {
        if (selectedAnswer !== null) return; // Prevent changing answer

        setSelectedAnswer(answer);
        const correct = answer === t(currentQuestions[currentQuestionIndex].correctAnswer);
        setIsCorrect(correct);

        if (correct) {
            const newScore = score + 1;
            const newStreak = streak + 1;
            const newCorrectCount = correctCount + 1;
            setScore(newScore);
            setStreak(newStreak);
            setCorrectCount(newCorrectCount);
            checkBadges(newStreak, newCorrectCount, newScore, currentQuestions.length, false);
            addXp(10); // Award XP for correct answer
        } else {
            setStreak(0);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < currentQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsCorrect(null);
        } else {
            setIsFinished(true);
        }
    };
    
    const handleRestart = () => {
        setSelectedSubject(null);
        setIsFinished(false);
    };

    const handleDismissBadge = () => {
        setUnlockedBadge(null);
    };

    const subjectChoices = [
        { subject: Subject.Biology, icon: <BookOpenIcon className="w-12 h-12" /> },
        { subject: Subject.Chemistry, icon: <FlaskIcon className="w-12 h-12" /> },
        { subject: Subject.Physics, icon: <AtomIcon className="w-12 h-12" /> },
    ];
    
    const currentQuestion = currentQuestions[currentQuestionIndex];

    return (
        <>
            {unlockedBadge && <BadgeNotification badge={unlockedBadge} onDismiss={handleDismissBadge} />}
            
            <div className="max-w-3xl mx-auto bg-black/50 border-2 border-primary/50 p-6 sm:p-8 min-h-[500px]">
                {!selectedSubject ? (
                    <div>
                        <h2 className="text-2xl text-white mb-6 text-center tracking-widest uppercase">{t('chooseSubjectToPractice')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {subjectChoices.map(({ subject, icon }) => (
                                <button
                                    key={subject}
                                    onClick={() => startPractice(subject)}
                                    className="group flex flex-col items-center justify-center p-6 bg-black/50 border-2 border-primary/40 hover:border-primary-light hover:bg-primary/20 transition-all duration-300"
                                >
                                    <div className="text-primary-light group-hover:text-white transition-colors duration-300 mb-4">{icon}</div>
                                    <h3 className="text-lg text-white uppercase">{t(subject.toLowerCase())}</h3>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : isFinished ? (
                    <div className="text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                        <h2 className="text-3xl text-white mb-4 uppercase">{t('yourScore')}</h2>
                        <p className="text-5xl text-primary-light mb-2">{Math.round((score / currentQuestions.length) * 100)}%</p>
                        <p className="text-muted-dark mb-8">{t('correct').replace('!', '')}: {score} / {currentQuestions.length}</p>
                        <button
                            onClick={handleRestart}
                            className="pixelated-button pixelated-button-primary"
                        >
                            {t('tryAgain')}
                        </button>
                    </div>
                ) : currentQuestion ? (
                    <div>
                        <div className="flex justify-between items-baseline mb-4">
                            <span className="text-sm text-primary-light uppercase">{t(selectedSubject.toLowerCase())}</span>
                            <span className="text-sm text-muted-dark">{t('questionCount', { current: currentQuestionIndex + 1, total: currentQuestions.length })}</span>
                        </div>
                        <p className="text-lg text-white mb-6 min-h-[60px] leading-relaxed">{t(currentQuestion.question)}</p>
                        
                        <div className="space-y-4">
                            {currentQuestion.options.map(optionKey => {
                                const translatedOption = t(optionKey);
                                const isSelected = selectedAnswer === translatedOption;
                                let buttonClass = 'bg-surface-dark border-gray-600 hover:bg-primary/20 hover:border-primary-light text-text-dark';
                                if (selectedAnswer) {
                                    if (translatedOption === t(currentQuestion.correctAnswer)) {
                                        buttonClass = 'bg-green-700/80 border-green-400 text-white';
                                    } else if (isSelected) {
                                        buttonClass = 'bg-red-700/80 border-red-400 text-white';
                                    }
                                }

                                return (
                                    <button
                                        key={optionKey}
                                        onClick={() => handleAnswerSelect(translatedOption)}
                                        disabled={selectedAnswer !== null}
                                        className={`w-full text-left p-4 border-2 transition-colors duration-200 text-sm ${buttonClass}`}
                                    >
                                        {translatedOption}
                                    </button>
                                );
                            })}
                        </div>

                        {selectedAnswer && (
                            <div className="mt-6 p-4 bg-black/30 animate-fade-in">
                                {isCorrect ? (
                                    <div className="flex items-center gap-2 text-green-400">
                                        <CheckCircleIcon className="w-6 h-6" />
                                        <p className="font-bold uppercase">{t('correct')}</p>
                                    </div>
                                ) : (
                                    <div className="text-red-400">
                                        <div className="flex items-center gap-2 font-bold mb-2 uppercase">
                                            <XCircleIcon className="w-6 h-6" />
                                            <p>{t('incorrect')}</p>
                                        </div>
                                        <p className="text-sm">{t('incorrectAnswerWas', { answer: t(currentQuestion.correctAnswer) })}</p>
                                    </div>
                                )}
                                <p className="mt-2 text-sm text-muted-dark">{t(currentQuestion.explanation)}</p>
                                <button
                                    onClick={handleNextQuestion}
                                    className="w-full mt-4 pixelated-button pixelated-button-primary"
                                >
                                    {currentQuestionIndex < currentQuestions.length - 1 ? t('nextQuestion') : t('finishAttempt')}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-muted-dark flex items-center justify-center h-full min-h-[400px]">{t('noQuestions')}</div>
                )}
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
};

export default Practice;