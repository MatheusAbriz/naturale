import { useState } from "react";
import { Check, Crown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { PLANS, type PlanId, useSubscription } from "@/stores/subscription-store";

const planOrder: PlanId[] = ["essential", "extra", "deluxe"];

export default function Plans() {
  const { plan: currentPlan, setPlan } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);

  function selectPlan(plan: PlanId) {
    if (plan === currentPlan) return;
    if (plan === "essential") {
      setPlan(plan);
      toast.success("Você está no plano Essencial.");
      return;
    }
    setSelectedPlan(plan);
  }

  function confirmMockSubscription() {
    if (!selectedPlan) return;
    setPlan(selectedPlan);
    toast.success(`Plano ${PLANS[selectedPlan].name} ativado em modo demonstração.`);
    setSelectedPlan(null);
  }

  return (
    <div className="pb-8">
      <section className="rounded-2xl bg-primary px-5 py-8 text-primary-foreground sm:px-8 sm:py-10">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold"><Sparkles className="h-3.5 w-3.5" /> Planos Naturale</span>
        <h1 className="mt-4 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">Escolha o jeito que combina com a sua rotina.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">Comece gratuitamente e evolua quando quiser mais organização, personalização e apoio na cozinha.</p>
      </section>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {planOrder.map((planId) => {
          const plan = PLANS[planId];
          const isCurrent = currentPlan === planId;
          const isDeluxe = planId === "deluxe";
          return (
            <article key={plan.id} className={`relative flex flex-col rounded-2xl border bg-white p-5 shadow-[0_8px_28px_rgba(39,73,58,0.06)] ${isDeluxe ? "border-accent-foreground/35" : "border-border"}`}>
              {isDeluxe && <span className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-accent-foreground"><Crown className="h-3.5 w-3.5" /> Mais completo</span>}
              <div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-extrabold">{plan.name}</h2><p className="mt-1 text-sm leading-5 text-muted-foreground">{plan.description}</p></div>{isCurrent && <span className="rounded-full bg-secondary px-2 py-1 text-[11px] font-bold text-primary">Seu plano</span>}</div>
              <p className="mt-6 text-2xl font-extrabold">{plan.price}</p>
              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => <li key={feature} className="flex gap-2 text-sm leading-5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{feature}</li>)}
              </ul>
              <Button variant={isCurrent ? "outline" : isDeluxe ? "default" : "secondary"} className="mt-7 w-full" disabled={isCurrent} onClick={() => selectPlan(planId)}>
                {isCurrent ? "Plano atual" : planId === "essential" ? "Usar plano Essencial" : `Escolher ${plan.name}`}
              </Button>
            </article>
          );
        })}
      </div>

      <p className="mt-5 text-center text-xs text-muted-foreground">Fluxo de assinatura em demonstração. A cobrança via Mercado Pago será conectada posteriormente.</p>

      <Dialog open={Boolean(selectedPlan)} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar plano {selectedPlan ? PLANS[selectedPlan].name : ""}</DialogTitle>
            <DialogDescription>Este é um fluxo demonstrativo. Nenhuma cobrança será realizada agora.</DialogDescription>
          </DialogHeader>
          <div className="rounded-xl bg-muted p-4 text-sm"><p className="font-bold">{selectedPlan && PLANS[selectedPlan].price}</p><p className="mt-1 text-muted-foreground">Quando a integração estiver pronta, você seguirá daqui para o checkout seguro do Mercado Pago.</p></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPlan(null)}>Cancelar</Button>
            <Button onClick={confirmMockSubscription}>Ativar em demonstração</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
