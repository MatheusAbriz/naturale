import { Crown, Sparkles } from "lucide-react";
import type { PlanId } from "@/stores/subscription-store";
import { Badge } from "./styles";

export function PlanBadge({ plan }: { plan: PlanId }) {
  if (plan === "essential") return null;
  const isDeluxe = plan === "deluxe";
  return (
    <Badge $deluxe={isDeluxe}>
      {isDeluxe ? <Crown size={12} /> : <Sparkles size={12} />}
      {isDeluxe ? "Deluxe" : "Extra"}
    </Badge>
  );
}
