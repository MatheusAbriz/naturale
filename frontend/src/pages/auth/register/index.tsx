import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { register as registerUser } from "@/services/AuthService";
import { uploadImage } from "@/services/ImageService";
import { useAuth } from "@/stores/auth-store";
import type { User, UserDTO } from "@/types/auth";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { AuthLayout } from "@/Components/auth/auth-layout";
import { formatMaskCPF, formatMaskCellphone, isValidCPF, isValidEmail, isValidPhone } from "@/utils/regexMasks";
import registerHero from "@/assets/img/auth-register-hero.jpg";

type FormValues = {
  name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  cpf: string;
};

export default function Register() {
  const { register, handleSubmit, setValue } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const signIn = useAuth((state) => state.signIn);
  const navigate = useNavigate();

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function onSubmit(values: FormValues) {
    if (!values.name?.trim()) return toast.error("Informe seu nome.");
    if (!values.email?.trim() || !isValidEmail(values.email)) return toast.error("Informe um e-mail válido.");
    if (!values.password?.trim()) return toast.error("Informe uma senha.");
    if (!isValidPhone(values.phone)) return toast.error("Informe um telefone válido com DDD.");
    if (!isValidCPF(values.cpf)) return toast.error("Informe um CPF válido.");

    try {
      setLoading(true);
      const avatarUrl = avatarFile ? await uploadImage(avatarFile, "usuarios") : "";

      const payload: UserDTO = {
        name: values.name,
        username: values.username,
        phone: values.phone,
        cpf: values.cpf,
        email: values.email,
        password: values.password,
        type: "USER",
        avatar: avatarUrl,
      };

      const res = await registerUser(payload);
      const user: User = {
        ...(res.data as User),
        role: (res.data as any)?.type,
      };

      await signIn(user);
      toast.success("Cadastro realizado com sucesso!");
      navigate("/home");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data ?? "Erro ao realizar cadastro.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      image={registerHero}
      imageAlt="Preparo de uma salada saudável com ingredientes frescos"
      eyebrow="Faça parte da comunidade"
      title="Crie a sua conta."
      description="Registre receitas, salve inspirações e compartilhe uma rotina mais saudável."
    >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2">
              <label htmlFor="avatar" className="cursor-pointer">
                <div className="h-20 w-20 overflow-hidden rounded-full border bg-muted">
                  {avatarPreview ? <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-xs text-muted-foreground">Foto</span>}
                </div>
              </label>
              <input id="avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input id="name" placeholder="Como quer ser chamado(a)?" {...register("name")} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Nome de usuário</Label>
              <Input id="username" placeholder="Ex.: receita.da.ana" {...register("username")} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input id="email" type="email" inputMode="email" placeholder="voce@email.com" {...register("email")} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Senha *</Label>
              <Input id="password" type="password" placeholder="Crie uma senha segura" {...register("password")} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                inputMode="numeric"
                placeholder="(11) 99999-9999"
                {...register("phone")}
                onChange={(event) => setValue("phone", formatMaskCellphone(event.target.value))}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                inputMode="numeric"
                placeholder="000.000.000-00"
                {...register("cpf")}
                onChange={(event) => setValue("cpf", formatMaskCPF(event.target.value))}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Cadastrando..." : "Criar conta"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Fazer login
              </Link>
            </p>
          </form>
    </AuthLayout>
  );
}
