

import { GoogleGenAI, Chat, GenerateContentResponse, Content } from "@google/genai";
import { ChatMessage, PerformanceData, CelestialBody } from "../types";

// Lazily initialize the AI client to avoid accessing process.env on app load.
let ai: GoogleGenAI | null = null;
const getAi = (): GoogleGenAI => {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

const transformHistory = (history: ChatMessage[]): Content[] => {
    // The chatbot UI adds an empty bot message for streaming. We should not send this to the API.
    const filteredHistory = history.filter(m => !(m.sender === 'bot' && m.text === ''));
    return filteredHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
};

export const getChatStream = async (
    prompt: string,
    history: ChatMessage[],
    module: CelestialBody | null,
    t: (key: string, options?: { [key: string]: string | number }) => string
): Promise<AsyncGenerator<GenerateContentResponse>> => {
    const genAI = getAi();
    
    const chatConfig = {
        systemInstruction: t('gemini.chat.systemInstruction'),
    };

    const chat: Chat = genAI.chats.create({
        model: 'gemini-2.5-flash',
        config: chatConfig,
        history: transformHistory(history)
    });
  
    const context = module
        ? t('gemini.chat.context.studyingModule', { subject: t(module.subject.toLowerCase()), title: t(module.title) })
        : t('gemini.chat.context.general');
  
    const fullPrompt = `${context}\n\n${prompt}`;

    const response = await chat.sendMessageStream({ message: fullPrompt });
  
    return response;
};

export const generatePerformanceSummary = async (history: PerformanceData[], language: string): Promise<string> => {
    const genAI = getAi();
    
    const systemInstruction = `You are an encouraging performance coach. Analyze the following student performance data across Biology, Chemistry, and Physics for the Vanda International Science Competition. The score is out of 100. Based on this data, provide a short, encouraging summary (2-3 sentences max). Your response must be in ${language}. The summary should comment on their overall trend and compare performance across subjects. For example, mention their strongest subject, any subject showing great improvement, or a subject that might need more attention. Be positive and motivating. Example in Portuguese: "Seu desempenho geral mostra uma melhora consistente! Você está indo muito bem em Biologia, e sua nota em Física teve um salto notável. Continue revisando Química para fortalecer ainda mais seus conhecimentos."`;
    
    const userPrompt = `Performance Data: ${JSON.stringify(history)}`;

    try {
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating performance summary with Gemini:", error);
        throw new Error("Failed to generate summary from AI.");
    }
};