import { API } from "./api";
import type { PaginatedResponse, Posts, CreatePostDTO, UpdatePostDTO } from "@/types/posts";

export function getPosts(page = 1, search = "") {
  return API.get<PaginatedResponse<Posts>>(`/posts?page=${page}&search=${search}`);
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
