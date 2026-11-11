import { API } from "./api";
import type { PaginatedResponse } from "@/types/posts";
import type { NotificationDTO } from "@/types/notifications";

export function getNotifications(page = 1) {
  return API.get<PaginatedResponse<NotificationDTO>>(`/notifications?page=${page}`);
}

export function getUnreadCount() {
  return API.get<{ count: number }>(`/notifications/unread-count`);
}

export function markAllAsRead() {
  return API.patch(`/notifications/read-all`);
}
