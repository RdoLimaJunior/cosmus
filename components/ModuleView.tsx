import React, { useState, useEffect } from 'react';
import { CelestialBody, Quiz } from '../types';
import { quizzes } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { XIcon } from './icons/XIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface ModuleViewProps {
    body: CelestialBody;
    onClose: () => void;
    onNextModule: (nextModuleId: string) => void;
}

const TYPING_SPEED = 20; // ms

// Define a type for the parsed content parts
type ContentPart = { type: 'text'; content: string } | { type: 'quiz'; quizId: string };

const ModuleView: React.FC<ModuleViewProps> = ({ body, onClose, onNextModule }) => {
    const { t } = useAppContext();
    
    // State for parsing and content management
    const [contentParts, setContentParts] = useState<ContentPart[]>([]);
    const [currentPartIndex, setCurrentPartIndex] = useState(0);

    // State for typing effect
    const [typedContent, setTypedContent] = useState('');
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);

    // State for quiz
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);

    // 1. Parse content when body or language changes
    useEffect(() => {
        const rawContent = t(body.content);
        const regex = /\[QUIZ:(\w+)\]/g;
        const parts: ContentPart[] = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(rawContent)) !== null) {
            if (match.index > lastIndex) {
                parts.push({ type: 'text', content: rawContent.substring(lastIndex, match.index) });
            }
            parts.push({ type: 'quiz', quizId: match[1] });
            lastIndex = regex.lastIndex;
        }

        if (lastIndex < rawContent.length) {
            parts.push({ type: 'text', content: rawContent.substring(lastIndex) });
        }
        
        setContentParts(parts);
        
        // Reset state for the new module
        setCurrentPartIndex(0);
        setTypedContent('');
        setCurrentCharIndex(0);
        setActiveQuiz(null);
        setSelectedAnswer(null);
        setFeedback(null);
        setIsTyping(true);

    }, [body, t]);

    // 2. Typing effect and quiz handling logic
    useEffect(() => {
        if (!isTyping || currentPartIndex >= contentParts.length) {
            return;
        }

        const currentPart = contentParts[currentPartIndex];

        if (currentPart.type === 'text') {
            if (currentCharIndex < currentPart.content.length) {
                const timeoutId = setTimeout(() => {
                    setTypedContent(prev => prev + currentPart.content[currentCharIndex]);
                    setCurrentCharIndex(prev => prev + 1);
                }, TYPING_SPEED);
                return () => clearTimeout(timeoutId);
            } else {
                // Finished typing this text part, move to the next part
                setCurrentPartIndex(prev => prev + 1);
                setCurrentCharIndex(0);
            }
        } else if (currentPart.type === 'quiz') {
            const quizData = quizzes.find(q => q.id === currentPart.quizId);
            if (quizData) {
                setActiveQuiz(quizData);
                setIsTyping(false); // Pause typing for the quiz
            } else {
                // Quiz not found, skip to the next part
                setCurrentPartIndex(prev => prev + 1);
            }
        }
    }, [isTyping, contentParts, currentPartIndex, currentCharIndex]);

    const handleAnswerSubmit = () => {
        if (!activeQuiz || !selectedAnswer) return;

        const correctAnswer = t(activeQuiz.correctAnswer);
        if (selectedAnswer === correctAnswer) {
            setFeedback({ type: 'correct', message: t('quizCorrect') });
            
            const quizRecap = `\n\n[SYSTEM CHECK]\n> Q: ${t(activeQuiz.question)}\n> A: ${correctAnswer}\n> STATUS: CORRECT. RESUMING DATA STREAM...\n\n`;
            
            setTimeout(() => {
                setTypedContent(prev => prev + quizRecap);
                setActiveQuiz(null);
                setSelectedAnswer(null);
                setFeedback(null);
                setCurrentPartIndex(prev => prev + 1);
                setIsTyping(true);
            }, 1500);

        } else {
            setFeedback({ type: 'incorrect', message: t('quizIncorrect') });
            setTimeout(() => {
                setFeedback(null);
                setSelectedAnswer(null);
            }, 1500);
        }
    };

    const handleNext = () => {
        if (body.unlocks) {
            onNextModule(body.unlocks);
        }
    };

    const quizUI = activeQuiz && (
        <div className="mt-6 p-4 border-2 border-secondary animate-fade-in">
            <p className="text-secondary-light mb-4 font-bold">{t(activeQuiz.question)}</p>
            <div className="space-y-3">
                {activeQuiz.options.map(optionKey => {
                    const translatedOption = t(optionKey);
                    const isSelected = selectedAnswer === translatedOption;
                    let buttonClass = 'bg-surface-dark border-gray-600 hover:bg-primary/20 hover:border-primary-light text-text-dark';
                    
                    if (isSelected && feedback) {
                        buttonClass = feedback.type === 'correct' ? 'bg-green-700/80 border-green-400 text-white' : 'bg-red-700/80 border-red-400 text-white';
                    } else if (isSelected) {
                        buttonClass = 'bg-primary/80 border-primary-light text-white';
                    }

                    return (
                        <button
                            key={optionKey}
                            onClick={() => setSelectedAnswer(translatedOption)}
                            disabled={!!feedback}
                            className={`w-full text-left p-3 border-2 transition-colors text-sm ${buttonClass}`}
                        >
                            {translatedOption}
                        </button>
                    );
                })}
            </div>
            {feedback ? (
                 <p className={`mt-4 text-sm font-bold ${feedback.type === 'correct' ? 'text-green-400' : 'text-red-400'}`}>{feedback.message}</p>
            ) : (
                <button 
                    onClick={handleAnswerSubmit} 
                    disabled={!selectedAnswer}
                    className="w-full mt-4 pixelated-button pixelated-button-primary disabled:bg-gray-600 disabled:border-gray-400"
                >
                    {t('submitAnswer')}
                </button>
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 z-30 bg-background-dark/95 flex flex-col p-4 sm:p-8 animate-fade-in">
            <header className="flex-shrink-0 flex items-center justify-between pb-4 border-b-2 border-primary/30">
                <div>
                    <span className="text-sm uppercase text-primary-light">{t(body.subject.toLowerCase())}</span>
                    <h1 className="text-2xl sm:text-3xl text-white mt-1 uppercase tracking-widest">{t(body.title)}</h1>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 text-muted-dark transition-colors"
                    aria-label={t('closeModule')}
                >
                    <XIcon className="w-8 h-8" />
                </button>
            </header>
            
            <article className="flex-grow overflow-y-auto my-6 bg-black/50 border-2 border-primary/30 p-4 sm:p-6">
                 <pre className="whitespace-pre-wrap font-mono text-sm sm:text-base leading-loose text-green-300">
                    {`> RUNNING MODULE: ${t(body.title).toUpperCase()}...\n\n${typedContent}`}
                    {isTyping && <span className="inline-block w-2 h-4 sm:h-5 bg-green-300 animate-pulse ml-1"></span>}
                </pre>
                {quizUI}
            </article>
            
            <footer className="flex-shrink-0 flex justify-end pt-4 border-t-2 border-primary/30">
                {body.unlocks && (
                     <button
                        onClick={handleNext}
                        className="flex items-center gap-2 pixelated-button pixelated-button-primary"
                    >
                        {t('nextModule')} <ChevronRightIcon className="w-5 h-5" />
                    </button>
                )}
            </footer>
        </div>
    );
};

export default ModuleView;