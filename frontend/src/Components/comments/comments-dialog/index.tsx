import { useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getComments, addComment } from "@/services/CommentService";
import { useAuth } from "@/stores/auth-store";
import { CommentItem } from "../comment-item";
import { Dialog, DialogHeader, DialogTitle } from "@/styles/overlays";
import { Input } from "@/styles/inputs";
import { Button } from "@/styles/buttons";
import { Loader } from "@/Components/common/loader";
import { StyledDialogContent, List, EmptyMessage, LoadMoreButton, ComposerForm } from "./styles";

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
      <StyledDialogContent>
        <DialogHeader>
          <DialogTitle>Comentários</DialogTitle>
        </DialogHeader>

        <List>
          {isLoading && <Loader size="sm" />}
          {!isLoading && comments.length === 0 && <EmptyMessage>Seja o primeiro a comentar.</EmptyMessage>}
          {user &&
            comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} postId={postId!} currentUserId={user.id} />
            ))}
          {hasNextPage && (
            <LoadMoreButton onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              {isFetchingNextPage ? "Carregando..." : "Carregar mais comentários"}
            </LoadMoreButton>
          )}
        </List>

        <ComposerForm onSubmit={handleSubmit}>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva um comentário..."
            disabled={isSubmitting}
          />
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </ComposerForm>
      </StyledDialogContent>
    </Dialog>
  );
}
