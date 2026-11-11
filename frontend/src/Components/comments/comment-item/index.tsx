import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CommentDTO } from "@/types/comments";
import {
  addReply,
  editComment,
  editReply,
  deleteComment,
  deleteReply,
} from "@/services/CommentService";
import { Button } from "@/styles/buttons";
import { track } from "@/lib/analytics";
import {
  SmallInput,
  Wrap,
  Row,
  Avatar,
  Content,
  Meta,
  Name,
  Username,
  TimeAgo,
  CommentText,
  EditRow,
  ActionsRow,
  ActionLink,
  ReplyRow,
} from "./styles";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80";

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

type CommentItemProps = {
  comment: CommentDTO;
  postId: number;
  currentUserId: number;
  level?: number;
};

export function CommentItem({ comment, postId, currentUserId, level = 0 }: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const queryClient = useQueryClient();

  const isOwner = comment.user_id === currentUserId;
  const isReply = comment.parent_comment_id !== null;
  const replies = comment.replies ?? [];

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["comments"] });
  }

  async function handleReplySubmit() {
    const trimmed = replyText.trim();
    if (!trimmed) return;
    try {
      await addReply({
        post_id: postId,
        user_id: currentUserId,
        comment_text: trimmed,
        parent_comment_id: comment.id,
      });
      setReplyText("");
      setShowReplyInput(false);
      invalidate();
      track("comment_reply_created");
    } catch (e) {
      console.error(e);
      track("comment_reply_creation_failed");
      toast.error("Erro ao responder. Tente novamente.");
    }
  }

  async function handleEditSubmit() {
    const trimmed = editText.trim();
    if (!trimmed) return;
    try {
      if (isReply) await editReply(comment.id, trimmed);
      else await editComment(comment.id, trimmed);
      setIsEditing(false);
      invalidate();
      track(isReply ? "comment_reply_updated" : "comment_updated");
    } catch (e) {
      console.error(e);
      track(isReply ? "comment_reply_update_failed" : "comment_update_failed");
      toast.error("Erro ao editar. Tente novamente.");
    }
  }

  async function handleDelete() {
    if (!window.confirm(isReply ? "Excluir resposta?" : "Excluir comentário?")) return;
    try {
      if (isReply) await deleteReply(comment.id);
      else await deleteComment(comment.id);
      invalidate();
      track(isReply ? "comment_reply_deleted" : "comment_deleted");
    } catch (e) {
      console.error(e);
      track(isReply ? "comment_reply_deletion_failed" : "comment_deletion_failed");
      toast.error("Erro ao excluir. Tente novamente.");
    }
  }

  return (
    <Wrap $level={level} id={`comment-${comment.id}`}>
      <Row>
        <Avatar src={comment.avatar || FALLBACK_AVATAR} alt={comment.username} />
        <Content>
          <Meta>
            <Name>{comment.name}</Name>
            <Username>@{comment.username}</Username>
            {comment.created_at && <TimeAgo>· {formatRelativeTime(comment.created_at)}</TimeAgo>}
          </Meta>

          {isEditing ? (
            <EditRow>
              <SmallInput value={editText} onChange={(e) => setEditText(e.target.value)} />
              <Button $size="sm" onClick={handleEditSubmit}>Salvar</Button>
              <Button $variant="ghost" $size="sm" onClick={() => setIsEditing(false)}>Cancelar</Button>
            </EditRow>
          ) : (
            <CommentText>{comment.text}</CommentText>
          )}

          <ActionsRow>
            <ActionLink onClick={() => setShowReplyInput((v) => !v)}>Responder</ActionLink>
            {isOwner && !isEditing && (
              <>
                <ActionLink onClick={() => setIsEditing(true)}>Editar</ActionLink>
                <ActionLink $danger onClick={handleDelete}>Excluir</ActionLink>
              </>
            )}
          </ActionsRow>

          {showReplyInput && (
            <ReplyRow>
              <SmallInput
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Respondendo a @${comment.username}...`}
              />
              <Button $size="sm" onClick={handleReplySubmit}>Enviar</Button>
            </ReplyRow>
          )}
        </Content>
      </Row>

      {replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} postId={postId} currentUserId={currentUserId} level={level + 1} />
      ))}
    </Wrap>
  );
}
