import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { VideoCard } from "@/components/VideoCard";
import { EngagementBar } from "@/components/EngagementBar";
import { Avatar } from "@/components/Avatar";
import { useStore } from "@/lib/store";
import { USERS } from "@/lib/mock-data";
import { formatRelative, cn } from "@/lib/utils";

export function HomePage() {
  const [tab, setTab] = useState<"descobrir" | "posts">("descobrir");
  const posts = useStore((s) => s.posts);
  const toggleLike = useStore((s) => s.toggleLike);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const addComment = useStore((s) => s.addComment);
  const [commentFor, setCommentFor] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const videos = useMemo(() => posts.filter((p) => p.kind === "video"), [posts]);
  const texts = useMemo(() => posts.filter((p) => p.kind === "text"), [posts]);

  function share() {
    setToast("Link copiado (protótipo)");
    window.setTimeout(() => setToast(null), 1800);
  }

  return (
    <div className="px-4 pt-4 pb-6">
      <div className="mb-5 flex gap-1 rounded-full bg-surface p-1 shadow-[var(--shadow-border)]">
        {(["descobrir", "posts"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-full py-2 text-sm font-medium capitalize transition-colors",
              tab === t ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
            )}
          >
            {t === "descobrir" ? "Descobrir" : "Posts"}
          </button>
        ))}
      </div>

      {tab === "descobrir" ? (
        <div className="flex flex-col gap-5">
          {videos.map((p) => {
            const author = USERS.find((u) => u.id === p.authorId)!;
            return (
              <article key={p.id} className="anim-in">
                <div className="mb-2 flex items-center gap-2">
                  <Link to={`/perfil/${author.id}`} className="flex items-center gap-2">
                    <Avatar name={author.name} color={author.avatarColor} size="sm" />
                    <div>
                      <p className="text-sm font-medium">{author.name}</p>
                      <p className="text-[11px] text-muted">@{author.username} · {formatRelative(p.createdAt)}</p>
                    </div>
                  </Link>
                </div>
                <VideoCard title={p.videoTitle ?? "Vídeo"} hue={p.videoHue ?? 40} large />
                <div className="mt-2">
                  <EngagementBar
                    likes={p.likes}
                    favorites={p.favorites}
                    commentCount={p.comments.length}
                    onLike={() => toggleLike(p.id)}
                    onFavorite={() => toggleFavorite(p.id)}
                    onComment={() => setCommentFor(commentFor === p.id ? null : p.id)}
                    onShare={share}
                  />
                </div>
                {commentFor === p.id && (
                  <CommentBox
                    comments={p.comments}
                    value={commentText}
                    onChange={setCommentText}
                    onSubmit={() => {
                      addComment(p.id, commentText);
                      setCommentText("");
                    }}
                  />
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {texts.map((p) => {
            const author = USERS.find((u) => u.id === p.authorId)!;
            return (
              <article
                key={p.id}
                className="anim-in rounded-3xl bg-page p-4 shadow-[var(--shadow-border)]"
              >
                <Link to={`/perfil/${author.id}`} className="mb-3 flex items-center gap-2">
                  <Avatar name={author.name} color={author.avatarColor} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{author.name}</p>
                    <p className="text-[11px] text-muted">@{author.username} · {formatRelative(p.createdAt)}</p>
                  </div>
                </Link>
                <p className="text-[15px] leading-relaxed">{p.text}</p>
                <div className="mt-3">
                  <EngagementBar
                    likes={p.likes}
                    favorites={p.favorites}
                    commentCount={p.comments.length}
                    onLike={() => toggleLike(p.id)}
                    onFavorite={() => toggleFavorite(p.id)}
                    onComment={() => setCommentFor(commentFor === p.id ? null : p.id)}
                    onShare={share}
                  />
                </div>
                {commentFor === p.id && (
                  <CommentBox
                    comments={p.comments}
                    value={commentText}
                    onChange={setCommentText}
                    onSubmit={() => {
                      addComment(p.id, commentText);
                      setCommentText("");
                    }}
                  />
                )}
              </article>
            );
          })}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-fg px-4 py-2 text-sm text-bg shadow-[var(--shadow-bar)]">
          {toast}
        </div>
      )}
    </div>
  );
}

function CommentBox({
  comments,
  value,
  onChange,
  onSubmit,
}: {
  comments: { id: string; authorId: string; text: string }[];
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="mt-2 space-y-2 rounded-2xl bg-surface p-3">
      {comments.map((c) => {
        const a = USERS.find((u) => u.id === c.authorId);
        return (
          <p key={c.id} className="text-sm">
            <span className="font-medium">{a?.name ?? "?"}: </span>
            {c.text}
          </p>
        );
      })}
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Comentar…"
          className="h-9 flex-1 rounded-full bg-bg px-3 text-sm outline-none ring-0 focus:ring-2 focus:ring-ring/70"
        />
        <button type="submit" className="rounded-full bg-accent px-3 text-sm font-medium text-accent-fg">
          Enviar
        </button>
      </form>
    </div>
  );
}
