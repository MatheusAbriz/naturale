import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { getPostById, createPost, updatePost } from "@/services/PostService";
import { uploadImage } from "@/services/ImageService";
import { useAuth } from "@/stores/auth-store";
import { Button } from "@/styles/buttons";
import { Input, Textarea } from "@/styles/inputs";
import { Loader } from "@/Components/common/loader";
import { track } from "@/lib/analytics";
import {
  BackButton,
  Header,
  Eyebrow,
  Title,
  Form,
  ImagePicker,
  PreviewImg,
  ImageBadge,
  HiddenFileInput,
  NutritionGrid,
  NutritionHint,
} from "./styles";

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
  const [calories, setCalories] = useState("");
  const [proteinG, setProteinG] = useState("");
  const [carbsG, setCarbsG] = useState("");
  const [fatG, setFatG] = useState("");
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
        setCalories(data.calories != null ? String(data.calories) : "");
        setProteinG(data.protein_g != null ? String(data.protein_g) : "");
        setCarbsG(data.carbs_g != null ? String(data.carbs_g) : "");
        setFatG(data.fat_g != null ? String(data.fat_g) : "");
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
      const nutrition = {
        calories: calories.trim() ? Number(calories) : null,
        protein_g: proteinG.trim() ? Number(proteinG) : null,
        carbs_g: carbsG.trim() ? Number(carbsG) : null,
        fat_g: fatG.trim() ? Number(fatG) : null,
      };

      if (isEditMode) {
        await updatePost(Number(postId), { title, text, ingredients, image: imageUrl, time, ...nutrition });
        track("recipe_updated", { has_new_image: Boolean(imageFile) });
        toast.success("Receita atualizada com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["post", Number(postId)] });
      } else {
        await createPost({ userId: user.id, title, text, ingredients, image: imageUrl, time, status: true, ...nutrition });
        track("recipe_created", { has_image: true });
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
      <BackButton onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Voltar
      </BackButton>

      <Header>
        <Eyebrow>Sua cozinha</Eyebrow>
        <Title>{isEditMode ? "Editar receita" : "Compartilhe uma receita"}</Title>
      </Header>

      <Form onSubmit={handleSubmit}>
        <ImagePicker>
          <PreviewImg src={imagePreview || FALLBACK_IMAGE} alt="Pré-visualização" />
          <ImageBadge>
            <ImagePlus size={20} />
          </ImageBadge>
          <HiddenFileInput type="file" accept="image/*" onChange={handleFileChange} />
        </ImagePicker>

        <Input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input placeholder="Tempo de preparo (ex: 30 min)" value={time} onChange={(e) => setTime(e.target.value)} />
        <Textarea
          $minHeight={96}
          placeholder="Ingredientes (separados por vírgula)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <Textarea
          $minHeight={144}
          placeholder="Modo de preparo"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <NutritionGrid>
          <Input type="number" min="0" placeholder="Calorias (kcal)" value={calories} onChange={(e) => setCalories(e.target.value)} />
          <Input type="number" min="0" step="0.1" placeholder="Proteína (g)" value={proteinG} onChange={(e) => setProteinG(e.target.value)} />
          <Input type="number" min="0" step="0.1" placeholder="Carboidrato (g)" value={carbsG} onChange={(e) => setCarbsG(e.target.value)} />
          <Input type="number" min="0" step="0.1" placeholder="Gordura (g)" value={fatG} onChange={(e) => setFatG(e.target.value)} />
        </NutritionGrid>
        <NutritionHint>Informação nutricional (opcional) — só aparece pra quem vê a receita com o plano Deluxe.</NutritionHint>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : isEditMode ? "Salvar alterações" : "Publicar"}
        </Button>
      </Form>
    </div>
  );
}
