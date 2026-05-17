import express from 'express';
import { get, toggle } from '../Service/favorites.js';

const router = express.Router();
router.use(express.json());

// Get user favorites
router.get('/favorites/:userId', (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 20);
    const filters = { page, limit };

    get(filters, req.params.userId).then(result => {
        if (result) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    });
});

// Toggle favorite (add / remove)
router.patch('/favorites/:userId/:postId', (req, res) => {
    toggle(req.params.userId, req.params.postId).then(result => {
        if (result.status) {
            return res.status(200).json(result.msg);
        }
        return res.status(400).json(result.msg);
    });
});

export default router;