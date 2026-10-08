-- EducaBem: schema do banco (PostgreSQL no Supabase)
-- Rode no SQL Editor do Supabase ou no DBeaver, nesta ordem: 01_schema.sql, 02_seed_base.sql, 03_seed_trilha.sql

-- 1. Pessoas e contas

create table niveis (
  numero     int  primary key,
  nome       text not null,
  pontos_min int  not null unique
);

-- uma linha por conta do Supabase Auth (auth.users); o trigger lá embaixo cria esta linha sozinho
create table usuarios (
  id                    uuid primary key references auth.users (id) on delete cascade,
  nome                  text not null,
  email                 text not null unique,
  data_nascimento       date,
  avatar_url            text,
  tipo                  text not null default 'doador' check (tipo in ('doador', 'instituicao')),
  pontos_totais         int  not null default 0 check (pontos_totais >= 0),
  consentimento_lgpd_em timestamptz,
  criado_em             timestamptz not null default now()
);

create table instituicoes (
  id      bigint generated always as identity primary key,
  nome    text not null,
  cidade  text,
  contato text,
  ativa   boolean not null default true
);

create table pontos_coleta (
  id             bigint generated always as identity primary key,
  instituicao_id bigint not null references instituicoes (id),
  nome           text not null,
  endereco       text,
  ativo          boolean not null default true
);

-- 2. Doações

create table livros (
  id        bigint generated always as identity primary key,
  doador_id uuid not null references usuarios (id),
  titulo    text not null,
  categoria text not null check (categoria in ('Educação financeira', 'Infantil', 'Didático', 'Literatura', 'Outros')),
  estado    text not null check (estado in ('Novo', 'Ótimo', 'Bom', 'Regular')),
  criado_em timestamptz not null default now()
);

create sequence doacao_codigo_seq;

create table doacoes (
  id               bigint generated always as identity primary key,
  codigo           text not null unique default ('EB-' || lpad(nextval('doacao_codigo_seq')::text, 5, '0')),
  doador_id        uuid   not null references usuarios (id),
  livro_id         bigint not null unique references livros (id),
  ponto_coleta_id  bigint not null references pontos_coleta (id),
  status           text   not null default 'registrada' check (status in ('registrada', 'em_transito', 'entregue')),
  quantidade       int    not null default 1 check (quantidade = 1),
  criado_em        timestamptz not null default now()
);
create index on doacoes (doador_id);

-- uma linha por mudança de status: é daqui que sai a timeline do Rastreio do Bem
create table doacao_eventos (
  id        bigint generated always as identity primary key,
  doacao_id bigint not null references doacoes (id) on delete cascade,
  status    text   not null check (status in ('registrada', 'em_transito', 'entregue')),
  criado_em timestamptz not null default now()
);
create index on doacao_eventos (doacao_id);

-- 3. Trilhas de aprendizado

create table trilhas (
  id     bigint generated always as identity primary key,
  titulo text not null,
  ordem  int  not null unique,
  ativa  boolean not null default true
);

-- O vídeo NÃO é guardado no banco: só a referência do YouTube.
-- Use video_youtube_id (11 caracteres do link) OU video_playlist_id. Os dois vazios = "vídeo em produção".
create table modulos (
  id                bigint generated always as identity primary key,
  trilha_id         bigint not null references trilhas (id),
  ordem             int    not null,
  slug              text   not null unique,
  titulo            text   not null,
  duracao_min       int    not null default 5,
  video_youtube_id  text check (video_youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  video_playlist_id text check (video_playlist_id ~ '^[A-Za-z0-9_-]+$'),
  video_titulo      text,
  video_canal       text,
  video_resumo      text,
  atividade_tipo    text check (atividade_tipo in ('classificar', 'amortizar', 'mora')),
  atividade_titulo  text,
  atividade_dica    text,
  atividade_config  jsonb,
  lembrar           text[] not null default '{}',
  unique (trilha_id, ordem)
);

create table modulo_cartoes (
  id        bigint generated always as identity primary key,
  modulo_id bigint not null references modulos (id) on delete cascade,
  ordem     int    not null,
  icone     text,
  titulo    text   not null,
  texto     text   not null,
  unique (modulo_id, ordem)
);

create table perguntas_quiz (
  id         bigint generated always as identity primary key,
  modulo_id  bigint not null references modulos (id) on delete cascade,
  ordem      int    not null,
  enunciado  text   not null,
  explicacao text   not null,
  unique (modulo_id, ordem)
);

create table alternativas (
  id          bigint generated always as identity primary key,
  pergunta_id bigint  not null references perguntas_quiz (id) on delete cascade,
  ordem       int     not null,
  texto       text    not null,
  correta     boolean not null default false,
  unique (pergunta_id, ordem)
);
-- garante exatamente uma alternativa correta por pergunta (no máximo uma; a seed cria uma)
create unique index alternativas_uma_correta on alternativas (pergunta_id) where correta;

create table progresso_modulos (
  usuario_id   uuid   not null references usuarios (id) on delete cascade,
  modulo_id    bigint not null references modulos (id),
  estrelas     int    not null check (estrelas between 1 and 3),
  concluido_em timestamptz not null default now(),
  primary key (usuario_id, modulo_id)
);

-- 4. Score do Bem e notificações

-- cada ponto ganho vira uma linha; o total do usuário é a soma destas linhas
create table pontos_lancamentos (
  id            bigint generated always as identity primary key,
  usuario_id    uuid   not null references usuarios (id) on delete cascade,
  origem        text   not null check (origem in ('doacao', 'modulo', 'trilha')),
  referencia_id bigint not null,
  pontos        int    not null check (pontos > 0),
  criado_em     timestamptz not null default now(),
  unique (usuario_id, origem, referencia_id)   -- impede ganhar duas vezes pela mesma coisa
);

create table notificacoes (
  id         bigint generated always as identity primary key,
  usuario_id uuid not null references usuarios (id) on delete cascade,
  tipo       text not null check (tipo in ('status_doacao', 'trilha', 'retencao', 'sistema')),
  texto      text not null,
  lida       boolean not null default false,
  criado_em  timestamptz not null default now()
);
create index on notificacoes (usuario_id, criado_em desc);

-- 5. Regras no banco (funções)

-- mantém usuarios.pontos_totais igual à soma de pontos_lancamentos
create function somar_pontos() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update usuarios set pontos_totais = pontos_totais + new.pontos where id = new.usuario_id;
  return new;
end $$;
create trigger pontos_somam after insert on pontos_lancamentos
  for each row execute function somar_pontos();

-- cria a linha em usuarios quando alguém se cadastra (e-mail/senha ou Google)
create function criar_usuario_ao_cadastrar() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into usuarios (id, nome, email, consentimento_lgpd_em)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    case when (new.raw_user_meta_data ->> 'aceitou_termos') = 'true' then now() end
  );
  return new;
end $$;
create trigger auth_novo_usuario after insert on auth.users
  for each row execute function criar_usuario_ao_cadastrar();

-- tela "Cadastrar livro": cria livro + doação + evento + 50 pontos + notificação, tudo ou nada
create function registrar_doacao(p_titulo text, p_categoria text, p_estado text, p_ponto_id bigint)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_uid     uuid := auth.uid();
  v_livro   bigint;
  v_doacao  bigint;
  v_codigo  text;
begin
  if v_uid is null then raise exception 'Faça login para doar'; end if;
  if length(trim(coalesce(p_titulo, ''))) = 0 then raise exception 'Informe o nome do livro'; end if;

  insert into livros (doador_id, titulo, categoria, estado)
  values (v_uid, trim(p_titulo), p_categoria, p_estado) returning id into v_livro;

  insert into doacoes (doador_id, livro_id, ponto_coleta_id)
  values (v_uid, v_livro, p_ponto_id) returning id, codigo into v_doacao, v_codigo;

  insert into doacao_eventos (doacao_id, status) values (v_doacao, 'registrada');
  insert into pontos_lancamentos (usuario_id, origem, referencia_id, pontos) values (v_uid, 'doacao', v_doacao, 50);
  insert into notificacoes (usuario_id, tipo, texto)
  values (v_uid, 'status_doacao', 'Doação ' || v_codigo || ' registrada! +50 no Score do Bem.');

  return v_codigo;
end $$;

-- fim do quiz: salva o progresso, guarda a melhor nota e dá 10 pontos só na primeira vez (+50 ao fechar a trilha)
create function concluir_modulo(p_modulo bigint, p_estrelas int)
returns table (primeira_vez boolean, pontos_ganhos int)
language plpgsql security definer set search_path = public as $$
declare
  v_uid    uuid := auth.uid();
  v_trilha bigint;
  v_novo   boolean;
  v_pts    int := 0;
begin
  if v_uid is null then raise exception 'Faça login'; end if;
  select trilha_id into v_trilha from modulos where id = p_modulo;
  if v_trilha is null then raise exception 'Módulo não encontrado'; end if;

  v_novo := not exists (select 1 from progresso_modulos where usuario_id = v_uid and modulo_id = p_modulo);

  insert into progresso_modulos (usuario_id, modulo_id, estrelas)
  values (v_uid, p_modulo, p_estrelas)
  on conflict (usuario_id, modulo_id)
  do update set estrelas = greatest(progresso_modulos.estrelas, excluded.estrelas);

  if v_novo then
    insert into pontos_lancamentos (usuario_id, origem, referencia_id, pontos) values (v_uid, 'modulo', p_modulo, 10);
    v_pts := 10;
    if (select count(*) from modulos m where m.trilha_id = v_trilha)
     = (select count(*) from progresso_modulos p join modulos m on m.id = p.modulo_id
         where p.usuario_id = v_uid and m.trilha_id = v_trilha) then
      insert into pontos_lancamentos (usuario_id, origem, referencia_id, pontos) values (v_uid, 'trilha', v_trilha, 50);
      v_pts := v_pts + 50;
      insert into notificacoes (usuario_id, tipo, texto) values (v_uid, 'trilha', 'Você concluiu a trilha! +50 de bônus no Score do Bem.');
    end if;
  end if;

  return query select v_novo, v_pts;
end $$;

-- uso interno da equipe (SQL Editor): muda o status, registra o evento e avisa o doador
create function mudar_status_doacao(p_doacao bigint, p_status text) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_doador uuid;
  v_codigo text;
begin
  update doacoes set status = p_status where id = p_doacao returning doador_id, codigo into v_doador, v_codigo;
  if v_doador is null then raise exception 'Doação não encontrada'; end if;
  insert into doacao_eventos (doacao_id, status) values (p_doacao, p_status);
  insert into notificacoes (usuario_id, tipo, texto) values (v_doador, 'status_doacao',
    case p_status when 'em_transito' then 'Sua doação ' || v_codigo || ' está a caminho da instituição.'
                  else 'Sua doação ' || v_codigo || ' foi entregue!' end);
  if p_status = 'entregue' then
    insert into notificacoes (usuario_id, tipo, texto) values (v_doador, 'retencao', 'Seu livro chegou! Que tal doar de novo?');
  end if;
end $$;

-- ranking: top N + a linha da pessoa logada, mesmo fora do top
create function ranking(p_limite int default 10)
returns table (posicao bigint, usuario_id uuid, nome text, avatar_url text, pontos int, eu boolean)
language sql stable security definer set search_path = public as $$
  select r.posicao, r.id, r.nome, r.avatar_url, r.pontos_totais, (r.id = auth.uid())
  from (select u.id, u.nome, u.avatar_url, u.pontos_totais,
               rank() over (order by u.pontos_totais desc) as posicao
        from usuarios u) r
  where r.posicao <= p_limite or r.id = auth.uid()
  order by r.posicao, r.nome;
$$;

-- 6. View do perfil (números derivados, nunca guardados)
create view v_perfil with (security_invoker = true) as
select u.id, u.nome, u.avatar_url, u.pontos_totais,
  (select n.numero from niveis n where n.pontos_min <= u.pontos_totais order by n.pontos_min desc limit 1) as nivel,
  (select count(*) from doacoes d where d.doador_id = u.id) as livros_doados,
  (select count(*) from doacoes d where d.doador_id = u.id and d.status = 'entregue') as leitores_impactados,
  (select count(distinct pc.instituicao_id) from doacoes d join pontos_coleta pc on pc.id = d.ponto_coleta_id
    where d.doador_id = u.id and d.status = 'entregue') as instituicoes_apoiadas,
  (select count(*) from progresso_modulos p where p.usuario_id = u.id) as modulos_concluidos
from usuarios u;

-- 7. Segurança (RLS): cada pessoa só enxerga e altera o que é dela
alter table usuarios           enable row level security;
alter table livros             enable row level security;
alter table doacoes            enable row level security;
alter table doacao_eventos     enable row level security;
alter table progresso_modulos  enable row level security;
alter table pontos_lancamentos enable row level security;
alter table notificacoes       enable row level security;
alter table niveis             enable row level security;
alter table instituicoes       enable row level security;
alter table pontos_coleta      enable row level security;
alter table trilhas            enable row level security;
alter table modulos            enable row level security;
alter table modulo_cartoes     enable row level security;
alter table perguntas_quiz     enable row level security;
alter table alternativas       enable row level security;

create policy usuarios_ver_proprio      on usuarios           for select to authenticated using (id = auth.uid());
create policy usuarios_editar_proprio   on usuarios           for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy livros_ver_proprios       on livros             for select to authenticated using (doador_id = auth.uid());
create policy doacoes_ver_proprias      on doacoes            for select to authenticated using (doador_id = auth.uid());
create policy eventos_ver_proprios      on doacao_eventos     for select to authenticated
  using (exists (select 1 from doacoes d where d.id = doacao_id and d.doador_id = auth.uid()));
create policy progresso_ver_proprio     on progresso_modulos  for select to authenticated using (usuario_id = auth.uid());
create policy lancamentos_ver_proprios  on pontos_lancamentos for select to authenticated using (usuario_id = auth.uid());
create policy notificacoes_ver_proprias on notificacoes       for select to authenticated using (usuario_id = auth.uid());
create policy notificacoes_marcar_lida  on notificacoes       for update to authenticated using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());

create policy niveis_ler          on niveis          for select to authenticated using (true);
create policy instituicoes_ler    on instituicoes    for select to authenticated using (ativa);
create policy pontos_coleta_ler   on pontos_coleta   for select to authenticated using (ativo);
create policy trilhas_ler         on trilhas         for select to authenticated using (ativa);
create policy modulos_ler         on modulos         for select to authenticated using (true);
create policy cartoes_ler         on modulo_cartoes  for select to authenticated using (true);
create policy perguntas_ler       on perguntas_quiz  for select to authenticated using (true);
create policy alternativas_ler    on alternativas    for select to authenticated using (true);

-- permissões: começa sem nada e libera só o necessário
revoke all on all tables    in schema public from anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;

grant select on usuarios, livros, doacoes, doacao_eventos, progresso_modulos, pontos_lancamentos, notificacoes,
                niveis, instituicoes, pontos_coleta, trilhas, modulos, modulo_cartoes, perguntas_quiz, alternativas,
                v_perfil to authenticated;
grant update (nome, data_nascimento, avatar_url) on usuarios to authenticated;   -- pontos_totais fica de fora de propósito
grant update (lida) on notificacoes to authenticated;
grant execute on function registrar_doacao(text, text, text, bigint) to authenticated;
grant execute on function concluir_modulo(bigint, int)               to authenticated;
grant execute on function ranking(int)                               to authenticated;
-- mudar_status_doacao fica sem permissão: só roda pelo SQL Editor (service_role)
