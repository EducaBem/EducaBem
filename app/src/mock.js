import { MODULOS } from './conteudo.js'
import { supabase, temBanco } from './supabase.js'

// Dados falsos para as telas ficarem de pé antes do Supabase. Troque por chamadas à API depois.
// Regras do Score seguem a doc v4 (seção 4.5): uma única moeda (pontos), calculada a partir dos lançamentos.

export const PTS = { doacao: 50, modulo: 10, trilha: 50 }

export const NIVEIS = [
  { n: 1, nome: 'Benevolente', min: 0 }, { n: 2, nome: 'Caridoso', min: 100 }, { n: 3, nome: 'Magnânimo', min: 300 },
  { n: 4, nome: 'Filantropo', min: 600 }, { n: 5, nome: '?', min: 1000 }, // nome do nível 5 ainda a definir
]
export function nivelDe(pontos) {
  const atual = [...NIVEIS].reverse().find((x) => pontos >= x.min)
  const prox = NIVEIS.find((x) => x.n === atual.n + 1)
  return {
    atual, prox, faltam: prox ? prox.min - pontos : 0,
    ganhos: pontos - atual.min, total: prox ? prox.min - atual.min : 0,
    pct: prox ? ((pontos - atual.min) / (prox.min - atual.min)) * 100 : 100,
  }
}

// Status oficiais (doc v4, seção 4.6). etapa = posição na timeline.
export const STATUS = {
  registrada: { texto: 'Doação registrada', cor: 'amarelo', etapa: 0 },
  em_transito: { texto: 'A caminho da instituição', cor: 'azul', etapa: 1 },
  entregue: { texto: 'Entregue na instituição', cor: 'verde', etapa: 2 },
}

export const CATEGORIAS = ['Educação financeira', 'Infantil', 'Didático', 'Literatura', 'Outros']
export const ESTADOS = ['Novo', 'Ótimo', 'Bom', 'Regular']
export const PONTOS_COLETA = ['Biblioteca parceira (exemplo)', 'ONG parceira (exemplo)']

// ---------- doações ----------
const dm = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
const DOACOES_DEMO = [
  { id: 'EB-0003', titulo: 'Dinheiro: os Sinais de Que…', status: 'registrada', datas: ['03/10'], categoria: 'Educação financeira', estado: 'Bom', ponto: 'Biblioteca parceira (exemplo)', inst: 'Biblioteca parceira' },
  { id: 'EB-0002', titulo: 'Educação Financeira pra Marta', status: 'em_transito', datas: ['28/09', '30/09'], categoria: 'Educação financeira', estado: 'Ótimo', ponto: 'ONG parceira (exemplo)', inst: 'ONG parceira' },
  { id: 'EB-0001', titulo: 'Passos Pequenos, Sonhos Grandes', status: 'entregue', datas: ['20/09', '22/09', '25/09'], categoria: 'Infantil', estado: 'Novo', ponto: 'Biblioteca parceira (exemplo)', inst: 'Biblioteca parceira' },
]

// ---------- trilha 1 – conteúdo próprio (doc v4: nada de obra protegida no MVP) ----------
export const TRILHA = { id: 't1', titulo: 'Trilha 1 – O Economista' }
export { MODULOS }

const MODULOS_DEMO = ['m1', 'm2', 'm3']
export const doacoes = [] // preenchido por carregarConta()
export const progresso = { concluidos: new Set(), estrelas: {} }
export const trilhaCompleta = () => progresso.concluidos.size === MODULOS.length
export function estadoModulo(i) {
  if (progresso.concluidos.has(MODULOS[i].id)) return 'concluido'
  return i === 0 || progresso.concluidos.has(MODULOS[i - 1].id) ? 'atual' : 'bloqueado'
}
export const moduloAtual = () => MODULOS.find((m, i) => estadoModulo(i) === 'atual') || MODULOS[MODULOS.length - 1]

// ---------- usuário e pontos ----------
export const usuario = {
  nome: '', email: '', nascimento: '', avatar: null,
  get primeiroNome() { return this.nome.trim().split(' ')[0] || 'você' },
  get inicial() { return (this.nome.trim()[0] || '?').toUpperCase() },
  get pontos() { return pontosTotais() },
}
let pontosDoBanco = null // com o banco ligado, o total vem de usuarios.pontos_totais (o app não calcula sozinho)
export function pontosTotais() {
  if (temBanco && pontosDoBanco !== null) return pontosDoBanco
  return doacoes.length * PTS.doacao + progresso.concluidos.size * PTS.modulo + (trilhaCompleta() ? PTS.trilha : 0)
}
// Números da Home e do Perfil (doc v4, 4.5)
export function stats() {
  const entregues = doacoes.filter((d) => d.status === 'entregue')
  return { livros: doacoes.length, pontos: pontosTotais(), leitores: entregues.length, instituicoes: new Set(entregues.map((d) => d.inst)).size }
}

// Contador de IDs por conta: nunca reaproveita número, mesmo depois de cancelar uma doação.
// (Antes era doacoes.length + 1, o que duplicaria IDs assim que alguém removesse um livro.)
let seqDoacao = 0
function proximoId() {
  const maior = doacoes.reduce((m, d) => Math.max(m, parseInt(String(d.id).slice(3), 10) || 0), 0)
  seqDoacao = Math.max(seqDoacao, maior) + 1
  return `EB-${String(seqDoacao).padStart(4, '0')}`
}
export function addDoacao({ titulo, categoria, estado, ponto }) {
  const id = proximoId()
  doacoes.unshift({ id, titulo, categoria, estado, ponto, inst: ponto.replace(/ \(.*\)/, ''), status: 'registrada', datas: [dm(new Date())] })
  notificar('doacao', `Doação ${id} registrada! +${PTS.doacao} pts no Score do Bem.`, `/rastreio/${id}`) // já salva
  return id
}
// Só dá para desistir enquanto o livro ainda não saiu do ponto de coleta (status "registrada").
// Os pontos voltam sozinhos: pontosTotais() é calculado a partir da lista de doações.
export const podeCancelar = (d) => d?.status === 'registrada'
export function removerDoacao(id) {
  const i = doacoes.findIndex((d) => d.id === id)
  if (i < 0 || !podeCancelar(doacoes[i])) return false
  doacoes.splice(i, 1)
  for (let k = notificacoes.length - 1; k >= 0; k--) if (notificacoes[k].to === `/rastreio/${id}`) notificacoes.splice(k, 1)
  salvarConta() // TODO: DELETE /doacoes/:id (só se status = registrada)
  return true
}
export function concluirModulo(id, estrelas = 1) {
  progresso.estrelas[id] = Math.max(progresso.estrelas[id] || 0, estrelas)
  if (progresso.concluidos.has(id)) { salvarConta(); return false }
  progresso.concluidos.add(id)
  if (trilhaCompleta()) notificar('trilha', `Trilha concluída! +${PTS.trilha} pts de bônus.`)
  salvarConta()
  return true
}

// ---------- medalhas (doc v4: 50/10/5/1 e 4/3/2/1) ----------
export const MEDALHAS = [
  { familia: 'Coração Benigno', valor: () => doacoes.length, unidade: 'vez(es)', faixas: [
    { tier: 'ouro', meta: 50, txt: 'Doe 50 vezes' }, { tier: 'prata', meta: 10, txt: 'Doe 10 vezes' },
    { tier: 'bronze', meta: 5, txt: 'Doe 5 vezes' }, { tier: 'inicial', meta: 1, txt: 'Doe 1 vez' }] },
  { familia: 'Viajante Bonificador', valor: () => (trilhaCompleta() ? 1 : 0), faixas: [
    { tier: 'ouro', meta: 4, txt: 'Complete a Trilha 4' }, { tier: 'prata', meta: 3, txt: 'Complete a Trilha 3' },
    { tier: 'bronze', meta: 2, txt: 'Complete a Trilha 2' }, { tier: 'inicial', meta: 1, txt: 'Complete a Trilha 1' }] },
]

// ---------- ranking (mock; depois: soma de pontos_lancamentos por usuário) ----------
const OUTROS = [['Lucas Menezes', 940], ['Ana Beatriz', 820], ['Pedro Santos', 760], ['Julia Ramos', 640], ['Thainá S.', 520], ['Rafael Lima', 410], ['Camila Dias', 330], ['Bruno Costa', 270], ['Isabelly M.', 150], ['Vitoria P.', 120], ['Cauan M.', 80]]
export function ranking() {
  const todos = [...OUTROS.map(([nome, pontos]) => ({ nome, pontos })), { nome: usuario.nome, pontos: pontosTotais(), eu: true }]
    .sort((a, b) => b.pontos - a.pontos).map((r, i) => ({ ...r, pos: i + 1 }))
  const top = todos.slice(0, 10)
  const eu = todos.find((r) => r.eu)
  return { top, eu, foraDoTop: eu.pos > 10 }
}

// ---------- missões do próximo nível (visuais no MVP) ----------
export function missoes() {
  const nv = nivelDe(pontosTotais())
  if (!nv.prox) return { nv, lista: [] }
  const lista = [{ txt: `Chegue a ${nv.prox.min} pts no Score do Bem`, prog: `${pontosTotais()}/${nv.prox.min}` }]
  if (nv.prox.n === 2) lista.unshift(
    { txt: 'Doe 1 vez.', prog: `${Math.min(doacoes.length, 1)}/1` },
    { txt: 'Conclua a Trilha 1 – O Economista.', prog: `${Math.round((progresso.concluidos.size / MODULOS.length) * 100)}%/100%` },
    { txt: 'Faça uma avaliação do ebook indicado.', prog: '0/1' })
  return { nv, lista }
}

// ---------- notificações (doc v4: status + aviso de retenção) ----------
const NOTIF_DEMO = [
  { id: 1, tipo: 'retencao', texto: 'Seu livro chegou! Que tal doar de novo?', lida: false, to: '/doar' },
  { id: 2, tipo: 'status', texto: 'EB-0002 está a caminho da instituição.', lida: false, to: '/rastreio/EB-0002' },
  { id: 3, tipo: 'status', texto: 'EB-0001 foi entregue na instituição.', lida: true, to: '/rastreio/EB-0001' },
]
export const notificacoes = []
export function notificar(tipo, texto, to = '/score') { notificacoes.unshift({ id: Date.now(), tipo, texto, lida: false, to }); salvarConta() }

// ---------- fora do MVP: apoio e ONGs ----------
export const PLANOS = [
  { id: 'gratis', nome: 'Grátis', sub: 'Plano Gratuito', icone: 'sprout', preco: null, itens: ['Doar livros e acompanhar o rastreio', 'Todas as trilhas, liberadas conforme você avança', 'Score do Bem completo', 'Espaços "Patrocinado"'] },
  { id: 'apoiador', nome: 'Apoiador', preco: 'R$ 9,90', icone: 'heart', destaque: true, itens: ['Tudo do Gratuito', 'Sem anúncios', 'Selo de Apoiador e medalha exclusiva', 'Certificado de conclusão das trilhas', 'R$ 2,00 do plano viram livros para ONGs'] },
  { id: 'guardiao', nome: 'Guardião do Bem', preco: 'R$ 24,90', icone: 'star', itens: ['Tudo do Apoiador', '1 livro doado por mês em seu nome', 'Relatório de impacto mensal', 'Prioridade no resgate de recompensas', 'R$ 8,00 do plano pagam esse livro'] },
]
export const ONGS = [
  { cor: 'amarelo', icone: 'trophy', nome: 'Prêmio Mente Brilhante', texto: 'Meta batida! Você ganhou a medalha de Ouro. Resgate seu brinde exclusivo com a Mente Brilhante e inspire outros colegas.' },
  { cor: 'azul', icone: 'star', nome: 'Instituto Saber a Moeda', texto: 'Acumulou moedas? Troque seu saldo por livros físicos de finanças pessoais em nossa livraria parceira mais próxima!' },
  { cor: 'verde', icone: 'book', nome: 'Leitura que Liberta', texto: 'Retire seu livro gratuitamente em um dos nossos pontos parceiros.' },
]

// ---------- contas e sessão (mock em localStorage; trocar por Supabase Auth + tabelas) ----------
// Cada conta guarda seus próprios dados. Conta nova nasce ZERADA; só o e-mail da demo traz dados de exemplo.
export const EMAIL_DEMO = 'maria.alves@email.com'
const K_CONTAS = 'educabem:contas', K_SESSAO = 'educabem:sessao'
const ler = (k, padrao) => { try { return JSON.parse(localStorage.getItem(k)) ?? padrao } catch { return padrao } }
const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* quota/privado: segue só em memória */ } }
const norm = (email) => (email || '').trim().toLowerCase()
const nomeDoEmail = (email) => norm(email).split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Leitor'

function aplicar(c) {
  usuario.nome = c.nome; usuario.email = c.email; usuario.nascimento = c.nascimento || ''; usuario.avatar = c.avatar || null
  doacoes.length = 0; doacoes.push(...(c.doacoes || []))
  notificacoes.length = 0; notificacoes.push(...(c.notificacoes || []))
  progresso.concluidos = new Set(c.concluidos || []); progresso.estrelas = { ...(c.estrelas || {}) }
  seqDoacao = c.seq || 0
  pontosDoBanco = null
}
function vazia(nome, email) { return { nome, email: norm(email), nascimento: '', avatar: null, doacoes: [], notificacoes: [], concluidos: [], estrelas: {} } }
function demo() { return { ...vazia('Maria Alves', EMAIL_DEMO), doacoes: structuredClone(DOACOES_DEMO), notificacoes: structuredClone(NOTIF_DEMO), concluidos: [...MODULOS_DEMO], estrelas: { m1: 3, m2: 2, m3: 3 } } }

export function salvarConta() {
  if (!usuario.email) return
  const contas = ler(K_CONTAS, {})
  contas[usuario.email] = { nome: usuario.nome, email: usuario.email, nascimento: usuario.nascimento, avatar: usuario.avatar,
    doacoes, notificacoes, concluidos: [...progresso.concluidos], estrelas: progresso.estrelas, seq: seqDoacao }
  gravar(K_CONTAS, contas)
}
// Editar perfil: se o e-mail muda, a conta muda de chave e a sessão acompanha.
export function atualizarPerfil({ nome, nascimento, email, avatar }) {
  const antigo = usuario.email, novo = temBanco ? antigo : (norm(email) || antigo) // com banco, o e-mail é o do login e não muda aqui
  usuario.nome = nome.trim() || usuario.nome; usuario.nascimento = nascimento || ''; usuario.avatar = avatar; usuario.email = novo
  if (temBanco) { // grava nome e nascimento no banco (a foto continua só neste aparelho até existir o Storage)
    supabase.auth.getSession().then(({ data }) => {
      const id = data.session?.user.id
      return id && supabase.from('usuarios').update({ nome: usuario.nome, data_nascimento: usuario.nascimento || null }).eq('id', id)
    }).then((r) => { if (r?.error) console.warn('Não salvou o perfil no banco:', r.error.message) }).catch((e) => console.warn(e))
  }
  if (novo !== antigo) { const contas = ler(K_CONTAS, {}); delete contas[antigo]; gravar(K_CONTAS, contas); gravar(K_SESSAO, { email: novo }) }
  salvarConta()
}
// Cadastro: cria a conta zerada e deixa "pendente" até o código ser confirmado.
export function criarConta({ nome, email }) {
  const e = norm(email), contas = ler(K_CONTAS, {})
  if (!contas[e]) { contas[e] = vazia(nome.trim() || nomeDoEmail(e), e); gravar(K_CONTAS, contas) }
  gravar(K_SESSAO, { pendente: e })
  return contas[e]
}
export const emailPendente = () => ler(K_SESSAO, {}).pendente || ''
// Login / confirmação de código: ativa a sessão. TODO: senha e código validados pelo Supabase.
export function entrar(email) {
  const e = norm(email), contas = ler(K_CONTAS, {})
  const c = contas[e] || (e === EMAIL_DEMO ? demo() : vazia(nomeDoEmail(e), e))
  aplicar(c); salvarConta(); gravar(K_SESSAO, { email: e })
}
export function entrarGoogle() { entrar('visitante@gmail.com') } // TODO: supabase.auth.signInWithOAuth({ provider: 'google' })
export function sair() { aplicar(vazia('', '')); gravar(K_SESSAO, {}); if (temBanco) supabase.auth.signOut().catch(() => {}) }
export const logado = () => !!ler(K_SESSAO, {}).email

// reabre a sessão ao recarregar a página
{ const e = ler(K_SESSAO, {}).email; const c = e && ler(K_CONTAS, {})[e]; if (c) aplicar(c) }

// ---------- login real com Supabase Auth (só quando temBanco) ----------
// Já vêm do banco: conta, login, perfil, doações, rastreio e notificações. Trilha, estrelas e ranking ainda ficam no localStorage de cada conta.
function traduzirErro(e) {
  if (e?.code === 'P0001' && e.message) return e.message // erros escritos nas funções do banco (ex.: "Faça login para doar")
  const m = `${e?.code || ''} ${e?.message || ''}`.toLowerCase()
  if (m.includes('invalid_credentials') || m.includes('invalid login')) return 'E-mail ou senha incorretos.'
  if (m.includes('already') && (m.includes('registered') || m.includes('exists'))) return 'Este e-mail já tem conta. Tente entrar.'
  if (m.includes('weak_password') || m.includes('at least')) return 'A senha precisa ter pelo menos 6 caracteres.'
  if (m.includes('rate') || e?.status === 429) return 'Muitas tentativas. Espere um minuto e tente de novo.'
  if (m.includes('email_not_confirmed')) return 'Confirme seu e-mail antes de entrar.'
  if (m.includes('failed to fetch') || m.includes('network')) return 'Sem conexão com o servidor. Confira sua internet.'
  console.error('Erro do Supabase:', e)
  return 'Não foi possível concluir. Tente de novo.'
}

// Traz o perfil do banco e junta com os dados locais da conta (doações, trilha, pontos).
async function carregarPerfilBanco(user) {
  const { data } = await supabase.from('usuarios').select('nome, email, data_nascimento').eq('id', user.id).maybeSingle()
  const email = norm(data?.email || user.email)
  aplicar(ler(K_CONTAS, {})[email] || vazia('', email))
  usuario.email = email
  usuario.nome = data?.nome || nomeDoEmail(email)
  usuario.nascimento = data?.data_nascimento || ''
  salvarConta(); gravar(K_SESSAO, { email })
  await atualizarDoBanco() // doações, notificações e pontos de coleta
}

export async function entrarBanco({ email, senha }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha })
  if (error) throw new Error(traduzirErro(error))
  await carregarPerfilBanco(data.user)
}

export async function criarContaBanco({ nome, email, senha }) {
  const { data, error } = await supabase.auth.signUp({ email: email.trim(), password: senha, options: { data: { nome: nome.trim(), aceitou_termos: 'true' } } })
  if (error) throw new Error(traduzirErro(error))
  if (!data.session) throw new Error('Conta criada, mas o projeto ainda exige confirmação por e-mail. Desligue "Confirm email" em Authentication → Sign In / Providers → Email.')
  await carregarPerfilBanco(data.user)
}

// Chamada uma vez ao abrir o app: o login passa a valer só se existir sessão de verdade no Supabase.
export async function iniciarSessao() {
  if (!temBanco) return
  try {
    const { data } = await supabase.auth.getSession()
    if (data.session) await carregarPerfilBanco(data.session.user)
    else { aplicar(vazia('', '')); gravar(K_SESSAO, {}) }
  } catch { /* sem rede: segue com o que já estava salvo */ }
  supabase.auth.onAuthStateChange((evento) => {
    if (evento === 'SIGNED_OUT' && logado()) { aplicar(vazia('', '')); gravar(K_SESSAO, {}); window.location.hash = '#/login' } // sessão expirou
  })
}

// ---------- doações, rastreio e notificações no banco ----------
const MODULOS_BANCO = new Map() // slug -> id numérico do módulo no banco
const PONTOS_BANCO = [] // { id, nome } dos pontos de coleta; PONTOS_COLETA (nomes) é preenchido a partir daqui
const um = (v) => (Array.isArray(v) ? v[0] : v)
const destinoNotificacao = (r) => {
  const codigo = r.texto.match(/EB-\d+/)?.[0]
  if (r.tipo === 'status_doacao' && codigo) return `/rastreio/${codigo}`
  return r.tipo === 'retencao' ? '/doar' : r.tipo === 'trilha' ? '/trilha' : '/score'
}

async function carregarDadosBanco() {
  const [pc, d, n, mo, pr, us] = await Promise.all([
    supabase.from('pontos_coleta').select('id, nome').order('id'),
    supabase.from('doacoes').select('id, codigo, status, criado_em, livros(titulo, categoria, estado), pontos_coleta(nome, instituicoes(nome)), doacao_eventos(status, criado_em)').order('criado_em', { ascending: false }),
    supabase.from('notificacoes').select('id, tipo, texto, lida, criado_em').order('criado_em', { ascending: false }).limit(30),
    supabase.from('modulos').select('id, slug'),
    supabase.from('progresso_modulos').select('modulo_id, estrelas'),
    supabase.from('usuarios').select('pontos_totais').maybeSingle(), // a regra de segurança só devolve a linha da própria pessoa
  ])
  const falha = pc.error || d.error || n.error || mo.error || pr.error || us.error
  if (falha) throw falha
  if (pc.data.length) {
    PONTOS_BANCO.length = 0; PONTOS_BANCO.push(...pc.data)
    PONTOS_COLETA.length = 0; PONTOS_COLETA.push(...pc.data.map((p) => p.nome))
  }
  const lista = d.data.map((x) => {
    const livro = um(x.livros) || {}, ponto = um(x.pontos_coleta) || {}, inst = um(ponto.instituicoes) || {}
    const eventos = [...(x.doacao_eventos || [])].sort((a, b) => (a.criado_em < b.criado_em ? -1 : 1))
    return { id: x.codigo, dbId: x.id, titulo: livro.titulo, categoria: livro.categoria, estado: livro.estado, ponto: ponto.nome || '',
      inst: (inst.nome || '').replace(/ \(.*\)/, ''), status: x.status, datas: eventos.map((e) => dm(new Date(e.criado_em))) }
  })
  doacoes.length = 0; doacoes.push(...lista)
  const doBanco = n.data.map((r) => ({ id: `db${r.id}`, db: true, tipo: r.tipo, texto: r.texto, lida: r.lida, to: destinoNotificacao(r) }))
  notificacoes.length = 0; notificacoes.push(...doBanco)
  // trilha: o banco guarda o id numérico; o app usa o slug (m1, m2...), que é igual ao id do módulo no conteudo.js
  MODULOS_BANCO.clear(); mo.data.forEach((x) => MODULOS_BANCO.set(x.slug, x.id))
  const slugDe = new Map(mo.data.map((x) => [x.id, x.slug]))
  progresso.concluidos = new Set(pr.data.map((x) => slugDe.get(x.modulo_id)).filter(Boolean))
  progresso.estrelas = Object.fromEntries(pr.data.filter((x) => slugDe.has(x.modulo_id)).map((x) => [slugDe.get(x.modulo_id), x.estrelas]))
  pontosDoBanco = us.data?.pontos_totais ?? null
}

// Recarrega do banco, uma de cada vez (fila), e nunca lança erro: se a rede falhar, a tela segue com o que já tem.
let fila = Promise.resolve()
export function atualizarDoBanco() {
  if (!temBanco) return Promise.resolve(false)
  const rodar = async () => {
    try { await carregarDadosBanco(); salvarConta(); return true } catch (e) { console.warn('Não carregou os dados do banco:', e?.message || e); return false }
  }
  fila = fila.then(rodar, rodar)
  return fila
}

export async function addDoacaoBanco({ titulo, categoria, estado, ponto }) {
  const pc = PONTOS_BANCO.find((p) => p.nome === ponto)
  if (!pc) throw new Error('Ponto de coleta não encontrado. Recarregue a página e tente de novo.')
  const { data: codigo, error } = await supabase.rpc('registrar_doacao', { p_titulo: titulo, p_categoria: categoria, p_estado: estado, p_ponto_id: pc.id })
  if (error) throw new Error(traduzirErro(error))
  await atualizarDoBanco()
  return codigo
}

export async function removerDoacaoBanco(codigo) {
  const d = doacoes.find((x) => x.id === codigo)
  if (!d || !podeCancelar(d)) return false
  const { error } = await supabase.rpc('cancelar_doacao', { p_doacao: d.dbId })
  if (error) throw new Error(traduzirErro(error))
  await atualizarDoBanco()
  return true
}

// Ao fechar o painel de notificações: marca as do banco como lidas.
export function marcarLidasBanco() {
  if (!temBanco || !notificacoes.some((n) => n.db && !n.lida)) return
  supabase.from('notificacoes').update({ lida: true }).eq('lida', false)
    .then((r) => { if (r.error) console.warn('Não marcou como lidas:', r.error.message) })
}

// Fim do quiz: o banco guarda as estrelas (fica a melhor nota), dá 10 pts só na 1ª vez e +50 ao fechar a trilha.
// Devolve true se foi a primeira vez neste módulo.
export async function concluirModuloBanco(slug, estrelas) {
  const id = MODULOS_BANCO.get(slug)
  if (!id) throw new Error('Módulo não encontrado no banco. Recarregue a página e tente de novo.')
  const { data, error } = await supabase.rpc('concluir_modulo', { p_modulo: id, p_estrelas: estrelas })
  if (error) throw new Error(traduzirErro(error))
  await atualizarDoBanco()
  return Boolean(data?.[0]?.primeira_vez)
}

// Ranking de verdade: top 10 + a linha da pessoa logada. Os outros aparecem abreviados ("Ana S."), por privacidade.
export async function rankingBanco() {
  const { data, error } = await supabase.rpc('ranking', { p_limite: 10 })
  if (error) throw new Error(traduzirErro(error))
  const abreviar = (nome) => { const p = (nome || '').trim().split(/\s+/).filter(Boolean); return p.length > 1 ? `${p[0]} ${p[p.length - 1][0]}.` : p[0] || 'Leitor' }
  const linhas = data.map((r) => ({ pos: Number(r.posicao), nome: r.eu ? r.nome : abreviar(r.nome), pontos: r.pontos, eu: r.eu }))
  const eu = linhas.find((r) => r.eu)
  const top = linhas.filter((r) => r.pos <= 10).slice(0, 10)
  return { top, eu, foraDoTop: Boolean(eu) && !top.includes(eu) }
}
