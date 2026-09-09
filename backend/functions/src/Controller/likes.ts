import express from 'express';
import { getAll, get } from '../Service/likes.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(express.json());

// Get all likes
router.get('/likes', verifyToken, (req, res) => {
    getAll().then(result => {
        if (result.status) {
            return res.status(200).json(result.msg);
        }
        return res.status(400).send(result.msg);
    });
});

// Check if user liked a post (HARDENING: userId extraído direto do token seguro)
router.get('/likes/:postId', verifyToken, (req, res) => {
    const userIdFromToken = req.user?.id;
    const { postId } = req.params;

    get(userIdFromToken!, postId).then((result) => {
        if (result.status) {
            return res.status(200).json(result.msg);
        }
        return res.status(200).send(0);
    });
});

export default router;