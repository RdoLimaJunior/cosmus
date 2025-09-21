
import { GoogleGenAI, Chat, GenerateContentResponse, Content } from "@google/genai";
import { ChatMessage, PerformanceData, StudyModule } from "../types";

// Lazily initialize the AI client to avoid accessing process.env on app load.
let ai: GoogleGenAI | null = null;
const getAi = (): GoogleGenAI => {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

const chatConfig = {
  systemInstruction: 'You are a specialized tutor for the Vanda International Science Competition, focusing on Biology, Chemistry, and Physics. You are integrated into a study page. When a user asks a question, it is related to the specific module they are viewing. Guide them through the content, clarify their doubts, and provide detailed explanations based on their study guide. Be encouraging and clear. Your primary language is Portuguese, but respond in the language of the user\'s query.',
};

const transformHistory = (history: ChatMessage[]): Content[] => {
    // The chatbot UI adds an empty bot message for streaming. We should not send this to the API.
    const filteredHistory = history.filter(m => !(m.sender === 'bot' && m.text === ''));
    return filteredHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
};

export const getChatStream = async (prompt: string, history: ChatMessage[], module: StudyModule | null): Promise<AsyncGenerator<GenerateContentResponse>> => {
  const genAI = getAi();

  const chat: Chat = genAI.chats.create({
    model: 'gemini-2.5-flash',
    config: chatConfig,
    history: transformHistory(history)
  });
  
  const context = module
    ? `O usuário está estudando o módulo de ${module.subject}: "${module.title}". Responda com base neste contexto.`
    : 'O usuário está na página de estudos geral.';
  
  const fullPrompt = `${context}\n\nPergunta do usuário: ${prompt}`;

  const response = await chat.sendMessageStream({ message: fullPrompt });
  
  return response;
};

export const generatePerformanceSummary = async (history: PerformanceData[], language: string): Promise<string> => {
    const genAI = getAi();
    
    const prompt = `You are an encouraging performance coach. Analyze the following student performance data across Biology, Chemistry, and Physics for the Vanda International Science Competition. The score is out of 100.

    Data: ${JSON.stringify(history)}

    Based on this data, provide a short, encouraging summary (2-3 sentences max). Your response must be in ${language}. 
    The summary should comment on their overall trend and compare performance across subjects. For example, mention their strongest subject, any subject showing great improvement, or a subject that might need more attention.

    Be positive and motivating. Example in Portuguese: "Seu desempenho geral mostra uma melhora consistente! Você está indo muito bem em Biologia, e sua nota em Física teve um salto notável. Continue revisando Química para fortalecer ainda mais seus conhecimentos."`;

    try {
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating performance summary with Gemini:", error);
        throw new Error("Failed to generate summary from AI.");
    }
};
