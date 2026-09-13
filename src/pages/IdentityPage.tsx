import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Avatar } from "@/components/Avatar";
import { useStore } from "@/lib/store";
import { CURRENT_USER_ID, USERS } from "@/lib/mock-data";
import type { TempDuration } from "@/lib/types";

export function IdentityPage() {
  const { userId } = useParams();
  const id = userId ?? CURRENT_USER_ID;
  const isMe = id === CURRENT_USER_ID;
  const user = USERS.find((u) => u.id === id) ?? USERS[0];
  const highlights = useStore((s) => s.highlights.filter((h) => h.userId === id));
  const tempHighlights = useStore((s) => s.tempHighlights.filter((th) => th.userId === id));
  const identityPeople = useStore((s) => s.identityPeople.filter((p) => p.userId === id));
  const yarns = useStore((s) => s.yarns.filter((y) => y.ownerId === id));
  const purgeExpiredTemp = useStore((s) => s.purgeExpiredTemp);
  const addTempHighlight = useStore((s) => s.addTempHighlight);
  const addHighlight = useStore((s) => s.addHighlight);
  const books = useStore((s) => s.books.filter((b) => b.ownerId === id));
  const [showTempForm, setShowTempForm] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [tempDuration, setTempDuration] = useState<TempDuration>("7d");

  useEffect(() => {
    purgeExpiredTemp();
    const t = window.setInterval(() => purgeExpiredTemp(), 30_000);
    return () => clearInterval(t);
  }, [purgeExpiredTemp]);

  const activeTemp = tempHighlights.filter((th) => th.expiresAt > Date.now());

  return (
    <div className="px-4 pt-6 pb-10">
      <div className="flex items-center gap-3">
        <Avatar name={user.name} color={user.avatarColor} size="lg" />
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">Identidade</p>
          <h1 className="font-serif text-2xl font-semibold tracking-tight">{user.name}</h1>
          <p className="text-sm text-muted">@{user.username}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Curadoria do que representa esta pessoa — permanente e do momento.
      </p>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold">Destaques temporários</h2>
          {isMe && (
            <button type="button" onClick={() => setShowTempForm((v) => !v)} className="text-xs font-medium text-muted underline">
              {showTempForm ? "Fechar" : "Adicionar"}
            </button>
          )}
        </div>
        <p className="mb-3 text-xs text-subtle">“Isso está me representando agora.”</p>
        {showTempForm && isMe && (
          <form
            className="mb-4 space-y-2 rounded-3xl bg-surface p-4 shadow-[var(--shadow-border)]"
            onSubmit={(e) => {
              e.preventDefault();
              if (!tempTitle.trim()) return;
              addTempHighlight({ title: tempTitle.trim(), sourceLabel: "Adicionado por você", kind: "other", duration: tempDuration });
              setTempTitle("");
              setShowTempForm(false);
            }}
          >
            <input value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} placeholder="O que te representa agora?" className="h-10 w-full rounded-full bg-bg px-4 text-sm outline-none focus:ring-2 focus:ring-ring/70" />
            <select value={tempDuration} onChange={(e) => setTempDuration(e.target.value as TempDuration)} className="h-10 w-full rounded-full bg-bg px-4 text-sm">
              <option value="1d">1 dia</option>
              <option value="3d">3 dias</option>
              <option value="7d">7 dias</option>
              <option value="14d">14 dias</option>
              <option value="30d">30 dias</option>
            </select>
            <button type="submit" className="w-full rounded-full bg-accent py-2.5 text-sm font-medium text-accent-fg">Colocar no muro temporário</button>
          </form>
        )}
        {activeTemp.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">Nenhum destaque temporário ativo.</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {activeTemp.map((th) => {
              const daysLeft = Math.max(0, Math.ceil((th.expiresAt - Date.now()) / 86_400_000));
              return (
                <div key={th.id} className="w-44 shrink-0 rounded-3xl bg-page p-4 shadow-[var(--shadow-page)]">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-subtle">Agora</p>
                  <p className="mt-1 font-serif text-base font-semibold leading-snug">{th.title}</p>
                  <p className="mt-2 text-xs text-muted">{th.sourceLabel}</p>
                  <p className="mt-3 text-[11px] text-subtle tabular-nums">some em {daysLeft}d</p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold">Destaques</h2>
          {isMe && books[0] && (
            <button
              type="button"
              onClick={() => addHighlight({ kind: "book", title: books[0].title, subtitle: "Livro", refId: books[0].id, color: "#3d4a42" })}
              className="text-xs font-medium text-muted underline"
            >
              Destacar livro
            </button>
          )}
        </div>
        <p className="mb-3 text-xs text-subtle">“Isso faz parte de quem eu sou.”</p>
        <div className="grid grid-cols-2 gap-3">
          {highlights.map((h) => {
            const to = h.kind === "book" && h.refId ? `/livro/${h.refId}` : h.kind === "yarn" && h.refId ? `/yarn/${h.refId}` : undefined;
            const inner = (
              <div className="flex h-full flex-col rounded-3xl p-4 text-cover-ink shadow-[var(--shadow-page)]" style={{ background: h.color ?? "#3d4a42" }}>
                <p className="text-[10px] uppercase tracking-wide opacity-70">{h.kind}</p>
                <p className="mt-1 font-serif text-base font-semibold leading-snug">{h.title}</p>
                {h.subtitle && <p className="mt-auto pt-3 text-xs opacity-70">{h.subtitle}</p>}
              </div>
            );
            return to ? <Link key={h.id} to={to} className="block">{inner}</Link> : <div key={h.id}>{inner}</div>;
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-lg font-semibold">Yarns</h2>
        <p className="mb-3 text-xs text-subtle">Trajetórias em vídeo ao longo do tempo.</p>
        <div className="flex flex-col gap-2">
          {yarns.map((y) => (
            <Link key={y.id} to={`/yarn/${y.id}`} className="flex items-center justify-between rounded-3xl bg-page px-4 py-3 shadow-[var(--shadow-border)]">
              <div>
                <p className="font-medium">{y.name}</p>
                <p className="text-xs text-muted">{y.videos.length} vídeos · sequência temporal</p>
              </div>
              <span className="font-serif text-xl font-semibold text-subtle">Y</span>
            </Link>
          ))}
          {yarns.length === 0 && <p className="text-sm text-muted">Nenhum Yarn ainda.</p>}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-lg font-semibold">Pessoas da identidade</h2>
        <p className="mb-3 text-xs text-subtle">Quem faz parte do que esta pessoa é — não uma lista automática de amigos.</p>
        <div className="flex flex-col gap-3">
          {identityPeople.map((ip) => {
            const person = USERS.find((u) => u.id === ip.personId);
            if (!person) return null;
            return (
              <Link key={ip.id} to={`/identidade/${person.id}`} className="flex items-center gap-3 rounded-3xl bg-page p-3 shadow-[var(--shadow-border)]">
                <Avatar name={person.name} color={person.avatarColor} />
                <div>
                  <p className="font-medium">{person.name}</p>
                  <p className="text-xs text-muted">{ip.reason}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
