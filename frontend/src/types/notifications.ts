export type NotificationType = "like" | "comment" | "follow" | "mention";

export type NotificationDTO = {
  id: number;
  type: NotificationType;
  postId: number | null;
  commentId: number | null;
  read: boolean;
  created_at: string;
  actor: {
    id: number;
    name: string;
    username: string;
    avatar: string;
  };
  postTitle: string | null;
};
