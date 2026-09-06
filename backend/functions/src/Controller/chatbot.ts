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
        const reply = await askChatbot(message);
        return res.status(200).json({ reply });
    } catch (error) {
        console.error(error);
        return res.status(502).json({ message: 'Erro ao consultar o assistente' });
    }
});

export default router;
