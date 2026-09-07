import express from 'express';
import { get, toggle } from '../Service/favorites.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(express.json());

// Get user favorites (Protegido por token)
router.get('/favorites', verifyToken, (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 20);
    const filters = { page, limit };

    // HARDENING: Resolvido erro do any
    const userId = (req as unknown as { user: { id: string } }).user.id; 

    get(filters, userId).then(result => {
        if (result) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    });
});

// Toggle favorite (add / remove) (Protegido por token)
router.patch('/favorites/:postId', verifyToken, (req, res) => {
    // HARDENING: Resolvido erro do any
    const userId = (req as unknown as { user: { id: string } }).user.id; 
    const { postId } = req.params;

    toggle(userId, postId).then(result => {
        if (result.status) {
            return res.status(200).json(result.msg);
        }
        return res.status(400).json(result.msg);
    });
});

export default router;