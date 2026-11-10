import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Camera, CreditCard, LockKeyhole, Save, UserRound } from "lucide-react";
import { getMyProfile, updateAvatar, updateEmail, updateName, updatePassword, updatePhone, updateUsername } from "@/services/AuthService";
import { uploadImage } from "@/services/ImageService";
import { getMySubscription, cancelMySubscription } from "@/services/SubscriptionService";
import { useAuth } from "@/stores/auth-store";
import { PLANS, useSubscription } from "@/stores/subscription-store";
import { Button } from "@/styles/buttons";
import { Input } from "@/styles/inputs";
import { Loader } from "@/Components/common/loader";
import { formatMaskCellphone, isValidEmail, isValidPhone } from "@/utils/regexMasks";
import { track } from "@/lib/analytics";
import {
  Root,
  BackButton,
  Header,
  Eyebrow,
  Title,
  Description,
  SubscriptionSection,
  SectionHeaderRow,
  SectionHeading,
  SubscriptionRow,
  PlanName,
  PlanStatus,
  Form,
  Section,
  AvatarRow,
  AvatarWrap,
  AvatarImg,
  AvatarPlaceholder,
  CameraOverlay,
  HiddenFileInput,
  AvatarHint,
  FieldsGrid,
  FieldLabel,
  PasswordHint,
} from "./styles";

type SettingsForm = { name: string; username: string; phone: string; email: string; avatar: string; password: string };

export default function Settings() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SettingsForm>({ name: "", username: "", phone: "", email: "", avatar: "", password: "" });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: async () => (await getMyProfile(user!.id)).data,
    enabled: Boolean(user?.id),
  });

  const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ["my-subscription"],
    queryFn: async () => (await getMySubscription()).data,
    enabled: Boolean(user?.id),
  });

  async function handleCancelSubscription() {
    if (!window.confirm("Tem certeza que deseja cancelar sua assinatura? Você mantém o acesso até o fim do período já pago.")) return;
    setIsCanceling(true);
    try {
      const { data } = await cancelMySubscription();
      track("subscription_canceled");
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
      await useSubscription.getState().syncPlan();
    } catch (error: any) {
      console.error(error);
      track("subscription_cancellation_failed");
      toast.error(error?.response?.data?.message ?? "Não foi possível cancelar agora. Tente novamente.");
    } finally {
      setIsCanceling(false);
    }
  }

  useEffect(() => {
    if (!profile) return;
    setForm({ name: profile.name ?? "", username: profile.username ?? "", phone: profile.phone ?? "", email: profile.email ?? "", avatar: profile.avatar ?? "", password: "" });
  }, [profile]);

  function setField(field: keyof SettingsForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setField("avatar", URL.createObjectURL(file));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user || !profile) return;
    if (!form.name.trim() || !form.username.trim() || !isValidEmail(form.email)) {
      toast.error("Informe nome, nome de usuário e um e-mail válido.");
      return;
    }
    if (form.phone && !isValidPhone(form.phone)) {
      toast.error("Informe um telefone válido com DDD.");
      return;
    }
    if (form.password && form.password.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsSaving(true);
    try {
      const tasks: Promise<unknown>[] = [];
      const updatedFields: string[] = [];
      if (form.name.trim() !== profile.name) { tasks.push(updateName(user.id, form.name.trim())); updatedFields.push("name"); }
      if (form.username.trim() !== profile.username) { tasks.push(updateUsername(user.id, form.username.trim())); updatedFields.push("username"); }
      if (form.phone.trim() !== profile.phone) { tasks.push(updatePhone(user.id, form.phone.trim())); updatedFields.push("phone"); }
      if (form.email.trim() !== profile.email) { tasks.push(updateEmail(user.id, form.email.trim())); updatedFields.push("email"); }
      if (form.password) { tasks.push(updatePassword(user.id, form.password)); updatedFields.push("password"); }

      let finalAvatar = profile.avatar;
      if (avatarFile) {
        finalAvatar = await uploadImage(avatarFile, "usuarios");
        tasks.push(updateAvatar(user.id, finalAvatar));
        updatedFields.push("avatar");
      }
      await Promise.all(tasks);
      updateUser({ name: form.name.trim(), username: form.username.trim(), email: form.email.trim(), avatar: finalAvatar });
      setField("password", "");
      setAvatarFile(null);
      track("profile_settings_updated", { changed_fields: updatedFields.join(",") || "none", changed_field_count: updatedFields.length });
      toast.success("Dados atualizados com sucesso.");
    } catch (error) {
      console.error(error);
      track("profile_settings_update_failed");
      toast.error("Não foi possível salvar as alterações. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <Loader />;

  return (
    <Root>
      <BackButton onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Voltar
      </BackButton>
      <Header>
        <Eyebrow>Sua conta</Eyebrow>
        <Title>Configurações do perfil</Title>
        <Description>Mantenha suas informações atualizadas e escolha como você aparece na comunidade.</Description>
      </Header>

      <SubscriptionSection>
        <SectionHeaderRow $mb={16}>
          <CreditCard size={20} color="#2f6b54" />
          <SectionHeading>Sua assinatura</SectionHeading>
        </SectionHeaderRow>
        {isLoadingSubscription ? (
          <Loader size="sm" />
        ) : (
          <SubscriptionRow>
            <div>
              <PlanName>{PLANS[subscription?.effectivePlan ?? "essential"].name}</PlanName>
              {subscription?.status === "active" && subscription.currentPeriodEnd && (
                <PlanStatus>Renova em {new Date(subscription.currentPeriodEnd).toLocaleDateString("pt-BR")}</PlanStatus>
              )}
              {subscription?.status === "canceled" && subscription.currentPeriodEnd && (
                <PlanStatus>Cancelada — acesso até {new Date(subscription.currentPeriodEnd).toLocaleDateString("pt-BR")}</PlanStatus>
              )}
              {(!subscription || subscription.effectivePlan === "essential") && <PlanStatus>Você está no plano gratuito.</PlanStatus>}
            </div>
            {subscription?.status === "active" ? (
              <Button $variant="outline" onClick={handleCancelSubscription} disabled={isCanceling}>
                {isCanceling ? "Cancelando..." : "Cancelar assinatura"}
              </Button>
            ) : (
              <Button $variant="outline" onClick={() => navigate("/plans")}>Ver planos</Button>
            )}
          </SubscriptionRow>
        )}
      </SubscriptionSection>

      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionHeaderRow>
            <UserRound size={20} color="#2f6b54" />
            <SectionHeading>Informações públicas</SectionHeading>
          </SectionHeaderRow>
          <AvatarRow>
            <AvatarWrap>
              {form.avatar ? <AvatarImg src={form.avatar} alt="Seu avatar" /> : <AvatarPlaceholder />}
              <CameraOverlay>
                <Camera size={16} />
                <HiddenFileInput type="file" accept="image/*" onChange={handleAvatarChange} />
              </CameraOverlay>
            </AvatarWrap>
            <AvatarHint>Toque na câmera para trocar sua foto. Uma imagem quadrada funciona melhor.</AvatarHint>
          </AvatarRow>
          <FieldsGrid>
            <FieldLabel>Nome<Input value={form.name} onChange={(event) => setField("name", event.target.value)} /></FieldLabel>
            <FieldLabel>Nome de usuário<Input value={form.username} onChange={(event) => setField("username", event.target.value)} /></FieldLabel>
          </FieldsGrid>
        </Section>

        <Section>
          <SectionHeading style={{ marginBottom: 20 }}>Dados cadastrais</SectionHeading>
          <FieldsGrid style={{ gridTemplateColumns: "1fr" }}>
            <FieldLabel>E-mail<Input type="email" inputMode="email" placeholder="voce@email.com" value={form.email} onChange={(event) => setField("email", event.target.value)} /></FieldLabel>
            <FieldLabel>Telefone<Input type="tel" inputMode="numeric" placeholder="(11) 99999-9999" value={form.phone} onChange={(event) => setField("phone", formatMaskCellphone(event.target.value))} /></FieldLabel>
          </FieldsGrid>
        </Section>

        <Section>
          <SectionHeaderRow $mb={8}>
            <LockKeyhole size={20} color="#2f6b54" />
            <SectionHeading>Segurança</SectionHeading>
          </SectionHeaderRow>
          <PasswordHint>Deixe em branco se não quiser mudar sua senha agora.</PasswordHint>
          <FieldLabel>Nova senha<Input type="password" autoComplete="new-password" value={form.password} onChange={(event) => setField("password", event.target.value)} /></FieldLabel>
        </Section>

        <Button type="submit" $size="lg" $fullWidth disabled={isSaving}>
          <Save size={16} /> {isSaving ? "Salvando alterações..." : "Salvar alterações"}
        </Button>
      </Form>
    </Root>
  );
}
