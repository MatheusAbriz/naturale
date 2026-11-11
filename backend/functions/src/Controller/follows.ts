import express, { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../Service/follows.js';

const router = express.Router();
router.use(express.json());

router.post('/user/:id/follow', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const followedId = Number(req.params.id);
        if (Number.isNaN(followedId)) return res.status(400).json({ message: 'ID inválido' });

        const result = await followUser(req.user!.id, followedId);
        if (result.status) return res.status(200).json({ message: result.msg });
        return res.status(400).json({ message: result.msg });
    } catch (error) {
        return next(error);
    }
});

router.delete('/user/:id/follow', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const followedId = Number(req.params.id);
        if (Number.isNaN(followedId)) return res.status(400).json({ message: 'ID inválido' });

        const result = await unfollowUser(req.user!.id, followedId);
        if (result.status) return res.status(200).json({ message: result.msg });
        return res.status(400).json({ message: result.msg });
    } catch (error) {
        return next(error);
    }
});

router.get('/user/:id/followers', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const targetId = Number(req.params.id);
        if (Number.isNaN(targetId)) return res.status(400).json({ message: 'ID inválido' });

        const page = Number(req.query.page) || 1;
        const limit = Math.min(Number(req.query.limit) || 10, 20);

        const result = await getFollowers(targetId, req.user!.id, { page, limit });
        if (result) return res.status(200).json(result);
        return res.status(400).json({ message: 'Erro ao listar seguidores' });
    } catch (error) {
        return next(error);
    }
});

router.get('/user/:id/following', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const targetId = Number(req.params.id);
        if (Number.isNaN(targetId)) return res.status(400).json({ message: 'ID inválido' });

        const page = Number(req.query.page) || 1;
        const limit = Math.min(Number(req.query.limit) || 10, 20);

        const result = await getFollowing(targetId, req.user!.id, { page, limit });
        if (result) return res.status(200).json(result);
        return res.status(400).json({ message: 'Erro ao listar quem o usuário segue' });
    } catch (error) {
        return next(error);
    }
});

export default router;
