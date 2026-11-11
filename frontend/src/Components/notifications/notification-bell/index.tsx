import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { getNotifications, getUnreadCount, markAllAsRead } from "@/services/NotificationService";
import type { NotificationDTO } from "@/types/notifications";
import { DropdownMenu, DropdownMenuTrigger } from "@/styles/overlays";
import { Loader } from "@/Components/common/loader";
import {
  BellButton,
  Badge,
  Panel,
  PanelHeader,
  NotificationItem,
  Avatar,
  NotificationText,
  NotificationTime,
  EmptyMessage,
  LoadMoreButton,
} from "./styles";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80";

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function notificationText(n: NotificationDTO): string {
  const title = n.postTitle ? ` "${n.postTitle}"` : "";
  switch (n.type) {
    case "like":
      return `${n.actor.name} curtiu sua receita${title}.`;
    case "comment":
      return `${n.actor.name} comentou na sua receita${title}.`;
    case "follow":
      return `${n.actor.name} começou a seguir você.`;
  }
}

function notificationHref(n: NotificationDTO): string {
  if (n.type === "follow") return `/profile/${n.actor.id}`;
  if (n.type === "comment" && n.commentId) return `/post/${n.postId}?commentId=${n.commentId}`;
  return `/post/${n.postId}`;
}

export function NotificationBell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: unread } = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: async () => (await getUnreadCount()).data,
    refetchInterval: 15000,
  });

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam = 1 }) => getNotifications(pageParam),
    enabled: open,
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const { page, totalPages } = last.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const notifications = data?.pages.flatMap((p) => p.data.data) ?? [];
  const count = unread?.count ?? 0;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      markAllAsRead()
        .then(() => queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] }))
        .catch((e) => console.error("Erro ao marcar notificações como lidas:", e));
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <BellButton aria-label="Notificações">
          <Bell size={18} />
          {count > 0 && <Badge>{count > 9 ? "9+" : count}</Badge>}
        </BellButton>
      </DropdownMenuTrigger>
      <Panel align="end">
        <PanelHeader>Notificações</PanelHeader>
        {isLoading && <Loader size="sm" />}
        {!isLoading && notifications.length === 0 && (
          <EmptyMessage>Nenhuma notificação por aqui.</EmptyMessage>
        )}
        {notifications.map((n) => (
          <NotificationItem key={n.id} onClick={() => navigate(notificationHref(n))}>
            <Avatar src={n.actor.avatar || FALLBACK_AVATAR} alt={n.actor.username} />
            <div>
              <NotificationText>{notificationText(n)}</NotificationText>
              <NotificationTime>{formatRelativeTime(n.created_at)}</NotificationTime>
            </div>
          </NotificationItem>
        ))}
        {hasNextPage && (
          <LoadMoreButton onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
          </LoadMoreButton>
        )}
      </Panel>
    </DropdownMenu>
  );
}
