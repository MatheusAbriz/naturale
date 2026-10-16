import { useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getComments, addComment } from "@/services/CommentService";
import { useAuth } from "@/stores/auth-store";
import { CommentItem } from "../comment-item";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Loader } from "@/Components/common/loader";

type CommentsDialogProps = {
  postId: number | null;
  onOpenChange: (open: boolean) => void;
};

export function CommentsDialog({ postId, onOpenChange }: CommentsDialogProps) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam = 1 }) => getComments(postId!, pageParam),
    enabled: postId !== null,
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const { page, totalPages } = last.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const comments = data?.pages.flatMap((p) => p.data.msg) ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !postId || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment({ post_id: postId, user_id: user.id, comment_text: trimmed });
      setText("");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("Comentário publicado!");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao comentar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={postId !== null} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col">
        <DialogHeader>
          <DialogTitle>Comentários</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {isLoading && <Loader size="sm" />}
          {!isLoading && comments.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">Seja o primeiro a comentar.</p>
          )}
          {user &&
            comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} postId={postId!} currentUserId={user.id} />
            ))}
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="mt-3 text-sm text-emerald-700 hover:underline"
            >
              {isFetchingNextPage ? "Carregando..." : "Carregar mais comentários"}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 border-t pt-3">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva um comentário..."
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
