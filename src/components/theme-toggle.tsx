import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Modo claro" : "Modo escuro"}
      className={cn(
        "relative grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-fg/6 hover:text-fg",
        className,
      )}
    >
      <span className="relative size-4">
        <Sun
          className={cn(
            "absolute inset-0 size-4 transition-[opacity,transform,filter] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]",
            isDark ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none",
          )}
        />
        <Moon
          className={cn(
            "absolute inset-0 size-4 transition-[opacity,transform,filter] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]",
            isDark ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]",
          )}
        />
      </span>
    </button>
  );
}
