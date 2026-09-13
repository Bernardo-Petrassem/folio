import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function VideoCard({
  title,
  hue,
  className,
  large,
  onClick,
}: {
  title: string;
  hue: number;
  className?: string;
  large?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-3xl text-left shadow-[var(--shadow-page)]",
        large ? "aspect-[9/14]" : "aspect-[9/12]",
        className,
      )}
      style={{
        background: `linear-gradient(160deg, hsl(${hue} 28% 28%), hsl(${(hue + 40) % 360} 22% 16%))`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="grid size-14 place-items-center rounded-full bg-page/20 text-cover-ink backdrop-blur-sm transition-transform group-hover:scale-105">
          <Play className="size-6 fill-current" />
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 pt-12 bg-gradient-to-t from-black/50 to-transparent">
        <p className="font-serif text-base font-semibold leading-snug text-cover-ink">{title}</p>
      </div>
    </button>
  );
}
