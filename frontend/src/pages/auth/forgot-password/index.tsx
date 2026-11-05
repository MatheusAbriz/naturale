import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { forgotPassword, resetPassword } from "@/services/AuthService";
import { Button } from "@/styles/buttons";
import { Input, Label, FieldGroup } from "@/styles/inputs";
import { AuthLayout } from "@/Components/auth/auth-layout";
import { isValidEmail } from "@/utils/regexMasks";
import { Text, MutedLink } from "@/styles/texts";
import recoveryHero from "@/assets/img/auth-recovery-hero.jpg";
import { Form, RetryButton } from "./styles";

type FormValues = {
  email: string;
  code: string;
  newPassword: string;
};

export default function ForgotPassword() {
  const { register, handleSubmit, getValues } = useForm<FormValues>();
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [sentToEmail, setSentToEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRequestCode() {
    const email = getValues("email");
    if (!email?.trim() || !isValidEmail(email)) return toast.error("Informe um e-mail válido.");

    try {
      setLoading(true);
      await forgotPassword(email);
      setSentToEmail(email);
      setStep("confirm");
      toast.success("Se o e-mail existir, um código foi enviado.");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao solicitar código. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmReset() {
    const { code, newPassword } = getValues();
    if (!code?.trim()) return toast.error("Informe o código recebido por e-mail.");
    if (!newPassword?.trim()) return toast.error("Informe a nova senha.");

    try {
      setLoading(true);
      await resetPassword(sentToEmail, code, newPassword);
      toast.success("Senha redefinida com sucesso! Faça login.");
      navigate("/login");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message ?? "Código inválido ou expirado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      image={recoveryHero}
      imageAlt="Chá de ervas em uma manhã tranquila"
      eyebrow="Vamos resolver isso"
      title={step === "request" ? "Recupere seu acesso." : "Crie uma nova senha."}
      description={step === "request" ? "Informe seu e-mail para receber as instruções de recuperação." : "Use o código enviado para concluir a redefinição com segurança."}
    >
      <Form $gap={20} onSubmit={handleSubmit(step === "request" ? handleRequestCode : handleConfirmReset)}>
        {step === "request" ? (
          <>
            <Text>
              Informe o e-mail da sua conta. Se ele existir, vamos enviar um código de 6 dígitos para
              redefinir sua senha.
            </Text>
            <FieldGroup>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" inputMode="email" placeholder="voce@email.com" {...register("email")} />
            </FieldGroup>
            <Button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar código"}
            </Button>
          </>
        ) : (
          <>
            <Text>Enviamos um código para {sentToEmail}. Digite-o abaixo junto com sua nova senha.</Text>
            <FieldGroup>
              <Label htmlFor="code">Código</Label>
              <Input id="code" maxLength={6} {...register("code")} />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="newPassword">Nova senha</Label>
              <Input id="newPassword" type="password" {...register("newPassword")} />
            </FieldGroup>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Redefinir senha"}
            </Button>
            <RetryButton type="button" onClick={() => setStep("request")}>
              Não recebeu o código? Tentar de novo
            </RetryButton>
          </>
        )}

        <MutedLink to="/login" style={{ textAlign: "center" }}>
          Voltar para o login
        </MutedLink>
      </Form>
    </AuthLayout>
  );
}
