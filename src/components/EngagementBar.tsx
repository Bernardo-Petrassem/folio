import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENT_USER_ID } from "@/lib/mock-data";

type Props = {
  likes: string[];
  favorites: string[];
  commentCount: number;
  onLike: () => void;
  onFavorite: () => void;
  onComment: () => void;
  onShare: () => void;
};

export function EngagementBar({
  likes,
  favorites,
  commentCount,
  onLike,
  onFavorite,
  onComment,
  onShare,
}: Props) {
  const liked = likes.includes(CURRENT_USER_ID);
  const favorited = favorites.includes(CURRENT_USER_ID);

  return (
    <div className="flex items-center gap-1 text-muted">
      <Btn active={liked} onClick={onLike} label="Curtir">
        <Heart className={cn("size-4", liked && "fill-current text-danger")} />
        <span className="tabular-nums">{likes.length || ""}</span>
      </Btn>
      <Btn onClick={onComment} label="Comentar">
        <MessageCircle className="size-4" />
        <span className="tabular-nums">{commentCount || ""}</span>
      </Btn>
      <Btn onClick={onShare} label="Compartilhar">
        <Share2 className="size-4" />
      </Btn>
      <Btn active={favorited} onClick={onFavorite} label="Favoritar">
        <Bookmark className={cn("size-4", favorited && "fill-current text-fg")} />
      </Btn>
    </div>
  );
}

function Btn({
  children,
  onClick,
  label,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs transition-colors hover:bg-fg/6 hover:text-fg",
        active && "text-fg",
      )}
    >
      {children}
    </button>
  );
}
