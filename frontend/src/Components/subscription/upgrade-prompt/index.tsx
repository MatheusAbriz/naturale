import { useNavigate } from "react-router-dom";
import { LockKeyhole, Sparkles } from "lucide-react";
import { Button } from "@/styles/buttons";
import { Wrap, IconCircle, Title, Description } from "./styles";

export function UpgradePrompt({ feature, plan = "Extra" }: { feature: string; plan?: "Extra" | "Deluxe" }) {
  const navigate = useNavigate();
  return (
    <Wrap>
      <IconCircle>
        <LockKeyhole size={20} />
      </IconCircle>
      <Title>{feature}</Title>
      <Description>Este recurso faz parte do plano {plan}. Explore os planos para liberar esta experiência.</Description>
      <Button $size="sm" style={{ marginTop: 16 }} onClick={() => navigate("/plans")}>
        <Sparkles size={16} /> Conhecer planos
      </Button>
    </Wrap>
  );
}
