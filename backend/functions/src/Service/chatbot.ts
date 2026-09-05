import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function askChatbot(userInput: string): Promise<string> {
    const response = await axios.post(
        GROQ_URL,
        {
            model: 'openai/gpt-oss-20b',
            messages: [
                {
                    role: 'system',
                    content: 'Você é um assistente culinário. Lembre de limitar suas respostas a mais ou menos 500 caracteres. Não corte a mensagem no meio. Ao invés disso, faça-a caber em 500 caracteres.',
                },
                { role: 'user', content: userInput },
            ],
            temperature: 0.7,
        },
        {
            headers: {
                Authorization: `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
        }
    );

    return response.data.choices[0].message.content;
}
