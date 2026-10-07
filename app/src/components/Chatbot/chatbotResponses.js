export const chatbotResponses = [
  {
    termos: ['doar livro', 'doacao de livro', 'doar livros'],
    texto: 'Que legal querer ajudar! Você pode doar livros didáticos, de literatura, gibis e paradidáticos em bom estado. Basta ir à seção "Doar Livros" no site, preencher o formulário com os dados dos livros e escolher se prefere levar a um ponto de coleta parceiro ou solicitar a retirada, quando disponível na sua região.'
  },
  {
    termos: ['tipo de livro', 'tipos de livro', 'livros aceitos', 'aceitam livro'],
    texto: 'Aceitamos livros de literatura infantil, juvenil e adulta, apostilas e livros didáticos atualizados, além de obras de negócios e finanças. Pedimos apenas que estejam em bom estado, sem páginas rasgadas, mofadas ou ilegíveis.'
  },
  {
    termos: ['receber livro', 'pedir livro', 'livro emprestado', 'livros doados', 'catalogo'],
    texto: 'Se você busca livros para leitura ou apoio nos estudos, acesse a aba "Catálogo de Livros" no site. Lá você pode buscar pelo título ou tema, fazer seu cadastro e solicitar o livro desejado gratuitamente.'
  },
  {
    termos: ['curso de financa', 'conteudo de financa', 'educacao financeira', 'financas gratis'],
    texto: 'Sim! O Educabem oferece artigos práticos, dicas rápidas no blog e cursos introdutórios gratuitos para ajudar você a organizar o orçamento, sair das dívidas e começar a investir.'
  },
  {
    termos: ['organizar meu dinheiro', 'organizar o dinheiro', 'comecar a organizar', 'controle financeiro'],
    texto: 'O primeiro passo é o autoconhecimento financeiro. Registre todas as entradas, como salário e rendas extras, e saídas, como gastos fixos e variáveis, por pelo menos 30 dias. Uma planilha de controle financeiro gratuita pode ajudar nessa jornada.'
  },
  {
    termos: ['sair das dividas', 'sair da divida', 'negociar divida', 'endividamento'],
    texto: 'Temos conteúdos sobre negociação de dívidas, planejamento de curto e longo prazo e prevenção do endividamento. Confira os guias práticos na seção "Educação Financeira" ou converse com nossa equipe de suporte para orientações gerais.'
  },
  {
    termos: ['o que e o educabem', 'sobre o educabem', 'quem e o educabem'],
    texto: 'O Educabem é uma organização sem fins lucrativos dedicada a democratizar o acesso à leitura por meio da doação de livros e a promover a inclusão e a saúde financeira de pessoas e famílias.'
  },
  {
    termos: ['voluntario', 'voluntariado', 'parceiro', 'ponto de coleta', 'trabalhar no educabem'],
    texto: 'Toda ajuda é muito bem-vinda! Você pode participar das ações de triagem de livros e oficinas, ou tornar sua empresa um ponto de coleta parceiro. Acesse "Trabalhe Conosco / Seja Voluntário" para preencher o formulário de inscrição.'
  },
  {
    termos: ['olá', 'ola', 'oi', 'bom dia', 'boa tarde', 'boa noite'],
    texto: 'Olá! Posso ajudar com doação de livros, catálogo, educação financeira, voluntariado ou informações sobre o Educabem.'
  },
  {
    termos: ['obrigado', 'obrigada', 'valeu'],
    texto: 'Por nada! Estou aqui para ajudar.'
  }
];

export function normalizar(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function encontrarResposta(pergunta) {
  const perguntaNormalizada = normalizar(pergunta);
  const resposta = chatbotResponses.find((item) =>
    item.termos.some((termo) => perguntaNormalizada.includes(normalizar(termo)))
  );

  return resposta
    ? resposta.texto
    : 'Ainda não encontrei uma resposta para essa pergunta. Tente perguntar sobre doação de livros, catálogo, educação financeira, dívidas, voluntariado ou sobre o Educabem.';
}
