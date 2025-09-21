
import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChatMessage, StudyModule } from '../types';
import { getChatStream } from '../services/geminiService';
import { BotIcon } from './icons/BotIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { SendIcon } from './icons/SendIcon';
import { UserIcon } from './icons/UserIcon';
import { XIcon } from './icons/XIcon';

interface ChatbotWidgetProps {
    selectedModule: StudyModule | null;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ selectedModule }) => {
    const { t } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'bot', text: 'Olá! Sou seu tutor AI. Como posso ajudar?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    useEffect(() => {
        if(isOpen && selectedModule) {
             const welcomeText = `Vejo que você está estudando "${selectedModule.title}". Tem alguma dúvida específica sobre este tópico?`;
             if (messages[messages.length - 1]?.text !== welcomeText) {
                setMessages(prev => [...prev, {sender: 'bot', text: welcomeText}]);
             }
        }
    }, [selectedModule, isOpen])

    const handleSend = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);
        
        // Easter Egg
        if (currentInput.trim().toLowerCase() === 'vanda') {
            setTimeout(() => {
                const easterEggResponse: ChatMessage = { sender: 'bot', text: t('easterEgg_vandaResponse') };
                setMessages(prev => [...prev, easterEggResponse]);
                setIsLoading(false);
            }, 1000);
            return;
        }

        const botMessage: ChatMessage = { sender: 'bot', text: '' };
        setMessages(prev => [...prev, botMessage]);

        try {
            const stream = await getChatStream(currentInput, messages, selectedModule);

            for await (const chunk of stream) {
                const chunkText = chunk.text;
                setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage?.sender === 'bot') {
                        const updatedMessages = [...prev];
                        updatedMessages[prev.length - 1] = { ...lastMessage, text: lastMessage.text + chunkText };
                        return updatedMessages;
                    }
                    return prev;
                });
            }
        } catch (error) {
            console.error("Gemini API error:", error);
            const errorText = "Desculpe, ocorreu um erro ao conectar com a IA. Tente novamente.";
            setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                 if (lastMessage?.sender === 'bot') {
                    const updatedMessages = [...prev];
                    updatedMessages[prev.length - 1] = { ...lastMessage, text: errorText };
                    return updatedMessages;
                }
                return [...prev, { sender: 'bot', text: errorText }];
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${isOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-4 bg-primary text-white rounded-full shadow-2xl hover:bg-primary-dark transition-transform hover:scale-110"
                    aria-label={t('chatWithTutor')}
                >
                    <ChatBubbleIcon className="w-8 h-8"/>
                </button>
            </div>

            <div className={`fixed bottom-8 right-8 z-50 w-[calc(100%-4rem)] max-w-md h-[70vh] max-h-[600px] flex flex-col bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-primary dark:text-primary-light">{t('studyCompanion')}</h3>
                    <button onClick={() => setIsOpen(false)} className="p-1 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark">
                        <XIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'bot' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white"><BotIcon className="w-5 h-5"/></div>}
                            <div className={`max-w-xs p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark rounded-bl-none'}`}>
                                <p className="text-sm break-words">{msg.text}</p>
                            </div>
                            {msg.sender === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white"><UserIcon className="w-5 h-5"/></div>}
                        </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.sender === 'bot' && (
                         <div className="flex items-start gap-3">
                             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white"><BotIcon className="w-5 h-5"/></div>
                             <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                                 <div className="flex items-center justify-center gap-1">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-0"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-200"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-400"></span>
                                 </div>
                             </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark">
                    <form onSubmit={handleSend} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t('askAnything')}
                            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors"
                            aria-label={t('send')}
                        >
                            <SendIcon className="w-5 h-5"/>
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChatbotWidget;