import { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Fingerprint, BookOpen } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { VideoCard } from "@/components/VideoCard";
import { EngagementBar } from "@/components/EngagementBar";
import { useStore } from "@/lib/store";
import { CURRENT_USER_ID, USERS } from "@/lib/mock-data";
import { cn, formatRelative } from "@/lib/utils";

export function ProfilePage() {
  const { userId } = useParams();
  const id = userId ?? CURRENT_USER_ID;
  const isMe = id === CURRENT_USER_ID;
  const user = USERS.find((u) => u.id === id) ?? USERS[0]!;
  const allPosts = useStore((s) => s.posts);
  const allYarns = useStore((s) => s.yarns);
  const allBooks = useStore((s) => s.books);
  const toggleLike = useStore((s) => s.toggleLike);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const navigate = useNavigate();
  const [mediaTab, setMediaTab] = useState<"posts" | "midias">("posts");
  const posts = useMemo(() => allPosts.filter((p) => p.authorId === id), [allPosts, id]);
  const yarns = useMemo(() => allYarns.filter((y) => y.ownerId === id), [allYarns, id]);
  const books = useMemo(() => allBooks.filter((b) => b.ownerId === id), [allBooks, id]);
  const textPosts = useMemo(() => posts.filter((p) => p.kind === "text"), [posts]);
  const mediaPosts = useMemo(() => posts.filter((p) => p.kind === "video"), [posts]);

  return (
    <div className="px-4 pt-6 pb-8">
      <div className="flex items-start gap-4">
        <Avatar name={user.name} color={user.avatarColor} size="xl" />
        <div className="min-w-0 flex-1 pt-1">
          <h1 className="font-serif text-2xl font-semibold tracking-tight">{user.name}</h1>
          <p className="text-sm text-muted">@{user.username}</p>
          {user.bio && <p className="mt-2 text-sm leading-relaxed text-muted">{user.bio}</p>}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          to={isMe ? "/identidade" : `/identidade/${id}`}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg"
        >
          <Fingerprint className="size-4" />
          Identidade
        </Link>
        <button
          type="button"
          onClick={() => {
            if (yarns[0]) navigate(`/yarn/${yarns[0].id}`);
            else if (isMe) navigate("/yarns");
          }}
          className="inline-flex size-10 items-center justify-center rounded-full bg-page font-serif text-lg font-semibold shadow-[var(--shadow-border)]"
          aria-label="Yarns"
        >
          Y
        </button>
        <Link
          to="/livros"
          className="inline-flex items-center gap-2 rounded-full bg-page px-4 py-2 text-sm shadow-[var(--shadow-border)]"
        >
          <BookOpen className="size-4" />
          Livros ({books.length})
        </Link>
      </div>
      {yarns.length > 0 && (
        <section className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted">Yarns</h2>
            {isMe && (
              <Link to="/yarns" className="text-xs text-muted underline">
                Ver todos
              </Link>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {yarns.map((y) => (
              <Link
                key={y.id}
                to={`/yarn/${y.id}`}
                className="shrink-0 rounded-2xl bg-page px-4 py-3 shadow-[var(--shadow-border)]"
              >
                <p className="font-medium">{y.name}</p>
                <p className="text-xs text-muted">{y.videos.length} vídeos</p>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="mt-8">
        <h2 className="font-serif text-lg font-semibold">Postagens</h2>
        <div className="mt-3 flex gap-1 rounded-full bg-surface p-1 shadow-[var(--shadow-border)]">
          {(["posts", "midias"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setMediaTab(t)}
              className={cn(
                "flex-1 rounded-full py-2 text-sm font-medium transition-colors",
                mediaTab === t ? "bg-accent text-accent-fg" : "text-muted",
              )}
            >
              {t === "posts" ? "Posts" : "Mídias"}
            </button>
          ))}
        </div>
        {mediaTab === "posts" ? (
          <div className="mt-4 flex flex-col gap-3">
            {textPosts.length === 0 && (
              <p className="py-8 text-center text-sm text-muted">Nenhum post textual.</p>
            )}
            {textPosts.map((p) => (
              <article key={p.id} className="rounded-3xl bg-page p-4 shadow-[var(--shadow-border)]">
                <p className="text-[11px] text-muted">{formatRelative(p.createdAt)}</p>
                <p className="mt-2 text-[15px] leading-relaxed">{p.text}</p>
                <div className="mt-3">
                  <EngagementBar
                    likes={p.likes}
                    favorites={p.favorites}
                    commentCount={p.comments.length}
                    onLike={() => toggleLike(p.id)}
                    onFavorite={() => toggleFavorite(p.id)}
                    onComment={() => {}}
                    onShare={() => {}}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {mediaPosts.length === 0 && (
              <p className="col-span-2 py-8 text-center text-sm text-muted">Nenhuma mídia.</p>
            )}
            {mediaPosts.map((p) => (
              <VideoCard key={p.id} title={p.videoTitle ?? "Vídeo"} hue={p.videoHue ?? 40} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
