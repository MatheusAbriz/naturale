export type PlanId = "essential" | "extra" | "deluxe";

export type SubscriptionStatus = "pending" | "active" | "canceled" | "expired";
export type SubscriptionPaymentStatus = "approved" | "pending" | "rejected" | "cancelled" | "refunded";

export type SubscriptionDTO = {
    plan: PlanId | null,
    status: SubscriptionStatus | null,
    paymentMethod: string | null,
    currentPeriodEnd: string | null,
    effectivePlan: PlanId
}

export type CheckoutResultDTO = {
    preferenceId: string,
    initPoint: string
}

export type MercadoPagoPreferenceDTO = {
    id: string,
    init_point: string
}

export type MercadoPagoPaymentDTO = {
    id: string | number,
    status: string,
    external_reference: string | null,
    transaction_amount: number | null,
    payment_method_id?: string,
    payment_type_id?: string,
    date_approved?: string | null,
    preference_id?: string
}

export type MercadoPagoWebhookBodyDTO = {
    type?: string,
    action?: string,
    data?: {
        id?: string | number
    }
}

export type WebhookResult = 'processed' | 'ignored' | 'rejected';
