import { useState } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FolderHeart, FolderPlus } from "lucide-react";
import { getFavoritesPosts } from "@/services/PostService";
import { getCollections, createCollection, togglePostInCollection } from "@/services/CollectionService";
import { PostCard } from "@/Components/post/post-card";
import { EmptyState } from "@/Components/common/empty-state";
import { Loader } from "@/Components/common/loader";
import { useInfiniteScrollSentinel } from "@/lib/useInfiniteScrollSentinel";
import { CommentsDialog } from "@/Components/comments/comments-dialog";
import { Button } from "@/styles/buttons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/styles/overlays";
import { hasPlan, useSubscription } from "@/stores/subscription-store";
import { UpgradePrompt } from "@/Components/subscription/upgrade-prompt";
import {
  Header,
  Eyebrow,
  Title,
  Description,
  CollectionsPanel,
  CollectionsPanelRow,
  CollectionsPanelTitle,
  CollectionsPanelSubtitle,
  PillsRow,
  Pill,
  PromptWrap,
  OrganizeLink,
  DialogInput,
  EmptyCollectionsHint,
  CollectionsGrid,
  CollectionCheckboxLabel,
} from "./styles";

export default function Favorites() {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [activeCollection, setActiveCollection] = useState<number | "all">("all");
  const [organizingPostId, setOrganizingPostId] = useState<number | null>(null);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const plan = useSubscription((state) => state.plan);
  const canOrganize = hasPlan(plan, "extra");
  const queryClient = useQueryClient();

  const { data: collections = [] } = useQuery({
    queryKey: ["favorite-collections"],
    queryFn: async () => (await getCollections()).data,
    enabled: canOrganize,
  });

  const { mutate: runCreateCollection, isPending: isCreating } = useMutation({
    mutationFn: (name: string) => createCollection(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-collections"] });
      setNewCollectionName("");
      setCreateOpen(false);
    },
    onError: () => toast.error("Não foi possível criar a coleção. Tente novamente."),
  });

  const { mutate: runTogglePost } = useMutation({
    mutationFn: ({ collectionId, postId }: { collectionId: number; postId: number }) =>
      togglePostInCollection(collectionId, postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorite-collections"] }),
    onError: () => toast.error("Não foi possível organizar a receita. Tente novamente."),
  });

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["favorite-posts"],
    queryFn: ({ pageParam = 1 }) => getFavoritesPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
  const allPosts = data?.pages.flatMap((page) => page.data.data) ?? [];
  const posts =
    activeCollection === "all"
      ? allPosts
      : allPosts.filter((post) => collections.find((collection) => collection.id === activeCollection)?.postIds.includes(post.postId));
  const sentinelRef = useInfiniteScrollSentinel(() => fetchNextPage(), !!hasNextPage && !isFetchingNextPage);

  function handleCreateCollection() {
    if (!newCollectionName.trim() || isCreating) return;
    runCreateCollection(newCollectionName);
  }

  if (isLoading) return <Loader />;

  return (
    <div>
      <Header>
        <Eyebrow>Sua coleção</Eyebrow>
        <Title>Receitas favoritas</Title>
        <Description>Guarde ideias para o próximo preparo.</Description>
      </Header>

      {canOrganize ? (
        <CollectionsPanel>
          <CollectionsPanelRow>
            <div>
              <CollectionsPanelTitle><FolderHeart size={16} color="#2f6b54" /> Coleções</CollectionsPanelTitle>
              <CollectionsPanelSubtitle>Organize suas receitas do seu jeito.</CollectionsPanelSubtitle>
            </div>
            <Button $size="sm" $variant="outline" onClick={() => setCreateOpen(true)}>
              <FolderPlus size={16} /> Nova
            </Button>
          </CollectionsPanelRow>
          <PillsRow>
            <Pill $active={activeCollection === "all"} onClick={() => setActiveCollection("all")}>Todas</Pill>
            {collections.map((collection) => (
              <Pill key={collection.id} $active={activeCollection === collection.id} onClick={() => setActiveCollection(collection.id)}>
                {collection.name}
              </Pill>
            ))}
          </PillsRow>
        </CollectionsPanel>
      ) : (
        <PromptWrap>
          <UpgradePrompt feature="Organize favoritos em coleções" />
        </PromptWrap>
      )}

      {posts.length === 0 ? (
        <EmptyState description={activeCollection === "all" ? "Você ainda não favoritou nenhuma receita." : "Ainda não há receitas nesta coleção."} />
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.postId}
            post={post}
            onOpenComments={setSelectedPostId}
            footer={
              canOrganize ? (
                <OrganizeLink onClick={(event) => { event.stopPropagation(); setOrganizingPostId(post.postId); }}>
                  <FolderHeart size={14} /> Organizar em coleção
                </OrganizeLink>
              ) : undefined
            }
          />
        ))
      )}

      <div ref={sentinelRef} />
      {isFetchingNextPage && <Loader size="sm" padY={16} />}
      <CommentsDialog postId={selectedPostId} onOpenChange={(open) => !open && setSelectedPostId(null)} />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova coleção</DialogTitle>
            <DialogDescription>Crie uma pasta para agrupar seus favoritos.</DialogDescription>
          </DialogHeader>
          <DialogInput
            autoFocus
            value={newCollectionName}
            onChange={(event) => setNewCollectionName(event.target.value)}
            placeholder="Ex.: Sobremesas, low carb..."
          />
          <DialogFooter>
            <Button $variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateCollection} disabled={isCreating}>{isCreating ? "Criando..." : "Criar coleção"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={organizingPostId !== null} onOpenChange={(open) => !open && setOrganizingPostId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Organizar receita</DialogTitle>
            <DialogDescription>Escolha as coleções em que esta receita deve aparecer.</DialogDescription>
          </DialogHeader>
          {collections.length === 0 ? (
            <EmptyCollectionsHint>Crie uma coleção primeiro para começar a organizar.</EmptyCollectionsHint>
          ) : (
            <CollectionsGrid>
              {collections.map((collection) => (
                <CollectionCheckboxLabel key={collection.id}>
                  <span>{collection.name}</span>
                  <input
                    type="checkbox"
                    checked={organizingPostId !== null && collection.postIds.includes(organizingPostId)}
                    onChange={() => organizingPostId !== null && runTogglePost({ collectionId: collection.id, postId: organizingPostId })}
                  />
                </CollectionCheckboxLabel>
              ))}
            </CollectionsGrid>
          )}
          <DialogFooter>
            <Button onClick={() => setOrganizingPostId(null)}>Concluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
