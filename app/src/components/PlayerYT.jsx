import { useEffect, useRef, useState } from 'react'

// Player do YouTube com controles próprios, sempre visíveis embaixo do vídeo.
// Os controles nativos do YouTube somem sozinhos e, no celular, só voltam com um toque preciso.
// Aqui o vídeo roda com controls=0 e a barra abaixo (voltar 10s, play/pause, avançar 10s, progresso, tela cheia) nunca some.
// Se a API do YouTube não carregar (rede restrita, bloqueio), cai no iframe comum.

let promessaAPI
function carregarAPI() {
  if (typeof window === 'undefined') return Promise.reject()
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (!promessaAPI) {
    promessaAPI = new Promise((ok, erro) => {
      const anterior = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => { anterior?.(); ok(window.YT) }
      const s = document.createElement('script')
      s.src = 'https://www.youtube.com/iframe_api'
      s.async = true
      s.onerror = () => { promessaAPI = null; erro() }
      document.head.appendChild(s)
      setTimeout(() => { if (!window.YT?.Player) { promessaAPI = null; erro() } }, 8000)
    })
  }
  return promessaAPI
}

const fmt = (s = 0) => { s = Math.max(0, Math.floor(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` }

const Svg = ({ children }) => <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">{children}</svg>

export function PlayerYT({ id, titulo, src }) {
  const [iniciou, setIniciou] = useState(false)
  const [falhou, setFalhou] = useState(false)
  const [pronto, setPronto] = useState(false)
  const [tocando, setTocando] = useState(false)
  const [fim, setFim] = useState(false)
  const [tempo, setTempo] = useState(0)
  const [duracao, setDuracao] = useState(0)
  const [arrastando, setArrastando] = useState(false)
  const [telaCheia, setTelaCheia] = useState(false)
  const caixa = useRef(null)
  const raiz = useRef(null)
  const player = useRef(null)
  const podeTelaCheia = typeof document !== 'undefined' && !!document.fullscreenEnabled

  // cria o player só depois do toque na capa (o toque acontece na nossa página, e o autoplay funciona no celular)
  useEffect(() => {
    if (!iniciou || falhou) return
    let vivo = true
    let timer
    carregarAPI().then((YT) => {
      if (!vivo || !caixa.current) return
      const alvo = document.createElement('div')
      caixa.current.appendChild(alvo)
      player.current = new YT.Player(alvo, {
        videoId: id,
        host: 'https://www.youtube-nocookie.com',
        playerVars: { autoplay: 1, controls: 0, playsinline: 1, rel: 0, modestbranding: 1, iv_load_policy: 3, fs: 0, disablekb: 1, origin: window.location.origin },
        events: {
          onReady: (e) => { setPronto(true); setDuracao(e.target.getDuration() || 0); e.target.playVideo() },
          onStateChange: (e) => {
            const S = YT.PlayerState
            setTocando(e.data === S.PLAYING || e.data === S.BUFFERING)
            setFim(e.data === S.ENDED)
            if (e.data === S.PLAYING) setDuracao(e.target.getDuration() || 0)
          },
          onError: () => setFalhou(true),
        },
      })
      timer = setInterval(() => {
        const p = player.current
        if (p?.getCurrentTime) setTempo(p.getCurrentTime() || 0)
      }, 300)
    }).catch(() => vivo && setFalhou(true))
    return () => {
      vivo = false
      clearInterval(timer)
      try { player.current?.destroy() } catch { /* já removido */ }
      player.current = null
      if (caixa.current) caixa.current.innerHTML = ''
    }
  }, [iniciou, falhou, id])

  useEffect(() => {
    const f = () => setTelaCheia(document.fullscreenElement === raiz.current)
    document.addEventListener('fullscreenchange', f)
    return () => document.removeEventListener('fullscreenchange', f)
  }, [])

  const alternar = () => {
    const p = player.current
    if (!p || !pronto) return
    if (fim) { p.seekTo(0, true); p.playVideo(); return }
    tocando ? p.pauseVideo() : p.playVideo()
  }
  const pular = (d) => {
    const p = player.current
    if (!p || !pronto) return
    const alvo = Math.min(Math.max(0, p.getCurrentTime() + d), duracao || 1e9)
    p.seekTo(alvo, true); setTempo(alvo)
  }
  const buscar = (v) => { player.current?.seekTo(v, true); setTempo(v) }
  const tela = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else raiz.current?.requestFullscreen?.()
  }

  // plano B: iframe comum, com os controles do próprio YouTube
  if (falhou) {
    return (
      <div className="video">
        <iframe src={src} title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
      </div>
    )
  }

  if (!iniciou) {
    return (
      <div className="video">
        <button type="button" className="video-capa" onClick={() => setIniciou(true)} aria-label={`Reproduzir vídeo: ${titulo}`}
          style={{ backgroundImage: `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)` }}>
          <span className="play" aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <div className={`player${telaCheia ? ' cheia' : ''}`} ref={raiz}>
      <div className="video">
        <div className="video-caixa" ref={caixa} />
        {/* camada transparente: o toque no vídeo pausa/continua e os menus do YouTube não aparecem */}
        <button type="button" className="video-toque" onClick={alternar} aria-label={tocando ? 'Pausar' : 'Continuar'}>
          {!pronto && <span className="video-carregando">Carregando…</span>}
          {pronto && (!tocando || fim) && <span className="play" aria-hidden="true" />}
        </button>
      </div>
      <div className="player-barra">
        <div className="player-botoes">
          <button type="button" className="pb" onClick={() => pular(-10)} aria-label="Voltar 10 segundos">
            <Svg><path d="M12 5V2L7 6l5 4V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z" /></Svg><small>10</small>
          </button>
          <button type="button" className="pb pb-play" onClick={alternar} aria-label={fim ? 'Rever' : tocando ? 'Pausar' : 'Continuar'}>
            {fim
              ? <Svg><path d="M12 5V2L7 6l5 4V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z" /></Svg>
              : tocando ? <Svg><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></Svg> : <Svg><path d="M8 5v14l11-7z" /></Svg>}
          </button>
          <button type="button" className="pb" onClick={() => pular(10)} aria-label="Avançar 10 segundos">
            <Svg><path d="M12 5V2l5 4-5 4V7a6 6 0 1 0 6 6h2a8 8 0 1 1-8-8z" /></Svg><small>10</small>
          </button>
          <span className="player-tempo">{fmt(tempo)} / {fmt(duracao)}</span>
          {podeTelaCheia && (
            <button type="button" className="pb pb-fim" onClick={tela} aria-label={telaCheia ? 'Sair da tela cheia' : 'Tela cheia'}>
              <Svg>{telaCheia ? <path d="M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z" /> : <path d="M7 14H5v5h5v-2H7zm-2-4h2V7h3V5H5zm12 7h-3v2h5v-5h-2zM14 5v2h3v3h2V5z" />}</Svg>
            </button>
          )}
        </div>
        <input type="range" className="player-prog" min={0} max={Math.max(1, Math.floor(duracao))} step={1}
          value={Math.min(Math.floor(tempo), Math.max(1, Math.floor(duracao)))}
          disabled={!pronto} aria-label="Progresso do vídeo"
          style={{ '--p': `${duracao ? (tempo / duracao) * 100 : 0}%` }}
          onChange={(e) => { setArrastando(true); setTempo(Number(e.target.value)) }}
          onPointerUp={(e) => { setArrastando(false); buscar(Number(e.currentTarget.value)) }}
          onKeyUp={(e) => buscar(Number(e.currentTarget.value))} />
      </div>
    </div>
  )
}
