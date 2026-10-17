import { Crown, Sparkles } from "lucide-react";
import type { PlanId } from "@/stores/subscription-store";

export function PlanBadge({ plan }: { plan: PlanId }) {
  if (plan === "essential") return null;
  const isDeluxe = plan === "deluxe";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-extrabold ${isDeluxe ? "bg-accent text-accent-foreground" : "bg-secondary text-primary"}`}>
      {isDeluxe ? <Crown className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
      {isDeluxe ? "Deluxe" : "Extra"}
    </span>
  );
}
