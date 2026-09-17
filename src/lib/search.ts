import { escapeRegExp } from "@/lib/utils";
import type { Page } from "@/lib/types";

export type SearchHit = {
  pageIndex: number;
  start: number;
  end: number;
  snippet: string;
};

export function htmlTextContent(html: string) {
  if (typeof DOMParser === "undefined") {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
  const doc = new DOMParser().parseFromString(
    `<div id="folio-root">${html}</div>`,
    "text/html",
  );
  return doc.getElementById("folio-root")?.textContent ?? "";
}

export function findInPages(
  pages: Page[],
  query: string,
  caseSensitive: boolean,
): SearchHit[] {
  const q = query.trim();
  if (!q) return [];
  const hits: SearchHit[] = [];
  const needle = caseSensitive ? q : q.toLowerCase();

  pages.forEach((page, pageIndex) => {
    const text = htmlTextContent(page.content);
    const hay = caseSensitive ? text : text.toLowerCase();
    let from = 0;
    while (from <= hay.length - needle.length) {
      const i = hay.indexOf(needle, from);
      if (i === -1) break;
      const snippetStart = Math.max(0, i - 28);
      const snippetEnd = Math.min(text.length, i + q.length + 28);
      hits.push({
        pageIndex,
        start: i,
        end: i + q.length,
        snippet:
          (snippetStart > 0 ? "…" : "") +
          text.slice(snippetStart, snippetEnd) +
          (snippetEnd < text.length ? "…" : ""),
      });
      from = i + Math.max(q.length, 1);
    }
  });
  return hits;
}

function parseRoot(html: string) {
  const doc = new DOMParser().parseFromString(
    `<div id="folio-root">${html}</div>`,
    "text/html",
  );
  return { doc, root: doc.getElementById("folio-root")! };
}

export function replaceAllInHtml(
  html: string,
  query: string,
  replacement: string,
  caseSensitive: boolean,
): string {
  const q = query.trim();
  if (!q) return html;
  const { doc, root } = parseRoot(html);
  const flags = caseSensitive ? "g" : "gi";
  const re = new RegExp(escapeRegExp(q), flags);
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) nodes.push(n as Text);
  for (const node of nodes) {
    node.data = node.data.replace(re, replacement);
  }
  return root.innerHTML;
}

export function replaceRangeInHtml(
  html: string,
  start: number,
  end: number,
  replacement: string,
): string {
  const text = htmlTextContent(html);
  if (start < 0 || end > text.length || start >= end) return html;
  const before = text.slice(0, start);
  const after = text.slice(end);
  // naive: replace entire content as plain text if structure is complex
  const { root } = parseRoot(html);
  const full = before + replacement + after;
  root.textContent = full;
  return root.innerHTML;
}

export function selectTextOffsets(
  el: HTMLElement,
  start: number,
  end: number,
) {
  const range = document.createRange();
  const sel = window.getSelection();
  let char = 0;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let startNode: Text | null = null;
  let endNode: Text | null = null;
  let startOff = 0;
  let endOff = 0;
  let n: Node | null;
  while ((n = walker.nextNode())) {
    const t = n as Text;
    const len = t.data.length;
    if (!startNode && char + len >= start) {
      startNode = t;
      startOff = start - char;
    }
    if (!endNode && char + len >= end) {
      endNode = t;
      endOff = end - char;
      break;
    }
    char += len;
  }
  if (startNode && endNode && sel) {
    range.setStart(startNode, startOff);
    range.setEnd(endNode, endOff);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}
