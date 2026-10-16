import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Bookmark, Clock } from "lucide-react";
import type { Posts } from "@/types/posts";
import { useToggleLike, useToggleFavorite } from "@/hooks/usePostMutations";
import { Card } from "@/Components/ui/card";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80";

type PostCardProps = {
  post: Posts;
  onOpenComments: (postId: number) => void;
};

export function PostCard({ post, onOpenComments }: PostCardProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const { mutate: toggleLike, isPending: isLiking } = useToggleLike();
  const { mutate: toggleFavorite, isPending: isFavoriting } = useToggleFavorite();

  return (
    <Card
      data-testid={`post-card-${post.postId}`}
      className="mb-5 gap-0 cursor-pointer overflow-hidden p-0 transition-shadow hover:shadow-[0_12px_32px_rgba(39,73,58,0.12)]"
      onClick={() => navigate(`/post/${post.postId}`)}
    >
      <div className="flex items-center gap-3 px-3.5 py-2.5">
        <img
          src={post.user?.avatar || FALLBACK_AVATAR}
          alt={post.user?.username}
          className="h-9 w-9 rounded-full border border-secondary object-cover"
        />
        <div>
          <span className="text-sm font-bold">{post.user?.username ?? post.user?.name}</span>
          <p className="text-xs text-muted-foreground">Receita saudável</p>
        </div>
      </div>

      <img src={post.image} alt={post.title} className="aspect-[4/3] w-full bg-muted object-cover" />

      <div className="flex items-center justify-between px-3.5 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLike({ postId: post.postId, isLiked: post.isLiked });
            }}
            disabled={isLiking}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary"
          >
            <Heart className={post.isLiked ? "h-5 w-5 fill-primary text-primary" : "h-5 w-5"} />
            <span className="text-sm text-muted-foreground">{post.likes_count}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenComments(post.postId);
            }}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm text-muted-foreground">{post.commentCount ?? 0}</span>
          </button>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite({ postId: post.postId, isFavorited: post.isFavorited });
          }}
          disabled={isFavoriting}
          className="rounded-lg p-2 transition-colors hover:bg-secondary"
        >
          <Bookmark className={post.isFavorited ? "h-5 w-5 fill-primary text-primary" : "h-5 w-5"} />
        </button>
      </div>

      <div className="px-3.5 pb-3 pt-1">
        <p className="mb-1 text-lg font-extrabold tracking-tight">{post.title}</p>
        <p className={expanded ? "text-sm leading-6" : "line-clamp-2 text-sm leading-6 text-muted-foreground"}>{post.text}</p>
        {post.text?.length > 50 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
            className="mt-1 text-sm font-semibold text-primary hover:underline"
          >
            {expanded ? "Ver menos" : "Ver mais..."}
          </button>
        )}
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {post.time}
        </div>
      </div>
    </Card>
  );
}
