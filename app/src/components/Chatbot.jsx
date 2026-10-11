import { useState, useRef, useEffect } from 'react'
import './Chatbot.css'
import chatbotIcon from '../../../assets/chatbot.png'

const RESPOSTAS = [
  {
    termos: ['doar livro', 'doacao de livro', 'doar livros'],
    texto: 'Que legal querer ajudar! Você pode doar livros didáticos, de literatura, gibis e paradidáticos em bom estado. Basta ir à seção "Doar Livros" no site, preencher o formulário com os dados e confirmar a entrega.'
  },
  {
    termos: ['tipo de livro', 'tipos de livro', 'livros aceitos', 'aceitam livro'],
    texto: 'Aceitamos livros de literatura infantil, juvenil e adulta, apostilas e livros didáticos atualizados, além de obras de negócios e finanças. Pedimos apenas que estejam em bom estado.'
  },
  {
    termos: ['receber livro', 'pedir livro', 'livro emprestado', 'livros doados', 'catalogo'],
    texto: 'Se você busca livros para leitura ou apoio nos estudos, acesse a aba "Catálogo de Livros" no site. Lá você pode buscar pelo título ou tema, fazer seu cadastro e solicitar o livro.'
  },
  {
    termos: ['curso de financa', 'conteudo de financa', 'educacao financeira', 'financas gratis'],
    texto: 'Sim! O Educabem oferece artigos práticos, dicas rápidas e cursos introdutórios gratuitos para ajudar você a organizar o orçamento, sair das dívidas e começar a investir.'
  },
  {
    termos: ['olá', 'ola', 'oi', 'bom dia', 'boa tarde', 'boa noite'],
    texto: 'Olá! Posso ajudar com doação de livros, catálogo, educação financeira, voluntariado ou informações sobre o Educabem.'
  },
  {
    termos: ['obrigado', 'obrigada', 'valeu'],
    texto: 'Por nada! Estou aqui para ajudar.'
  }
]

function normalizar(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function encontrarResposta(pergunta) {
  const perguntaNormalizada = normalizar(pergunta)
  const resposta = RESPOSTAS.find((item) =>
    item.termos.some((termo) => perguntaNormalizada.includes(normalizar(termo)))
  )

  return resposta
    ? resposta.texto
    : 'Ainda não encontrei uma resposta para essa pergunta. Tente perguntar sobre doação de livros, catálogo, educação financeira, dívidas, voluntariado ou sobre o Educabem.'
}

export default function Chatbot() {
  const [aberto, setAberto] = useState(false)
  const [mensagens, setMensagens] = useState([
    { remetente: 'Educabem', texto: 'Olá! Como posso ajudar?' }
  ])

  const inputRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  useEffect(() => {
    if (aberto) {
      inputRef.current?.focus()
    }
  }, [aberto])

  const handleSubmit = (e) => {
    e.preventDefault()
    const texto = inputRef.current?.value.trim()

    if (!texto) return

    const novasMensagens = [...mensagens, { remetente: 'Você', texto }]
    const resposta = encontrarResposta(texto)

    novasMensagens.push({ remetente: 'Educabem', texto: resposta })

    setMensagens(novasMensagens)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <>
      <button
        id="chatbot-button"
        type="button"
        aria-label="Abrir chatbot"
        onClick={() => setAberto(true)}
        className={aberto ? 'oculto' : ''}
      >
        <img src={chatbotIcon} alt="Chatbot EducaBem" className="chatbot-img" />
      </button>

      {aberto && (
        <section id="chatbot-window" aria-label="Chat Educabem">
          <header id="chatbot-header">
            <div className="chatbot-header-content">
              <img src={chatbotIcon} alt="EducaBem" className="chatbot-header-img" />
              <span>EducaBem</span>
            </div>

            <button
              id="chatbot-close"
              type="button"
              aria-label="Fechar chatbot"
              onClick={() => setAberto(false)}
            >
              ×
            </button>
          </header>

          <div id="chatbot-messages">
            {mensagens.map((msg, idx) => (
              <p key={idx}>
                <strong>{msg.remetente}:</strong> {msg.texto}
              </p>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form id="chatbot-input-area" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              id="chatbot-input"
              type="text"
              placeholder="Digite sua mensagem..."
              autoComplete="off"
            />
            <button id="chatbot-send" type="submit">
              Enviar
            </button>
          </form>
        </section>
      )}
    </>
  )
}
