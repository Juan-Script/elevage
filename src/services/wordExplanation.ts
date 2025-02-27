import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { GROQ_API_KEY } from "../config";

export async function getWordExplanation(word: string, level: string = 'Básico'): Promise<string> {
    try {
        const apiKey = GROQ_API_KEY;
        if (!apiKey) {
            throw new Error('GROQ_API_KEY no está configurada en las variables de entorno');
        }

        const model = new ChatGroq({
            temperature: 0,
            model: "mixtral-8x7b-32768",
            maxTokens: level === 'Extenso' ? 900 : level === 'Moderado' ? 750 : 500,
            apiKey: apiKey
        });

        const systemPrompt = "Eres un asistente experto en explicar palabras y términos en español de manera clara y concisa.";
        let userPrompt = "";

        switch (level) {
            case 'Básico':
                userPrompt = "Da una explicación breve y simple de la palabra: {word}. Incluye solo la definición básica y un ejemplo corto.";
                break;
            case 'Moderado':
                userPrompt = "Explica la palabra: {word}. Incluye definición, ejemplos y contexto de uso común.";
                break;
            case 'Extenso':
                userPrompt = "Proporciona una explicación detallada de la palabra: {word}. Incluye definición completa, múltiples ejemplos, contexto histórico si es relevante, sinónimos, antónimos y usos en diferentes situaciones.";
                break;
            default:
                userPrompt = "Explica la palabra: {word}. Incluye definición, ejemplos y contexto.";
        }

        const prompt = ChatPromptTemplate.fromMessages([
            ["system", systemPrompt],
            ["human", userPrompt]
        ]);

        const chain = prompt.pipe(model);
        
        const response = await chain.invoke({
            word: word
        });

        return response.content.toString();
    } catch (error) {
        console.error('Error al obtener la explicación de la palabra:', error);
        throw error;
    }
} 