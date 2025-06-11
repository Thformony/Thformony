
import { GoogleGenAI, GenerateContentResponse, Chat, GroundingChunk, Part, Content } from "@google/genai";
import { API_MODELS } from "../constants";

// Ensure API_KEY is accessed correctly, assuming it's set in the environment
const API_KEY = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("Gemini API Key is not configured. AI features will be limited.");
}

const generateContent = async (prompt: string, modelName: string = API_MODELS.text, systemInstruction?: string, tools?: any[]): Promise<GenerateContentResponse | null> => {
  if (!ai) return null;
  try {
    const config: any = {};
    if (systemInstruction) {
        config.systemInstruction = systemInstruction;
    }
    if (tools) {
        config.tools = tools;
    }
    // Ensure config is only passed if it has keys, otherwise pass undefined.
    const requestConfig = Object.keys(config).length > 0 ? config : undefined;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: requestConfig,
    });
    return response;
  } catch (error) {
    console.error("Gemini API Error (generateContent):", error);
    return null;
  }
};


export const getSmartSuggestionGemini = async (fromCurrency: string, toCurrency: string, currentRate: number): Promise<string | null> => {
  if (!ai) return null;
  const prompt = `As a financial analyst, provide a brief (1-2 sentences) market trend suggestion for exchanging ${fromCurrency} to ${toCurrency}. The current rate is 1 ${fromCurrency} = ${currentRate.toFixed(4)} ${toCurrency}. Consider general market sentiment or recent volatility if possible, but keep it very generic and cautious. Example: 'The ${toCurrency} has shown some strength against the ${fromCurrency} recently. Consider monitoring for a dip if you're not in a hurry.'`;
  const response = await generateContent(prompt);
  return response ? response.text : null;
};

export const getRatePredictionGemini = async (fromCurrency: string, toCurrency: string): Promise<string | null> => {
  if (!ai) return null;
  const prompt = `Provide a very short (1 sentence) speculative outlook for the ${fromCurrency}/${toCurrency} exchange rate over the next 7 days. This is not financial advice. Example: 'The ${fromCurrency}/${toCurrency} pair might see slight fluctuations around the current levels.'`;
  const response = await generateContent(prompt);
  return response ? response.text : null;
};

export const getAlertSuggestionGemini = async (fromCurrency: string, toCurrency: string, currentRate: number): Promise<string | null> => {
  if (!ai) return null;
  const prompt = `Based on the current ${fromCurrency}/${toCurrency} rate of ${currentRate.toFixed(4)}, suggest a hypothetical target rate (1 sentence) for setting an exchange alert that might be favorable. This is not financial advice. Example: 'If you're looking to buy ${toCurrency} with ${fromCurrency}, a rate around ${ (currentRate * 0.98).toFixed(4)} could be an interesting point to watch.'`;
  const response = await generateContent(prompt);
  return response ? response.text : null;
};

// chatInstance is not used in the current implementation of sendMessageToChat which creates a new chat each time.
// If a persistent chat session is desired, initChat and chatInstance would need to be integrated differently.
// let chatInstance: Chat | null = null; 

// export const initChat = (): Chat | null => { ... }; // Original initChat function if needed for persistent chat


export const sendMessageToChat = async (message: string, currentChatHistory: Content[]): Promise<GenerateContentResponse | null> => {
    if (!ai) return null;
    
    // Create a new chat session for each message, incorporating the history.
    // This approach is simpler if chat sessions don't need to be long-lived or stateful beyond the current exchange.
    const chat = ai.chats.create({
      model: API_MODELS.text,
      config: {
        systemInstruction: "You are a friendly and helpful AI assistant for 'Th For Currency Exchange'. Answer questions about currency conversion, exchange rates, the app's features (converter, history, calculator, favorites), and provide general information about currencies. If asked about recent financial news or very specific real-time data, you can use your general knowledge or suggest the user consult a financial expert. If a user's query could benefit from web search results, use the provided Google Search tool. Always be polite and concise.",
        tools: [{ googleSearch: {} }],
      },
      history: currentChatHistory, 
    });

    try {
        // The message to send should be a Content object, or a simple string for convenience.
        // The SDK handles string messages by wrapping them appropriately.
        // If message were an object (e.g., multimodal), it would need to be a Content or Part[].
        const response = await chat.sendMessage({ message: message }); // API expects string or ContentPart[]
        return response;
    } catch (error) {
        console.error("Gemini Chat API Error:", error);
        return null;
    }
};

export const extractGroundingChunks = (response: GenerateContentResponse | null): GroundingChunk[] => {
    if (!response || !response.candidates || response.candidates.length === 0) {
        return [];
    }
    const candidate = response.candidates[0];
    if (candidate.groundingMetadata && candidate.groundingMetadata.groundingChunks) {
        // Ensure the cast is safe or type-checked if the actual structure might vary.
        return candidate.groundingMetadata.groundingChunks as GroundingChunk[];
    }
    return [];
};
