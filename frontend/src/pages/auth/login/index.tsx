import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login } from "@/services/AuthService";
import { useAuth } from "@/stores/auth-store";
import type { User } from "@/types/auth";
import { Button } from "@/styles/buttons";
import { Input, Label, FieldGroup } from "@/styles/inputs";
import { AuthLayout } from "@/Components/auth/auth-layout";
import { isValidEmail } from "@/utils/regexMasks";
import { Muted, StyledLink } from "@/styles/texts";
import loginHero from "@/assets/img/auth-login-hero.jpg";
import { Form, ForgotLink } from "./styles";

type FormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const signIn = useAuth((state) => state.signIn);
  const navigate = useNavigate();

  async function onSubmit(values: FormValues) {
    if (!values.email || !isValidEmail(values.email) || !values.password) {
      toast.error("Preencha os campos corretamente!");
      return;
    }

    try {
      setLoading(true);
      const res = await login(values);
      const payload: User = {
        ...(res.data as User),
        role: (res.data as any)?.type,
      };
      await signIn(payload);
      toast.success("Login realizado com sucesso, seja bem-vindo!");
      navigate("/home");
    } catch (e) {
      console.error(e);
      toast.error("Login inválido!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      image={loginHero}
      imageAlt="Café da manhã saudável com frutas frescas"
      eyebrow="Que bom ter você de volta"
      title="Entre no seu ritmo."
      description="Acesse suas receitas favoritas e acompanhe a comunidade Naturale."
    >
      <Form $gap={20} onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="exemplo@gmail.com" {...register("email")} />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" placeholder="******" {...register("password")} />
        </FieldGroup>

        <ForgotLink to="/forgot-password">Esqueci minha senha</ForgotLink>

        <Button type="submit" disabled={loading} $fullWidth>
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        <Muted style={{ textAlign: "center" }}>
          Não tem uma conta? <StyledLink to="/register">Cadastre-se</StyledLink>
        </Muted>
      </Form>
    </AuthLayout>
  );
}
