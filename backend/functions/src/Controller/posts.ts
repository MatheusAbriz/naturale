import express from 'express';
import {
    getAll,
    add,
    getByTitle,
    getById,
    getByUserId,
    toggleLike,
    update,
    remove
} from '../Service/posts.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getEffectivePlan, PLAN_RANK } from '../Service/subscription.js';

const router = express.Router();
router.use(express.json());

const NUTRITION_FIELDS = ['calories', 'protein_g', 'carbs_g', 'fat_g'] as const;

// Remove os campos de nutrição da resposta pra quem não é Deluxe (gating de verdade no backend)
function stripNutritionIfNotDeluxe<T extends Record<string, unknown>>(post: T, viewerPlan: string): T {
    if (PLAN_RANK[viewerPlan as keyof typeof PLAN_RANK] >= PLAN_RANK.deluxe) return post;
    const clone = { ...post };
    for (const field of NUTRITION_FIELDS) delete clone[field];
    return clone;
}

// CRUD - POSTS

// Ler todos os posts
router.get('/posts', verifyToken, async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 20);
    const search = req.query.search?.toString();
    const ingredient = req.query.ingredient?.toString() || undefined;
    const maxTime = req.query.maxTime ? Number(req.query.maxTime) : undefined;
    const feedParam = req.query.feed?.toString();
    const feedMode = feedParam === 'following' ? 'following' : feedParam === 'recommended' ? 'recommended' : 'discover';

    const filters = { page, limit };
    const userId = req.user!.id;
    const viewerPlan = await getEffectivePlan(userId);

    if (feedMode === 'recommended' && PLAN_RANK[viewerPlan] < PLAN_RANK.deluxe) {
      return res.status(402).json({ message: 'Recurso exclusivo do plano Deluxe. Assine para liberar!' });
    }

    // Filtro por nutrição só é aplicado pra quem é Deluxe (senão vazaria o dado pelo resultado da busca,
    // já que esses campos são removidos da resposta pra quem não é Deluxe)
    const isDeluxeViewer = PLAN_RANK[viewerPlan] >= PLAN_RANK.deluxe;
    const maxCalories = isDeluxeViewer && req.query.maxCalories ? Number(req.query.maxCalories) : undefined;
    const minProtein = isDeluxeViewer && req.query.minProtein ? Number(req.query.minProtein) : undefined;
    const maxCarbs = isDeluxeViewer && req.query.maxCarbs ? Number(req.query.maxCarbs) : undefined;
    const maxFat = isDeluxeViewer && req.query.maxFat ? Number(req.query.maxFat) : undefined;

    const result = await getAll(filters, userId, search, feedMode, ingredient, maxTime, maxCalories, minProtein, maxCarbs, maxFat);
    if (!result) return res.status(400).send("Erro!");

    return res.status(200).json({
      ...result,
      data: result.data.map((post) => stripNutritionIfNotDeluxe(post, viewerPlan))
    });
  } catch (error) {
    return next(error);
  }
});

// Adicionar post
router.post('/posts', verifyToken, (req, res) => {
    const userIdFromToken = req.user?.id;

    const postData = { ...req.body, user_id: userIdFromToken! };

    add(postData).then(result => {
        if (result.status) {
            return res.status(200).send("Sucesso! post adicionado com sucesso");
        }
        return res.status(400).send(result.msg);
    });
});

// Ler posts por título
router.get('/posts/search/:text', verifyToken, (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 20);
    const filters = { page, limit };

    getByTitle(req.params.text, filters).then(result => {
        if (result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).send(result.msg);
    });
});

// Ler posts de um autor específico (usado na tela de perfil)
router.get('/posts/user/:userId', verifyToken, async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 20);
    const filters = { page, limit };
    const viewerId = req.user!.id;

    const result = await getByUserId(req.params.userId, viewerId, filters);
    if (!result) return res.status(400).send("Erro!");

    const viewerPlan = await getEffectivePlan(viewerId);
    return res.status(200).json({
      ...result,
      data: result.data.map((post) => stripNutritionIfNotDeluxe(post, viewerPlan))
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/posts/:postId', verifyToken, async (req, res, next) => {
  try {
    const userIdFromToken = req.user!.id;

    const result = await getById(req.params.postId, userIdFromToken);
    if (!result.status) {
      return res.status(400).json({ message: result.msg });
    }

    const viewerPlan = await getEffectivePlan(userIdFromToken);
    return res.status(200).json(stripNutritionIfNotDeluxe(result.data!, viewerPlan));
  } catch (error) {
    return next(error);
  }
});

// Editar post (somente o dono)
router.put('/posts/:postId', verifyToken, async (req, res) => {
    const userIdFromToken = req.user?.id;

    const result = await update(req.params.postId, userIdFromToken!, req.body);
    if (result.status) {
        return res.status(200).json({ message: result.msg });
    }
    return res.status(403).json({ message: result.msg });
});

// Excluir post (somente o dono)
router.delete('/posts/:postId', verifyToken, async (req, res) => {
    const userIdFromToken = req.user?.id;

    const result = await remove(req.params.postId, userIdFromToken!);
    if (result.status) {
        return res.status(200).json({ message: result.msg });
    }
    return res.status(403).json({ message: result.msg });
});

// CRUD - Posts - Atualizar Likes por Curtida (HARDENING: userId sai da URL e entra o ID do token)
router.patch('/posts/:postId/like', verifyToken, (req, res) => {
    const userIdFromToken = req.user?.id;

    toggleLike(userIdFromToken!, req.params.postId).then(result => {
        if (result) {
            return res.status(200).send("Sucesso! post updated com sucesso");
        }
        return res.status(400).send("Erro! post não encontrado");
    });
});

export default router;