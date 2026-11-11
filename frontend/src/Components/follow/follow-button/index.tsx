import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { followUser, unfollowUser } from "@/services/FollowService";
import { Button, type ButtonSize } from "@/styles/buttons";
import { track } from "@/lib/analytics";

type FollowButtonProps = {
  userId: number;
  isFollowing: boolean;
  size?: ButtonSize;
};

export function FollowButton({ userId, isFollowing, size = "default" }: FollowButtonProps) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(userId);
        track("user_unfollowed");
      } else {
        await followUser(userId);
        track("user_followed");
      }
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
      queryClient.invalidateQueries({ queryKey: ["public-profile"] });
      queryClient.invalidateQueries({ queryKey: ["follow-list"] });
      // Feed "Seguindo" depende de quem o usuário segue — invalida pra não
      // mostrar uma lista desatualizada ao trocar de aba e voltar.
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (e) {
      console.error(e);
      toast.error(isFollowing ? "Erro ao deixar de seguir. Tente novamente." : "Erro ao seguir. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button $variant={isFollowing ? "outline" : "default"} $size={size} onClick={handleClick} disabled={loading}>
      {isFollowing ? "Seguindo" : "Seguir"}
    </Button>
  );
}
