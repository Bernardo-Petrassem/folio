import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid() {
  return crypto.randomUUID();
}

export function formatRelative(ts: number) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `há ${hr} h`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "ontem";
  if (day < 7) return `há ${day} dias`;
  return new Date(ts).toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}

export function htmlToText(html: string) {
  if (typeof DOMParser !== "undefined") {
    const doc = new DOMParser().parseFromString(`<div id="r">${html}</div>`, "text/html");
    return (doc.getElementById("r")?.textContent ?? "").trim();
  }
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function wordCount(html: string) {
  const t = htmlToText(html);
  return t ? t.split(/\s+/).filter(Boolean).length : 0;
}
