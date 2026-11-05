import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, CheckCheck, Copy, Crown, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/styles/buttons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/styles/overlays";
import { API } from "@/services/api";
import { PLANS, type PlanId, useSubscription } from "@/stores/subscription-store";
import {
  Page,
  Hero,
  HeroBadge,
  HeroTitle,
  HeroText,
  PendingBanner,
  PendingLeft,
  PendingTitle,
  PendingSubtitle,
  PendingRight,
  DismissButton,
  SpinningIcon,
  PlansGrid,
  PlanArticle,
  DeluxeBadge,
  PlanHeaderRow,
  PlanName,
  PlanDescription,
  CurrentBadge,
  PlanPrice,
  FeaturesList,
  FeatureItem,
  FooterNote,
  DialogInfoBox,
  DialogInfoPrice,
  DialogInfoText,
  LinkBox,
  LinkInput,
  DialogFooterNote,
} from "./styles";

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
    <Page>
      <Hero>
        <HeroBadge>Planos Naturale</HeroBadge>
        <HeroTitle>Escolha o jeito que combina com a sua rotina.</HeroTitle>
        <HeroText>Comece gratuitamente e evolua quando quiser mais organização, personalização e apoio na cozinha.</HeroText>
      </Hero>

      {pendingCheckout && (
        <PendingBanner>
          <PendingLeft>
            <SpinningIcon size={20} color="#694a2e" />
            <div>
              <PendingTitle>Pagamento do plano {PLANS[pendingCheckout.plan].name} em andamento</PendingTitle>
              <PendingSubtitle>Assim que o Mercado Pago aprovar, seu plano é atualizado automaticamente.</PendingSubtitle>
            </div>
          </PendingLeft>
          <PendingRight>
            <Button $size="sm" $variant="outline" onClick={() => setLinkModalOpen(true)}>Ver link</Button>
            <DismissButton onClick={dismissPendingCheckout} aria-label="Dispensar">
              <X size={16} />
            </DismissButton>
          </PendingRight>
        </PendingBanner>
      )}

      <PlansGrid>
        {planOrder.map((planId) => {
          const plan = PLANS[planId];
          const isCurrent = currentPlan === planId;
          const isDeluxe = planId === "deluxe";
          return (
            <PlanArticle key={plan.id} $deluxe={isDeluxe}>
              {isDeluxe && <DeluxeBadge><Crown size={14} /> Mais completo</DeluxeBadge>}
              <PlanHeaderRow>
                <div>
                  <PlanName>{plan.name}</PlanName>
                  <PlanDescription>{plan.description}</PlanDescription>
                </div>
                {isCurrent && <CurrentBadge>Seu plano</CurrentBadge>}
              </PlanHeaderRow>
              <PlanPrice>{plan.price}</PlanPrice>
              <FeaturesList>
                {plan.features.map((feature) => (
                  <FeatureItem key={feature}>
                    <Check size={16} style={{ marginTop: 2, flexShrink: 0 }} color="#2f6b54" />
                    {feature}
                  </FeatureItem>
                ))}
              </FeaturesList>
              <Button
                $variant={isCurrent ? "outline" : isDeluxe ? "default" : "secondary"}
                $fullWidth
                style={{ marginTop: 28 }}
                disabled={isCurrent}
                onClick={() => selectPlan(planId)}
              >
                {isCurrent ? "Plano atual" : planId === "essential" ? "Usar plano Essencial" : `Escolher ${plan.name}`}
              </Button>
            </PlanArticle>
          );
        })}
      </PlansGrid>

      <FooterNote>Pagamento processado com segurança pelo Mercado Pago. Aceitamos cartão de crédito.</FooterNote>

      <Dialog open={Boolean(selectedPlan)} onOpenChange={(open) => !open && closeConfirmDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar plano {selectedPlan ? PLANS[selectedPlan].name : ""}</DialogTitle>
            <DialogDescription>Você vai receber um link de pagamento seguro do Mercado Pago para concluir a assinatura.</DialogDescription>
          </DialogHeader>
          <DialogInfoBox>
            <DialogInfoPrice>{selectedPlan && PLANS[selectedPlan].price}</DialogInfoPrice>
            <DialogInfoText>Nenhum dado do seu cartão passa pelo Naturale — o Mercado Pago processa tudo por nós.</DialogInfoText>
          </DialogInfoBox>
          <DialogFooter>
            <Button $variant="outline" disabled={isCreatingLink} onClick={closeConfirmDialog}>Cancelar</Button>
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
          <LinkBox>
            <LinkInput
              readOnly
              value={pendingCheckout?.link ?? ""}
              onFocus={(event) => event.currentTarget.select()}
            />
          </LinkBox>
          <Button onClick={copyPaymentLink} $fullWidth>
            {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
            {copied ? "Link copiado!" : "Copiar link de pagamento"}
          </Button>
          <DialogFooterNote>
            Pode fechar esta janela sem problema — continuamos acompanhando seu pagamento e avisamos quando for aprovado.
          </DialogFooterNote>
          <DialogFooter>
            <Button $variant="outline" onClick={() => setLinkModalOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  );
}
