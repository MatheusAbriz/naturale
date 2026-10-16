import { API } from "./api";
import type { UserDTO, UserProfile, UserSimpleDetails, UserStats } from "@/types/auth";

export function login(data: { email: string; password: string }) {
  return API.post("/user/login", data);
}

export function register(data: UserDTO) {
  return API.post("/user", data);
}

// Perfil público (nome, username, avatar) — usado para ver o perfil de outro usuário
export function getPublicProfile(userId: number | string) {
  return API.get<UserSimpleDetails>(`/user/${userId}`);
}

// Perfil completo do próprio usuário (protegido, IDOR-checked no backend)
export function getMyProfile(userId: number | string) {
  return API.get<UserProfile>(`/user/profile/${userId}`);
}

export function getUserStats(userId: number | string) {
  return API.get<UserStats>(`/user/${userId}/stats`);
}

export function updateName(userId: number | string, name: string) {
  return API.put(`/user/${userId}/name`, { name });
}

export function updateUsername(userId: number | string, username: string) {
  return API.put(`/user/${userId}/username`, { username });
}

export function updatePhone(userId: number | string, phone: string) {
  return API.put(`/user/${userId}/phone`, { phone });
}

export function updateEmail(userId: number | string, email: string) {
  return API.put(`/user/${userId}/email`, { email });
}

export function updatePassword(userId: number | string, password: string) {
  return API.put(`/user/${userId}/password`, { password });
}

export function updateAvatar(userId: number | string, avatar: string) {
  return API.put(`/user/${userId}/avatar`, { avatar });
}

export function forgotPassword(email: string) {
  return API.post("/user/forgot-password", { email });
}

export function resetPassword(email: string, code: string, newPassword: string) {
  return API.post("/user/reset-password", { email, code, newPassword });
}
