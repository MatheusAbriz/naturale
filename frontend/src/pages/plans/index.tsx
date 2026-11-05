import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, CheckCheck, Copy, Crown, Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { API } from "@/services/api";
import { PLANS, type PlanId, useSubscription } from "@/stores/subscription-store";

const planOrder: PlanId[] = ["essential", "extra", "deluxe"];
const POLL_INTERVAL_MS = 4000;

type PendingCheckout = { plan: PlanId; link: string };

export default function Plans() {
  const navigate = useNavigate();
  const { plan: currentPlan, setPlan, syncPlan } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [copied, setCopied] = useState(false);

  // Continua existindo mesmo depois que o modal do link é fechado — é o que
  // mantém o polling rodando em segundo plano enquanto o usuário paga em outra aba.
  const [pendingCheckout, setPendingCheckout] = useState<PendingCheckout | null>(null);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Retorno do Mercado Pago, caso o usuário pague na mesma aba em vez de
  // colar o link em outro lugar: sincroniza o plano real do backend.
  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get("status");
    if (!status) return;

    const messages: Record<string, string> = {
      approved: "Pagamento aprovado! Bem-vindo ao plano assinado",
      pending: "Pagamento pendente (ex.: PIX aguardando). Assim que aprovar, seu plano é liberado.",
      failure: "O pagamento não foi concluído. Nenhuma cobrança foi efetuada.",
    };

    syncPlan().then((ok) => {
      if (ok) toast.success(messages[status] ?? "Assinatura atualizada!");
      else toast.info(messages[status] ?? "Assinatura atualizada!");
    });

    navigate("/plans", { replace: true });
  }, []);

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  // O Mercado Pago avisa o backend por webhook (chamada servidor-a-servidor);
  // o frontend não recebe esse evento diretamente. Enquanto houver um checkout
  // pendente — com o modal aberto ou não — perguntamos ao backend de tempos
  // em tempos se já aprovou.
  useEffect(() => {
    if (!pendingCheckout) return;

    pollRef.current = setInterval(async () => {
      const ok = await syncPlan();
      if (ok && useSubscription.getState().plan === pendingCheckout.plan) {
        stopPolling();
        toast.success("Pagamento aprovado! Bem-vindo ao plano assinado 🎉");
        setPendingCheckout(null);
        setLinkModalOpen(false);
      }
    }, POLL_INTERVAL_MS);

    return stopPolling;
  }, [pendingCheckout]);

  function closeConfirmDialog() {
    setSelectedPlan(null);
  }

  function dismissPendingCheckout() {
    stopPolling();
    setPendingCheckout(null);
    setLinkModalOpen(false);
  }

  function selectPlan(plan: PlanId) {
    if (plan === currentPlan) return;
    if (plan === "essential") {
      setPlan(plan);
      toast.success("Você está no plano Essencial.");
      return;
    }
    setSelectedPlan(plan);
  }

  async function startCheckout() {
    if (!selectedPlan) return;
    setIsCreatingLink(true);
    try {
      const response = await API.post("/subscription/checkout", { plan: selectedPlan });
      const { initPoint } = response.data;
      if (!initPoint) throw new Error("Sem URL de pagamento");
      setPendingCheckout({ plan: selectedPlan, link: initPoint });
      setLinkModalOpen(true);
      setSelectedPlan(null);
    } catch {
      toast.error("Não foi possível gerar o link de pagamento. Tente novamente.");
    } finally {
      setIsCreatingLink(false);
    }
  }

  async function copyPaymentLink() {
    if (!pendingCheckout) return;
    try {
      await navigator.clipboard.writeText(pendingCheckout.link);
      setCopied(true);
      toast.success("Link copiado! Cole em uma aba, faça login no Mercado Pago e finalize o pagamento.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o link. Tente novamente.");
    }
  }

  return (
    <div className="pb-8">
      <section className="rounded-2xl bg-primary px-5 py-8 text-primary-foreground sm:px-8 sm:py-10">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold"><Sparkles className="h-3.5 w-3.5" /> Planos Naturale</span>
        <h1 className="mt-4 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">Escolha o jeito que combina com a sua rotina.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">Comece gratuitamente e evolua quando quiser mais organização, personalização e apoio na cozinha.</p>
      </section>

      {pendingCheckout && (
        <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-accent-foreground/25 bg-accent/40 px-4 py-3">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 shrink-0 animate-spin text-accent-foreground" />
            <div>
              <p className="text-sm font-bold">Pagamento do plano {PLANS[pendingCheckout.plan].name} em andamento</p>
              <p className="text-xs text-muted-foreground">Assim que o Mercado Pago aprovar, seu plano é atualizado automaticamente.</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setLinkModalOpen(true)}>Ver link</Button>
            <button onClick={dismissPendingCheckout} aria-label="Dispensar" className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

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

      <p className="mt-5 text-center text-xs text-muted-foreground">Pagamento processado com segurança pelo Mercado Pago. Aceitamos cartão de crédito.</p>

      <Dialog open={Boolean(selectedPlan)} onOpenChange={(open) => !open && closeConfirmDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar plano {selectedPlan ? PLANS[selectedPlan].name : ""}</DialogTitle>
            <DialogDescription>Você vai receber um link de pagamento seguro do Mercado Pago para concluir a assinatura.</DialogDescription>
          </DialogHeader>
          <div className="rounded-xl bg-muted p-4 text-sm"><p className="font-bold">{selectedPlan && PLANS[selectedPlan].price}</p><p className="mt-1 text-muted-foreground">Nenhum dado do seu cartão passa pelo Naturale — o Mercado Pago processa tudo por nós.</p></div>
          <DialogFooter>
            <Button variant="outline" disabled={isCreatingLink} onClick={closeConfirmDialog}>Cancelar</Button>
            <Button disabled={isCreatingLink} onClick={startCheckout}>{isCreatingLink ? "Gerando link..." : "Gerar link de pagamento"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={linkModalOpen} onOpenChange={setLinkModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Falta pouco!</DialogTitle>
            <DialogDescription>
              Você vai receber um link de pagamento. Entre na sua conta do Mercado Pago e finalize o pagamento para continuar.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-border bg-muted p-3">
            <input
              readOnly
              value={pendingCheckout?.link ?? ""}
              onFocus={(event) => event.currentTarget.select()}
              className="w-full truncate bg-transparent text-xs text-muted-foreground outline-none"
            />
          </div>
          <Button onClick={copyPaymentLink} className="w-full">
            {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Link copiado!" : "Copiar link de pagamento"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Pode fechar esta janela sem problema — continuamos acompanhando seu pagamento e avisamos quando for aprovado.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkModalOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
