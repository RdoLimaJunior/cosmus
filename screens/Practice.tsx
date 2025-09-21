import React, { useState, useEffect } from 'react';
import { Subject, PracticeQuestion, Badge } from '../types';
import { practiceQuestions, badges } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import GalacticLayout from '../components/GalacticLayout';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { XCircleIcon } from '../components/icons/XCircleIcon';
import BadgeNotification from '../components/BadgeNotification';

// A simple shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

const Practice: React.FC = () => {
    const { t } = useAppContext();
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    
    const [streak, setStreak] = useState(0);
    const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);
    const [awardedBadges, setAwardedBadges] = useState<string[]>([]);

    const subjects = Object.values(Subject);
    const currentQuestion = questions[currentQuestionIndex];

    useEffect(() => {
        if (selectedSubject) {
            const subjectQuestions = shuffleArray(practiceQuestions.filter(q => q.subject === selectedSubject)).slice(0, 5); // Take 5 random questions
            setQuestions(subjectQuestions);
            setCurrentQuestionIndex(0);
            setSelectedOption(null);
            setIsAnswered(false);
            setScore(0);
            setIsFinished(false);
            setStreak(0);
            setAwardedBadges([]);
        }
    }, [selectedSubject]);

    const checkBadges = (currentScore: number, currentStreak: number, isDone: boolean) => {
        const correctAnswers = currentScore;
        const totalQuestions = questions.length;
        const scorePercentage = totalQuestions > 0 ? (currentScore / totalQuestions) * 100 : 0;

        const badgeToUnlock = badges.find(badge => {
            if (awardedBadges.includes(badge.id) || badge.type !== 'practice') return false;

            const { criteria } = badge;
            if (criteria.streak && currentStreak >= criteria.streak) return true;
            if (criteria.correctAnswers && correctAnswers >= criteria.correctAnswers) return true;
            if (isDone && criteria.scorePercentage && scorePercentage >= criteria.scorePercentage && totalQuestions >= (criteria.minQuestions || 0)) return true;
            
            return false;
        });

        if (badgeToUnlock) {
            setUnlockedBadge(badgeToUnlock);
            setAwardedBadges(prev => [...prev, badgeToUnlock.id]);
        }
    };
    
    const handleOptionSelect = (option: string) => {
        if (isAnswered) return;
        
        setSelectedOption(option);
        setIsAnswered(true);

        if (option === currentQuestion.correctAnswer) {
            const newScore = score + 1;
            setScore(newScore);
            const newStreak = streak + 1;
            setStreak(newStreak);
            checkBadges(newScore, newStreak, false);
        } else {
            setStreak(0);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setIsFinished(true);
            checkBadges(score, streak, true); // Check for end-of-session badges
        }
    };

    const handleTryAgain = () => {
        setSelectedSubject(null);
        setIsFinished(false);
    };

    const renderSubjectSelection = () => (
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-8 text-primary-light">{t('practiceTitle')}</h1>
            <p className="text-lg mb-8 text-muted-dark">{t('chooseSubjectToPractice')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {subjects.map(subject => (
                    <button
                        key={subject}
                        onClick={() => setSelectedSubject(subject)}
                        className="p-8 bg-surface-dark/50 border border-primary/30 rounded-lg hover:bg-primary/30 hover:border-primary-light transition-all duration-300 transform hover:scale-105"
                    >
                        <h2 className="text-2xl font-semibold text-white">{t(subject.toLowerCase())}</h2>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderQuiz = () => (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-2 text-primary-light">{t('practiceTitle')}: {t(selectedSubject!.toLowerCase())}</h1>
            <p className="mb-4 text-muted-dark">Question {currentQuestionIndex + 1} of {questions.length}</p>
            <div className="bg-surface-dark/50 border border-primary/30 rounded-lg p-6 shadow-lg">
                <p className="text-xl mb-6 font-semibold">{currentQuestion.question}</p>
                <div className="space-y-4">
                    {currentQuestion.options.map(option => {
                        const isCorrect = option === currentQuestion.correctAnswer;
                        const isSelected = option === selectedOption;
                        let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-colors duration-200 ';
                        if (isAnswered) {
                            if (isCorrect) {
                                buttonClass += 'bg-green-500/20 border-green-400 text-white';
                            } else if (isSelected) {
                                buttonClass += 'bg-red-500/20 border-red-400 text-white';
                            } else {
                                buttonClass += 'bg-surface-dark border-gray-600 text-muted-dark';
                            }
                        } else {
                            buttonClass += 'bg-surface-dark border-gray-600 hover:bg-primary/20 hover:border-primary-light';
                        }
                        return (
                            <button
                                key={option}
                                onClick={() => handleOptionSelect(option)}
                                disabled={isAnswered}
                                className={buttonClass}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
                {isAnswered && (
                    <div className="mt-6 p-4 rounded-lg bg-black/30">
                        {selectedOption === currentQuestion.correctAnswer ? (
                            <p className="flex items-center gap-2 text-green-400 font-bold"><CheckCircleIcon className="w-5 h-5" /> {t('correct')}</p>
                        ) : (
                            <p className="flex items-center gap-2 text-red-400 font-bold"><XCircleIcon className="w-5 h-5" /> {t('incorrect')} "{currentQuestion.correctAnswer}"</p>
                        )}
                        <p className="mt-2 text-sm text-muted-dark">{currentQuestion.explanation}</p>
                    </div>
                )}
                <div className="mt-6 text-right">
                    <button 
                        onClick={handleNext} 
                        disabled={!isAnswered}
                        className="px-6 py-2 bg-secondary text-white font-bold rounded-lg hover:bg-secondary-dark disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                        {currentQuestionIndex < questions.length - 1 ? t('nextQuestion') : t('finishAttempt')}
                    </button>
                </div>
            </div>
        </div>
    );
    
    const renderResults = () => (
        <div className="text-center max-w-lg mx-auto bg-surface-dark/50 border border-primary/30 rounded-lg p-8 shadow-lg">
            <h1 className="text-4xl font-bold text-primary-light mb-4">{t('yourScore')}</h1>
            <p className="text-6xl font-bold mb-6">{questions.length > 0 ? Math.round((score / questions.length) * 100) : 0}%</p>
            <p className="text-lg text-muted-dark mb-8">You answered {score} out of {questions.length} questions correctly.</p>
            <button
                onClick={handleTryAgain}
                className="px-8 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-secondary-dark transition-colors"
            >
                {t('tryAgain')}
            </button>
        </div>
    );

    return (
        <GalacticLayout>
            {!selectedSubject ? renderSubjectSelection() : isFinished ? renderResults() : renderQuiz()}
            {unlockedBadge && (
                <BadgeNotification badge={unlockedBadge} onDismiss={() => setUnlockedBadge(null)} />
            )}
        </GalacticLayout>
    );
};

export default Practice;
