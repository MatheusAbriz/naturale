import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Heart, MessageCircle, Bookmark, Clock, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { getPostById, deletePost } from "@/services/PostService";
import { useToggleLike, useToggleFavorite } from "@/hooks/usePostMutations";
import { useAuth } from "@/stores/auth-store";
import { EmptyState } from "@/Components/common/empty-state";
import { Loader } from "@/Components/common/loader";
import { CommentsDialog } from "@/Components/comments/comments-dialog";
import { Button } from "@/Components/ui/button";

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
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <img src={data.image} alt={data.title} className="mb-4 h-80 w-full rounded-lg object-cover" />

      <div className="mb-3 flex items-start justify-between gap-2">
        <h1 className="text-2xl font-bold">{data.title}</h1>
        {isOwner && (
          <div className="flex shrink-0 gap-2">
            <Button size="icon" variant="outline" onClick={() => navigate(`/postForm/${data.postId}`)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}
      </div>

      <Link to={`/profile/${data.user?.id}`} className="mb-3 flex items-center gap-2">
        <img
          src={data.user?.avatar || FALLBACK_AVATAR}
          alt={data.user?.name}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold">{data.user?.name}</p>
          <p className="text-xs text-muted-foreground">@{data.user?.username}</p>
        </div>
      </Link>

      <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" /> {data.time}
      </div>

      <div className="mb-4 flex items-center justify-between border-y py-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => toggleLike({ postId: data.postId, isLiked: data.isLiked })}
            disabled={isLiking}
            className="flex items-center gap-1"
          >
            <Heart className={data.isLiked ? "h-5 w-5 fill-emerald-600 text-emerald-600" : "h-5 w-5"} />
            {data.likes_count}
          </button>
          <button onClick={() => setCommentsOpen(true)} className="flex items-center gap-1">
            <MessageCircle className="h-5 w-5" /> {data.commentCount ?? 0}
          </button>
        </div>
        <button
          onClick={() => toggleFavorite({ postId: data.postId, isFavorited: data.isFavorited })}
          disabled={isFavoriting}
        >
          <Bookmark className={data.isFavorited ? "h-5 w-5 fill-emerald-600 text-emerald-600" : "h-5 w-5"} />
        </button>
      </div>

      <h2 className="mb-1 font-semibold">Descrição</h2>
      <p className="mb-4 text-sm">{data.text}</p>

      {ingredients.length > 0 && (
        <>
          <h2 className="mb-1 font-semibold">Ingredientes</h2>
          <ul className="mb-4 list-disc pl-5 text-sm">
            {ingredients.map((ingredient, i) => (
              <li key={i}>{ingredient}</li>
            ))}
          </ul>
        </>
      )}

      <Button variant="outline" className="w-full" onClick={() => setCommentsOpen(true)}>
        Ver comentários ({data.commentCount ?? 0})
      </Button>

      <CommentsDialog postId={commentsOpen ? data.postId : null} onOpenChange={setCommentsOpen} />
    </div>
  );
}
