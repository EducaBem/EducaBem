// Base de conhecimento do chatbot do EducaBem.
// Cada item: termos (palavras-chave, sem acento), texto (resposta) e, opcionalmente, link (botão que leva a uma tela do app).
// Regras dos termos: "doar" casa só a palavra inteira; "doac*" casa qualquer palavra que COMECE com "doac" (doação, doações...).
// Quando duas respostas casam, vence a que casou os termos mais específicos (mais longos).
// Os números (pontos, níveis, etapas) espelham o app: PTS, NIVEIS e STATUS em app/src/mock.js. Se mudar lá, mude aqui.

export const MENSAGEM_INICIAL = 'Olá! Eu sou o Bem, o beija-flor do EducaBem. Posso ajudar com doação de livros, rastreio, pontos e trilha de educação financeira. Como posso ajudar?'

export const SUGESTOES = ['Como doar um livro?', 'Como funciona o rastreio?', 'Como ganho pontos?', 'O que tem na trilha?']

export const RESPOSTA_PADRAO =
  'Ainda não encontrei uma resposta para essa pergunta. Tente perguntar sobre doar livros, rastreio da doação, pontos e níveis, medalhas, trilha de educação financeira ou como apoiar o EducaBem.'

export const chatbotResponses = [
  {
    termos: ['oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'e ai', 'eai', 'hello'],
    texto: 'Olá! Posso ajudar com doação de livros, rastreio, pontos e níveis, trilha de educação financeira ou apoio ao projeto. O que você quer saber?'
  },
  {
    termos: ['como doar', 'quero doar', 'doar', 'doo', 'doac*', 'doacao de livro', 'como funciona a doacao', 'doar livro', 'doar livros'],
    texto: 'É simples e sem frete: 1) cadastre seu livro, informando o título e o estado de conservação; 2) escolha o ponto parceiro e leve o livro pessoalmente; 3) pronto, seu livro chega a novas histórias e você ganha 50 pontos no Score do Bem.',
    link: { to: '/doar', rotulo: 'Ir para Doar Livros' }
  },
  {
    termos: ['tipo de livro', 'tipos de livro', 'livros aceitos', 'aceitam livro', 'que livro', 'quais livros', 'categoria', 'categorias', 'estado do livro', 'estado de conservacao', 'conservacao'],
    texto: 'No cadastro você escolhe a categoria do livro: Educação financeira, Infantil, Didático, Literatura ou Outros. Também informa o estado: Novo, Ótimo, Bom (pequenos desgastes) ou Regular (marcas de uso, mas legível). O importante é o livro estar legível e inteiro.'
  },
  {
    termos: ['frete', 'entregar', 'onde entregar', 'ponto de coleta', 'pontos de coleta', 'ponto parceiro', 'levar o livro', 'retirada', 'buscar o livro'],
    texto: 'Você leva o livro pessoalmente a um ponto parceiro, como uma biblioteca ou ONG. Não tem frete nem intermediário. Na hora de cadastrar a doação você escolhe onde vai entregar.',
    link: { to: '/ongs', rotulo: 'Ver ONGs parceiras' }
  },
  {
    termos: ['rastreio', 'rastrear', 'acompanhar', 'entregue', 'foi entregue', 'chegou', 'status', 'onde esta meu livro', 'minhas doacoes', 'etapas', 'notificacao', 'notificacoes'],
    texto: 'No Rastreio do Bem você acompanha cada doação em 3 etapas: Registrada, A caminho da instituição e Entregue. Quando a instituição dá baixa na entrega, você é avisado pelas notificações (o sininho no topo). Em "Ver detalhes" aparece o histórico de cada livro.',
    link: { to: '/rastreio', rotulo: 'Abrir Rastreio do Bem' }
  },
  {
    termos: ['cancelar', 'cancelo', 'cancela', 'cancelamento', 'desistir', 'desfazer doacao', 'apagar doacao', 'remover doacao'],
    texto: 'Dá para cancelar a doação no Rastreio do Bem, em "Cancelar doação", enquanto o livro ainda não saiu do ponto de coleta. Depois que ele sai, o cancelamento não é mais possível. Ao cancelar, você deixa de contar os 50 pontos daquela doação.',
    link: { to: '/rastreio', rotulo: 'Ir para o Rastreio' }
  },
  {
    termos: ['ponto', 'pontos', 'pontuacao', 'score', 'score do bem', 'ganhar ponto', 'ganho ponto', 'como pontuar', 'quanto vale'],
    texto: 'No Score do Bem você ganha: 50 pontos por doação, 10 pontos por módulo concluído da trilha e 50 pontos ao completar a trilha inteira. Os pontos fazem você subir de nível e conquistar medalhas.',
    link: { to: '/score', rotulo: 'Ver meu Score do Bem' }
  },
  {
    termos: ['nivel', 'niveis', 'subir de nivel', 'benevolente', 'caridoso', 'magnanimo', 'filantropo', 'proximo nivel'],
    texto: 'Os níveis são: 1 Benevolente (começa com 0 pontos), 2 Caridoso (100), 3 Magnânimo (300), 4 Filantropo (600) e o nível 5, que começa em 1000 pontos. Na tela do Score você vê quanto falta para o próximo.',
    link: { to: '/score', rotulo: 'Ver meu nível' }
  },
  {
    termos: ['medalha', 'medalhas', 'conquista', 'conquistas', 'coracao benigno', 'viajante bonificador', 'ouro', 'prata', 'bronze'],
    texto: 'Existem duas famílias de medalhas. Coração Benigno é por doações: 1 doação (inicial), 5 (bronze), 10 (prata) e 50 (ouro). Viajante Bonificador é pela trilha: complete as Trilhas 1, 2, 3 e 4 para conquistar da inicial até a de ouro.',
    link: { to: '/score', rotulo: 'Ver minhas medalhas' }
  },
  {
    termos: ['ranking', 'classificacao', 'top 10', 'posicao'],
    texto: 'O Ranking mostra os 10 leitores com mais pontos e a sua posição. Quanto mais você doa e estuda na trilha, mais sobe.',
    link: { to: '/ranking', rotulo: 'Abrir Ranking' }
  },
  {
    termos: ['recompensa', 'recompensas', 'brinde', 'brindes', 'trocar ponto', 'trocar pontos', 'resgatar', 'desconto', 'descontos', 'premio'],
    texto: 'A troca de pontos por recompensas ainda está chegando. Por enquanto a seção aparece como "Em breve" no Score do Bem. Continue acumulando pontos que eles já contam para o seu nível e suas medalhas.'
  },
  {
    termos: ['trilha', 'trilhas', 'modulo', 'modulos', 'curso', 'cursos', 'aula', 'aulas', 'quiz', 'estudar', 'aprender', 'educacao financeira', 'financas', 'conteudo'],
    texto: 'A Trilha de educação financeira tem 5 módulos curtos, de uns 5 minutos: Renda extra pela internet, O ciclo da dívida, Atrasada, negativada ou caducada?, O que é amortização? e Juros de mora. Cada um traz vídeo do Serasa Ensina, cartões de resumo, uma atividade e um quiz. Cada módulo concluído vale 10 pontos.',
    link: { to: '/trilha', rotulo: 'Abrir a Trilha' }
  },
  {
    termos: ['divida', 'dividas', 'endividado', 'endividamento', 'sair das dividas', 'negociar', 'negativada', 'negativado', 'caducada', 'caduca', 'nome sujo'],
    texto: 'Dívida atrasada é a conta não paga até o vencimento e pode gerar juros. Negativada é quando a empresa credora pede e o nome é registrado nos birôs de crédito. Caducada é a dívida que, depois de cinco anos, pode deixar de aparecer nos birôs, mas a pendência continua existindo com a empresa. A Trilha explica isso em vídeo e quiz.',
    link: { to: '/trilha', rotulo: 'Ver na Trilha' }
  },
  {
    termos: ['juros de mora', 'mora', 'juros', 'atraso', 'atrasar'],
    texto: 'Juros de mora são cobrados pelo atraso no pagamento de uma conta. Quanto maior o período de atraso, maior pode ficar o valor dos juros. Pagar dentro do prazo evita essa cobrança, e se for atrasar, o melhor é resolver o quanto antes.',
    link: { to: '/trilha', rotulo: 'Ver módulo na Trilha' }
  },
  {
    termos: ['amortizar', 'amortizacao', 'saldo devedor'],
    texto: 'Amortizar é pagar uma parte do que você deve para reduzir o valor devido. Ao amortizar, o saldo devedor (quanto ainda falta pagar) pode diminuir, e quanto mais você amortiza, menos falta para quitar.',
    link: { to: '/trilha', rotulo: 'Ver módulo na Trilha' }
  },
  {
    termos: ['renda extra', 'golpe', 'golpes', 'lucro facil', 'ganhar dinheiro', 'aplicativo de renda'],
    texto: 'Renda extra é o dinheiro que entra além da renda principal, e aplicativos e plataformas online podem ser um caminho. Antes de se cadastrar, confira se a plataforma é segura e verdadeira, e desconfie de promessas de lucro muito alto e fácil, que são o sinal de alerta mais comum de golpe.',
    link: { to: '/trilha', rotulo: 'Ver módulo na Trilha' }
  },
  {
    termos: ['receber livro', 'receber livros', 'pegar livro', 'pedir livro', 'retirar livro', 'ganhar livro', 'livro gratis', 'catalogo', 'quero ler'],
    texto: 'Para ler, você pode retirar livros gratuitamente nos pontos parceiros. Veja a lista de instituições parceiras na tela de ONGs Parceiras.',
    link: { to: '/ongs', rotulo: 'Ver ONGs parceiras' }
  },
  {
    termos: ['ong', 'ongs', 'ongs parceiras', 'instituicao', 'instituicoes', 'biblioteca', 'bibliotecas', 'parceiro', 'parceiros'],
    texto: 'As instituições parceiras recebem os livros e dão baixa no sistema, e é isso que atualiza o seu Rastreio do Bem. Você encontra todas na tela de ONGs Parceiras.',
    link: { to: '/ongs', rotulo: 'Ver ONGs parceiras' }
  },
  {
    termos: ['apoiar', 'apoio', 'plano', 'planos', 'plano mensal', 'assinar', 'assinatura', 'pix', 'cartao', 'contribuir', 'contribuicao', 'doar dinheiro', 'ajudar o projeto'],
    texto: 'Doar livros é gratuito. Quem quiser ajudar a manter a plataforma no ar pode apoiar de duas formas: Plano Mensal, com vantagens, ou Doar uma vez, via Pix ou cartão, com valores de R$ 10, 25, 50, 100 ou outro valor. O pagamento ainda está em breve.',
    link: { to: '/apoiar', rotulo: 'Apoiar o EducaBem' }
  },
  {
    termos: ['perfil', 'editar perfil', 'meus dados', 'minha conta', 'foto', 'avatar', 'nome da conta', 'alterar dados'],
    texto: 'Na tela de Perfil você vê seus dados e pode editá-los, como nome e foto.',
    link: { to: '/perfil', rotulo: 'Abrir Perfil' }
  },
  {
    termos: ['senha', 'esqueci', 'esqueci a senha', 'recuperar senha', 'redefinir senha', 'login', 'entrar', 'cadastro', 'criar conta', 'sair'],
    texto: 'Se esqueceu a senha, use a opção de recuperar senha na tela de login, que envia um código de confirmação para o seu e-mail. Para sair da conta, use o botão "Sair" no menu.'
  },
  {
    termos: ['voluntario', 'voluntariado', 'trabalhar no educabem', 'seja voluntario', 'trabalhe conosco'],
    texto: 'Essa opção ainda não está disponível no app. Hoje você ajuda doando livros, estudando a trilha ou apoiando o projeto na tela Apoiar o EducaBem.',
    link: { to: '/apoiar', rotulo: 'Apoiar o EducaBem' }
  },
  {
    termos: ['o que e o educabem', 'sobre o educabem', 'quem e o educabem', 'missao do educabem', 'serasa', 'objetivo do projeto'],
    texto: 'O EducaBem é uma plataforma que une doação de livros e educação financeira, alinhada à missão da Serasa. Você doa livros a instituições parceiras, acompanha a jornada deles no Rastreio do Bem, aprende em trilhas interativas e ganha pontos no Score do Bem. Nosso lema: "Quem lê, aprende bem".'
  },
  {
    termos: ['mascote', 'beija flor', 'beijaflor', 'quem e voce', 'seu nome', 'quem e bem'],
    texto: 'Eu sou o Bem, o beija-flor mascote do EducaBem! Uso mochila, carrego um livro e estou aqui para ajudar você a doar e aprender.'
  },
  {
    termos: ['obrigado', 'obrigada', 'valeu', 'brigado', 'agradeco'],
    texto: 'Por nada! Estou aqui sempre que precisar.'
  },
  {
    termos: ['tchau', 'ate logo', 'ate mais', 'flw'],
    texto: 'Até logo! Quem lê, aprende bem.'
  }
]

export function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // tira acentos
    .replace(/[^a-z0-9*\s]/g, ' ') // pontuação vira espaço
    .replace(/\s+/g, ' ')
    .trim()
}

function escapar(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Termo simples casa palavra(s) inteira(s); termo terminado em * casa prefixo de palavra.
function casa(textoNormalizado, termo) {
  const t = normalizar(termo)
  const prefixo = termo.trim().endsWith('*')
  const base = escapar(t.replace(/\*/g, ''))
  const re = new RegExp(`(^| )${base}${prefixo ? '' : '( |$)'}`)
  return re.test(textoNormalizado)
}

// Devolve o item de resposta mais específico (ou null).
export function encontrarItem(pergunta) {
  const texto = normalizar(pergunta)
  if (!texto) return null
  let melhor = null
  let melhorPontos = 0
  for (const item of chatbotResponses) {
    const pontos = item.termos.reduce((soma, termo) => (casa(texto, termo) ? soma + normalizar(termo).length : soma), 0)
    if (pontos > melhorPontos) { melhor = item; melhorPontos = pontos }
  }
  return melhor
}

// Mantida por compatibilidade: devolve só o texto.
export function encontrarResposta(pergunta) {
  return encontrarItem(pergunta)?.texto ?? RESPOSTA_PADRAO
}
