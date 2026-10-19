import express, { Request, Response, NextFunction } from 'express';
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
    createCheckout,
    cancelMySubscription,
    getMySubscription,
    getPaidPlan,
    handleWebhook
} from '../Service/subscription.js';

const router = express.Router();

router.use(express.json());

router.post('/subscription/checkout', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paidPlan = getPaidPlan(req.body?.plan);

        if (!paidPlan) {
            return res.status(400).json({ message: 'Plano inválido ou gratuito (Essencial não precisa de pagamento)' });
        }

        const result = await createCheckout(req.user!.id, paidPlan);
        return res.status(201).json({
            preferenceId: result.preferenceId,
            initPoint: result.initPoint
        });
    } catch (error) {
        return next(error);
    }
});

router.post('/subscription/webhook', async (req: Request, res: Response) => {
    try {
        const rawSignature = req.headers['x-signature'];
        const signature = Array.isArray(rawSignature) ? rawSignature[0] : rawSignature;
        const result = await handleWebhook(req.body, req.query as Record<string, unknown>, signature, req.originalUrl);

        if (result !== 'rejected') {
            return res.status(200).send();
        }
        return res.status(500).send();
    } catch (error) {
        console.error('Webhook MP falhou:', error);
        return res.status(500).send();
    }
});

router.get('/subscription/me', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscription = await getMySubscription(req.user!.id);
        if (subscription) {
            return res.status(200).json(subscription);
        }
        return res.status(500).json({ message: 'Erro ao buscar assinatura' });
    } catch (error) {
        return next(error);
    }
});

router.delete('/subscription/me', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await cancelMySubscription(req.user!.id);
        if (result.status) return res.status(200).json({ message: result.msg });
        return res.status(400).json({ message: result.msg });
    } catch (error) {
        return next(error);
    }
});

export default router;
