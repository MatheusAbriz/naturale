import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "@/services/PostService";
import { PostCard } from "@/Components/post/post-card";
import { EmptyState } from "@/Components/common/empty-state";
import { Loader } from "@/Components/common/loader";
import { useInfiniteScrollSentinel } from "@/lib/useInfiniteScrollSentinel";
import { CommentsDialog } from "@/Components/comments/comments-dialog";
import { Header, Eyebrow, Title } from "./styles";

export default function Home() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["posts", search],
    queryFn: ({ pageParam = 1 }) => getPosts(pageParam, search),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const posts = data?.pages.flatMap((page) => page.data.data) ?? [];
  const sentinelRef = useInfiniteScrollSentinel(() => fetchNextPage(), !!hasNextPage && !isFetchingNextPage);

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
          </>
        )}
      </Header>

      {posts.length === 0 ? (
        <EmptyState description="Nenhuma receita encontrada." />
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
