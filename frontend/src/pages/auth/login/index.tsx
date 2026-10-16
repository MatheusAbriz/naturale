import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login } from "@/services/AuthService";
import { useAuth } from "@/stores/auth-store";
import type { User } from "@/types/auth";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { AuthLayout } from "@/Components/auth/auth-layout";
import { isValidEmail } from "@/utils/regexMasks";
import loginHero from "@/assets/img/auth-login-hero.jpg";

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
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="exemplo@gmail.com" {...register("email")} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="******" {...register("password")} />
            </div>

            <Link to="/forgot-password" className="text-right text-sm font-semibold text-primary hover:underline">
              Esqueci minha senha
            </Link>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>
          </form>
    </AuthLayout>
  );
}
