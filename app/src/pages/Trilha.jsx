import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { MODULOS, PTS, TRILHA, concluirModulo, estadoModulo, missoes, nivelDe, progresso, usuario } from '../mock.js'
import { Atividade } from '../components/atividades.jsx'
import { PlayerYT } from '../components/PlayerYT.jsx'
import mascote from '../../../assets/mascot.png'
import { Icone, NivelBarra, useDialogoAberto } from '../components/ui.jsx'
import menino from '../../../assets/menino.png'
import moeda from '../../../assets/moeda.png'
import diamante from '../../../assets/diamante.png'
import bau from '../../../assets/bau.png'
import bambu from '../../../assets/bambu.png'
import pinheiros from '../../../assets/pinheiros.png'

// posição (x%, y%) de cada nó no mapa — zigue-zague do protótipo
const POS = [[42, 6], [62, 26], [40, 46], [66, 65], [42, 83]]
const BAU = [50, 96]

export function Trilha() {
  const navigate = useNavigate()
  const [modal, setModal] = useState(false)
  const nv = nivelDe(usuario.pontos)
  const pts = [...POS, BAU].map(([x, y]) => `${x},${y}`).join(' ')
  const mid = (a, b) => [(POS[a][0] + POS[b][0]) / 2, (POS[a][1] + POS[b][1]) / 2]
  const [cx, cy] = mid(1, 2), [dx, dy] = mid(3, 4)
  return (
    <>
      <NivelBarra />
      <div className="pilula-trilha">{TRILHA.titulo.replace('–', '-')}</div>
      <div className="mapa-wrap">
        <aside className="card-benef">
          <h2>Você é {nv.atual.nome}!</h2>
          <b>Benefícios:</b>
          <ul>
            <li>Selo de nível no perfil.</li>
            <li>Acesso à Trilha 1 - <b>O Economista</b>.</li>
            <li>Acesso ao primeiro ebook do EducaBem.</li>
          </ul>
          <button className="btn-missoes" onClick={() => setModal(true)}>Ver missões</button>
        </aside>
        <div className="mapa">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <polyline points={pts} />
          </svg>
          <img className="deco" style={{ right: '4%', top: '55%', width: 90 }} src={bambu} alt="" />
          <img className="deco" style={{ left: '-2%', bottom: '34%', width: 100 }} src={pinheiros} alt="" />
          <img className="deco" style={{ right: '2%', bottom: '14%', width: 90 }} src={pinheiros} alt="" />
          <img className="deco" style={{ left: '2%', bottom: '3%', width: 90 }} src={bambu} alt="" />
          <img className="item-mapa" style={{ left: `${cx}%`, top: `${cy}%`, width: 40 }} src={moeda} alt="" />
          <img className="item-mapa" style={{ left: `${dx - 14}%`, top: `${dy}%`, width: 56 }} src={diamante} alt="" />
          <img className="item-mapa" style={{ left: `${BAU[0]}%`, top: `${BAU[1]}%`, width: 110 }} src={bau} alt="Baú do tesouro" />
          {MODULOS.map((m, i) => {
            const est = estadoModulo(i)
            return (
              <button key={m.id} className={`no no-${est} v${i}`} style={{ left: `${POS[i][0]}%`, top: `${POS[i][1]}%` }}
                disabled={est === 'bloqueado'} aria-label={`Módulo ${i + 1}: ${m.titulo} (${est})`}
                onClick={() => navigate(`/trilha/${m.id}`)}>
                {est === 'concluido' ? <Icone nome="check" tam={26} strokeWidth={3.2} /> : est === 'bloqueado' ? <Icone nome="lock" tam={22} /> : i + 1}
                {est === 'atual' && <img className="heroi" src={menino} alt="Você está aqui" />}
                <span className="rot">{m.titulo}{est === 'concluido' && <Estrelas n={progresso.estrelas[m.id] || 1} />}</span>
              </button>
            )
          })}
        </div>
      </div>
      {modal && <ModalMissoes onClose={() => setModal(false)} />}
    </>
  )
}

function ModalMissoes({ onClose }) {
  useDialogoAberto()
  const { nv, lista } = missoes()
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus() }, [])
  return (
    <div className="modal-fundo" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Missões" onClick={(e) => e.stopPropagation()}>
        <h2>Você é {nv.atual.nome}!</h2>
        {nv.prox ? <>
          <p>Conclua as missões abaixo para se tornar <b className="ciano">{nv.prox.nome.toUpperCase()}</b>:</p>
          <ul>{lista.map((m) => <li key={m.txt}>{m.txt} <span>({m.prog})</span></li>)}</ul>
        </> : <p>Você chegou ao nível máximo. Obrigado por transformar futuros!</p>}
        <button ref={ref} className="btn-missoes" onClick={onClose}>Voltar à aventura</button>
      </div>
    </div>
  )
}

export function embedYT(v = {}) {
  const alvo = v.url || v.id || ''
  const pl = v.playlist || (alvo.match(/[?&]list=([\w-]+)/) || [])[1]
  const vid = (alvo.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/) || [])[1] || (/^[\w-]{11}$/.test(alvo) ? alvo : '')
  // playsinline=1: no iPhone o vídeo toca dentro da página, em vez de abrir em tela cheia sozinho
  if (vid) return `https://www.youtube-nocookie.com/embed/${vid}?rel=0&playsinline=1${pl ? `&list=${pl}` : ''}`
  if (pl) return `https://www.youtube-nocookie.com/embed/videoseries?list=${pl}&rel=0&playsinline=1`
  return ''
}
export function idYT(v = {}) {
  const alvo = v.url || v.id || ''
  return (alvo.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/) || [])[1] || (/^[\w-]{11}$/.test(alvo) ? alvo : '')
}
// Link normal do YouTube: plano B quando o player embutido não carrega (celular, app com navegador interno, rede restrita).
export function linkYT(v = {}) {
  const alvo = v.url || v.id || ''
  const vid = (alvo.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/) || [])[1] || (/^[\w-]{11}$/.test(alvo) ? alvo : '')
  const pl = v.playlist || (alvo.match(/[?&]list=([\w-]+)/) || [])[1]
  if (vid) return `https://www.youtube.com/watch?v=${vid}`
  return pl ? `https://www.youtube.com/playlist?list=${pl}` : ''
}

function Estrelas({ n = 0, tam = 14 }) {
  return (
    <span className="estrelas" role="img" aria-label={`${n} de 3 estrelas`}>
      {[1, 2, 3].map((k) => <Icone key={k} nome="star" tam={tam} fill={k <= n ? 'currentColor' : 'none'} className={k <= n ? 'on' : ''} />)}
    </span>
  )
}

function embaralhar(q) {
  const ordem = q.alt.map((_, k) => k).sort(() => Math.random() - 0.5)
  return { ...q, alt: ordem.map((k) => q.alt[k]), certa: ordem.indexOf(q.certa) }
}

function Alternativas({ pergunta, escolha, onEscolher }) {
  return (
    <div className="alts" role="group" aria-label="Alternativas">
      {pergunta.alt.map((a, k) => {
        const cls = escolha === null ? '' : k === pergunta.certa ? 'certa' : k === escolha ? 'errada' : 'neutra'
        return <button key={a} className={`alt ${cls}`} onClick={() => onEscolher(k)} aria-pressed={escolha === k}>{a}</button>
      })}
    </div>
  )
}

function Feedback({ pergunta, escolha }) {
  if (escolha === null) return null
  const ok = escolha === pergunta.certa
  return (
    <div className={`feedback com-masc ${ok ? 'ok' : 'erro'}`} role="status">
      <img src={mascote} alt="" />
      <p><b>{ok ? 'Certo!' : 'Quase!'}</b> {pergunta.exp}</p>
    </div>
  )
}

export function Modulo() {
  const { modulo } = useParams()
  const navigate = useNavigate()
  const i = MODULOS.findIndex((m) => m.id === modulo)
  const m = MODULOS[i]
  const anterior = MODULOS[i - 1]
  const [aquec] = useState(() => (anterior ? embaralhar(anterior.quiz[Math.floor(Math.random() * anterior.quiz.length)]) : null))
  const [passo, setPasso] = useState(0)
  const [escolha, setEscolha] = useState(null)
  useEffect(() => { window.scrollTo?.({ top: 0 }) }, [passo])
  if (!m || estadoModulo(i) === 'bloqueado') return <Navigate to="/trilha" replace />

  const srcVideo = embedYT(m.video)
  const passos = [
    ...(aquec ? [{ tipo: 'aquec', nome: 'Aquecimento' }] : []),
    { tipo: 'video', nome: 'Vídeo' },
    ...m.cards.map((c) => ({ tipo: 'card', c, nome: c.t })),
    { tipo: 'ativ', nome: 'Experimente' },
    { tipo: 'lembrar', nome: 'Para lembrar' },
  ]
  const p = passos[passo]
  const ultimo = passo === passos.length - 1
  const pct = ((passo + 1) / passos.length) * 100
  const bloqueia = p.tipo === 'aquec' && escolha === null
  const seguir = () => ultimo ? navigate(`/trilha/${m.id}/quiz`) : setPasso(passo + 1)

  return (
    <>
      <NivelBarra />
      <article className="modulo licao">
        <div className="licao-topo">
          <span className="etiqueta">Módulo {i + 1} de {MODULOS.length} · {m.min} min</span>
          <span className="passo-n">{passo + 1}/{passos.length}</span>
        </div>
        <div className="barra barra-verde claro" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso da lição"><i style={{ width: `${pct}%` }} /></div>
        <h1>{m.titulo}</h1>

        {p.tipo === 'aquec' && (
          <section className="passo">
            <span className="selo-passo">Aquecimento · lembra do módulo anterior?</span>
            <h2>{aquec.p}</h2>
            <Alternativas pergunta={aquec} escolha={escolha} onEscolher={(k) => escolha === null && setEscolha(k)} />
            <Feedback pergunta={aquec} escolha={escolha} />
          </section>
        )}

        {p.tipo === 'video' && (
          <section className="passo">
            <span className="selo-passo">Assista ao vídeo</span>
            {srcVideo
              ? <PlayerYT key={srcVideo} id={idYT(m.video)} titulo={m.video.titulo} src={srcVideo} />
              : <div className="video vazio"><img src={mascote} alt="" /><b>Vídeo em produção</b><small>Em breve você assiste aqui. Por enquanto, siga pelo resumo.</small></div>}
            {srcVideo && <p className="credito-video">{m.video.canal && <>Vídeo: {m.video.canal} · </>}<a href={linkYT(m.video)} target="_blank" rel="noopener noreferrer">Não carregou? Assistir no YouTube</a></p>}
            <p className="resumo-video"><b>Resumo:</b> {m.video.resumo}</p>
          </section>
        )}

        {p.tipo === 'card' && (
          <section className="passo card-passo">
            <span className="ic-passo"><Icone nome={p.c.icone} tam={34} /></span>
            <h2>{p.c.t}</h2>
            <p>{p.c.p}</p>
          </section>
        )}

        {p.tipo === 'ativ' && <section className="passo"><span className="selo-passo">Experimente</span><Atividade dados={m.atividade} /></section>}

        {p.tipo === 'lembrar' && (
          <section className="passo">
            <span className="selo-passo">Para lembrar</span>
            <ul className="lembrar">{m.lembrar.map((l) => <li key={l}><Icone nome="check" tam={20} strokeWidth={3} />{l}</li>)}</ul>
            <p className="sub-lembrar">Agora um quiz rápido fixa isso. Se errar, a pergunta volta no final: é assim que se aprende.</p>
          </section>
        )}

        <div className="licao-nav">
          {passo > 0 ? <button className="btn-voltar" onClick={() => { setPasso(passo - 1); setEscolha(null) }}>← Voltar</button> : <Link to="/trilha" className="btn-voltar">← Mapa</Link>}
          <button className={`btn ${ultimo ? 'btn-verde-g' : 'btn-amarelo'} avanca`} disabled={bloqueia} onClick={seguir}>
            {ultimo ? 'Fazer quiz' : 'Continuar'} <Icone nome="arrow" tam={20} />
          </button>
        </div>
      </article>
    </>
  )
}

export function Quiz() { const { key } = useLocation(); return <QuizTela key={key} /> }

function QuizTela() {
  const { modulo } = useParams()
  const idx = MODULOS.findIndex((x) => x.id === modulo)
  const m = MODULOS[idx]
  const [fila, setFila] = useState(() => (m ? m.quiz.map((q, k) => ({ ...embaralhar(q), id: k })).sort(() => Math.random() - 0.5) : []))
  const [q, setQ] = useState(0)
  const [escolha, setEscolha] = useState(null)
  const [errou, setErrou] = useState(() => new Set())
  const [resolvidas, setResolvidas] = useState(0)
  const [res, setRes] = useState(null)
  if (!m || estadoModulo(idx) === 'bloqueado') return <Navigate to="/trilha" replace />
  const total = m.quiz.length
  const pergunta = fila[q]
  const retry = q >= total

  function responder(k) {
    if (escolha !== null) return
    setEscolha(k)
    if (k === pergunta.certa) { setResolvidas((r) => r + 1); return }
    if (!retry) setErrou(new Set([...errou, pergunta.id]))
    setFila([...fila, { ...embaralhar(m.quiz[pergunta.id]), id: pergunta.id }])
  }
  function avancar() {
    if (q < fila.length - 1) { setQ(q + 1); setEscolha(null); return }
    const estrelas = errou.size === 0 ? 3 : errou.size === 1 ? 2 : 1
    setRes({ ganhou: concluirModulo(m.id, estrelas), estrelas }) // TODO: POST /progresso-modulos
  }

  if (res) {
    const completa = progresso.concluidos.size === MODULOS.length
    const prox = MODULOS[idx + 1]
    return (
      <div className="quiz-card fim">
        <img className="masc-fim" src={mascote} alt="" />
        <h1>{res.estrelas === 3 ? 'Perfeito!' : 'Módulo concluído!'}</h1>
        <Estrelas n={res.estrelas} tam={34} />
        <p className="grande">{errou.size === 0 ? 'Você acertou tudo de primeira.' : <>Você acertou <b>{total - errou.size}</b> de {total} de primeira e refez o resto.</>}</p>
        <div className="missao pontos"><Icone nome="star" tam={44} fill="currentColor" className="estrela" />
          <div>{res.ganhou ? <><b>+{PTS.modulo}</b>{completa && <> <b>+{PTS.trilha}</b></>} no Score do Bem</> : 'Pontos deste módulo já foram contados'}</div></div>
        <div className="recap"><b>Para lembrar</b><ul>{m.lembrar.map((l) => <li key={l}>{l}</li>)}</ul></div>
        {completa && <p className="trilha-ok"><Icone nome="trophy" tam={20} /> Você concluiu a Trilha 1!</p>}
        <Link className="btn btn-amarelo cta" to={prox && !completa ? `/trilha/${prox.id}` : '/trilha'}>{prox && !completa ? 'Próximo módulo' : 'Voltar ao mapa'} <Icone nome="arrow" tam={20} /></Link>
        {res.estrelas < 3 && <Link to={`/trilha/${m.id}/quiz`} className="voltar escuro">Refazer para ganhar mais estrelas</Link>}
        <Link to="/trilha" className="voltar escuro">Voltar ao mapa</Link>
      </div>
    )
  }
  const pct = (resolvidas / total) * 100
  return (
    <div className="quiz-card">
      <div className="licao-topo">
        <span className="etiqueta">{retry ? 'Vamos rever essa' : `Pergunta ${Math.min(q + 1, total)} de ${total}`}</span>
        <span className="passo-n">{resolvidas}/{total} acertadas</span>
      </div>
      <div className="barra barra-verde claro" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso do quiz"><i style={{ width: `${pct}%` }} /></div>
      <h2>{pergunta.p}</h2>
      <Alternativas pergunta={pergunta} escolha={escolha} onEscolher={responder} />
      <Feedback pergunta={pergunta} escolha={escolha} />
      {escolha !== null && <button className="btn btn-amarelo cta" onClick={avancar}>{q >= fila.length - 1 ? 'Ver resultado' : 'Próxima'} <Icone nome="arrow" tam={20} /></button>}
    </div>
  )
}
