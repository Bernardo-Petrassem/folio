import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Video, Type, BookPlus } from "lucide-react";
import { useStore } from "@/lib/store";
import { CURRENT_USER_ID } from "@/lib/mock-data";

export function CreatePage() {
  const navigate = useNavigate();
  const createTextPost = useStore((s) => s.createTextPost);
  const createVideoPost = useStore((s) => s.createVideoPost);
  const createBook = useStore((s) => s.createBook);
  const allYarns = useStore((s) => s.yarns);
  const yarns = useMemo(() => allYarns.filter((y) => y.ownerId === CURRENT_USER_ID), [allYarns]);

  const [mode, setMode] = useState<"menu" | "video" | "text">("menu");
  const [text, setText] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [yarnId, setYarnId] = useState("");

  if (mode === "text") {
    return (
      <div className="px-4 pt-6">
        <h1 className="font-serif text-2xl font-semibold">Publicar texto</h1>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="O que você quer dizer?"
          className="mt-4 w-full rounded-3xl bg-page p-4 text-[15px] leading-relaxed shadow-[var(--shadow-border)] outline-none focus:ring-2 focus:ring-ring/70"
        />
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => setMode("menu")} className="rounded-full px-4 py-2 text-sm text-muted">
            Voltar
          </button>
          <button
            type="button"
            onClick={() => {
              createTextPost(text);
              navigate("/home");
            }}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-fg"
          >
            Publicar
          </button>
        </div>
      </div>
    );
  }

  if (mode === "video") {
    return (
      <div className="px-4 pt-6">
        <h1 className="font-serif text-2xl font-semibold">Publicar vídeo</h1>
        <p className="mt-1 text-sm text-muted">No MVP, o vídeo é representado visualmente.</p>
        <label className="mt-4 block text-sm font-medium">
          Título
          <input
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-full bg-page px-4 text-sm shadow-[var(--shadow-border)] outline-none focus:ring-2 focus:ring-ring/70"
            placeholder="Ex.: Manhã de treino"
          />
        </label>
        <label className="mt-3 block text-sm font-medium">
          Associar a um Yarn (opcional)
          <select
            value={yarnId}
            onChange={(e) => setYarnId(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-full bg-page px-4 text-sm shadow-[var(--shadow-border)] outline-none"
          >
            <option value="">Nenhum</option>
            {yarns.map((y) => (
              <option key={y.id} value={y.id}>
                {y.name}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => setMode("menu")} className="rounded-full px-4 py-2 text-sm text-muted">
            Voltar
          </button>
          <button
            type="button"
            onClick={() => {
              createVideoPost(videoTitle, yarnId || undefined);
              navigate("/home");
            }}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-fg"
          >
            Publicar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      <h1 className="font-serif text-2xl font-semibold">Criar</h1>
      <p className="mt-1 text-sm text-muted">Escolha o tipo de conteúdo.</p>
      <div className="mt-6 flex flex-col gap-3">
        <CreateOption icon={Video} title="Vídeo" desc="Formato principal do Folio" onClick={() => setMode("video")} />
        <CreateOption icon={Type} title="Texto" desc="Publicação textual" onClick={() => setMode("text")} />
        <CreateOption
          icon={BookPlus}
          title="Livro"
          desc="Criar e editar páginas"
          onClick={() => {
            const id = createBook("Sem título", "Marina Vale");
            navigate(`/livro/${id}`);
          }}
        />
      </div>
      <p className="mt-8 text-center text-xs text-subtle">
        Já tem livros? <Link to="/livros" className="underline">Abrir biblioteca</Link>
      </p>
    </div>
  );
}

function CreateOption({
  icon: Icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-4 rounded-3xl bg-page p-4 text-left shadow-[var(--shadow-border)] transition hover:bg-surface"
    >
      <span className="grid size-12 place-items-center rounded-2xl bg-accent/10 text-fg">
        <Icon className="size-5" />
      </span>
      <span>
        <span className="block font-medium">{title}</span>
        <span className="text-sm text-muted">{desc}</span>
      </span>
    </button>
  );
}
