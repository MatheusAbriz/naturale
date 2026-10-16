import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getFavoritesPosts } from "@/services/PostService";
import { PostCard } from "@/Components/post/post-card";
import { EmptyState } from "@/Components/common/empty-state";
import { Loader } from "@/Components/common/loader";
import { useInfiniteScrollSentinel } from "@/lib/useInfiniteScrollSentinel";
import { CommentsDialog } from "@/Components/comments/comments-dialog";

export default function Favorites() {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["favorite-posts"],
    queryFn: ({ pageParam = 1 }) => getFavoritesPosts(pageParam),
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
      <div className="mb-5">
        <p className="text-sm font-semibold text-primary">Sua coleção</p>
        <h1 className="mt-1 text-xl font-extrabold tracking-tight">Receitas favoritas</h1>
        <p className="mt-1 text-sm text-muted-foreground">Guarde ideias para o próximo preparo.</p>
      </div>

      {posts.length === 0 ? (
        <EmptyState description="Você ainda não favoritou nenhuma receita." />
      ) : (
        posts.map((post) => (
          <PostCard key={post.postId} post={post} onOpenComments={setSelectedPostId} />
        ))
      )}

      <div ref={sentinelRef} />
      {isFetchingNextPage && <Loader size="sm" className="py-4" />}

      <CommentsDialog postId={selectedPostId} onOpenChange={(open) => !open && setSelectedPostId(null)} />
    </div>
  );
}
