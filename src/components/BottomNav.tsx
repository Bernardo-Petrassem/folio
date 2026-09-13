import { Home, Plus, Fingerprint, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/criar", label: "+", icon: Plus, special: true },
  { to: "/identidade", label: "Identidade", icon: Fingerprint },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-lg items-center justify-around px-2 py-1.5">
        {items.map((item) => {
          const active =
            item.to === "/home"
              ? pathname.startsWith("/home")
              : item.to === "/identidade"
                ? pathname.startsWith("/identidade")
                : item.to === "/perfil"
                  ? pathname.startsWith("/perfil")
                  : pathname.startsWith("/criar");
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex min-w-[4.5rem] flex-col items-center gap-0.5 rounded-2xl px-3 py-2 text-[10px] font-medium transition-colors",
                  item.special
                    ? "text-accent-fg"
                    : active
                      ? "text-fg"
                      : "text-muted hover:text-fg",
                )}
              >
                {item.special ? (
                  <span className="grid size-11 place-items-center rounded-full bg-accent text-accent-fg shadow-[var(--shadow-border)]">
                    <Icon className="size-5" strokeWidth={2.5} />
                  </span>
                ) : (
                  <>
                    <Icon className={cn("size-5", active && "stroke-[2.25]")} />
                    <span>{item.label}</span>
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
