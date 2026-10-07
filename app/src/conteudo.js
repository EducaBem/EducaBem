// vídeo: preencha url, id ou playlist
// vídeos e quizzes: Serasa Ensina (documento da trilha de educação financeira)

const CANAL = 'Serasa Ensina'

export const MODULOS = [
  {
    id: 'm1', titulo: 'Renda extra pela internet', min: 5,
    video: { id: 'zmISrAl8h24', canal: CANAL, titulo: 'Renda extra com aplicativos', resumo: 'Aplicativos e plataformas online podem render uma renda extra, mas é preciso conferir se são seguros e desconfiar de promessas de lucro alto e fácil.' },
    cards: [
      { icone: 'bag', t: 'Renda além do salário', p: 'Renda extra é todo dinheiro que entra além da sua renda principal. Hoje, aplicativos e plataformas online são um caminho possível para conseguir essa renda.' },
      { icone: 'lock', t: 'Confira antes de se cadastrar', p: 'Veja se a plataforma é segura e verdadeira: pesquise o nome, confira se existe canal de atendimento e nunca passe a senha do seu banco.' },
      { icone: 'bell', t: 'Desconfie do lucro fácil', p: 'Promessas de ganhar muito, rápido e sem esforço são o sinal de alerta mais comum de golpe. Plataforma séria não costuma pedir pagamento antecipado para liberar seus ganhos.' },
    ],
    atividade: { tipo: 'classificar', titulo: 'Parece seguro ou é sinal de alerta?', dica: 'Toque na opção de cada situação.', opcoes: ['Parece seguro', 'Sinal de alerta'],
      itens: [['Promete lucro muito alto e fácil', 1], ['Pede um pagamento antecipado para liberar seus ganhos', 1], ['Tem CNPJ, regras claras e um canal de atendimento que você consegue conferir', 0], ['Pede a senha do seu banco', 1], ['Não cobra nada para participar e explica como o pagamento funciona', 0]] },
    lembrar: ['Aplicativos e plataformas online podem gerar renda extra.', 'Antes de se cadastrar, confira se a plataforma é segura e verdadeira.', 'Desconfie de promessas de lucro muito alto e fácil.'],
    quiz: [
      { p: 'Segundo a aula, uma possibilidade de conseguir renda extra é:', alt: ['Utilizar aplicativos e plataformas online', 'Fazer empréstimos frequentemente', 'Aumentar o limite do cartão', 'Deixar de pagar contas'], certa: 0, exp: 'Aplicativos e plataformas online são uma das formas de conseguir renda extra.' },
      { p: 'O que deve ser feito antes de se cadastrar em uma plataforma de renda extra?', alt: ['Compartilhar seus dados com qualquer pessoa', 'Verificar a segurança e a veracidade da plataforma', 'Fazer um pagamento antecipado', 'Informar sua senha bancária'], certa: 1, exp: 'Conferir se a plataforma é segura e verdadeira ajuda a evitar golpes.' },
      { p: 'O vídeo alerta que é importante desconfiar de:', alt: ['Plataformas conhecidas', 'Promessas de lucros muito altos e fáceis', 'Pesquisas online', 'Trabalho pela internet'], certa: 1, exp: 'Promessas de lucro muito alto e fácil são um sinal clássico de golpe.' },
    ],
  },
  {
    id: 'm2', titulo: 'O ciclo da dívida', min: 5,
    video: { id: 'UEiBsd_nmTA', canal: CANAL, titulo: 'O ciclo da dívida', resumo: 'O ciclo da dívida passa pelo atraso no pagamento, pela cobrança da empresa credora e pela possível negativação, quando a Serasa entra para comunicar e registrar informações de crédito.' },
    cards: [
      { icone: 'bag', t: 'Tudo começa no crédito', p: 'Ao comprar parcelado, usar o cartão ou pegar um empréstimo, você assume uma dívida. Pagando em dia, o ciclo termina por aí.' },
      { icone: 'bell', t: 'O atraso é uma das primeiras etapas', p: 'Quando o pagamento atrasa, a conta passa a ser cobrada e a dívida começa a crescer. É uma das primeiras etapas do ciclo da dívida.' },
      { icone: 'category', t: 'Quem faz o quê', p: 'Quem pode pedir a negativação é a empresa credora. A Serasa comunica o consumidor sobre a possível negativação e registra informações de crédito.' },
    ],
    atividade: { tipo: 'classificar', titulo: 'Quem faz o quê?', dica: 'Toque em quem é responsável por cada ação.', opcoes: ['Empresa credora', 'Serasa'],
      itens: [['Concedeu o crédito e cobra a dívida', 0], ['Solicita a negativação da dívida', 0], ['Comunica o consumidor sobre a possível negativação', 1], ['Registra as informações de crédito', 1]] },
    lembrar: ['O atraso no pagamento é uma das primeiras etapas do ciclo da dívida.', 'Quem solicita a negativação é a empresa credora.', 'A Serasa comunica a possível negativação e registra informações de crédito.'],
    quiz: [
      { p: 'Qual é uma das primeiras etapas do ciclo de uma dívida?', alt: ['Atrasar o pagamento', 'Aumentar o salário', 'Cancelar o CPF', 'Receber um empréstimo'], certa: 0, exp: 'O atraso no pagamento é uma das primeiras etapas do ciclo da dívida.' },
      { p: 'Quem solicita a negativação de uma dívida?', alt: ['O consumidor', 'A empresa credora', 'O banco central', 'O consumidor junto à Serasa'], certa: 1, exp: 'É a empresa credora, que concedeu o crédito, quem solicita a negativação.' },
      { p: 'Por que a Serasa entra na relação entre consumidor e empresa credora?', alt: ['Para criar a dívida', 'Para comunicar sobre a possível negativação e registrar informações de crédito', 'Para escolher o valor da dívida', 'Para definir o salário do consumidor'], certa: 1, exp: 'A Serasa comunica sobre a possível negativação e registra informações de crédito.' },
    ],
  },
  {
    id: 'm3', titulo: 'Atrasada, negativada ou caducada?', min: 5,
    video: { id: 'CkwxlovFIa0', canal: CANAL, titulo: 'Dívida atrasada, negativada ou caduca: qual a diferença?', resumo: 'Dívida atrasada é a que passou do vencimento. A negativada é registrada nos birôs. A caducada pode deixar de aparecer nos birôs depois de cinco anos, mas a pendência continua com a empresa.' },
    cards: [
      { icone: 'note', t: 'Dívida atrasada', p: 'É a conta que não foi paga até a data de vencimento. Enquanto continua em aberto, ela pode gerar juros.' },
      { icone: 'lock', t: 'Dívida negativada', p: 'Quando a empresa credora pede, o nome do consumidor pode ser registrado nos birôs de crédito por causa da dívida em atraso.' },
      { icone: 'star', t: 'Dívida caducada', p: 'Depois de cinco anos, a dívida pode deixar de aparecer nos birôs de crédito. Mas atenção: a pendência continua existindo com a empresa.' },
    ],
    atividade: { tipo: 'classificar', titulo: 'Qual é qual?', dica: 'Toque no tipo de dívida de cada situação.', opcoes: ['Atrasada', 'Negativada', 'Caducada'],
      itens: [['Venceu ontem e ainda não foi paga', 0], ['Seu nome foi registrado nos birôs por causa da dívida', 1], ['Passou de cinco anos e deixou de aparecer nos birôs, mas a pendência segue com a empresa', 2], ['Pode gerar juros enquanto não for paga', 0]] },
    lembrar: ['Atrasada: não foi paga até o vencimento.', 'Negativada: o nome foi registrado nos birôs de crédito.', 'Caducada: pode sair dos birôs depois de cinco anos, mas a pendência continua com a empresa.'],
    quiz: [
      { p: 'O que caracteriza uma dívida atrasada?', alt: ['Uma conta que ainda não venceu', 'Uma conta que não foi paga até a data de vencimento', 'Uma dívida que foi automaticamente cancelada', 'Uma dívida que nunca existiu'], certa: 1, exp: 'Dívida atrasada é a conta que não foi paga até a data do vencimento.' },
      { p: 'O que pode acontecer com uma dívida atrasada?', alt: ['Ela pode gerar juros', 'Ela desaparece imediatamente', 'O consumidor recebe dinheiro', 'O limite do cartão aumenta'], certa: 0, exp: 'A dívida atrasada pode gerar juros enquanto não for paga.' },
      { p: 'Depois de cinco anos, uma dívida simplesmente deixa de existir?', alt: ['Sim, sempre', 'Não, a dívida pode deixar de aparecer nos birôs de crédito, mas a pendência continua existindo com a empresa', 'Sim, desde que o consumidor não consulte o CPF', 'Sim, automaticamente após cinco anos'], certa: 1, exp: 'Ela pode sair dos birôs, mas a pendência continua existindo com a empresa.' },
    ],
  },
  {
    id: 'm4', titulo: 'O que é amortização?', min: 5,
    video: { id: '7Ib1rTuxUpk', canal: CANAL, titulo: 'O que é amortização? (Falando Dinheirês)', resumo: 'Amortizar é pagar uma parte da dívida para reduzir o valor devido, diminuindo o saldo devedor.' },
    cards: [
      { icone: 'trophy', t: 'Amortizar é reduzir a dívida', p: 'Amortizar é pagar uma parte do que você deve para diminuir o valor devido.' },
      { icone: 'sprout', t: 'O saldo devedor diminui', p: 'Saldo devedor é quanto ainda falta pagar. Ao amortizar, ele pode diminuir.' },
      { icone: 'check', t: 'Por que isso importa', p: 'Quanto mais você amortiza, menos falta para quitar. É um caminho para sair da dívida.' },
    ],
    atividade: { tipo: 'amortizar', titulo: 'Veja o saldo devedor diminuir', dica: 'Mude os valores e veja quanto falta pagar.' },
    lembrar: ['Amortizar é reduzir o valor devido por meio de pagamentos.', 'A amortização está ligada à redução de uma dívida.', 'Ao amortizar, o saldo devedor pode diminuir.'],
    quiz: [
      { p: 'O que significa amortizar uma dívida?', alt: ['Aumentar o valor da dívida', 'Reduzir o valor devido por meio de pagamentos', 'Cancelar uma dívida automaticamente', 'Parar de pagar as parcelas'], certa: 1, exp: 'Amortizar é reduzir o valor devido por meio de pagamentos.' },
      { p: 'A amortização está relacionada principalmente a:', alt: ['Redução de uma dívida', 'Aumento do salário', 'Criação de uma conta bancária', 'Aumento do limite do cartão'], certa: 0, exp: 'A amortização está ligada à redução de uma dívida.' },
      { p: 'Ao amortizar uma dívida, o que pode acontecer com o saldo devedor?', alt: ['Pode diminuir', 'Sempre aumenta', 'Desaparece imediatamente', 'Não sofre nenhuma alteração'], certa: 0, exp: 'Ao amortizar, o saldo devedor pode diminuir.' },
    ],
  },
  {
    id: 'm5', titulo: 'Juros de mora', min: 5,
    video: { id: 'Yic1w81yBq8', canal: CANAL, titulo: 'Juros de mora (Falando Dinheirês)', resumo: 'Juros de mora são cobrados pelo atraso no pagamento de uma conta e podem aumentar quanto maior for o tempo de atraso.' },
    cards: [
      { icone: 'bell', t: 'Os juros do atraso', p: 'Juros de mora são cobrados pelo atraso no pagamento de uma conta. Quem paga dentro do prazo não paga esses juros.' },
      { icone: 'category', t: 'Crescem com o tempo', p: 'Quanto maior o período de atraso, maior pode ficar o valor dos juros.' },
      { icone: 'check', t: 'Como evitar', p: 'Pague as contas dentro do prazo. Se for atrasar, resolva o quanto antes para o custo não crescer.' },
    ],
    atividade: { tipo: 'mora', titulo: 'Veja o atraso custando mais', dica: 'Mexa nos dias de atraso e compare o valor final.' },
    lembrar: ['Juros de mora são cobrados pelo atraso no pagamento.', 'Quanto maior o atraso, maior pode ser o valor dos juros.', 'Pagar dentro do prazo evita essa cobrança.'],
    quiz: [
      { p: 'O que são juros de mora?', alt: ['Juros cobrados quando uma conta é paga antes do vencimento', 'Juros cobrados pelo atraso no pagamento de uma conta', 'Desconto oferecido para pagamentos antecipados', 'Taxa cobrada somente na abertura de uma conta'], certa: 1, exp: 'Juros de mora são cobrados pelo atraso no pagamento.' },
      { p: 'O que pode acontecer com os juros de mora conforme aumenta o período de atraso?', alt: ['O valor dos juros pode aumentar', 'Os juros desaparecem automaticamente', 'A dívida é cancelada', 'O valor da conta diminui'], certa: 0, exp: 'Quanto maior o período de atraso, maior pode ficar o valor dos juros.' },
      { p: 'Qual atitude ajuda a evitar a cobrança de juros de mora?', alt: ['Deixar as contas para depois', 'Pagar as contas dentro do prazo', 'Utilizar todo o limite do cartão', 'Ignorar a data de vencimento'], certa: 1, exp: 'Pagar dentro do prazo evita a cobrança de juros de mora.' },
    ],
  },
]
