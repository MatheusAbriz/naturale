import { API } from "./api";

export type UserSearchResult = {
  id: number;
  name: string;
  username: string;
  avatar: string;
};

export function searchUsers(query: string) {
  return API.get<{ data: UserSearchResult[] }>(`/users/search`, { params: { q: query } });
}
