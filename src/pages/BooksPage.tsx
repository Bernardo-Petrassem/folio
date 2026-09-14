import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookPlus, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { COVERS, type CoverId, type BookVisibility } from "@/lib/types";
import { CURRENT_USER_ID } from "@/lib/mock-data";
import { formatRelative, htmlToText, wordCount } from "@/lib/utils";

export function BooksPage() {
  const navigate = useNavigate();
  const allBooks = useStore((s) => s.books);
  const createBook = useStore((s) => s.createBook);
  const deleteBook = useStore((s) => s.deleteBook);
  const updateBook = useStore((s) => s.updateBook);
  const books = useMemo(() => allBooks.filter((b) => b.ownerId === CURRENT_USER_ID), [allBooks]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState<CoverId>("olive");

  return (
    <div className="px-4 pt-6 pb-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Livros</h1>
          <p className="mt-1 text-sm text-muted">Crie, edite e publique páginas. Livros podem ir para a Identidade.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg"
        >
          <BookPlus className="size-4" />
          Novo
        </button>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-4">
        {books.map((book) => {
          const c = COVERS[book.cover];
          const preview = htmlToText(book.pages[0]?.content ?? "").slice(0, 70);
          const words = book.pages.reduce((n, p) => n + wordCount(p.content), 0);
          return (
            <li key={book.id} className="group relative">
              <Link
                to={`/livro/${book.id}`}
                className="flex aspect-[2/3] w-full flex-col overflow-hidden rounded-3xl p-4 text-left text-cover-ink shadow-[var(--shadow-page)]"
                style={{ background: c.cloth }}
              >
                <p className="font-serif text-lg font-semibold leading-snug">{book.title}</p>
                <p className="mt-1 text-xs opacity-70">{book.author || "Sem autor"}</p>
                <p className="mt-3 line-clamp-3 font-serif text-xs leading-relaxed opacity-65">{preview || "Página em branco."}</p>
                <div className="mt-auto flex justify-between pt-3 text-[11px] opacity-55">
                  <span>{book.pages.length} pág.</span>
                  <span>{words} pal.</span>
                </div>
              </Link>
              <p className="mt-1.5 px-1 text-[11px] text-muted">
                {formatRelative(book.updatedAt)} · {visibilityLabel(book.visibility)}
              </p>
              <div className="mt-1 flex gap-1">
                <select
                  value={book.visibility}
                  onChange={(e) => updateBook(book.id, { visibility: e.target.value as BookVisibility })}
                  className="h-8 flex-1 rounded-full bg-page px-2 text-[11px] shadow-[var(--shadow-border)]"
                  aria-label="Visibilidade"
                >
                  <option value="public">Público</option>
                  <option value="private">Privado</option>
                  <option value="friends">Amigos</option>
                  <option value="followers">Seguidores</option>
                  <option value="following">Quem sigo</option>
                  <option value="specific">Usuários específicos</option>
                </select>
                <button
                  type="button"
                  onClick={() => deleteBook(book.id)}
                  className="rounded-full bg-page p-2 text-muted shadow-[var(--shadow-border)] hover:text-danger"
                  aria-label="Apagar"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-fg/30 p-4">
          <form
            className="w-full max-w-sm rounded-3xl bg-surface p-5 shadow-[var(--shadow-bar)]"
            onSubmit={(e) => {
              e.preventDefault();
              const id = createBook(title || "Sem título", "Marina Vale", cover);
              setOpen(false);
              setTitle("");
              navigate(`/livro/${id}`);
            }}
          >
            <h2 className="font-serif text-lg font-semibold">Novo livro</h2>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título"
              className="mt-4 h-11 w-full rounded-full bg-bg px-4 text-sm outline-none focus:ring-2 focus:ring-ring/70"
            />
            <div className="mt-3 flex gap-2">
              {(["olive", "ink", "clay", "slate", "moss"] as CoverId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setCover(id)}
                  className={`size-8 rounded-full ${cover === id ? "ring-2 ring-fg ring-offset-2 ring-offset-surface" : ""}`}
                  style={{ background: COVERS[id].cloth }}
                  aria-label={COVERS[id].label}
                />
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-full px-4 py-2 text-sm text-muted">
                Cancelar
              </button>
              <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg">
                Criar e abrir
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function visibilityLabel(v: BookVisibility) {
  const map: Record<BookVisibility, string> = {
    public: "público",
    private: "privado",
    friends: "amigos",
    followers: "seguidores",
    following: "quem sigo",
    specific: "específicos",
  };
  return map[v];
}
