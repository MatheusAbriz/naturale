import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FolderHeart, FolderPlus } from "lucide-react";
import { getFavoritesPosts } from "@/services/PostService";
import { PostCard } from "@/Components/post/post-card";
import { EmptyState } from "@/Components/common/empty-state";
import { Loader } from "@/Components/common/loader";
import { useInfiniteScrollSentinel } from "@/lib/useInfiniteScrollSentinel";
import { CommentsDialog } from "@/Components/comments/comments-dialog";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { useCollections } from "@/stores/collections-store";
import { hasPlan, useSubscription } from "@/stores/subscription-store";
import { UpgradePrompt } from "@/Components/subscription/upgrade-prompt";

export default function Favorites() {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [activeCollection, setActiveCollection] = useState<string | "all">("all");
  const [organizingPostId, setOrganizingPostId] = useState<number | null>(null);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const { collections, createCollection, togglePost } = useCollections();
  const plan = useSubscription((state) => state.plan);
  const canOrganize = hasPlan(plan, "extra");
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({ queryKey: ["favorite-posts"], queryFn: ({ pageParam = 1 }) => getFavoritesPosts(pageParam), initialPageParam: 1, getNextPageParam: (lastPage) => { const { page, totalPages } = lastPage.data.pagination; return page < totalPages ? page + 1 : undefined; } });
  const allPosts = data?.pages.flatMap((page) => page.data.data) ?? [];
  const posts = activeCollection === "all" ? allPosts : allPosts.filter((post) => collections.find((collection) => collection.id === activeCollection)?.postIds.includes(post.postId));
  const sentinelRef = useInfiniteScrollSentinel(() => fetchNextPage(), !!hasNextPage && !isFetchingNextPage);
  function handleCreateCollection() { if (!newCollectionName.trim()) return; createCollection(newCollectionName); setNewCollectionName(""); setCreateOpen(false); }
  if (isLoading) return <Loader />;
  return <div>
    <div className="mb-5"><p className="text-sm font-semibold text-primary">Sua coleção</p><h1 className="mt-1 text-xl font-extrabold tracking-tight">Receitas favoritas</h1><p className="mt-1 text-sm text-muted-foreground">Guarde ideias para o próximo preparo.</p></div>
    {canOrganize ? <div className="mb-5 rounded-2xl border border-border bg-white p-4"><div className="flex items-center justify-between gap-3"><div><p className="flex items-center gap-2 text-sm font-extrabold"><FolderHeart className="h-4 w-4 text-primary" /> Coleções</p><p className="mt-1 text-xs text-muted-foreground">Organize suas receitas do seu jeito.</p></div><Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}><FolderPlus className="h-4 w-4" /> Nova</Button></div><div className="mt-3 flex gap-2 overflow-x-auto pb-1"><button onClick={() => setActiveCollection("all")} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${activeCollection === "all" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>Todas</button>{collections.map((collection) => <button key={collection.id} onClick={() => setActiveCollection(collection.id)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${activeCollection === collection.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>{collection.name}</button>)}</div></div> : <div className="mb-5"><UpgradePrompt feature="Organize favoritos em coleções" /></div>}
    {posts.length === 0 ? <EmptyState description={activeCollection === "all" ? "Você ainda não favoritou nenhuma receita." : "Ainda não há receitas nesta coleção."} /> : posts.map((post) => <PostCard key={post.postId} post={post} onOpenComments={setSelectedPostId} footer={canOrganize ? <button onClick={(event) => { event.stopPropagation(); setOrganizingPostId(post.postId); }} className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"><FolderHeart className="h-3.5 w-3.5" /> Organizar em coleção</button> : undefined} />)}
    <div ref={sentinelRef} />{isFetchingNextPage && <Loader size="sm" className="py-4" />}<CommentsDialog postId={selectedPostId} onOpenChange={(open) => !open && setSelectedPostId(null)} />
    <Dialog open={createOpen} onOpenChange={setCreateOpen}><DialogContent><DialogHeader><DialogTitle>Nova coleção</DialogTitle><DialogDescription>Crie uma pasta para agrupar seus favoritos.</DialogDescription></DialogHeader><input autoFocus value={newCollectionName} onChange={(event) => setNewCollectionName(event.target.value)} placeholder="Ex.: Sobremesas, low carb..." className="h-10 rounded-xl border border-input bg-white px-3 text-sm outline-none" /><DialogFooter><Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button><Button onClick={handleCreateCollection}>Criar coleção</Button></DialogFooter></DialogContent></Dialog>
    <Dialog open={organizingPostId !== null} onOpenChange={(open) => !open && setOrganizingPostId(null)}><DialogContent><DialogHeader><DialogTitle>Organizar receita</DialogTitle><DialogDescription>Escolha as coleções em que esta receita deve aparecer.</DialogDescription></DialogHeader>{collections.length === 0 ? <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">Crie uma coleção primeiro para começar a organizar.</p> : <div className="grid gap-2">{collections.map((collection) => <label key={collection.id} className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-3 text-sm font-semibold"><span>{collection.name}</span><input type="checkbox" checked={organizingPostId !== null && collection.postIds.includes(organizingPostId)} onChange={() => organizingPostId !== null && togglePost(collection.id, organizingPostId)} /></label>)}</div>}<DialogFooter><Button onClick={() => setOrganizingPostId(null)}>Concluir</Button></DialogFooter></DialogContent></Dialog>
  </div>;
}
