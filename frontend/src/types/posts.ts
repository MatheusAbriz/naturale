import type { UserSimpleDetails } from "./auth";

export type Posts = {
  postId: number;
  title: string;
  text: string;
  ingredients: string;
  image: string;
  time: string;
  likes_count: number;
  isLiked: boolean;
  isFavorited: boolean;
  commentCount: number;
  status: boolean;
  user: UserSimpleDetails;
  calories?: number | null;
  protein_g?: number | null;
  carbs_g?: number | null;
  fat_g?: number | null;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreatePostDTO = {
  userId: number | string;
  title: string;
  text: string;
  ingredients: string;
  image: string;
  time: string;
  status: boolean;
  calories?: number | null;
  protein_g?: number | null;
  carbs_g?: number | null;
  fat_g?: number | null;
};

export type UpdatePostDTO = {
  title: string;
  text: string;
  ingredients: string;
  image: string;
  time: string;
  calories?: number | null;
  protein_g?: number | null;
  carbs_g?: number | null;
  fat_g?: number | null;
};
