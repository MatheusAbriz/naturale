import { API } from "./api";
import type { PaginatedResponse } from "@/types/posts";
import type { UserSimpleDetails } from "@/types/auth";

export function followUser(userId: number | string) {
  return API.post(`/user/${userId}/follow`);
}

export function unfollowUser(userId: number | string) {
  return API.delete(`/user/${userId}/follow`);
}

export function getFollowers(userId: number | string, page = 1) {
  return API.get<PaginatedResponse<UserSimpleDetails>>(`/user/${userId}/followers?page=${page}`);
}

export function getFollowing(userId: number | string, page = 1) {
  return API.get<PaginatedResponse<UserSimpleDetails>>(`/user/${userId}/following?page=${page}`);
}
