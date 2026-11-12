import type { QueryClient } from "@tanstack/react-query";
import type { Posts } from "@/types/posts";

const LIST_QUERY_KEYS = ["posts", "favorite-posts", "user-posts"];

function bump(post: Posts, delta: number): Posts {
  return { ...post, commentCount: Math.max(0, Number(post.commentCount ?? 0) + delta) };
}

type ListQueryData = {
  pages: { data: { data: Posts[]; pagination: unknown } }[];
  pageParams: unknown[];
};

// Atualiza o commentCount de um post no cache do react-query (sem esperar um refetch),
// tanto na query de post único quanto em qualquer lista (feed, favoritos, perfil) que o contenha.
export function adjustPostCommentCount(queryClient: QueryClient, postId: number, delta: number) {
  queryClient.setQueryData(["post", postId], (old: Posts | undefined) => (old ? bump(old, delta) : old));

  queryClient.setQueriesData<ListQueryData>(
    { predicate: (query) => LIST_QUERY_KEYS.includes(query.queryKey[0] as string) },
    (old) => {
      if (!old?.pages) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: {
            ...page.data,
            data: page.data.data.map((p) => (p.postId === postId ? bump(p, delta) : p)),
          },
        })),
      };
    }
  );
}
