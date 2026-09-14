import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Book,
  CoverId,
  Extension,
  Highlight,
  HighlightKind,
  IdentityPerson,
  Page,
  Post,
  TempDuration,
  TempHighlight,
  Yarn,
  YarnVideo,
} from "./types";
import { COVER_ORDER } from "./types";
import {
  CURRENT_USER_ID,
  SEED_BOOKS,
  SEED_EXTENSIONS,
  SEED_HIGHLIGHTS,
  SEED_IDENTITY_PEOPLE,
  SEED_POSTS,
  SEED_TEMP,
  SEED_YARNS,
} from "./mock-data";
import { uid } from "./utils";

const DURATION_MS: Record<TempDuration, number> = {
  "1d": 86_400_000,
  "3d": 3 * 86_400_000,
  "7d": 7 * 86_400_000,
  "14d": 14 * 86_400_000,
  "30d": 30 * 86_400_000,
};

function blankPage(): Page {
  return { id: uid(), content: "" };
}

type State = {
  books: Book[];
  posts: Post[];
  yarns: Yarn[];
  highlights: Highlight[];
  tempHighlights: TempHighlight[];
  identityPeople: IdentityPerson[];
  extensions: Extension[];
  waterGlasses: number;

  createBook: (title?: string, author?: string, cover?: CoverId) => string;
  updateBook: (id: string, patch: Partial<Pick<Book, "title" | "author" | "cover" | "visibility">>) => void;
  deleteBook: (id: string) => void;
  setPageContent: (bookId: string, pageId: string, content: string) => void;
  addPage: (bookId: string, afterPageId?: string) => string | undefined;
  deletePage: (bookId: string, pageId: string) => void;

  toggleLike: (postId: string) => void;
  toggleFavorite: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  createTextPost: (text: string) => void;
  createVideoPost: (title: string, yarnId?: string) => void;

  createYarn: (name: string, description?: string) => string;
  addVideoToYarn: (yarnId: string, title: string, date?: string) => void;
  toggleYarnVideoLike: (yarnId: string, videoId: string) => void;
  addYarnVideoComment: (yarnId: string, videoId: string, text: string) => void;

  addHighlight: (h: Omit<Highlight, "id" | "userId">) => void;
  removeHighlight: (id: string) => void;
  addTempHighlight: (opts: { title: string; sourceLabel: string; kind: TempHighlight["kind"]; duration: TempDuration }) => void;
  purgeExpiredTemp: () => void;
  addIdentityPerson: (personId: string, reason: string) => void;
  removeIdentityPerson: (id: string) => void;

  toggleExtension: (id: string) => void;
  addWaterGlass: () => void;
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      books: SEED_BOOKS,
      posts: SEED_POSTS,
      yarns: SEED_YARNS,
      highlights: SEED_HIGHLIGHTS,
      tempHighlights: SEED_TEMP,
      identityPeople: SEED_IDENTITY_PEOPLE,
      extensions: SEED_EXTENSIONS,
      waterGlasses: 0,

      createBook: (title = "Sem título", author = "", cover) => {
        const id = uid();
        const chosen: CoverId = cover ?? COVER_ORDER[get().books.length % COVER_ORDER.length] ?? "olive";
        const book: Book = {
          id,
          title: title.trim() || "Sem título",
          author: author.trim(),
          cover: chosen,
          pages: [blankPage()],
          visibility: "private",
          ownerId: CURRENT_USER_ID,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((s) => ({ books: [book, ...s.books] }));
        return id;
      },
      updateBook: (id, patch) =>
        set((s) => ({
          books: s.books.map((b) => (b.id === id ? { ...b, ...patch, updatedAt: Date.now() } : b)),
        })),
      deleteBook: (id) => set((s) => ({ books: s.books.filter((b) => b.id !== id) })),
      setPageContent: (bookId, pageId, content) =>
        set((s) => ({
          books: s.books.map((b) =>
            b.id !== bookId
              ? b
              : {
                  ...b,
                  updatedAt: Date.now(),
                  pages: b.pages.map((p) => (p.id === pageId ? { ...p, content } : p)),
                },
          ),
        })),
      addPage: (bookId, afterPageId) => {
        const page = blankPage();
        set((s) => ({
          books: s.books.map((b) => {
            if (b.id !== bookId) return b;
            const pages = [...b.pages];
            const idx = afterPageId ? pages.findIndex((p) => p.id === afterPageId) : pages.length - 1;
            pages.splice(idx + 1, 0, page);
            return { ...b, pages, updatedAt: Date.now() };
          }),
        }));
        return page.id;
      },
      deletePage: (bookId, pageId) =>
        set((s) => ({
          books: s.books.map((b) => {
            if (b.id !== bookId || b.pages.length <= 1) return b;
            return { ...b, pages: b.pages.filter((p) => p.id !== pageId), updatedAt: Date.now() };
          }),
        })),

      toggleLike: (postId) =>
        set((s) => ({
          posts: s.posts.map((p) => {
            if (p.id !== postId) return p;
            const has = p.likes.includes(CURRENT_USER_ID);
            return { ...p, likes: has ? p.likes.filter((x) => x !== CURRENT_USER_ID) : [...p.likes, CURRENT_USER_ID] };
          }),
        })),
      toggleFavorite: (postId) =>
        set((s) => ({
          posts: s.posts.map((p) => {
            if (p.id !== postId) return p;
            const has = p.favorites.includes(CURRENT_USER_ID);
            return {
              ...p,
              favorites: has ? p.favorites.filter((x) => x !== CURRENT_USER_ID) : [...p.favorites, CURRENT_USER_ID],
            };
          }),
        })),
      addComment: (postId, text) => {
        const t = text.trim();
        if (!t) return;
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id !== postId
              ? p
              : {
                  ...p,
                  comments: [
                    ...p.comments,
                    { id: uid(), authorId: CURRENT_USER_ID, text: t, createdAt: Date.now() },
                  ],
                },
          ),
        }));
      },
      createTextPost: (text) => {
        const t = text.trim();
        if (!t) return;
        const post: Post = {
          id: uid(),
          authorId: CURRENT_USER_ID,
          kind: "text",
          text: t,
          createdAt: Date.now(),
          likes: [],
          favorites: [],
          comments: [],
        };
        set((s) => ({ posts: [post, ...s.posts] }));
      },
      createVideoPost: (title, yarnId) => {
        const post: Post = {
          id: uid(),
          authorId: CURRENT_USER_ID,
          kind: "video",
          videoTitle: title.trim() || "Vídeo sem título",
          videoHue: Math.floor(Math.random() * 360),
          createdAt: Date.now(),
          likes: [],
          favorites: [],
          comments: [],
          yarnId,
        };
        set((s) => ({ posts: [post, ...s.posts] }));
        if (yarnId) {
          get().addVideoToYarn(yarnId, title.trim() || "Vídeo sem título");
        }
      },

      createYarn: (name, description) => {
        const id = uid();
        const yarn: Yarn = {
          id,
          ownerId: CURRENT_USER_ID,
          name: name.trim() || "Yarn",
          description: description?.trim(),
          videos: [],
          createdAt: Date.now(),
        };
        set((s) => ({ yarns: [yarn, ...s.yarns] }));
        return id;
      },
      addVideoToYarn: (yarnId, title, date) => {
        const video: YarnVideo = {
          id: uid(),
          title: title.trim() || "Vídeo",
          date: date ?? new Date().toISOString().slice(0, 10),
          hue: Math.floor(Math.random() * 360),
          likes: [],
          comments: [],
        };
        set((s) => ({
          yarns: s.yarns.map((y) =>
            y.id !== yarnId ? y : { ...y, videos: [...y.videos, video] },
          ),
        }));
      },
      toggleYarnVideoLike: (yarnId, videoId) =>
        set((s) => ({
          yarns: s.yarns.map((y) => {
            if (y.id !== yarnId) return y;
            return {
              ...y,
              videos: y.videos.map((v) => {
                if (v.id !== videoId) return v;
                const has = v.likes.includes(CURRENT_USER_ID);
                return {
                  ...v,
                  likes: has ? v.likes.filter((x) => x !== CURRENT_USER_ID) : [...v.likes, CURRENT_USER_ID],
                };
              }),
            };
          }),
        })),
      addYarnVideoComment: (yarnId, videoId, text) => {
        const t = text.trim();
        if (!t) return;
        set((s) => ({
          yarns: s.yarns.map((y) => {
            if (y.id !== yarnId) return y;
            return {
              ...y,
              videos: y.videos.map((v) =>
                v.id !== videoId
                  ? v
                  : {
                      ...v,
                      comments: [
                        ...v.comments,
                        { id: uid(), authorId: CURRENT_USER_ID, text: t, createdAt: Date.now() },
                      ],
                    },
              ),
            };
          }),
        }));
      },

      addHighlight: (h) =>
        set((s) => ({
          highlights: [
            ...s.highlights,
            { ...h, id: uid(), userId: CURRENT_USER_ID },
          ],
        })),
      removeHighlight: (id) => set((s) => ({ highlights: s.highlights.filter((h) => h.id !== id) })),
      addTempHighlight: ({ title, sourceLabel, kind, duration }) => {
        const now = Date.now();
        const item: TempHighlight = {
          id: uid(),
          title,
          sourceLabel,
          kind,
          userId: CURRENT_USER_ID,
          createdAt: now,
          expiresAt: now + DURATION_MS[duration],
          duration,
        };
        set((s) => ({ tempHighlights: [item, ...s.tempHighlights] }));
      },
      purgeExpiredTemp: () => {
        const now = Date.now();
        set((s) => {
          const next = s.tempHighlights.filter((th) => th.expiresAt > now);
          if (next.length === s.tempHighlights.length) return s;
          return { tempHighlights: next };
        });
      },
      addIdentityPerson: (personId, reason) => {
        if (get().identityPeople.some((p) => p.personId === personId && p.userId === CURRENT_USER_ID)) return;
        set((s) => ({
          identityPeople: [
            ...s.identityPeople,
            { id: uid(), userId: CURRENT_USER_ID, personId, reason },
          ],
        }));
      },
      removeIdentityPerson: (id) =>
        set((s) => ({ identityPeople: s.identityPeople.filter((p) => p.id !== id) })),

      toggleExtension: (id) =>
        set((s) => ({
          extensions: s.extensions.map((e) => (e.id === id ? { ...e, enabled: !e.enabled } : e)),
        })),
      addWaterGlass: () => set((s) => ({ waterGlasses: s.waterGlasses + 1 })),
    }),
    {
      name: "folio-mvp",
      partialize: (s) => ({
        books: s.books,
        posts: s.posts,
        yarns: s.yarns,
        highlights: s.highlights,
        tempHighlights: s.tempHighlights,
        identityPeople: s.identityPeople,
        extensions: s.extensions,
        waterGlasses: s.waterGlasses,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<State>;
        return {
          ...current,
          ...p,
          books: Array.isArray(p.books) ? p.books : current.books,
          posts: Array.isArray(p.posts) ? p.posts : current.posts,
          yarns: Array.isArray(p.yarns) ? p.yarns : current.yarns,
          highlights: Array.isArray(p.highlights) ? p.highlights : current.highlights,
          tempHighlights: Array.isArray(p.tempHighlights) ? p.tempHighlights : current.tempHighlights,
          identityPeople: Array.isArray(p.identityPeople) ? p.identityPeople : current.identityPeople,
          extensions: Array.isArray(p.extensions) ? p.extensions : current.extensions,
          waterGlasses: typeof p.waterGlasses === "number" ? p.waterGlasses : current.waterGlasses,
        };
      },
    },
  ),
);

export type { HighlightKind };
