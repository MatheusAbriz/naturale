import express, { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { requirePlan } from '../middlewares/planMiddleware.js';
import { listMyCollections, createCollection, togglePostInCollection } from '../Service/collections.js';

const router = express.Router();
router.use(express.json());

router.get('/favorite-collections', verifyToken, requirePlan('extra'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const collections = await listMyCollections(req.user!.id);
        return res.status(200).json(collections);
    } catch (error) {
        return next(error);
    }
});

router.post('/favorite-collections', verifyToken, requirePlan('extra'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await createCollection(req.user!.id, req.body?.name);
        if (result.status) return res.status(201).json(result.msg);
        return res.status(400).json({ message: result.msg });
    } catch (error) {
        return next(error);
    }
});

router.patch('/favorite-collections/:collectionId/posts/:postId', verifyToken, requirePlan('extra'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const collectionId = Number(req.params.collectionId);
        const postId = Number(req.params.postId);

        if (Number.isNaN(collectionId) || Number.isNaN(postId)) {
            return res.status(400).json({ message: 'IDs inválidos' });
        }

        const result = await togglePostInCollection(req.user!.id, collectionId, postId);
        if (result.status) return res.status(200).json({ message: result.msg });
        return res.status(404).json({ message: result.msg });
    } catch (error) {
        return next(error);
    }
});

export default router;
