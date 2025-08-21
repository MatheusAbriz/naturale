import axios from "axios";

export const callGroq = async (userInput: string) =>{
    try{
        const res = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions', {
                model: 'llama3-8b-8192',
                messages: [
                    { role: 'system', content: 'Você é um assistente culinário' },
                    { role: 'user', content: userInput },
                ],
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return res.data.choices[0].message.content;
    }catch(e){
        console.log(e);
        throw new Error(`Erro ${e}`);
    }
}