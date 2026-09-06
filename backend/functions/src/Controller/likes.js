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
// Check if user liked a post
router.get('/likes/:userId/:postId', verifyToken, (req, res) => {
    get(req.params.userId, req.params.postId).then(result => {
        // Mantém o comportamento para o frontend
        if (result.status) {
            return res.status(200).json(result.msg);
        }
        return res.status(200).send(0);
    });
});
export default router;
//# sourceMappingURL=likes.js.map