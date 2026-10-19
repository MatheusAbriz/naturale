import crypto from 'crypto';
import pool from '../Model/pool.js';
import mercadoPago from '../Model/mercadoPago.js';
import { CheckoutResultDTO, MercadoPagoPaymentDTO, MercadoPagoWebhookBodyDTO, PlanId, SubscriptionDTO, WebhookResult } from '../types/subscription/index.js';

const PERIOD_DAYS = 30;

const PLAN_PRICES: Record<Exclude<PlanId, 'essential'>, { title: string; price: number }> = {
    extra: { title: 'Plano Extra — Naturale', price: 9.9 },
    deluxe: { title: 'Plano Deluxe — Naturale', price: 19.9 },
};

function getRequiredUrl(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`ERRO CRÍTICO DE CONFIGURAÇÃO: A variável de ambiente ${name} não foi definida!`);
    }
    return value;
}

export function getPaidPlan(plan: string | undefined): Exclude<PlanId, 'essential'> | null {
    if (plan === 'extra' || plan === 'deluxe') return plan;
    return null;
}

export async function createCheckout(userId: number, plan: Exclude<PlanId, 'essential'>): Promise<CheckoutResultDTO> {
    const config = PLAN_PRICES[plan];

    const successUrl = getRequiredUrl('MP_CHECKOUT_SUCCESS_URL');
    const failureUrl = getRequiredUrl('MP_CHECKOUT_FAILURE_URL');
    const pendingUrl = getRequiredUrl('MP_CHECKOUT_PENDING_URL');

    let autoReturn: string | undefined;
    try {
        const successParsed = new URL(successUrl);
        const isPublicHttps = successParsed.protocol === 'https:' && !['localhost', '127.0.0.1'].includes(successParsed.hostname);
        if (isPublicHttps) autoReturn = 'approved';
    } catch {
        autoReturn = undefined;
    }

    const preference = {
        items: [
            {
                title: config.title,
                description: `Assinatura mensal ${PERIOD_DAYS} dias do plano ${plan === 'extra' ? 'Extra' : 'Deluxe'} da rede social saudável Naturale`,
                unit_price: config.price,
                quantity: 1,
                currency_id: 'BRL',
            },
        ],
        external_reference: `${userId}:${plan}`,
        back_urls: {
            success: successUrl,
            failure: failureUrl,
            pending: pendingUrl,
        },
        ...(autoReturn ? { auto_return: autoReturn } : {}),
        notification_url: getRequiredUrl('MP_NOTIFICATION_URL'),
        statement_descriptor: 'NATURALE',
    };

    const response = await mercadoPago.post('/checkout/preferences', preference).catch((err: unknown) => {
        const mpError = err as { response?: { status?: number; data?: unknown }; message?: string };
        console.error('Erro do Mercado Pago ao criar preferência:', {
            status: mpError?.response?.status,
            data: mpError?.response?.data
        });
        throw new Error(`Falha ao criar preferência no Mercado Pago: ${JSON.stringify(mpError?.response?.data ?? mpError?.message)}`);
    });
    const data = response.data;

    if (!data?.id || !data?.init_point) {
        throw new Error('Resposta inválida do Mercado Pago ao criar a preferência de pagamento');
    }

    return { preferenceId: data.id, initPoint: data.init_point };
}

function validateNotificationSignature(
    signatureHeader: string | undefined,
    query: Record<string, unknown>,
    originalUrl: string,
    dataId: string
): boolean {
    const secret = process.env.MP_WEBHOOK_SECRET;

    if (!secret) {
        throw new Error('ERRO CRÍTICO DE CONFIGURAÇÃO: A variável de ambiente MP_WEBHOOK_SECRET não foi definida!');
    }

    const macParam = query?.['mac'];
    if (!signatureHeader && typeof macParam === 'string') {
        return macParam === secret;
    }

    if (!signatureHeader) return false;

    const parts = signatureHeader.split(',').map(part => part.trim());
    const ts = parts.map(part => part.split('=')).find(kv => kv.length === 2 && kv[0] === 'ts')?.[1];
    const v1 = parts.map(part => part.split('=')).find(kv => kv.length === 2 && kv[0] === 'v1')?.[1];

    if (!ts || !v1) return false;

    const [path, search] = originalUrl.split('?');
    const base = `${ts}:${path}${search ?? ''}`;
    const alternatives = [base, `${ts}:id:${dataId}`];

    for (const alternative of alternatives) {
        const signature = crypto.createHmac('sha256', secret).update(alternative).digest('hex');
        if (signature === v1) return true;
    }

    console.warn('Webhook MP: assinatura inválida', { alternatives: alternatives.length });
    return false;
}

export async function handleWebhook(body: MercadoPagoWebhookBodyDTO, query: Record<string, unknown>, headerSignature: string | undefined, originalUrl: string): Promise<WebhookResult> {
    const dataId = String(body?.data?.id ?? query?.['data.id'] ?? query?.['data_id'] ?? '');

    if (!dataId || Number.isNaN(Number(dataId))) {
        return 'ignored';
    }

    if (!validateNotificationSignature(headerSignature, query, originalUrl, dataId)) {
        return 'rejected';
    }

    const response = await mercadoPago.get(`/v1/payments/${dataId}`);
    const payment: MercadoPagoPaymentDTO = response.data;

    const [refUserId, refPlan] = payment.external_reference?.split(':') ?? [];
    const plan = getPaidPlan(refPlan);
    const userId = Number(refUserId);

    if (!plan || Number.isNaN(userId)) {
        console.error('Webhook MP: external_reference inválida', { external_reference: payment.external_reference });
        return 'rejected';
    }

    const expectedPrice = PLAN_PRICES[plan].price;
    const paidAmount = Number(payment.transaction_amount ?? 0);
    if (paidAmount < expectedPrice - 0.001) {
        console.error('Webhook MP: valor divergente', { paidAmount, expectedPrice });
        return 'rejected';
    }

    const method = String(payment.payment_type_id ?? payment.payment_method_id ?? 'unknown');

    const sub = await pool`SELECT id, current_period_end FROM subscription WHERE user_id = ${userId}`;
    let subscriptionId: number | undefined = sub.count > 0 ? Number(sub[0].id) : undefined;

    if (!subscriptionId) {
        const inserted = await pool`
            INSERT INTO subscription (user_id, plan, status, payment_method, mp_preference_id)
            VALUES (${userId}, ${plan}, 'pending', ${method}, ${payment.preference_id ?? null})
            RETURNING id
        `;
        subscriptionId = Number(inserted[0].id);
    }

    const pay = await pool`
        INSERT INTO subscription_payment (subscription_id, mp_payment_id, amount, method, status, payload)
        VALUES (${subscriptionId}, ${String(payment.id)}, ${paidAmount}, ${method}, ${payment.status}, ${JSON.stringify(payment)})
        ON CONFLICT (mp_payment_id) DO NOTHING
        RETURNING id
    `;

    if (pay.count === 0) {
        return 'processed';
    }

    if (payment.status === 'approved') {
        await pool`
            UPDATE subscription
            SET plan = ${plan},
                status = 'active',
                payment_method = ${method},
                current_period_end = GREATEST(now(), COALESCE(current_period_end, now())) + (${PERIOD_DAYS} * interval '1 day'),
                mp_preference_id = ${payment.preference_id ?? null},
                updated_at = now()
            WHERE id = ${subscriptionId}
        `;
    } else if (payment.status === 'pending' || payment.status === 'in_process') {
        await pool`
            UPDATE subscription
            SET status = 'pending', updated_at = now()
            WHERE id = ${subscriptionId}
        `;
    }

    return 'processed';
}

export async function getMySubscription(userId: number): Promise<SubscriptionDTO | false> {
    try {
        const results = await pool`
            SELECT
                plan,
                status,
                payment_method,
                current_period_end,
                CASE
                    WHEN status = 'active' AND (current_period_end IS NULL OR current_period_end > now()) THEN plan
                    WHEN status = 'canceled' AND current_period_end > now() THEN plan
                    ELSE 'essential'
                END AS effective_plan
            FROM subscription
            WHERE user_id = ${userId}
        `;

        if (results.count >= 1) {
            const row = results[0];
            return {
                plan: row.plan as PlanId,
                status: row.status as SubscriptionDTO['status'],
                paymentMethod: row.payment_method || null,
                currentPeriodEnd: row.current_period_end ? new Date(row.current_period_end).toISOString() : null,
                effectivePlan: row.effective_plan as PlanId,
            };
        }

        return { plan: 'essential', status: null, paymentMethod: null, currentPeriodEnd: null, effectivePlan: 'essential' };
    } catch (err) {
        console.error('Erro ao buscar assinatura:', err);
        return false;
    }
}

export async function getEffectivePlan(userId: number): Promise<PlanId> {
    const subscription = await getMySubscription(userId);
    return subscription ? subscription.effectivePlan : 'essential';
}

export async function cancelMySubscription(userId: number): Promise<{ status: boolean; msg: string }> {
    try {
        const results = await pool`
            UPDATE subscription
            SET status = 'canceled', updated_at = now()
            WHERE user_id = ${userId} AND status = 'active'
            RETURNING current_period_end
        `;

        if (results.count > 0) {
            const end = new Date(results[0].current_period_end).toLocaleDateString('pt-BR');
            return { status: true, msg: `Assinatura cancelada! Você mantém o plano até ${end}.` };
        }

        return { status: false, msg: 'Nenhuma assinatura ativa encontrada' };
    } catch (err) {
        console.error('Erro ao cancelar assinatura:', err);
        return { status: false, msg: `${err}` };
    }
}
