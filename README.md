# EducaBem

Educação financeira para todos: doe livros, acompanhe o rastreio e aprenda nas trilhas.
O projeto tem uma **landing page** (`index.html`) e um **web app React** (`app/`), no mesmo build Vite.
O app funciona de dois jeitos: **conectado ao Supabase** (dados reais) ou em **modo de demonstração** (dados no navegador).

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173/  (landing)  ·  /app/#/login  (app)
npm run build      # gera ./dist
npm run preview    # testa o build
```

Requer Node 18+. Para abrir no celular, na mesma rede Wi-Fi: `npm run dev -- --host` e use o endereço `Network`.

## Conectar ao banco (Supabase)

1. Crie um projeto no [Supabase](https://supabase.com) e rode os arquivos de `banco/` no **SQL Editor**, nesta ordem, um de cada vez:
   1. `01_schema.sql`: tabelas, regras de segurança (RLS), trigger do cadastro e funções
   2. `02_seed_base.sql`: níveis, instituição e pontos de coleta
   3. `03_seed_trilha.sql`: módulos, cartões e perguntas da trilha
   4. `04_cancelar_doacao.sql`: função de cancelar doação
2. Em **Authentication → Sign In / Providers → Email**, desligue **Confirm email** (o cadastro entra direto no app).
3. Copie `.env.example` para `.env` e preencha com a URL e a chave **publicável** (Project Settings → API Keys):

   ```
   VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

   O nome precisa começar com `VITE_`, senão o Vite não entrega a variável ao app.
   **Nunca** coloque a `SECRET_KEY` no código, no `.env` ou no GitHub. O `.env` já está no `.gitignore`.

Sem essas duas variáveis, o app abre em **modo de demonstração**.

### O que já usa o banco

Cadastro e login, perfil (nome e nascimento), doações, rastreio, cancelamento, notificações, trilha (progresso e estrelas), pontos e ranking.

### O que ainda não usa

- Foto de perfil (fica só no aparelho)
- Recuperação de senha (a tela avisa que está em construção)
- Login com Google (o botão fica oculto com o banco ligado)
- Apoiar o EducaBem (pagamentos fora do escopo atual)

### Simular o andamento de uma doação

Quem muda o status é a instituição. Por enquanto isso é feito no SQL Editor:

```sql
select mudar_status_doacao(id, 'em_transito') from doacoes order by id desc limit 1;
select mudar_status_doacao(id, 'entregue')    from doacoes order by id desc limit 1;
```

No app, o novo status aparece ao trocar de tela. A notificação chega junto.

## Publicar (GitHub Pages)

O deploy roda pelo GitHub Actions (`.github/workflows/deploy.yml`) a cada push na `main`.
Para o site publicado se conectar ao banco, crie em **Settings → Secrets and variables → Actions** os secrets
`VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`. Sem eles, o site publicado abre em modo de demonstração.

Fluxo de trabalho: cada pessoa trabalha na sua branch (ex.: `feature/nome`) e só depois junta na `main`.
Antes de juntar, rode `npm run build`: a `main` precisa sempre compilar, senão o deploy falha.

## Estrutura

```
index.html, style.css   landing page (o build depende dela: não apague)
app/index.html          entrada do app
app/src/                React (pages, layouts, components, app.css)
app/src/supabase.js     conexão com o Supabase (lê o .env)
app/src/mock.js         estado do app: dados de demonstração + chamadas ao banco
app/src/conteudo.js     conteúdo da trilha (módulos, cartões, quiz, vídeos)
banco/                  scripts SQL do Supabase + gerador do seed da trilha
scripts/                utilitários (ex.: buscar IDs de vídeos do YouTube)
assets/                 imagens (nomes em minúsculas, sem espaços/acentos)
vite.config.js          build com 2 entradas: landing + app
```

## Modo de demonstração

Sem o Supabase, os dados são **mock** e ficam no `localStorage` do navegador. Conta nova começa zerada;
entre com `maria.alves@email.com` para ver a conta de exemplo.

## Trilha e vídeos

O conteúdo fica em `app/src/conteudo.js`. Cada módulo tem um campo `video.id` para o ID do vídeo no YouTube;
enquanto estiver vazio, a tela mostra "Vídeo em produção" e o resumo em texto. Se mudar os textos ou as perguntas,
rode `banco/gerar-seed-trilha.mjs` e execute o novo `03_seed_trilha.sql` no banco.

## Limitações conhecidas

- Os pontos da doação são dados no registro, antes da entrega do livro. O ideal é dar só na entrega.
- A instituição ainda não tem tela própria para confirmar o recebimento (hoje, via SQL).
- A confirmação de e-mail está desligada, então o endereço cadastrado não é verificado.
- Faltam termos de uso e política de privacidade publicados (o cadastro já registra o aceite).
- Não há testes automatizados.

## Assets

Use nomes em minúsculas e sem espaços (ex.: `pilha-azul.png`). O GitHub Pages/Linux diferencia
maiúsculas de minúsculas, então `Medal.png` ≠ `medal.png`.