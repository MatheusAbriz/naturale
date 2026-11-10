import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { register as registerUser, updateAvatar } from "@/services/AuthService";
import { uploadImage } from "@/services/ImageService";
import { useAuth } from "@/stores/auth-store";
import type { User, UserDTO } from "@/types/auth";
import { Button } from "@/styles/buttons";
import { Input, Label, FieldGroup } from "@/styles/inputs";
import { AuthLayout } from "@/Components/auth/auth-layout";
import { formatMaskCPF, formatMaskCellphone, isValidCPF, isValidEmail, isValidPhone } from "@/utils/regexMasks";
import { identifyUser, track } from "@/lib/analytics";
import registerHero from "@/assets/img/auth-register-hero.jpg";
import { Muted, StyledLink } from "@/styles/texts";
import { Form, Column, AvatarPicker, AvatarCircle, AvatarImg, AvatarPlaceholder, HiddenFileInput } from "./styles";

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
  const updateUser = useAuth((state) => state.updateUser);
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

      // A imagem só pode ser enviada depois que o usuário existir e tivermos um
      // token (o endpoint de imagens é protegido): cria a conta primeiro, com
      // avatar vazio, e só então envia a foto escolhida.
      const payload: UserDTO = {
        name: values.name,
        username: values.username,
        phone: values.phone,
        cpf: values.cpf,
        email: values.email,
        password: values.password,
        type: "USER",
        avatar: "",
      };

      const res = await registerUser(payload);
      const user: User = {
        ...(res.data as User),
        role: (res.data as any)?.type,
      };

      await signIn(user);

      if (avatarFile) {
        try {
          const avatarUrl = await uploadImage(avatarFile, "usuarios");
          await updateAvatar(user.id, avatarUrl);
          updateUser({ avatar: avatarUrl });
        } catch (avatarError) {
          console.error("Falha ao enviar avatar no cadastro:", avatarError);
          toast.error("Conta criada, mas não foi possível enviar sua foto. Você pode adicionar depois em Configurações.");
        }
      }

      identifyUser(user);
      track("signup_completed", { has_avatar: Boolean(avatarFile) });
      toast.success("Cadastro realizado com sucesso!");
      navigate("/home");
    } catch (e: any) {
      console.error(e);
      track("signup_failed", { has_avatar: Boolean(avatarFile) });
      toast.error(e?.response?.data?.message ?? "Erro ao realizar cadastro.");
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
      <Form $gap={16} onSubmit={handleSubmit(onSubmit)}>
        <Column $gap={8} style={{ alignItems: "center" }}>
          <AvatarPicker htmlFor="avatar">
            <AvatarCircle>
              {avatarPreview ? <AvatarImg src={avatarPreview} alt="Avatar" /> : <AvatarPlaceholder>Foto</AvatarPlaceholder>}
            </AvatarCircle>
          </AvatarPicker>
          <HiddenFileInput id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} />
        </Column>

        <FieldGroup>
          <Label htmlFor="name">Nome completo *</Label>
          <Input id="name" placeholder="Como quer ser chamado(a)?" {...register("name")} />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="username">Nome de usuário</Label>
          <Input id="username" placeholder="Ex.: receita.da.ana" {...register("username")} />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="email">E-mail *</Label>
          <Input id="email" type="email" inputMode="email" placeholder="voce@email.com" {...register("email")} />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="password">Senha *</Label>
          <Input id="password" type="password" placeholder="Crie uma senha segura" {...register("password")} />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            inputMode="numeric"
            placeholder="(11) 99999-9999"
            {...register("phone")}
            onChange={(event) => setValue("phone", formatMaskCellphone(event.target.value))}
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            inputMode="numeric"
            placeholder="000.000.000-00"
            {...register("cpf")}
            onChange={(event) => setValue("cpf", formatMaskCPF(event.target.value))}
          />
        </FieldGroup>

        <Button type="submit" disabled={loading} $fullWidth>
          {loading ? "Cadastrando..." : "Criar conta"}
        </Button>

        <Muted style={{ textAlign: "center" }}>
          Já tem uma conta? <StyledLink to="/login">Fazer login</StyledLink>
        </Muted>
      </Form>
    </AuthLayout>
  );
}
