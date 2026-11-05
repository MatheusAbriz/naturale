import { Request, Response, NextFunction } from "express";
import { getEffectivePlan, PLAN_RANK } from "../Service/subscription.js";
import { PlanId } from "../types/subscription/index.js";

export function requirePlan(required: Extract<PlanId, 'extra' | 'deluxe'>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const plan = await getEffectivePlan(req.user!.id);

            if (PLAN_RANK[plan] < PLAN_RANK[required]) {
                return res.status(402).json({
                    message: `Recurso exclusivo do plano ${required === 'deluxe' ? 'Deluxe' : 'Extra'}. Assine para liberar!`
                });
            }

            return next();
        } catch (error) {
            return next(error);
        }
    };
}
