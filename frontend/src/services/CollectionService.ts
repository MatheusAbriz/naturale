import { API } from "./api";

export type FavoriteCollection = {
  id: number;
  name: string;
  postIds: number[];
};

export function getCollections() {
  return API.get<FavoriteCollection[]>("/favorite-collections");
}

export function createCollection(name: string) {
  return API.post<FavoriteCollection>("/favorite-collections", { name });
}

export function togglePostInCollection(collectionId: number, postId: number) {
  return API.patch<{ message: string }>(`/favorite-collections/${collectionId}/posts/${postId}`);
}
