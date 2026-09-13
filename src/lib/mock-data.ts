import type { Book, Extension, Highlight, IdentityPerson, Post, TempHighlight, User, Yarn } from "./types";

export const CURRENT_USER_ID = "u-me";

export const USERS: User[] = [
  { id: "u-me", name: "Marina Vale", username: "marinavale", avatarColor: "#3d4a42", bio: "Escrevo e gravo o que estou a construir." },
  { id: "u-leo", name: "Leo Santos", username: "leosantos", avatarColor: "#6b5344", bio: "Treino e projetos longos." },
  { id: "u-ana", name: "Ana Ribeiro", username: "anaribeiro", avatarColor: "#3a4450", bio: "Design e identidade." },
  { id: "u-rui", name: "Rui Costa", username: "ruicosta", avatarColor: "#4a5540", bio: "Música e rotina." },
];

const t = Date.now();

export const SEED_BOOKS: Book[] = [
  {
    id: "guia-folio",
    title: "Guia do Folio",
    author: "Folio",
    cover: "olive",
    visibility: "public",
    ownerId: CURRENT_USER_ID,
    createdAt: t - 86_400_000,
    updatedAt: t - 3_600_000,
    pages: [
      { id: "g1", content: "<p>Bem-vindo ao Folio.</p><p>Este é um caderno para escrever livros página a página. O papel fica no centro.</p>" },
      { id: "g2", content: "<p>Para editar, clique no papel e escreva. Use a barra superior para formatação.</p>" },
      { id: "g3", content: "<p>Os livros podem aparecer na sua Identidade e nos Destaques.</p>" },
    ],
  },
  {
    id: "casa-paginas",
    title: "A Casa das Páginas",
    author: "Marina Vale",
    cover: "clay",
    visibility: "public",
    ownerId: CURRENT_USER_ID,
    createdAt: t - 172_800_000,
    updatedAt: t - 86_400_000,
    pages: [
      { id: "c1", content: "<p>Havia uma casa no fim da rua que só existia para quem precisava de uma frase.</p>" },
      { id: "c2", content: "<p>Lá dentro, os corredores eram estantes. Cada prateleira guardava um capítulo sem dono.</p>" },
    ],
  },
];

export const SEED_POSTS: Post[] = [
  {
    id: "p1",
    authorId: "u-leo",
    kind: "video",
    videoTitle: "Manhã de treino — série 1",
    videoHue: 160,
    createdAt: t - 2 * 3600_000,
    likes: ["u-me"],
    favorites: [],
    comments: [{ id: "c1", authorId: "u-me", text: "Consistência.", createdAt: t - 3600_000 }],
    yarnId: "y-treino",
  },
  {
    id: "p2",
    authorId: "u-ana",
    kind: "video",
    videoTitle: "Esboço da capa do projeto",
    videoHue: 30,
    createdAt: t - 5 * 3600_000,
    likes: [],
    favorites: ["u-me"],
    comments: [],
  },
  {
    id: "p3",
    authorId: "u-rui",
    kind: "video",
    videoTitle: "Som da janela ao fim do dia",
    videoHue: 220,
    createdAt: t - 8 * 3600_000,
    likes: ["u-leo"],
    favorites: [],
    comments: [],
  },
  {
    id: "p4",
    authorId: "u-me",
    kind: "video",
    videoTitle: "Página em branco, café frio",
    videoHue: 45,
    createdAt: t - 12 * 3600_000,
    likes: ["u-ana"],
    favorites: [],
    comments: [],
  },
  {
    id: "p5",
    authorId: "u-ana",
    kind: "text",
    text: "Identidade não é bio. É o que você escolhe mostrar quando alguém quer conhecer quem você é.",
    createdAt: t - 3 * 3600_000,
    likes: ["u-me", "u-leo"],
    favorites: [],
    comments: [],
  },
  {
    id: "p6",
    authorId: "u-leo",
    kind: "text",
    text: "Três semanas sem pular o treino. Não é motivação — é calendário.",
    createdAt: t - 6 * 3600_000,
    likes: [],
    favorites: [],
    comments: [],
  },
  {
    id: "p7",
    authorId: "u-me",
    kind: "text",
    text: "Terminei o segundo capítulo da Casa das Páginas. Amanhã publico uma página no Folio.",
    createdAt: t - 10 * 3600_000,
    likes: ["u-rui"],
    favorites: ["u-ana"],
    comments: [],
  },
];

export const SEED_YARNS: Yarn[] = [
  {
    id: "y-treino",
    ownerId: "u-me",
    name: "Treino",
    description: "Do primeiro dia ao ritmo atual.",
    createdAt: t - 400 * 86_400_000,
    videos: [
      { id: "yv1", title: "Dia 1 — recomeço", date: "2025-03-12", hue: 150, likes: [], comments: [] },
      { id: "yv2", title: "Semana 4 — ritmo", date: "2025-04-08", hue: 155, likes: ["u-me"], comments: [] },
      { id: "yv3", title: "Verão — carga alta", date: "2025-07-22", hue: 35, likes: [], comments: [] },
      { id: "yv4", title: "Outono — pausa e retorno", date: "2025-10-09", hue: 40, likes: [], comments: [] },
      { id: "yv5", title: "2026 — consistência", date: "2026-01-20", hue: 165, likes: ["u-ana"], comments: [] },
      { id: "yv6", title: "Março 2026 — recorde leve", date: "2026-03-05", hue: 170, likes: [], comments: [] },
      { id: "yv7", title: "Hoje — manhã", date: "2026-09-12", hue: 175, likes: [], comments: [] },
    ],
  },
  {
    id: "y-projeto",
    ownerId: "u-me",
    name: "Projeto Casa",
    description: "Etapas da construção da história.",
    createdAt: t - 200 * 86_400_000,
    videos: [
      { id: "yp1", title: "Ideia na mesa", date: "2025-11-01", hue: 25, likes: [], comments: [] },
      { id: "yp2", title: "Primeiro rascunho", date: "2026-01-15", hue: 30, likes: [], comments: [] },
      { id: "yp3", title: "Capítulo 2", date: "2026-06-20", hue: 35, likes: [], comments: [] },
      { id: "yp4", title: "Revisão em voz alta", date: "2026-09-01", hue: 40, likes: [], comments: [] },
    ],
  },
];

export const SEED_HIGHLIGHTS: Highlight[] = [
  { id: "h1", userId: CURRENT_USER_ID, kind: "book", title: "A Casa das Páginas", subtitle: "Livro em curso", refId: "casa-paginas", color: "#6b5344" },
  { id: "h2", userId: CURRENT_USER_ID, kind: "yarn", title: "Treino", subtitle: "Yarn · trajetória", refId: "y-treino", color: "#3d4a42" },
  { id: "h3", userId: CURRENT_USER_ID, kind: "interest", title: "Tipografia", subtitle: "Interesse permanente", color: "#3a4450" },
  { id: "h4", userId: CURRENT_USER_ID, kind: "project", title: "Estúdio em casa", subtitle: "Projeto", color: "#4a5540" },
];

export const SEED_TEMP: TempHighlight[] = [
  {
    id: "th1",
    userId: CURRENT_USER_ID,
    title: "Som da janela ao fim do dia",
    sourceLabel: "Vídeo de @ruicosta",
    kind: "video",
    createdAt: t - 2 * 86_400_000,
    expiresAt: t + 5 * 86_400_000,
    duration: "7d",
  },
];

export const SEED_IDENTITY_PEOPLE: IdentityPerson[] = [
  { id: "ip1", userId: CURRENT_USER_ID, personId: "u-leo", reason: "Treina comigo desde o começo" },
  { id: "ip2", userId: CURRENT_USER_ID, personId: "u-ana", reason: "Olha para o que eu construo com honestidade" },
];

export const SEED_EXTENSIONS: Extension[] = [
  { id: "ext-water", name: "Water Reminder", description: "Lembrete discreto para beber água ao longo do dia.", enabled: false },
  { id: "ext-focus", name: "Focus Hour", description: "Uma hora marcada para escrever sem distrações.", enabled: false },
];
