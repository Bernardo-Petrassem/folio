# Folio — MVP

Rede social centrada em **identidade**, com vídeos como formato principal, Yarns (trajetórias), Destaques, Livros e Extensões.

## Como rodar

```bash
cd folio
npm install
npm run dev
```

Abra o endereço indicado no terminal (ex.: http://localhost:5173).

O app inicia em **Perfil**.

## Navegação principal

HOME | + | IDENTIDADE | PERFIL

## O que está no MVP

- **Perfil** — foto, nome, @username, Postagens (Posts | Mídias), botão Y (Yarns), link para Identidade e Livros
- **Identidade** — Destaques, Destaques Temporários (com duração e expiração), Yarns, pessoas da identidade
- **Home** — Descobrir (vídeos) | Posts (textos), com curtir / comentar / compartilhar / favoritar
- **+** — criar vídeo, texto ou livro
- **Yarns** — criar, adicionar vídeos, navegar por ano/mês, curtir e comentar
- **Livros** — biblioteca, editor página a página, visibilidade (público, privado, amigos, seguidores, quem sigo, específicos)
- **Extensões** — menu lateral → Extensões (ex.: Water Reminder)

Dados ficam no `localStorage` do navegador (zustand persist).
