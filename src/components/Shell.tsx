import { Outlet, Link } from "react-router-dom";
import { Menu, BookOpen, Compass, FileText } from "lucide-react";
import { useState } from "react";
import { BottomNav } from "./BottomNav";
import { ThemeToggle } from "./theme-toggle";
import { useStore } from "@/lib/store";

export function Shell() {
  const [sideOpen, setSideOpen] = useState(false);
  const extensions = useStore((s) => s.extensions);
  const waterOn = extensions.find((e) => e.id === "ext-water")?.enabled;
  const waterGlasses = useStore((s) => s.waterGlasses);

  return (
    <div className="desk-grid min-h-dvh pb-24">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 bg-surface/90 px-4 py-3 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setSideOpen(true)}
          className="rounded-full p-2 text-muted hover:bg-fg/6 hover:text-fg"
          aria-label="Menu"
        >
          <Menu className="size-5" />
        </button>
        <Link to="/identidade" className="font-serif text-lg font-semibold tracking-tight">
          Folio
        </Link>
        <div className="ml-auto flex items-center gap-1">
          {waterOn && (
            <span className="rounded-full bg-fg/6 px-2.5 py-1 text-xs text-muted tabular-nums">
              Água {waterGlasses}
            </span>
          )}
          <ThemeToggle />
          <Link
            to="/livros"
            className="rounded-full p-2 text-muted hover:bg-fg/6 hover:text-fg"
            aria-label="Livros"
          >
            <BookOpen className="size-5" />
          </Link>
        </div>
      </header>

      {sideOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-fg/30"
            aria-label="Fechar menu"
            onClick={() => setSideOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(100%,18rem)] flex-col bg-surface p-5 shadow-[var(--shadow-bar)] anim-in">
            <p className="font-serif text-xl font-semibold">Folio</p>
            <p className="mt-1 text-xs text-muted">Identidade · livros · trajetórias</p>
            <nav className="mt-6 flex flex-col gap-1">
              <SideLink to="/home" onClick={() => setSideOpen(false)}>
                <Compass className="size-4 opacity-70" />
                Descobrir
              </SideLink>
              <SideLink to="/home" onClick={() => setSideOpen(false)}>
                <FileText className="size-4 opacity-70" />
                Posts
              </SideLink>
              <SideLink to="/identidade" onClick={() => setSideOpen(false)}>
                Identidade
              </SideLink>
              <SideLink to="/perfil" onClick={() => setSideOpen(false)}>
                Perfil
              </SideLink>
              <SideLink to="/livros" onClick={() => setSideOpen(false)}>
                Livros
              </SideLink>
              <SideLink to="/yarns" onClick={() => setSideOpen(false)}>
                Yarns
              </SideLink>
              <SideLink to="/extensoes" onClick={() => setSideOpen(false)}>
                Extensões
              </SideLink>
            </nav>
            <p className="mt-auto pt-8 text-[11px] leading-relaxed text-subtle">
              Não é um feed genérico. É a curadoria do que você é — permanente e do momento.
            </p>
          </aside>
        </div>
      )}

      <main className="mx-auto w-full max-w-lg">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

function SideLink({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium hover:bg-fg/6"
    >
      {children}
    </Link>
  );
}
