import { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Share2 } from "lucide-react";
import { VideoCard } from "@/components/VideoCard";
import { useStore } from "@/lib/store";
import { CURRENT_USER_ID, USERS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function YarnListPage() {
  const yarns = useStore((s) => s.yarns.filter((y) => y.ownerId === CURRENT_USER_ID));
  const createYarn = useStore((s) => s.createYarn);
  const navigate = useNavigate();
  const [name, setName] = useState("");

  return (
    <div className="px-4 pt-6">
      <h1 className="font-serif text-2xl font-semibold">Yarns</h1>
      <p className="mt-1 text-sm text-muted">Trajetórias em vídeo. Crie um Yarn e adicione vídeos ao longo do tempo.</p>
      <form
        className="mt-5 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          const id = createYarn(name.trim());
          setName("");
          navigate(`/yarn/${id}`);
        }}
      >
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do Yarn" className="h-11 flex-1 rounded-full bg-page px-4 text-sm shadow-[var(--shadow-border)] outline-none focus:ring-2 focus:ring-ring/70" />
        <button type="submit" className="rounded-full bg-accent px-4 text-sm font-medium text-accent-fg">Criar</button>
      </form>
      <div className="mt-6 flex flex-col gap-2">
        {yarns.map((y) => (
          <Link key={y.id} to={`/yarn/${y.id}`} className="rounded-3xl bg-page px-4 py-3 shadow-[var(--shadow-border)]">
            <p className="font-medium">{y.name}</p>
            <p className="text-xs text-muted">{y.videos.length} vídeos</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function YarnPage() {
  const { yarnId } = useParams();
  const yarn = useStore((s) => s.yarns.find((y) => y.id === yarnId));
  const addVideoToYarn = useStore((s) => s.addVideoToYarn);
  const toggleYarnVideoLike = useStore((s) => s.toggleYarnVideoLike);
  const addYarnVideoComment = useStore((s) => s.addYarnVideoComment);
  const [index, setIndex] = useState(0);
  const [period, setPeriod] = useState<string>("all");
  const [comment, setComment] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const years = useMemo(() => {
    if (!yarn) return [] as string[];
    return [...new Set(yarn.videos.map((v) => v.date.slice(0, 4)))].sort();
  }, [yarn]);

  const months = useMemo(() => {
    if (!yarn || period === "all" || period.length === 4) {
      const base = period.length === 4 ? yarn?.videos.filter((v) => v.date.startsWith(period)) : yarn?.videos;
      return [...new Set((base ?? []).map((v) => v.date.slice(0, 7)))].sort();
    }
    return [] as string[];
  }, [yarn, period]);

  const filtered = useMemo(() => {
    if (!yarn) return [];
    if (period === "all") return yarn.videos;
    return yarn.videos.filter((v) => v.date.startsWith(period));
  }, [yarn, period]);

  if (!yarn) {
    return (
      <div className="px-4 pt-10 text-center">
        <p>Yarn não encontrado.</p>
        <Link to="/yarns" className="mt-4 inline-block text-sm underline">Voltar</Link>
      </div>
    );
  }

  const video = filtered[Math.min(index, Math.max(0, filtered.length - 1))];
  const owner = USERS.find((u) => u.id === yarn.ownerId);

  return (
    <div className="px-4 pt-4 pb-8">
      <div className="mb-4 flex items-center gap-2">
        <Link to="/yarns" className="text-sm text-muted">Yarns</Link>
        <span className="text-subtle">/</span>
        <h1 className="font-serif text-xl font-semibold">{yarn.name}</h1>
      </div>
      {yarn.description && <p className="mb-4 text-sm text-muted">{yarn.description}</p>}

      <div className="mb-4 flex flex-wrap gap-1.5">
        <Chip active={period === "all"} onClick={() => { setPeriod("all"); setIndex(0); }}>Tudo</Chip>
        {years.map((y) => (
          <Chip key={y} active={period === y || period.startsWith(y + "-")} onClick={() => { setPeriod(y); setIndex(0); }}>{y}</Chip>
        ))}
        {period.length === 4 &&
          months.map((m) => (
            <Chip key={m} active={period === m} onClick={() => { setPeriod(m); setIndex(0); }}>
              {new Date(m + "-01").toLocaleDateString("pt-BR", { month: "short" })}
            </Chip>
          ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted">Nenhum vídeo neste período.</p>
      ) : video ? (
        <div>
          <VideoCard title={video.title} hue={video.hue} large />
          <p className="mt-3 text-sm text-muted">
            {owner?.name} · {new Date(video.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <button type="button" disabled={index <= 0} onClick={() => setIndex((i) => i - 1)} className="rounded-full bg-page p-3 shadow-[var(--shadow-border)] disabled:opacity-30" aria-label="Anterior">
              <ChevronLeft className="size-5" />
            </button>
            <span className="text-xs tabular-nums text-muted">{index + 1} / {filtered.length}</span>
            <button type="button" disabled={index >= filtered.length - 1} onClick={() => setIndex((i) => i + 1)} className="rounded-full bg-page p-3 shadow-[var(--shadow-border)] disabled:opacity-30" aria-label="Próximo">
              <ChevronRight className="size-5" />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button type="button" onClick={() => toggleYarnVideoLike(yarn.id, video.id)} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm hover:bg-fg/6">
              <Heart className={cn("size-4", video.likes.includes(CURRENT_USER_ID) && "fill-current text-danger")} />
              {video.likes.length || ""}
            </button>
            <button type="button" onClick={() => setToast("Compartilhado (protótipo)")} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm hover:bg-fg/6">
              <Share2 className="size-4" />
            </button>
            <span className="inline-flex items-center gap-1.5 px-2 text-sm text-muted">
              <MessageCircle className="size-4" />
              {video.comments.length || ""}
            </span>
          </div>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              addYarnVideoComment(yarn.id, video.id, comment);
              setComment("");
            }}
          >
            <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comentar…" className="h-9 flex-1 rounded-full bg-page px-3 text-sm shadow-[var(--shadow-border)] outline-none" />
            <button type="submit" className="rounded-full bg-accent px-3 text-sm text-accent-fg">Enviar</button>
          </form>
          {video.comments.map((c) => {
            const a = USERS.find((u) => u.id === c.authorId);
            return (
              <p key={c.id} className="mt-2 text-sm">
                <span className="font-medium">{a?.name}: </span>
                {c.text}
              </p>
            );
          })}
        </div>
      ) : null}

      {yarn.ownerId === CURRENT_USER_ID && (
        <button
          type="button"
          className="mt-8 w-full rounded-full border border-border py-3 text-sm font-medium"
          onClick={() => {
            const title = prompt("Título do vídeo");
            if (title) addVideoToYarn(yarn.id, title);
          }}
        >
          Adicionar vídeo a este Yarn
        </button>
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-fg px-4 py-2 text-sm text-bg">{toast}</div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors",
        active ? "bg-accent text-accent-fg" : "bg-page text-muted shadow-[var(--shadow-border)]",
      )}
    >
      {children}
    </button>
  );
}
