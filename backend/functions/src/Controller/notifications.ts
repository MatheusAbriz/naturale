import express, { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getNotifications, getUnreadCount, markAllAsRead, deleteNotification, deleteAllNotifications } from '../Service/notifications.js';

const router = express.Router();
router.use(express.json());

router.get('/notifications', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Math.min(Number(req.query.limit) || 10, 20);

        const result = await getNotifications(req.user!.id, { page, limit });
        if (result) return res.status(200).json(result);
        return res.status(400).json({ message: 'Erro ao listar notificações' });
    } catch (error) {
        return next(error);
    }
});

router.get('/notifications/unread-count', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getUnreadCount(req.user!.id);
        if (result) return res.status(200).json(result);
        return res.status(400).json({ message: 'Erro ao contar notificações' });
    } catch (error) {
        return next(error);
    }
});

router.patch('/notifications/read-all', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await markAllAsRead(req.user!.id);
        if (result.status) return res.status(200).json({ message: result.msg });
        return res.status(400).json({ message: result.msg });
    } catch (error) {
        return next(error);
    }
});

router.delete('/notifications/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await deleteNotification(req.params.id, req.user!.id);
        if (result.status) return res.status(200).json({ message: result.msg });
        return res.status(400).json({ message: result.msg });
    } catch (error) {
        return next(error);
    }
});

router.delete('/notifications', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await deleteAllNotifications(req.user!.id);
        if (result.status) return res.status(200).json({ message: result.msg });
        return res.status(400).json({ message: result.msg });
    } catch (error) {
        return next(error);
    }
});

export default router;
