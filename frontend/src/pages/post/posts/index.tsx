import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "@/services/PostService";
import { PostCard } from "@/Components/post/post-card";
import { EmptyState } from "@/Components/common/empty-state";
import { Loader } from "@/Components/common/loader";
import { useInfiniteScrollSentinel } from "@/lib/useInfiniteScrollSentinel";
import { CommentsDialog } from "@/Components/comments/comments-dialog";
import { Button } from "@/styles/buttons";
import { track } from "@/lib/analytics";
import { Header, Eyebrow, Title, FeedToggle } from "./styles";

type FeedMode = "discover" | "following";

export default function Home() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [mode, setMode] = useState<FeedMode>("discover");

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["posts", mode, search],
    queryFn: ({ pageParam = 1 }) => getPosts(pageParam, search, mode),
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
            </FeedToggle>
          </>
        )}
      </Header>

      {posts.length === 0 ? (
        <EmptyState
          description={
            mode === "following"
              ? "Nenhuma receita por aqui ainda. Siga outros usuários para ver as receitas deles."
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
