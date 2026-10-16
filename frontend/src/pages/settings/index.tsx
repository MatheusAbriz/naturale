import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Camera, LockKeyhole, Save, UserRound } from "lucide-react";
import { getMyProfile, updateAvatar, updateEmail, updateName, updatePassword, updatePhone, updateUsername } from "@/services/AuthService";
import { uploadImage } from "@/services/ImageService";
import { useAuth } from "@/stores/auth-store";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Loader } from "@/Components/common/loader";
import { formatMaskCellphone, isValidEmail, isValidPhone } from "@/utils/regexMasks";

type SettingsForm = { name: string; username: string; phone: string; email: string; avatar: string; password: string };

export default function Settings() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<SettingsForm>({ name: "", username: "", phone: "", email: "", avatar: "", password: "" });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: async () => (await getMyProfile(user!.id)).data,
    enabled: Boolean(user?.id),
  });

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
      if (form.name.trim() !== profile.name) tasks.push(updateName(user.id, form.name.trim()));
      if (form.username.trim() !== profile.username) tasks.push(updateUsername(user.id, form.username.trim()));
      if (form.phone.trim() !== profile.phone) tasks.push(updatePhone(user.id, form.phone.trim()));
      if (form.email.trim() !== profile.email) tasks.push(updateEmail(user.id, form.email.trim()));
      if (form.password) tasks.push(updatePassword(user.id, form.password));

      let finalAvatar = profile.avatar;
      if (avatarFile) {
        finalAvatar = await uploadImage(avatarFile, "usuarios");
        tasks.push(updateAvatar(user.id, finalAvatar));
      }
      await Promise.all(tasks);
      updateUser({ name: form.name.trim(), username: form.username.trim(), email: form.email.trim(), avatar: finalAvatar });
      setField("password", "");
      setAvatarFile(null);
      toast.success("Dados atualizados com sucesso.");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar as alterações. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <Loader />;

  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={() => navigate(-1)} className="mb-5 flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>
      <div className="mb-6">
        <p className="text-sm font-semibold text-primary">Sua conta</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Configurações do perfil</h1>
        <p className="mt-1 text-sm text-muted-foreground">Mantenha suas informações atualizadas e escolha como você aparece na comunidade.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="rounded-2xl border border-border/80 bg-white p-5 shadow-[0_8px_28px_rgba(39,73,58,0.06)] sm:p-6">
          <div className="mb-5 flex items-center gap-2"><UserRound className="h-5 w-5 text-primary" /><h2 className="font-extrabold">Informações públicas</h2></div>
          <div className="mb-6 flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
              {form.avatar ? <img src={form.avatar} alt="Seu avatar" className="h-full w-full object-cover" /> : <UserRound className="m-6 h-8 w-8 text-muted-foreground" />}
              <label className="absolute inset-x-0 bottom-0 flex cursor-pointer items-center justify-center bg-primary/85 py-1.5 text-white"><Camera className="h-4 w-4" /><input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} /></label>
            </div>
            <p className="text-sm leading-5 text-muted-foreground">Toque na câmera para trocar sua foto. Uma imagem quadrada funciona melhor.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-semibold">Nome<Input value={form.name} onChange={(event) => setField("name", event.target.value)} /></label>
            <label className="grid gap-1.5 text-sm font-semibold">Nome de usuário<Input value={form.username} onChange={(event) => setField("username", event.target.value)} /></label>
          </div>
        </section>

        <section className="rounded-2xl border border-border/80 bg-white p-5 shadow-[0_8px_28px_rgba(39,73,58,0.06)] sm:p-6">
          <h2 className="mb-5 font-extrabold">Dados cadastrais</h2>
          <div className="grid gap-4">
            <label className="grid gap-1.5 text-sm font-semibold">E-mail<Input type="email" inputMode="email" placeholder="voce@email.com" value={form.email} onChange={(event) => setField("email", event.target.value)} /></label>
            <label className="grid gap-1.5 text-sm font-semibold">Telefone<Input type="tel" inputMode="numeric" placeholder="(11) 99999-9999" value={form.phone} onChange={(event) => setField("phone", formatMaskCellphone(event.target.value))} /></label>
          </div>
        </section>

        <section className="rounded-2xl border border-border/80 bg-white p-5 shadow-[0_8px_28px_rgba(39,73,58,0.06)] sm:p-6">
          <div className="mb-2 flex items-center gap-2"><LockKeyhole className="h-5 w-5 text-primary" /><h2 className="font-extrabold">Segurança</h2></div>
          <p className="mb-4 text-sm text-muted-foreground">Deixe em branco se não quiser mudar sua senha agora.</p>
          <label className="grid gap-1.5 text-sm font-semibold">Nova senha<Input type="password" autoComplete="new-password" value={form.password} onChange={(event) => setField("password", event.target.value)} /></label>
        </section>

        <Button type="submit" size="lg" className="w-full" disabled={isSaving}>
          <Save className="h-4 w-4" /> {isSaving ? "Salvando alterações..." : "Salvar alterações"}
        </Button>
      </form>
    </div>
  );
}
