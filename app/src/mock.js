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
export const MODULOS = [
  { id: 'm1', titulo: 'Para que serve o dinheiro?',
    texto: ['O dinheiro é uma ferramenta: ele troca o nosso trabalho por coisas de que precisamos hoje e ajuda a guardar valor para amanhã.', 'Quem entende isso deixa de ver o dinheiro como "sorte" e passa a ver como algo que se planeja.'],
    quiz: [
      { p: 'Qual é a melhor definição de dinheiro?', alt: ['Uma ferramenta de troca e de guardar valor', 'Um prêmio para quem tem sorte', 'Algo que só adultos usam', 'Um número no extrato'], certa: 0, exp: 'O dinheiro facilita trocas e permite guardar valor para o futuro.' },
      { p: 'Planejar o dinheiro ajuda principalmente a…', alt: ['Gastar tudo mais rápido', 'Decidir com calma o que é importante', 'Evitar ganhar mais', 'Não conversar sobre o assunto'], certa: 1, exp: 'Planejar é escolher com consciência onde o dinheiro vai.' },
    ] },
  { id: 'm2', titulo: 'Necessidade ou desejo?',
    texto: ['Necessidades são o que mantém a vida funcionando: comida, moradia, saúde, estudo. Desejos são o que queremos, mas dá para esperar.', 'Antes de comprar, pergunte: "Eu preciso disso agora ou eu só quero?". Essa pausa de 10 segundos já economiza muito.'],
    quiz: [
      { p: 'Qual item é uma necessidade?', alt: ['Tênis de marca nova', 'Material escolar', 'Skin de jogo', 'Terceiro videogame'], certa: 1, exp: 'Estudar é uma necessidade; os outros itens são desejos.' },
      { p: 'Qual hábito ajuda a evitar compras por impulso?', alt: ['Comprar na hora', 'Esperar antes de decidir', 'Ouvir só a propaganda', 'Parcelar tudo'], certa: 1, exp: 'Esperar um pouco dá tempo de separar querer de precisar.' },
    ] },
  { id: 'm3', titulo: 'Orçamento simples',
    texto: ['Orçamento é o mapa do seu dinheiro: quanto entra, quanto sai e o que sobra. Uma regra fácil é 50-30-20: 50% para necessidades, 30% para desejos e 20% para guardar.', 'Não precisa ser perfeito. O importante é anotar e ajustar todo mês.'],
    quiz: [
      { p: 'Na regra 50-30-20, o que são os 20%?', alt: ['Lazer', 'Dívidas novas', 'Poupança e metas', 'Presentes'], certa: 2, exp: 'Os 20% são para guardar e construir o futuro.' },
      { p: 'Para que serve um orçamento?', alt: ['Mostrar para onde vai o dinheiro', 'Aumentar o salário', 'Pagar menos imposto', 'Evitar contas'], certa: 0, exp: 'Ele deixa claro quanto entra e quanto sai.' },
    ] },
  { id: 'm4', titulo: 'Reserva de emergência',
    texto: ['Reserva de emergência é um dinheiro guardado para imprevistos: um conserto, uma consulta, uma perda de renda.', 'Comece pequeno: guardar um valor fixo todo mês já cria o hábito. A meta clássica é cobrir de 3 a 6 meses de gastos essenciais.'],
    quiz: [
      { p: 'A reserva de emergência serve para…', alt: ['Viagens de férias', 'Imprevistos', 'Compras em promoção', 'Presentes'], certa: 1, exp: 'Ela protege você quando algo inesperado acontece.' },
      { p: 'Qual é o melhor jeito de começar uma reserva?', alt: ['Esperar sobrar dinheiro', 'Guardar um valor fixo todo mês', 'Guardar só no fim do ano', 'Pedir emprestado'], certa: 1, exp: 'Constância importa mais que o tamanho do valor no início.' },
    ] },
  { id: 'm5', titulo: 'Juros: aliados e vilões',
    texto: ['Juros são o "aluguel do dinheiro". Quando você investe, os juros trabalham a seu favor. Quando você deve, eles trabalham contra você.', 'Por isso, dívidas de cartão e cheque especial devem ser quitadas primeiro: seus juros costumam ser os mais altos.'],
    quiz: [
      { p: 'Quando os juros trabalham a seu favor?', alt: ['Quando você deve', 'Quando você investe', 'Quando atrasa a conta', 'Nunca'], certa: 1, exp: 'Ao investir, você recebe juros pelo dinheiro guardado.' },
      { p: 'Qual dívida costuma ter juros mais altos?', alt: ['Cartão de crédito rotativo', 'Poupança', 'Mesada', 'Doação'], certa: 0, exp: 'O rotativo do cartão está entre os juros mais caros do mercado.' },
    ] },
  { id: 'm6', titulo: 'Metas e o poder do hábito',
    texto: ['Uma meta boa é específica, tem valor e prazo: "guardar R$ 600 em 12 meses" é mais forte que "guardar dinheiro".', 'Dividir a meta em passos pequenos e comemorar cada um mantém a motivação. Quem doa um livro, por exemplo, já começa a criar o hábito de agir pelo bem.'],
    quiz: [
      { p: 'Qual meta é mais bem definida?', alt: ['Juntar dinheiro um dia', 'Guardar R$ 600 em 12 meses', 'Ficar rico', 'Gastar menos'], certa: 1, exp: 'Valor e prazo tornam a meta clara e mensurável.' },
      { p: 'O que mantém a motivação ao longo do tempo?', alt: ['Passos pequenos e comemorar o progresso', 'Mudar de meta todo dia', 'Não contar para ninguém', 'Esperar o fim do prazo'], certa: 0, exp: 'Progresso visível gera vontade de continuar.' },
    ] },
]

const MODULOS_DEMO = ['m1', 'm2', 'm3']
export const doacoes = [] // preenchido por carregarConta()
export const progresso = { concluidos: new Set() }
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
export function pontosTotais() {
  return doacoes.length * PTS.doacao + progresso.concluidos.size * PTS.modulo + (trilhaCompleta() ? PTS.trilha : 0)
}
// Números da Home e do Perfil (doc v4, 4.5)
export function stats() {
  const entregues = doacoes.filter((d) => d.status === 'entregue')
  return { livros: doacoes.length, pontos: pontosTotais(), leitores: entregues.length, instituicoes: new Set(entregues.map((d) => d.inst)).size }
}

export function addDoacao({ titulo, categoria, estado, ponto }) {
  const n = String(doacoes.length + 1).padStart(4, '0')
  doacoes.unshift({ id: `EB-${n}`, titulo, categoria, estado, ponto, inst: ponto.replace(/ \(.*\)/, ''), status: 'registrada', datas: [dm(new Date())] })
  notificar('doacao', `Doação EB-${n} registrada! +${PTS.doacao} pts no Score do Bem.`, `/rastreio/EB-${n}`) // já salva
}
export function concluirModulo(id) {
  if (progresso.concluidos.has(id)) return false
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
  progresso.concluidos = new Set(c.concluidos || [])
}
function vazia(nome, email) { return { nome, email: norm(email), nascimento: '', avatar: null, doacoes: [], notificacoes: [], concluidos: [] } }
function demo() { return { ...vazia('Maria Alves', EMAIL_DEMO), doacoes: structuredClone(DOACOES_DEMO), notificacoes: structuredClone(NOTIF_DEMO), concluidos: [...MODULOS_DEMO] } }

export function salvarConta() {
  if (!usuario.email) return
  const contas = ler(K_CONTAS, {})
  contas[usuario.email] = { nome: usuario.nome, email: usuario.email, nascimento: usuario.nascimento, avatar: usuario.avatar,
    doacoes, notificacoes, concluidos: [...progresso.concluidos] }
  gravar(K_CONTAS, contas)
}
// Editar perfil: se o e-mail muda, a conta muda de chave e a sessão acompanha.
export function atualizarPerfil({ nome, nascimento, email, avatar }) {
  const antigo = usuario.email, novo = norm(email) || antigo
  usuario.nome = nome.trim() || usuario.nome; usuario.nascimento = nascimento || ''; usuario.avatar = avatar; usuario.email = novo
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
export function sair() { aplicar(vazia('', '')); gravar(K_SESSAO, {}) }
export const logado = () => !!ler(K_SESSAO, {}).email

// reabre a sessão ao recarregar a página
{ const e = ler(K_SESSAO, {}).email; const c = e && ler(K_CONTAS, {})[e]; if (c) aplicar(c) }
