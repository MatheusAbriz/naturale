import { API } from "./api";
import type { CommentDTO, CreateComment, CreateReply, CommentsResponse } from "@/types/comments";

export function getComments(postId: number | string, page = 1) {
  return API.get<CommentsResponse>(`/comments/post/${postId}`, {
    params: { page, limit: 10 },
  });
}

export function addComment(comment: CreateComment) {
  return API.post("/comments", comment);
}

export function addReply(reply: CreateReply) {
  return API.post<CommentDTO>("/comments/reply", reply);
}

export function editComment(commentId: number, comment_text: string) {
  return API.patch(`/comments/${commentId}`, { comment_text });
}

export function deleteComment(commentId: number) {
  return API.delete(`/comments/${commentId}`);
}

export function editReply(commentId: number, comment_text: string) {
  return API.patch(`/comments/reply/${commentId}`, { comment_text });
}

export function deleteReply(commentId: number) {
  return API.delete(`/comments/reply/${commentId}`);
}
