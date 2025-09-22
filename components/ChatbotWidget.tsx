import React, { useState, useEffect, useRef } from 'react';
import { CelestialBody, ChatMessage } from '../types';
import { getChatStream } from '../services/geminiService';
import { useAppContext } from '../context/AppContext';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { XIcon } from './icons/XIcon';
import { SendIcon } from './icons/SendIcon';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';

interface ChatbotWidgetProps {
    selectedBody: CelestialBody | null;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ selectedBody }) => {
    const { t } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    };

    useEffect(scrollToBottom, [messages]);
    
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);
        
        // Add a placeholder for the bot's response
        setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

        try {
            const stream = await getChatStream(input, newMessages, selectedBody, t);
            let botResponse = '';
            for await (const chunk of stream) {
                botResponse += chunk.text;
                setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage && lastMessage.sender === 'bot') {
                        return [...prev.slice(0, -1), { sender: 'bot', text: botResponse }];
                    }
                    return prev;
                });
            }
        } catch (error) {
            console.error('Error fetching chat stream:', error);
            setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.sender === 'bot') {
                    return [...prev.slice(0, -1), { sender: 'bot', text: t('chatError') }];
                }
                return prev;
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-24 md:bottom-5 right-5 z-50 p-4 border-2 border-white transition-transform transform hover:scale-110 ${
                    isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-dark'
                }`}
                aria-label={isOpen ? t('closeChat') : t('openChat')}
            >
                {isOpen ? <XIcon className="w-6 h-6 text-white" /> : <ChatBubbleIcon className="w-6 h-6 text-white" />}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 md:bottom-20 right-5 z-40 w-full max-w-sm h-[500px] bg-black/80 border-2 border-primary/50 flex flex-col animate-fade-in-up">
                    <header className="p-4 border-b-2 border-primary/30 flex items-center gap-3">
                        <BotIcon className="w-6 h-6 text-primary-light" />
                        <h3 className="font-bold text-white uppercase text-sm">{t('chatTutorName')}</h3>
                    </header>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                {msg.sender === 'bot' && <div className="flex-shrink-0 w-8 h-8 bg-primary/50 flex items-center justify-center border-2 border-primary"><BotIcon className="w-5 h-5 text-primary-light" /></div>}
                                <div className={`max-w-[80%] p-3 ${
                                    msg.sender === 'user' ? 'bg-primary text-white' : 'bg-black/40 text-text-dark'
                                }`}>
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                    {msg.sender === 'bot' && isLoading && index === messages.length -1 && <span className="typing-indicator"></span>}
                                </div>
                                {msg.sender === 'user' && <div className="flex-shrink-0 w-8 h-8 bg-secondary/80 flex items-center justify-center border-2 border-secondary-light"><UserIcon className="w-5 h-5 text-white" /></div>}
                            </div>
                        ))}
                         <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t-2 border-primary/30 flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t('chatPlaceholder')}
                            className="flex-1 px-4 py-2 bg-black/50 border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-light text-text-dark text-sm"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()} className="p-3 bg-primary border-2 border-primary-light disabled:bg-gray-600 disabled:border-gray-400 hover:bg-primary-dark transition-colors">
                            <SendIcon className="w-5 h-5 text-white" />
                        </button>
                    </form>
                </div>
            )}
             <style>{`
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .typing-indicator {
                  display: inline-block;
                  width: 8px;
                  height: 8px;
                  background-color: #9ca3af;
                  animation: typing-indicator-bounce 1s infinite steps(1, end);
                }
                @keyframes typing-indicator-bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-4px); }
                }
            `}</style>
        </>
    );
};

export default ChatbotWidget;