import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { getPostById, createPost, updatePost } from "@/services/PostService";
import { uploadImage } from "@/services/ImageService";
import { useAuth } from "@/stores/auth-store";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Loader } from "@/Components/common/loader";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80";

export default function PostForm() {
  const { postId } = useParams<{ postId: string }>();
  const isEditMode = !!postId;
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [time, setTime] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;
    (async () => {
      try {
        const { data } = await getPostById(Number(postId));
        setTitle(data.title);
        setText(data.text);
        setIngredients(data.ingredients);
        setTime(data.time);
        setImagePreview(data.image);
      } catch (e) {
        console.error(e);
        toast.error("Erro ao carregar receita.");
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isEditMode, postId, navigate]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !text.trim() || !ingredients.trim() || !time.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }
    if (!isEditMode && !imageFile) {
      toast.error("Selecione uma imagem para a receita.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Só reenviamos a imagem se o usuário trocou o arquivo; na edição, sem
      // novo arquivo, reaproveitamos a URL já existente.
      const imageUrl = imageFile ? await uploadImage(imageFile, "posts") : imagePreview;

      if (isEditMode) {
        await updatePost(Number(postId), { title, text, ingredients, image: imageUrl, time });
        toast.success("Receita atualizada com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["post", Number(postId)] });
      } else {
        await createPost({ userId: user.id, title, text, ingredients, image: imageUrl, time, status: true });
        toast.success("Receita publicada com sucesso!");
      }

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate(isEditMode ? `/post/${postId}` : "/home");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar receita. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <Loader />;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <div className="mb-5">
        <p className="text-sm font-semibold text-primary">Sua cozinha</p>
        <h1 className="mt-1 text-xl font-extrabold tracking-tight">{isEditMode ? "Editar receita" : "Compartilhe uma receita"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="relative flex h-56 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-primary/35 bg-muted">
          <img src={imagePreview || FALLBACK_IMAGE} alt="Pré-visualização" className="h-full w-full object-cover" />
          <div className="absolute bottom-3 right-3 rounded-xl bg-white p-2.5 text-primary shadow">
            <ImagePlus className="h-5 w-5" />
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>

        <Input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input placeholder="Tempo de preparo (ex: 30 min)" value={time} onChange={(e) => setTime(e.target.value)} />
        <textarea
          placeholder="Ingredientes (separados por vírgula)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="min-h-24 rounded-xl border border-input bg-white px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
        />
        <textarea
          placeholder="Modo de preparo"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-36 rounded-xl border border-input bg-white px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : isEditMode ? "Salvar alterações" : "Publicar"}
        </Button>
      </form>
    </div>
  );
}
