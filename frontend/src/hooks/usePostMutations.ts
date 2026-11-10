import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { insertLike, insertFavorite } from "@/services/PostService";
import { track } from "@/lib/analytics";

export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId }: { postId: number; isLiked: boolean }) => insertLike(postId),
    onSuccess: (_data, { isLiked }) => {
      track(isLiked ? "recipe_unliked" : "recipe_liked");
      toast.success(isLiked ? "Curtida removida." : "Receita curtida!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["favorite-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
    },
    onError: () => {
      toast.error("Erro ao curtir. Tente novamente.");
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId }: { postId: number; isFavorited: boolean }) => insertFavorite(postId),
    onSuccess: (_data, { isFavorited }) => {
      track(isFavorited ? "recipe_unfavorited" : "recipe_favorited");
      toast.success(isFavorited ? "Removido dos favoritos." : "Adicionado aos favoritos!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["favorite-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
    },
    onError: () => {
      toast.error("Erro ao favoritar. Tente novamente.");
    },
  });
}
