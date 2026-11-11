import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getFollowers, getFollowing } from "@/services/FollowService";
import { useAuth } from "@/stores/auth-store";
import { Dialog, DialogHeader, DialogTitle } from "@/styles/overlays";
import { Loader } from "@/Components/common/loader";
import { FollowButton } from "../follow-button";
import { StyledDialogContent, List, EmptyMessage, LoadMoreButton, Row, Avatar, Content, Name, Username } from "./styles";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80";

export type FollowListMode = "followers" | "following" | null;

type FollowListDialogProps = {
  userId: number | null;
  mode: FollowListMode;
  onOpenChange: (open: boolean) => void;
};

export function FollowListDialog({ userId, mode, onOpenChange }: FollowListDialogProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOpen = userId !== null && mode !== null;

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["follow-list", mode, userId],
    queryFn: ({ pageParam = 1 }) =>
      mode === "followers" ? getFollowers(userId!, pageParam) : getFollowing(userId!, pageParam),
    enabled: isOpen,
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const { page, totalPages } = last.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const people = data?.pages.flatMap((p) => p.data.data) ?? [];

  function goToProfile(id: number) {
    onOpenChange(false);
    navigate(`/profile/${id}`);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <StyledDialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "followers" ? "Seguidores" : "Seguindo"}</DialogTitle>
        </DialogHeader>

        <List>
          {isLoading && <Loader size="sm" />}
          {!isLoading && people.length === 0 && (
            <EmptyMessage>
              {mode === "followers" ? "Ainda não há seguidores." : "Ainda não segue ninguém."}
            </EmptyMessage>
          )}
          {people.map((person) => (
            <Row key={person.id}>
              <Avatar
                src={person.avatar || FALLBACK_AVATAR}
                alt={person.username}
                onClick={() => goToProfile(person.id)}
                style={{ cursor: "pointer" }}
              />
              <Content onClick={() => goToProfile(person.id)} style={{ cursor: "pointer" }}>
                <Name>{person.name}</Name>
                <Username>@{person.username}</Username>
              </Content>
              {user && person.id !== user.id && (
                <FollowButton userId={person.id} isFollowing={Boolean(person.isFollowedByMe)} size="sm" />
              )}
            </Row>
          ))}
          {hasNextPage && (
            <LoadMoreButton onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
            </LoadMoreButton>
          )}
        </List>
      </StyledDialogContent>
    </Dialog>
  );
}
