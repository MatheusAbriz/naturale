import axios from 'axios';
import dotenv from 'dotenv';
import pool from '../Model/pool.js';
import { getEffectivePlan } from './subscription.js';
import { PlanId } from '../types/subscription/index.js';

dotenv.config();
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const DAILY_QUESTION_LIMIT: Record<PlanId, number> = {
    essential: 5,
    extra: 30,
    deluxe: 100,
};

export type ChatbotAnswerResult = {
    status: boolean,
    reply?: string,
    limit?: number,
    used?: number
};

async function registerQuestion(userId: number): Promise<number> {
    const results = await pool`
        INSERT INTO chatbot_usage (user_id, usage_day, questions_used)
        VALUES (${userId}, CURRENT_DATE, 1)
        ON CONFLICT (user_id, usage_day)
        DO UPDATE SET questions_used = chatbot_usage.questions_used + 1
        RETURNING questions_used
    `;
    return Number(results[0].questions_used);
}

export async function askChatbot(userId: number, userInput: string): Promise<ChatbotAnswerResult> {
    const plan = await getEffectivePlan(userId);
    const limit = DAILY_QUESTION_LIMIT[plan];

    const current = await pool`
        SELECT questions_used
        FROM chatbot_usage
        WHERE user_id = ${userId} AND usage_day = CURRENT_DATE
    `;

    const used = current.count > 0 ? Number(current[0].questions_used) : 0;

    if (used >= limit) {
        return { status: false, limit, used };
    }

    const newUsed = await registerQuestion(userId);

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

    return { status: true, reply: response.data.choices[0].message.content, limit, used: newUsed };
}
