import { API } from "./api";
import type { PlanId } from "@/stores/subscription-store";

export type SubscriptionStatus = "pending" | "active" | "canceled" | "expired" | null;

export type MySubscription = {
  plan: PlanId;
  status: SubscriptionStatus;
  paymentMethod: string | null;
  currentPeriodEnd: string | null;
  effectivePlan: PlanId;
};

export function getMySubscription() {
  return API.get<MySubscription>("/subscription/me");
}

export function cancelMySubscription() {
  return API.delete<{ message: string }>("/subscription/me");
}
