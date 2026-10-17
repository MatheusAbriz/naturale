import { useNavigate } from "react-router-dom";
import { LockKeyhole, Sparkles } from "lucide-react";
import { Button } from "@/Components/ui/button";

export function UpgradePrompt({ feature, plan = "Extra" }: { feature: string; plan?: "Extra" | "Deluxe" }) {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl border border-primary/15 bg-secondary/60 p-5 text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary shadow-sm"><LockKeyhole className="h-5 w-5" /></span>
      <h2 className="mt-3 font-extrabold">{feature}</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted-foreground">Este recurso faz parte do plano {plan}. Explore os planos para liberar esta experiência.</p>
      <Button className="mt-4" size="sm" onClick={() => navigate("/plans")}><Sparkles className="h-4 w-4" /> Conhecer planos</Button>
    </div>
  );
}
