import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, Pencil, Plus, Utensils } from "lucide-react";
import { getPublicProfile, getUserStats } from "@/services/AuthService";
import { getPostsByUser } from "@/services/PostService";
import { useAuth } from "@/stores/auth-store";
import { PostCard } from "@/Components/post/post-card";
import { CommentsDialog } from "@/Components/comments/comments-dialog";
import { EmptyState } from "@/Components/common/empty-state";
import { Loader } from "@/Components/common/loader";
import { Button } from "@/Components/ui/button";
import { useInfiniteScrollSentinel } from "@/lib/useInfiniteScrollSentinel";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwnProfile = id === "me" || Number(id) === user?.id;
  const userId = isOwnProfile ? user?.id : Number(id);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

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
      <section className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-[0_8px_28px_rgba(39,73,58,0.06)]">
        <div className="h-24 bg-[linear-gradient(120deg,#2f6b54,#72a187_58%,#d9b77c)] sm:h-32" />
        <div className="px-5 pb-5 sm:px-7">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <img
              src={profile.avatar || FALLBACK_AVATAR}
              alt={profile.name}
              className="h-24 w-24 rounded-2xl border-4 border-white bg-muted object-cover shadow-sm sm:h-28 sm:w-28"
            />
            {isOwnProfile && (
              <Button variant="outline" onClick={() => navigate("/settings")} className="sm:mb-1">
                <Pencil className="h-4 w-4" /> Editar perfil
              </Button>
            )}
          </div>
          <div className="mt-4">
            <h1 className="text-2xl font-extrabold tracking-tight">{profile.name}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">@{profile.username}</p>
          </div>
          <div className="mt-5 grid grid-cols-3 divide-x divide-border rounded-xl bg-muted/70 py-3">
            {metrics.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-1 px-1 text-center">
                <span className="flex items-center gap-1 text-base font-extrabold"><Icon className="hidden h-3.5 w-3.5 text-primary sm:block" />{value}</span>
                <span className="text-[11px] font-medium text-muted-foreground sm:text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mb-4 mt-8 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold">Receitas publicadas</h2>
          <p className="text-sm text-muted-foreground">Sabores compartilhados por {isOwnProfile ? "você" : profile.name.split(" ")[0]}.</p>
        </div>
        {isOwnProfile && (
          <Button size="sm" onClick={() => navigate("/postForm")}>
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Nova receita</span>
          </Button>
        )}
      </div>

      {isLoadingPosts ? <Loader size="sm" className="py-10" /> : posts.length === 0 ? (
        <EmptyState
          title={isOwnProfile ? "Sua cozinha ainda está vazia" : "Ainda não há receitas por aqui"}
          description={isOwnProfile ? "Publique sua primeira receita saudável." : "Volte mais tarde para conferir as novidades."}
        />
      ) : (
        posts.map((post) => <PostCard key={post.postId} post={post} onOpenComments={setSelectedPostId} />)
      )}

      {isOwnProfile && posts.length === 0 && (
        <div className="-mt-8 flex justify-center"><Button asChild><Link to="/postForm">Criar receita</Link></Button></div>
      )}
      <div ref={sentinelRef} />
      {isFetchingNextPage && <Loader size="sm" className="py-4" />}
      <CommentsDialog postId={selectedPostId} onOpenChange={(open) => !open && setSelectedPostId(null)} />
    </div>
  );
}
