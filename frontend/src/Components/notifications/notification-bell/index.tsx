import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Bell, X } from "lucide-react";
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "@/services/NotificationService";
import type { NotificationDTO } from "@/types/notifications";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/styles/overlays";
import { Button } from "@/styles/buttons";
import { Loader } from "@/Components/common/loader";
import {
  BellButton,
  Badge,
  Panel,
  PanelHeader,
  ClearAllButton,
  NotificationItem,
  TextBlock,
  UnreadDot,
  Avatar,
  NotificationText,
  NotificationTime,
  DeleteButton,
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
    case "mention":
      return `${n.actor.name} mencionou você num comentário${title}.`;
  }
}

function notificationHref(n: NotificationDTO): string {
  if (n.type === "follow") return `/profile/${n.actor.id}`;
  if ((n.type === "comment" || n.type === "mention") && n.commentId) return `/post/${n.postId}?commentId=${n.commentId}`;
  return `/post/${n.postId}`;
}

export function NotificationBell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const { data: unread } = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: async () => (await getUnreadCount()).data,
    // refetchInterval: 15000,
    refetchInterval: 3600
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
    if (!nextOpen && count > 0) {
      markAllAsRead()
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        })
        .catch((e) => console.error("Erro ao marcar notificações como lidas:", e));
    }
  }

  function handleDelete(id: number) {
    setDeletingIds((prev) => new Set(prev).add(id));
    deleteNotification(id)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
      })
      .catch((e) => {
        console.error("Erro ao excluir notificação:", e);
        toast.error("Erro ao excluir notificação.");
      })
      .finally(() => {
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      });
  }

  function handleClearAll() {
    deleteAllNotifications()
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
        setConfirmClearOpen(false);
      })
      .catch((e) => {
        console.error("Erro ao excluir notificações:", e);
        toast.error("Erro ao excluir notificações.");
      });
  }

  function handleNotificationClick(n: NotificationDTO) {
    navigate(notificationHref(n));
    handleOpenChange(false);
  }

  return (
    <>
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <BellButton aria-label="Notificações">
          <Bell size={18} />
          {count > 0 && <Badge>{count > 9 ? "9+" : count}</Badge>}
        </BellButton>
      </DropdownMenuTrigger>
      <Panel align="end">
        <PanelHeader>
          <span>Notificações</span>
          {notifications.length > 0 && (
            <ClearAllButton onClick={() => setConfirmClearOpen(true)}>Limpar tudo</ClearAllButton>
          )}
        </PanelHeader>
        {isLoading && <Loader size="sm" />}
        {!isLoading && notifications.length === 0 && (
          <EmptyMessage>Nenhuma notificação por aqui.</EmptyMessage>
        )}
        {notifications.map((n) => (
          <NotificationItem
            key={n.id}
            role="button"
            tabIndex={0}
            onClick={() => handleNotificationClick(n)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleNotificationClick(n);
              }
            }}
          >
            <Avatar src={n.actor.avatar || FALLBACK_AVATAR} alt={n.actor.username} />
            <TextBlock>
              <NotificationText>{notificationText(n)}</NotificationText>
              <NotificationTime>{formatRelativeTime(n.created_at)}</NotificationTime>
            </TextBlock>
            {!n.read && <UnreadDot />}
            <DeleteButton
              aria-label="Excluir notificação"
              disabled={deletingIds.has(n.id)}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(n.id);
              }}
            >
              <X size={14} />
            </DeleteButton>
          </NotificationItem>
        ))}
        {hasNextPage && (
          <LoadMoreButton onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
          </LoadMoreButton>
        )}
      </Panel>
    </DropdownMenu>

    <Dialog open={confirmClearOpen} onOpenChange={setConfirmClearOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir todas as notificações?</DialogTitle>
          <DialogDescription>Essa ação não pode ser desfeita.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button $variant="outline" onClick={() => setConfirmClearOpen(false)}>Cancelar</Button>
          <Button $variant="destructive" onClick={handleClearAll}>Excluir tudo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
