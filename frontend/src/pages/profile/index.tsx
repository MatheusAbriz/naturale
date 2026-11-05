import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, Pencil, Plus, Utensils } from "lucide-react";
import { getPublicProfile, getUserStats } from "@/services/AuthService";
import { getPostsByUser } from "@/services/PostService";
import { useAuth } from "@/stores/auth-store";
import { PostCard } from "@/Components/post/post-card";
import { CommentsDialog } from "@/Components/comments/comments-dialog";
import { EmptyState } from "@/Components/common/empty-state";
import { Loader } from "@/Components/common/loader";
import { Button } from "@/styles/buttons";
import { useInfiniteScrollSentinel } from "@/lib/useInfiniteScrollSentinel";
import { PlanBadge } from "@/Components/subscription/plan-badge";
import { hasPlan, useSubscription } from "@/stores/subscription-store";
import {
  HeroSection,
  Banner,
  HeroContent,
  AvatarRow,
  Avatar,
  NameBlock,
  NameRow,
  Name,
  Username,
  MetricsGrid,
  MetricItem,
  MetricValue,
  MetricIcon,
  MetricLabel,
  DeluxeBanner,
  DeluxeIcon,
  DeluxeTitle,
  DeluxeText,
  PostsHeaderRow,
  PostsHeaderTitle,
  PostsHeaderSubtitle,
  NewRecipeLabel,
  EmptyCreateWrap,
} from "./styles";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwnProfile = id === "me" || Number(id) === user?.id;
  const userId = isOwnProfile ? user?.id : Number(id);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const plan = useSubscription((state) => state.plan);

  const { data: profile, isLoading: isLoadingProfile, isError } = useQuery({
    queryKey: ["public-profile", userId],
    queryFn: async () => (await getPublicProfile(userId!)).data,
    enabled: Boolean(userId),
  });

  const { data: stats } = useQuery({
    queryKey: ["user-stats", userId],
    queryFn: async () => (await getUserStats(userId!)).data,
    enabled: Boolean(userId),
  });

  const { data: postsData, isLoading: isLoadingPosts, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["user-posts", userId],
    queryFn: ({ pageParam = 1 }) => getPostsByUser(userId!, pageParam),
    initialPageParam: 1,
    enabled: Boolean(userId),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const sentinelRef = useInfiniteScrollSentinel(() => fetchNextPage(), Boolean(hasNextPage) && !isFetchingNextPage);
  const posts = postsData?.pages.flatMap((page) => page.data.data) ?? [];

  if (isLoadingProfile) return <Loader />;
  if (isError || !profile) return <EmptyState title="Perfil não encontrado" description="Este perfil não está disponível." />;

  const metrics = [
    { label: "receitas", value: stats?.postCount ?? posts.length, icon: Utensils },
    { label: "curtidas", value: stats?.likesReceived ?? 0, icon: Heart },
    { label: "comentários", value: stats?.commentsReceived ?? 0, icon: MessageCircle },
  ];

  return (
    <div>
      <HeroSection>
        <Banner />
        <HeroContent>
          <AvatarRow>
            <Avatar src={profile.avatar || FALLBACK_AVATAR} alt={profile.name} />
            {isOwnProfile && (
              <Button $variant="outline" onClick={() => navigate("/settings")} style={{ marginBottom: 4 }}>
                <Pencil size={16} /> Editar perfil
              </Button>
            )}
          </AvatarRow>
          <NameBlock>
            <NameRow>
              <Name>{profile.name}</Name>
              {isOwnProfile && <PlanBadge plan={plan} />}
            </NameRow>
            <Username>@{profile.username}</Username>
          </NameBlock>
          <MetricsGrid>
            {metrics.map(({ label, value, icon: Icon }) => (
              <MetricItem key={label}>
                <MetricValue>
                  <MetricIcon><Icon size={14} color="#2f6b54" /></MetricIcon>
                  {value}
                </MetricValue>
                <MetricLabel>{label}</MetricLabel>
              </MetricItem>
            ))}
          </MetricsGrid>
        </HeroContent>
      </HeroSection>

      {isOwnProfile && hasPlan(plan, "deluxe") && (
        <DeluxeBanner>
          <DeluxeIcon>★</DeluxeIcon>
          <div>
            <DeluxeTitle>Destaque Deluxe ativo</DeluxeTitle>
            <DeluxeText>Suas novas receitas recebem mais visibilidade no feed.</DeluxeText>
          </div>
        </DeluxeBanner>
      )}

      <PostsHeaderRow>
        <div>
          <PostsHeaderTitle>Receitas publicadas</PostsHeaderTitle>
          <PostsHeaderSubtitle>Sabores compartilhados por {isOwnProfile ? "você" : profile.name.split(" ")[0]}.</PostsHeaderSubtitle>
        </div>
        {isOwnProfile && (
          <Button $size="sm" onClick={() => navigate("/postForm")}>
            <Plus size={16} /> <NewRecipeLabel>Nova receita</NewRecipeLabel>
          </Button>
        )}
      </PostsHeaderRow>

      {isLoadingPosts ? (
        <Loader size="sm" padY={40} />
      ) : posts.length === 0 ? (
        <EmptyState
          title={isOwnProfile ? "Sua cozinha ainda está vazia" : "Ainda não há receitas por aqui"}
          description={isOwnProfile ? "Publique sua primeira receita saudável." : "Volte mais tarde para conferir as novidades."}
        />
      ) : (
        posts.map((post) => <PostCard key={post.postId} post={post} onOpenComments={setSelectedPostId} />)
      )}

      {isOwnProfile && posts.length === 0 && (
        <EmptyCreateWrap>
          <Button onClick={() => navigate("/postForm")}>Criar receita</Button>
        </EmptyCreateWrap>
      )}
      <div ref={sentinelRef} />
      {isFetchingNextPage && <Loader size="sm" padY={16} />}
      <CommentsDialog postId={selectedPostId} onOpenChange={(open) => !open && setSelectedPostId(null)} />
    </div>
  );
}
