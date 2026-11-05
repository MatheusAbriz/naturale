import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Heart, MessageCircle, Bookmark, Clock, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { getPostById, deletePost } from "@/services/PostService";
import { useToggleLike, useToggleFavorite } from "@/hooks/usePostMutations";
import { useAuth } from "@/stores/auth-store";
import { EmptyState } from "@/Components/common/empty-state";
import { Loader } from "@/Components/common/loader";
import { CommentsDialog } from "@/Components/comments/comments-dialog";
import { Button } from "@/styles/buttons";
import {
  BackButton,
  CoverImage,
  TitleRow,
  PostTitle,
  OwnerActions,
  AuthorLink,
  Avatar,
  AuthorName,
  AuthorUsername,
  TimeRow,
  EngagementRow,
  EngagementGroup,
  EngagementButton,
  SectionTitle,
  SectionText,
  IngredientsList,
} from "./styles";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80";

export default function PostDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [commentsOpen, setCommentsOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["post", Number(id)],
    queryFn: async () => (await getPostById(Number(id))).data,
    enabled: !!id,
  });

  const { mutate: toggleLike, isPending: isLiking } = useToggleLike();
  const { mutate: toggleFavorite, isPending: isFavoriting } = useToggleFavorite();

  if (isLoading) return <Loader />;
  if (isError || !data) return <EmptyState title="Receita não encontrada" />;

  const isOwner = data.user?.id === user?.id;
  const ingredients = data.ingredients
    ? data.ingredients.split(",").map((i) => i.trim()).filter(Boolean)
    : [];

  async function handleDelete() {
    if (!window.confirm("Tem certeza que deseja excluir esta receita?")) return;
    try {
      await deletePost(data!.postId);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post excluído com sucesso!");
      navigate("/home");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao excluir post. Tente novamente.");
    }
  }

  return (
    <div>
      <BackButton onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Voltar
      </BackButton>

      <CoverImage src={data.image} alt={data.title} />

      <TitleRow>
        <PostTitle>{data.title}</PostTitle>
        {isOwner && (
          <OwnerActions>
            <Button $size="icon" $variant="outline" onClick={() => navigate(`/postForm/${data.postId}`)}>
              <Pencil size={16} />
            </Button>
            <Button $size="icon" $variant="outline" onClick={handleDelete}>
              <Trash2 size={16} color="#ef4444" />
            </Button>
          </OwnerActions>
        )}
      </TitleRow>

      <AuthorLink to={`/profile/${data.user?.id}`}>
        <Avatar src={data.user?.avatar || FALLBACK_AVATAR} alt={data.user?.name} />
        <div>
          <AuthorName>{data.user?.name}</AuthorName>
          <AuthorUsername>@{data.user?.username}</AuthorUsername>
        </div>
      </AuthorLink>

      <TimeRow>
        <Clock size={16} /> {data.time}
      </TimeRow>

      <EngagementRow>
        <EngagementGroup>
          <EngagementButton
            onClick={() => toggleLike({ postId: data.postId, isLiked: data.isLiked })}
            disabled={isLiking}
          >
            <Heart size={20} fill={data.isLiked ? "currentColor" : "none"} color={data.isLiked ? "#059669" : "currentColor"} />
            {data.likes_count}
          </EngagementButton>
          <EngagementButton onClick={() => setCommentsOpen(true)}>
            <MessageCircle size={20} /> {data.commentCount ?? 0}
          </EngagementButton>
        </EngagementGroup>
        <EngagementButton
          onClick={() => toggleFavorite({ postId: data.postId, isFavorited: data.isFavorited })}
          disabled={isFavoriting}
        >
          <Bookmark size={20} fill={data.isFavorited ? "currentColor" : "none"} color={data.isFavorited ? "#059669" : "currentColor"} />
        </EngagementButton>
      </EngagementRow>

      <SectionTitle>Descrição</SectionTitle>
      <SectionText>{data.text}</SectionText>

      {ingredients.length > 0 && (
        <>
          <SectionTitle>Ingredientes</SectionTitle>
          <IngredientsList>
            {ingredients.map((ingredient, i) => (
              <li key={i}>{ingredient}</li>
            ))}
          </IngredientsList>
        </>
      )}

      <Button $variant="outline" $fullWidth onClick={() => setCommentsOpen(true)}>
        Ver comentários ({data.commentCount ?? 0})
      </Button>

      <CommentsDialog postId={commentsOpen ? data.postId : null} onOpenChange={setCommentsOpen} />
    </div>
  );
}
