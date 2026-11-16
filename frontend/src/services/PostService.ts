import { API } from "./api";
import type { PaginatedResponse, Posts, CreatePostDTO, UpdatePostDTO } from "@/types/posts";

export type FeedMode = "discover" | "following" | "recommended";

export type PostFilters = {
  ingredient?: string;
  maxTime?: number;
  maxCalories?: number;
  minProtein?: number;
  maxCarbs?: number;
  maxFat?: number;
};

export function getPosts(
  page = 1,
  search = "",
  feed: FeedMode = "discover",
  filters?: PostFilters
) {
  const params = new URLSearchParams({ page: String(page), search, feed });
  if (filters?.ingredient) params.set("ingredient", filters.ingredient);
  if (filters?.maxTime) params.set("maxTime", String(filters.maxTime));
  if (filters?.maxCalories) params.set("maxCalories", String(filters.maxCalories));
  if (filters?.minProtein) params.set("minProtein", String(filters.minProtein));
  if (filters?.maxCarbs) params.set("maxCarbs", String(filters.maxCarbs));
  if (filters?.maxFat) params.set("maxFat", String(filters.maxFat));
  return API.get<PaginatedResponse<Posts>>(`/posts?${params.toString()}`);
}

export function getPostById(postId: number) {
  return API.get<Posts>(`/posts/${postId}`);
}

export function getFavoritesPosts(page = 1) {
  return API.get<PaginatedResponse<Posts>>(`/favorites?page=${page}`);
}

export function getPostsByUser(userId: number | string, page = 1) {
  return API.get<PaginatedResponse<Posts>>(`/posts/user/${userId}?page=${page}`);
}

export function insertLike(postId: number | string) {
  return API.patch(`/posts/${postId}/like`);
}

export function insertFavorite(postId: number | string) {
  return API.patch(`/favorites/${postId}`);
}

export function createPost(data: CreatePostDTO) {
  return API.post("/posts", data);
}

export function updatePost(postId: number, data: UpdatePostDTO) {
  return API.put(`/posts/${postId}`, data);
}

export function deletePost(postId: number) {
  return API.delete(`/posts/${postId}`);
}
