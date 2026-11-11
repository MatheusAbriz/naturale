import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Bookmark, Clock } from "lucide-react";
import type { Posts } from "@/types/posts";
import { useToggleLike, useToggleFavorite } from "@/hooks/usePostMutations";
import { useAuth } from "@/stores/auth-store";
import { FollowButton } from "@/Components/follow/follow-button";
import {
  Card,
  AuthorRow,
  AuthorInfo,
  Avatar,
  Username,
  AuthorSubtitle,
  CoverImage,
  ActionsRow,
  ActionGroup,
  ActionButton,
  FavoriteButton,
  Count,
  Body,
  Title,
  PostText,
  ExpandButton,
  TimeRow,
  Footer,
} from "./styles";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80";

type PostCardProps = {
  post: Posts;
  onOpenComments: (postId: number) => void;
  footer?: ReactNode;
};

export function PostCard({ post, onOpenComments, footer }: PostCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const { mutate: toggleLike, isPending: isLiking } = useToggleLike();
  const { mutate: toggleFavorite, isPending: isFavoriting } = useToggleFavorite();
  const isOwnPost = post.user?.id === user?.id;

  useEffect(() => {
    const el = textRef.current;
    if (el) setIsOverflowing(el.scrollHeight > el.clientHeight);
  }, [post.text]);

  return (
    <Card data-testid={`post-card-${post.postId}`} onClick={() => navigate(`/post/${post.postId}`)}>
      <AuthorRow>
        <AuthorInfo>
          <Avatar src={post.user?.avatar || FALLBACK_AVATAR} alt={post.user?.username} />
          <div>
            <Username>{post.user?.username ?? post.user?.name}</Username>
            <AuthorSubtitle>Receita saudável</AuthorSubtitle>
          </div>
        </AuthorInfo>
        {!isOwnPost && post.user && (
          <div onClick={(e) => e.stopPropagation()}>
            <FollowButton userId={post.user.id} isFollowing={Boolean(post.user.isFollowedByMe)} size="sm" />
          </div>
        )}
      </AuthorRow>

      <CoverImage src={post.image} alt={post.title} />

      <ActionsRow>
        <ActionGroup>
          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              toggleLike({ postId: post.postId, isLiked: post.isLiked });
            }}
            disabled={isLiking}
          >
            <Heart
              size={20}
              fill={post.isLiked ? "currentColor" : "none"}
              color={post.isLiked ? "#2f6b54" : "currentColor"}
            />
            <Count>{post.likes_count}</Count>
          </ActionButton>

          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              onOpenComments(post.postId);
            }}
          >
            <MessageCircle size={20} />
            <Count>{post.commentCount ?? 0}</Count>
          </ActionButton>
        </ActionGroup>

        <FavoriteButton
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite({ postId: post.postId, isFavorited: post.isFavorited });
          }}
          disabled={isFavoriting}
        >
          <Bookmark
            size={20}
            fill={post.isFavorited ? "currentColor" : "none"}
            color={post.isFavorited ? "#2f6b54" : "currentColor"}
          />
        </FavoriteButton>
      </ActionsRow>

      <Body>
        <Title>{post.title}</Title>
        <PostText ref={textRef} $expanded={expanded}>{post.text}</PostText>
        {isOverflowing && (
          <ExpandButton
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
          >
            {expanded ? "Ver menos" : "Ver mais..."}
          </ExpandButton>
        )}
        <TimeRow>
          <Clock size={14} />
          {post.time}
        </TimeRow>
        {footer && <Footer>{footer}</Footer>}
      </Body>
    </Card>
  );
}
