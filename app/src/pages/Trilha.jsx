import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { MODULOS, PTS, TRILHA, concluirModulo, estadoModulo, missoes, nivelDe, progresso, usuario } from '../mock.js'
import { Icone, NivelBarra } from '../components/ui.jsx'
import menino from '../../../assets/menino.png'
import moeda from '../../../assets/moeda.png'
import diamante from '../../../assets/diamante.png'
import bau from '../../../assets/bau.png'
import bambu from '../../../assets/bambu.png'
import pinheiros from '../../../assets/pinheiros.png'

// posição (x%, y%) de cada nó no mapa — zigue-zague do protótipo
const POS = [[42, 5], [62, 20], [40, 36], [68, 52], [38, 68], [64, 83]]
const BAU = [48, 96]

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
          <img className="item-mapa" style={{ left: `${dx}%`, top: `${dy}%`, width: 56 }} src={diamante} alt="" />
          <img className="item-mapa" style={{ left: `${BAU[0]}%`, top: `${BAU[1]}%`, width: 110 }} src={bau} alt="Baú do tesouro" />
          {MODULOS.map((m, i) => {
            const est = estadoModulo(i)
            return (
              <button key={m.id} className={`no no-${est} v${i}`} style={{ left: `${POS[i][0]}%`, top: `${POS[i][1]}%` }}
                disabled={est === 'bloqueado'} aria-label={`Módulo ${i + 1}: ${m.titulo} (${est})`}
                onClick={() => navigate(`/trilha/${m.id}`)}>
                {est === 'concluido' ? <Icone nome="check" tam={26} strokeWidth={3.2} /> : est === 'bloqueado' ? <Icone nome="lock" tam={22} /> : i + 1}
                {est === 'atual' && <img className="heroi" src={menino} alt="Você está aqui" />}
                <span className="rot">{m.titulo}</span>
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

export function Modulo() {
  const { modulo } = useParams()
  const i = MODULOS.findIndex((m) => m.id === modulo)
  if (i < 0 || estadoModulo(i) === 'bloqueado') return <Navigate to="/trilha" replace />
  const m = MODULOS[i]
  return (
    <>
      <NivelBarra />
      <article className="modulo">
        <span className="etiqueta">Módulo {i + 1} de {MODULOS.length} · 2 min</span>
        <h1>{m.titulo}</h1>
        {m.texto.map((p) => <p key={p}>{p}</p>)}
        <Link className="btn btn-verde-g" to={`/trilha/${m.id}/quiz`}>Fazer quiz <Icone nome="arrow" tam={20} /></Link>
        <Link to="/trilha" className="voltar">← Voltar ao mapa</Link>
      </article>
    </>
  )
}

export function Quiz() {
  const { modulo } = useParams()
  const idx = MODULOS.findIndex((x) => x.id === modulo)
  const m = MODULOS[idx]
  const [q, setQ] = useState(0)
  const [escolha, setEscolha] = useState(null)
  const [acertos, setAcertos] = useState(0)
  const [ganhou, setGanhou] = useState(false)
  const [fim, setFim] = useState(false)
  if (!m || estadoModulo(idx) === 'bloqueado') return <Navigate to="/trilha" replace />
  const pergunta = m.quiz[q]
  const ultima = q === m.quiz.length - 1

  function responder(k) {
    if (escolha !== null) return
    setEscolha(k)
    if (k === pergunta.certa) setAcertos((a) => a + 1)
  }
  function avancar() {
    if (!ultima) { setQ(q + 1); setEscolha(null); return }
    setGanhou(concluirModulo(m.id)) // TODO: POST /progresso-modulos (salva o progresso e lança +10 pts)
    setFim(true)
  }

  if (fim) {
    const completa = progresso.concluidos.size === MODULOS.length
    return (
      <div className="quiz-card fim">
        <h1>{acertos === m.quiz.length ? 'Perfeito!' : 'Módulo concluído!'}</h1>
        <p className="grande">Você acertou <b>{acertos}</b> de {m.quiz.length}.</p>
        <div className="missao pontos"><Icone nome="star" tam={44} fill="currentColor" className="estrela" />
          <div>{ganhou ? <><b>+{PTS.modulo}</b>{completa && <> <b>+{PTS.trilha}</b></>} no Score do Bem</> : 'Pontos deste módulo já foram contados'}</div></div>
        {completa && <p className="trilha-ok"><Icone nome="trophy" tam={20} /> Você concluiu a Trilha 1!</p>}
        <Link className="btn btn-amarelo cta" to="/trilha">Voltar ao mapa <Icone nome="arrow" tam={20} /></Link>
      </div>
    )
  }
  return (
    <div className="quiz-card">
      <span className="etiqueta">Pergunta {q + 1} de {m.quiz.length}</span>
      <h2>{pergunta.p}</h2>
      <div className="alts" role="group" aria-label="Alternativas">
        {pergunta.alt.map((a, k) => {
          const cls = escolha === null ? '' : k === pergunta.certa ? 'certa' : k === escolha ? 'errada' : 'neutra'
          return <button key={a} className={`alt ${cls}`} onClick={() => responder(k)} aria-pressed={escolha === k}>{a}</button>
        })}
      </div>
      {escolha !== null && (
        <div className={`feedback ${escolha === pergunta.certa ? 'ok' : 'erro'}`} role="status">
          <b>{escolha === pergunta.certa ? 'Certo!' : 'Quase!'}</b> {pergunta.exp}
        </div>
      )}
      {escolha !== null && <button className="btn btn-amarelo cta" onClick={avancar}>{ultima ? 'Ver resultado' : 'Próxima'} <Icone nome="arrow" tam={20} /></button>}
    </div>
  )
}
