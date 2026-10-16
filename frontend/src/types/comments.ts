export type CommentDTO = {
  id: number;
  user_id: number;
  text: string;
  created_at: string;
  parent_comment_id: number | null;
  name: string;
  username: string;
  avatar: string;
  replies: CommentDTO[];
};

export type CreateComment = {
  post_id: number;
  user_id: number;
  comment_text: string;
};

export type CreateReply = CreateComment & {
  parent_comment_id: number;
};

export type CommentsResponse = {
  status: boolean;
  msg: CommentDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
