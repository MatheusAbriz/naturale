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
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";

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
    } catch (e) {
      console.error(e);
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
    } catch (e) {
      console.error(e);
      toast.error("Erro ao editar. Tente novamente.");
    }
  }

  async function handleDelete() {
    if (!window.confirm(isReply ? "Excluir resposta?" : "Excluir comentário?")) return;
    try {
      if (isReply) await deleteReply(comment.id);
      else await deleteComment(comment.id);
      invalidate();
    } catch (e) {
      console.error(e);
      toast.error("Erro ao excluir. Tente novamente.");
    }
  }

  return (
    <div style={{ marginLeft: Math.min(level, 2) * 20 }} className="mt-3">
      <div className="flex items-start gap-2">
        <img src={comment.avatar || FALLBACK_AVATAR} alt={comment.username} className="h-8 w-8 rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-semibold">{comment.name}</span>
            <span className="text-xs text-muted-foreground">@{comment.username}</span>
            {comment.created_at && (
              <span className="text-xs text-muted-foreground">· {formatRelativeTime(comment.created_at)}</span>
            )}
          </div>

          {isEditing ? (
            <div className="mt-1 flex gap-2">
              <Input value={editText} onChange={(e) => setEditText(e.target.value)} className="h-8" />
              <Button size="sm" onClick={handleEditSubmit}>Salvar</Button>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancelar</Button>
            </div>
          ) : (
            <p className="text-sm">{comment.text}</p>
          )}

          <div className="mt-1 flex gap-3 text-xs font-medium text-muted-foreground">
            <button onClick={() => setShowReplyInput((v) => !v)} className="hover:text-emerald-700">
              Responder
            </button>
            {isOwner && !isEditing && (
              <>
                <button onClick={() => setIsEditing(true)} className="hover:text-emerald-700">
                  Editar
                </button>
                <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
                  Excluir
                </button>
              </>
            )}
          </div>

          {showReplyInput && (
            <div className="mt-2 flex gap-2">
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Respondendo a @${comment.username}...`}
                className="h-8"
              />
              <Button size="sm" onClick={handleReplySubmit}>Enviar</Button>
            </div>
          )}
        </div>
      </div>

      {replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} postId={postId} currentUserId={currentUserId} level={level + 1} />
      ))}
    </div>
  );
}
