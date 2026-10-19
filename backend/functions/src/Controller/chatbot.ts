import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { askChatbot } from '../Service/chatbot.js';

const router = express.Router();

router.post('/chatbot', verifyToken, async (req, res) => {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ message: 'Mensagem inválida' });
    }

    try {
        const result = await askChatbot(req.user!.id, message.trim());

        if (!result.status) {
            return res.status(429).json({
                message: 'Limite diário do assistente atingido. Faça upgrade do seu plano para continuar!',
                limit: result.limit,
                used: result.used
            });
        }

        return res.status(200).json({
            reply: result.reply,
            limit: result.limit,
            used: result.used
        });
    } catch (error) {
        console.error(error);
        return res.status(502).json({ message: 'Erro ao consultar o assistente' });
    }
});

export default router;
