# EducaBem

Educação financeira para todos: doe livros, acompanhe o rastreio e aprenda nas trilhas.
Projeto com **landing page** (`index.html`) e **web app React** (`app/`), no mesmo build Vite.

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173/  (landing)  ·  /app/#/login  (app)
npm run build      # gera ./dist
npm run preview    # testa o build
```

Requer Node 18+.

## Estrutura

```
index.html, style.css   landing page
app/index.html          entrada do app
app/src/                React (pages, layouts, components, mock.js, app.css)
assets/                 imagens (nomes em minúsculas, sem espaços/acentos)
vite.config.js          build com 2 entradas: landing + app
```

## Dados de demonstração

Os dados são **mock** (`app/src/mock.js`, salvos no `localStorage`). Conta nova começa zerada;
entre com `maria.alves@email.com` para ver a conta de exemplo. Autenticação e API (Supabase) ainda são TODO.

## Assets

Use nomes em minúsculas e sem espaços (ex.: `pilha-azul.png`). O GitHub Pages/Linux diferencia
maiúsculas de minúsculas, então `Medal.png` ≠ `medal.png`.
