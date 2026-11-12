import { useEffect, useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getComments, addComment } from "@/services/CommentService";
import { useAuth } from "@/stores/auth-store";
import { CommentItem } from "../comment-item";
import { MentionInput } from "@/Components/common/mention-input";
import { Dialog, DialogHeader, DialogTitle } from "@/styles/overlays";
import { Button } from "@/styles/buttons";
import { Loader } from "@/Components/common/loader";
import { track } from "@/lib/analytics";
import { adjustPostCommentCount } from "@/lib/postCommentCount";
import { StyledDialogContent, List, EmptyMessage, LoadMoreButton, ComposerForm } from "./styles";

type CommentsDialogProps = {
  postId: number | null;
  onOpenChange: (open: boolean) => void;
  highlightCommentId?: number | null;
};

export function CommentsDialog({ postId, onOpenChange, highlightCommentId }: CommentsDialogProps) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["comments", postId, highlightCommentId ? "deep-link" : "default"],
    queryFn: ({ pageParam = 1 }) =>
      highlightCommentId ? getComments(postId!, 1, true) : getComments(postId!, pageParam),
    enabled: postId !== null,
    initialPageParam: 1,
    getNextPageParam: (last) => {
      if (highlightCommentId) return undefined;
      const { page, totalPages } = last.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const comments = data?.pages.flatMap((p) => p.data.msg) ?? [];
  const mentions = Object.assign({}, ...(data?.pages.map((p) => p.data.mentions) ?? []));

  useEffect(() => {
    if (postId !== null) track("comments_opened");
  }, [postId]);

  useEffect(() => {
    if (!highlightCommentId || isLoading) return;

    const el = document.getElementById(`comment-${highlightCommentId}`);
    if (!el) {
      toast.error("Comentário não encontrado.");
      return;
    }

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.style.transition = "background-color 1.5s ease";
    el.style.backgroundColor = "#fef3c7";
    const timeout = setTimeout(() => {
      el.style.backgroundColor = "transparent";
    }, 1800);
    return () => clearTimeout(timeout);
  }, [highlightCommentId, isLoading, comments.length]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !postId || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment({ post_id: postId, user_id: user.id, comment_text: trimmed });
      setText("");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      adjustPostCommentCount(queryClient, postId, 1);
      track("comment_created");
      toast.success("Comentário publicado!");
    } catch (e) {
      console.error(e);
      track("comment_creation_failed");
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
          {isFetching && !isLoading && !isFetchingNextPage && <Loader size="sm" padY={8} />}
          {!isLoading && comments.length === 0 && <EmptyMessage>Seja o primeiro a comentar.</EmptyMessage>}
          {user &&
            comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} postId={postId!} currentUserId={user.id} mentions={mentions} />
            ))}
          {hasNextPage && (
            <LoadMoreButton onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              {isFetchingNextPage ? "Carregando..." : "Carregar mais comentários"}
            </LoadMoreButton>
          )}
        </List>

        <ComposerForm onSubmit={handleSubmit}>
          <MentionInput
            value={text}
            onChange={setText}
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
