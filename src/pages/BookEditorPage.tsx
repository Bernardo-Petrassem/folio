import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Trash2, Bold, Italic } from "lucide-react";
import { useStore } from "@/lib/store";
import { wordCount } from "@/lib/utils";

export function BookEditorPage() {
  const { bookId } = useParams();
  const book = useStore((s) => s.books.find((b) => b.id === bookId));
  const updateBook = useStore((s) => s.updateBook);
  const setPageContent = useStore((s) => s.setPageContent);
  const addPage = useStore((s) => s.addPage);
  const deletePage = useStore((s) => s.deletePage);
  const [pageIndex, setPageIndex] = useState(0);
  const [title, setTitle] = useState(book?.title ?? "");

  useEffect(() => {
    if (book) setTitle(book.title);
  }, [book?.id, book?.title]);

  useEffect(() => {
    if (book && pageIndex >= book.pages.length) setPageIndex(Math.max(0, book.pages.length - 1));
  }, [book, pageIndex]);

  if (!book) {
    return (
      <div className="px-4 pt-10 text-center">
        <p>Livro não encontrado.</p>
        <Link to="/livros" className="mt-4 inline-block text-sm underline">Biblioteca</Link>
      </div>
    );
  }

  const page = book.pages[pageIndex];

  function exec(cmd: string) {
    document.execCommand(cmd, false);
  }

  return (
    <div className="desk-grid min-h-dvh pb-8">
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border/60 bg-surface/95 px-3 py-2 backdrop-blur-md">
        <Link to="/livros" className="rounded-full p-2 text-muted hover:bg-fg/6" aria-label="Biblioteca">
          <ArrowLeft className="size-5" />
        </Link>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => updateBook(book.id, { title: title.trim() || "Sem título" })}
          className="min-w-0 flex-1 bg-transparent font-serif text-base font-semibold outline-none"
        />
        <button type="button" onClick={() => exec("bold")} className="rounded-full p-2 text-muted hover:bg-fg/6" aria-label="Negrito">
          <Bold className="size-4" />
        </button>
        <button type="button" onClick={() => exec("italic")} className="rounded-full p-2 text-muted hover:bg-fg/6" aria-label="Itálico">
          <Italic className="size-4" />
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-6 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <div
            key={page?.id}
            className="page-body min-h-[60dvh] rounded-[28px] bg-page px-8 py-10 shadow-[var(--shadow-page)] outline-none"
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Comece a escrever nesta página…"
            onInput={(e) => {
              if (page) setPageContent(book.id, page.id, e.currentTarget.innerHTML);
            }}
            dangerouslySetInnerHTML={{ __html: page?.content ?? "" }}
          />
          <p className="mt-2 px-2 text-xs text-muted tabular-nums">
            {page ? wordCount(page.content) : 0} palavras · página {pageIndex + 1}
          </p>
        </div>

        <div className="flex shrink-0 flex-row items-center justify-center gap-1 rounded-full bg-surface p-1.5 shadow-[var(--shadow-bar)] sm:flex-col">
          <RailBtn label="Anterior" disabled={pageIndex <= 0} onClick={() => setPageIndex((i) => i - 1)}>
            <ChevronLeft className="size-5" />
          </RailBtn>
          <span className="px-2 font-serif text-sm font-semibold tabular-nums">
            {pageIndex + 1}/{book.pages.length}
          </span>
          <RailBtn label="Próxima" disabled={pageIndex >= book.pages.length - 1} onClick={() => setPageIndex((i) => i + 1)}>
            <ChevronRight className="size-5" />
          </RailBtn>
          <RailBtn
            label="Adicionar"
            onClick={() => {
              if (page) {
                addPage(book.id, page.id);
                setPageIndex(pageIndex + 1);
              }
            }}
          >
            <Plus className="size-5" />
          </RailBtn>
          <RailBtn
            label="Remover"
            disabled={book.pages.length <= 1}
            onClick={() => {
              if (page) {
                deletePage(book.id, page.id);
                setPageIndex(Math.max(0, pageIndex - 1));
              }
            }}
          >
            <Trash2 className="size-4" />
          </RailBtn>
        </div>
      </div>
    </div>
  );
}

function RailBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full text-fg hover:bg-fg/6 disabled:opacity-30"
    >
      {children}
    </button>
  );
}
