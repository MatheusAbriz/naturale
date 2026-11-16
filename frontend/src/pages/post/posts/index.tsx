import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts, type FeedMode } from "@/services/PostService";
import { PostCard } from "@/Components/post/post-card";
import { EmptyState } from "@/Components/common/empty-state";
import { Loader } from "@/Components/common/loader";
import { useInfiniteScrollSentinel } from "@/lib/useInfiniteScrollSentinel";
import { CommentsDialog } from "@/Components/comments/comments-dialog";
import { Button } from "@/styles/buttons";
import { track } from "@/lib/analytics";
import { hasPlan, useSubscription } from "@/stores/subscription-store";
import { Header, Eyebrow, Title, FeedToggle } from "./styles";

export default function Home() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const ingredient = searchParams.get("ingredient") ?? undefined;
  const numberParam = (key: string) => (searchParams.get(key) ? Number(searchParams.get(key)) : undefined);
  const maxTime = numberParam("maxTime");
  const maxCalories = numberParam("maxCalories");
  const minProtein = numberParam("minProtein");
  const maxCarbs = numberParam("maxCarbs");
  const maxFat = numberParam("maxFat");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [mode, setMode] = useState<FeedMode>("discover");
  const plan = useSubscription((state) => state.plan);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["posts", mode, search, ingredient, maxTime, maxCalories, minProtein, maxCarbs, maxFat],
    queryFn: ({ pageParam = 1 }) =>
      getPosts(pageParam, search, mode, { ingredient, maxTime, maxCalories, minProtein, maxCarbs, maxFat }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const posts = data?.pages.flatMap((page) => page.data.data) ?? [];
  const sentinelRef = useInfiniteScrollSentinel(() => fetchNextPage(), !!hasNextPage && !isFetchingNextPage);

  useEffect(() => {
    if (!data) return;
    track("recipe_feed_loaded", {
      has_search: Boolean(search),
      feed_mode: mode,
      recipes_loaded: posts.length,
      page_count: data.pages.length,
    });
  }, [data, posts.length, search, mode]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Header>
        {search ? (
          <>
            <Eyebrow>Busca</Eyebrow>
            <Title>Resultados para “{search}”</Title>
          </>
        ) : (
          <>
            <Eyebrow>Comunidade Naturale</Eyebrow>
            <Title>Receitas que cuidam de você</Title>
            <FeedToggle>
              <Button $variant={mode === "discover" ? "default" : "outline"} $size="sm" onClick={() => setMode("discover")}>
                Descobrir
              </Button>
              <Button $variant={mode === "following" ? "default" : "outline"} $size="sm" onClick={() => setMode("following")}>
                Seguindo
              </Button>
              {hasPlan(plan, "deluxe") && (
                <Button $variant={mode === "recommended" ? "default" : "outline"} $size="sm" onClick={() => setMode("recommended")}>
                  Recomendadas
                </Button>
              )}
            </FeedToggle>
          </>
        )}
      </Header>

      {posts.length === 0 ? (
        <EmptyState
          description={
            mode === "following"
              ? "Nenhuma receita por aqui ainda. Siga outros usuários para ver as receitas deles."
              : mode === "recommended"
                ? "Sem recomendações ainda. Siga outros usuários pra começarmos a sugerir receitas."
                : "Nenhuma receita encontrada."
          }
        />
      ) : (
        posts.map((post) => (
          <PostCard key={post.postId} post={post} onOpenComments={setSelectedPostId} />
        ))
      )}

      <div ref={sentinelRef} />
      {isFetchingNextPage && <Loader size="sm" padY={16} />}

      <CommentsDialog
        postId={selectedPostId}
        onOpenChange={(open) => !open && setSelectedPostId(null)}
      />
    </div>
  );
}
