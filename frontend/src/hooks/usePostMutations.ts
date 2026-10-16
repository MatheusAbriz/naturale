import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { insertLike, insertFavorite } from "@/services/PostService";

export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId }: { postId: number; isLiked: boolean }) => insertLike(postId),
    onSuccess: (_data, { isLiked }) => {
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
