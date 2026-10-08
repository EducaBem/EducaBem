// gera 03_seed_trilha.sql a partir de app/src/conteudo.js
// uso (na raiz do projeto): node banco/gerar-seed-trilha.mjs > banco/03_seed_trilha.sql
import { MODULOS } from '../app/src/conteudo.js'

const q = (v) => (v == null || v === '' ? 'null' : `'${String(v).replace(/'/g, "''")}'`)
const out = []

MODULOS.forEach((m, i) => {
  const v = m.video || {}
  const cfg = m.atividade.itens ? { opcoes: m.atividade.opcoes, itens: m.atividade.itens } : null
  out.push(`insert into modulos (trilha_id, ordem, slug, titulo, duracao_min, video_youtube_id, video_playlist_id, video_titulo, video_canal, video_resumo, atividade_tipo, atividade_titulo, atividade_dica, atividade_config, lembrar)
values ((select id from trilhas where ordem = 1), ${i + 1}, ${q(m.id)}, ${q(m.titulo)}, ${m.min}, ${q(v.id)}, ${q(v.playlist)}, ${q(v.titulo)}, ${q(v.canal)}, ${q(v.resumo)}, ${q(m.atividade.tipo)}, ${q(m.atividade.titulo)}, ${q(m.atividade.dica)}, ${cfg ? q(JSON.stringify(cfg)) + '::jsonb' : 'null'}, array[${m.lembrar.map(q).join(', ')}]);`)
  m.cards.forEach((c, k) => out.push(`insert into modulo_cartoes (modulo_id, ordem, icone, titulo, texto) values ((select id from modulos where slug = ${q(m.id)}), ${k + 1}, ${q(c.icone)}, ${q(c.t)}, ${q(c.p)});`))
  m.quiz.forEach((p, k) => {
    out.push(`insert into perguntas_quiz (modulo_id, ordem, enunciado, explicacao) values ((select id from modulos where slug = ${q(m.id)}), ${k + 1}, ${q(p.p)}, ${q(p.exp)});`)
    p.alt.forEach((a, n) => out.push(`insert into alternativas (pergunta_id, ordem, texto, correta) values ((select pq.id from perguntas_quiz pq join modulos mo on mo.id = pq.modulo_id where mo.slug = ${q(m.id)} and pq.ordem = ${k + 1}), ${n + 1}, ${q(a)}, ${n === p.certa});`))
  })
  out.push('')
})
console.log(out.join('\n'))
