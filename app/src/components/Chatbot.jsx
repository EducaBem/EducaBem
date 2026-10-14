import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Chatbot.css'
import chatbotIcon from '../../../assets/chatbot.png'
import { encontrarItem, MENSAGEM_INICIAL, RESPOSTA_PADRAO, SUGESTOES } from './Chatbot/chatbotResponses.js'

const ATRASO_RESPOSTA = 450 // ms: "digitando..." antes de responder

export default function Chatbot() {
  const [aberto, setAberto] = useState(false)
  const [digitando, setDigitando] = useState(false)
  const [mensagens, setMensagens] = useState([{ remetente: 'EducaBem', texto: MENSAGEM_INICIAL }])

  const inputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const botaoRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens, digitando])

  useEffect(() => {
    if (aberto) inputRef.current?.focus()
  }, [aberto])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const fechar = () => {
    setAberto(false)
    botaoRef.current?.focus() // devolve o foco ao botão flutuante
  }

  const enviar = (texto) => {
    const pergunta = texto.trim()
    if (!pergunta || digitando) return

    setMensagens((atual) => [...atual, { remetente: 'Você', texto: pergunta }])
    setDigitando(true)

    const item = encontrarItem(pergunta)
    timerRef.current = setTimeout(() => {
      setMensagens((atual) => [
        ...atual,
        { remetente: 'EducaBem', texto: item ? item.texto : RESPOSTA_PADRAO, link: item?.link, semResposta: !item },
      ])
      setDigitando(false)
    }, ATRASO_RESPOSTA)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const texto = inputRef.current?.value ?? ''
    if (!texto.trim()) return
    enviar(texto)
    if (inputRef.current) inputRef.current.value = ''
  }

  const mostrarSugestoes = mensagens.length <= 1 || mensagens[mensagens.length - 1]?.semResposta

  return (
    <>
      <button
        ref={botaoRef}
        id="chatbot-button"
        type="button"
        aria-label="Abrir chatbot"
        aria-expanded={aberto}
        aria-controls="chatbot-window"
        onClick={() => setAberto(true)}
        className={aberto ? 'oculto' : ''}
      >
        <span className="chatbot-fab-avatar">
          <img src={chatbotIcon} alt="" className="chatbot-img" />
        </span>
        <span className="chatbot-fab-label">Posso ajudar?</span>
      </button>

      {aberto && (
        <section
          id="chatbot-window"
          aria-label="Chat EducaBem"
          onKeyDown={(e) => { if (e.key === 'Escape') fechar() }}
        >
          <header id="chatbot-header">
            <div className="chatbot-header-content">
              <img src={chatbotIcon} alt="" className="chatbot-header-img" />
              <span className="chatbot-header-texto">
                <b>EducaBem</b>
                <small>Tire suas dúvidas</small>
              </span>
            </div>

            <button id="chatbot-close" type="button" aria-label="Fechar chatbot" onClick={fechar}>
              ×
            </button>
          </header>

          <div id="chatbot-messages" role="log" aria-live="polite">
            {mensagens.map((msg, idx) => (
              <div key={idx} className={`chatbot-msg ${msg.remetente === 'Você' ? 'msg-usuario' : 'msg-bot'}`}>
                <p>
                  <strong>{msg.remetente}:</strong> {msg.texto}
                </p>
                {msg.link && (
                  <Link to={msg.link.to} className="chatbot-link" onClick={fechar}>
                    {msg.link.rotulo} →
                  </Link>
                )}
              </div>
            ))}

            {digitando && (
              <div className="chatbot-msg msg-bot">
                <p className="chatbot-digitando" aria-label="EducaBem está digitando">
                  <span /><span /><span />
                </p>
              </div>
            )}

            {mostrarSugestoes && !digitando && (
              <div className="chatbot-sugestoes">
                {SUGESTOES.map((s) => (
                  <button key={s} type="button" onClick={() => enviar(s)}>{s}</button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form id="chatbot-input-area" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              id="chatbot-input"
              type="text"
              placeholder="Digite sua mensagem..."
              autoComplete="off"
              maxLength={200}
              aria-label="Mensagem para o chatbot"
            />
            <button id="chatbot-send" type="submit" disabled={digitando}>
              Enviar
            </button>
          </form>
        </section>
      )}
    </>
  )
}
