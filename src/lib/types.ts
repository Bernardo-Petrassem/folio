export type CoverId = "olive" | "ink" | "clay" | "slate" | "moss";

export const COVERS: Record<CoverId, { cloth: string; clothDark: string; label: string }> = {
  olive: { cloth: "#3d4a42", clothDark: "#2c3530", label: "Oliva" },
  ink: { cloth: "#1c1915", clothDark: "#141210", label: "Tinta" },
  clay: { cloth: "#6b5344", clothDark: "#4a3a30", label: "Argila" },
  slate: { cloth: "#3a4450", clothDark: "#2a323b", label: "Ardósia" },
  moss: { cloth: "#4a5540", clothDark: "#343c2e", label: "Musgo" },
};

export const COVER_ORDER: CoverId[] = ["olive", "ink", "clay", "slate", "moss"];

export type BookVisibility = "public" | "private" | "friends" | "followers" | "following" | "specific";

export type Page = { id: string; content: string };

export type Book = {
  id: string;
  title: string;
  author: string;
  cover: CoverId;
  pages: Page[];
  visibility: BookVisibility;
  specificUsers?: string[];
  ownerId: string;
  createdAt: number;
  updatedAt: number;
};

export type User = {
  id: string;
  name: string;
  username: string;
  avatarColor: string;
  bio?: string;
};

/** Paleta e superfície da Identidade — única por pessoa, não feed genérico */
export type IdentityTheme = {
  accent: string; // hex principal
  banner: string; // hex ou gradient hint
  ink: string; // texto sobre banner
  paper: string; // fundo de cartões da identidade
};

export type IdentityProfile = {
  userId: string;
  /** Frase curta que define quem você é neste momento */
  statement: string;
  /** Bio longa da identidade (não do perfil social) */
  identityBio: string;
  theme: IdentityTheme;
  /** URL ou data-url de banner (mock: usamos gradient se vazio) */
  bannerImage?: string;
  updatedAt: number;
};

export const DEFAULT_IDENTITY_THEMES: Record<string, IdentityTheme> = {
  "u-me": { accent: "#3d4a42", banner: "#2c3530", ink: "#f4efe4", paper: "#f7f3eb" },
  "u-leo": { accent: "#6b5344", banner: "#4a3a30", ink: "#f4efe4", paper: "#f7f3eb" },
  "u-ana": { accent: "#3a4450", banner: "#2a323b", ink: "#f4efe4", paper: "#f7f3eb" },
  "u-rui": { accent: "#4a5540", banner: "#343c2e", ink: "#f4efe4", paper: "#f7f3eb" },
};

export type PostKind = "text" | "video";

export type Post = {
  id: string;
  authorId: string;
  kind: PostKind;
  text?: string;
  videoTitle?: string;
  videoHue?: number;
  imageUrl?: string;
  createdAt: number;
  likes: string[];
  favorites: string[];
  comments: { id: string; authorId: string; text: string; createdAt: number }[];
  yarnId?: string;
};

export type HighlightKind = "book" | "yarn" | "text" | "project" | "interest" | "other";

export type Highlight = {
  id: string;
  userId: string;
  kind: HighlightKind;
  title: string;
  subtitle?: string;
  refId?: string;
  color?: string;
};

export type TempDuration = "1d" | "3d" | "7d" | "14d" | "30d";

export type TempHighlight = {
  id: string;
  userId: string;
  title: string;
  sourceLabel: string;
  kind: "video" | "image" | "post" | "book" | "other";
  createdAt: number;
  expiresAt: number;
  duration: TempDuration;
};

export type IdentityPerson = {
  id: string;
  userId: string;
  personId: string;
  reason: string;
};

export type YarnVideo = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  hue: number;
  likes: string[];
  comments: { id: string; authorId: string; text: string; createdAt: number }[];
};

export type Yarn = {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  videos: YarnVideo[];
  createdAt: number;
};

export type Extension = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
};
