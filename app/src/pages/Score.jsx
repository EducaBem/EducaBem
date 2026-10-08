import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MEDALHAS, NIVEIS, nivelDe, ranking, rankingBanco, usuario } from '../mock.js'
import { temBanco } from '../supabase.js'
import { Avatar, Icone, Medalha, NivelBarra } from '../components/ui.jsx'

function Abas({ ativa }) {
  return (
    <nav className="abas" aria-label="Seções do Score">
      <Link to="/score" className={ativa === 'score' ? 'on' : ''}>Conquistas</Link>
      <Link to="/ranking" className={ativa === 'ranking' ? 'on' : ''}>Ranking</Link>
    </nav>
  )
}

export function Score() {
  const nv = nivelDe(usuario.pontos)
  return (
    <>
      <NivelBarra />
      <Abas ativa="score" />
      <section className="card-benef grande">
        <div>
          <h2>Você é {nv.atual.nome}!</h2>
          <b>Benefícios:</b>
          <ul>
            <li>Selo de nível no perfil.</li>
            <li>Acesso à Trilha 1 - O Economista.</li>
            <li>Acesso ao primeiro ebook do EducaBem.</li>
          </ul>
        </div>
        <Avatar tam={110} className="avatar-borda" />
      </section>
      <ol className="regua" aria-label="Níveis">
        {NIVEIS.map((n) => (
          <li key={n.n} className={n.n <= nv.atual.n ? 'on' : ''} aria-current={n.n === nv.atual.n ? 'step' : undefined}>
            <span className={`bola b${n.n}`}>{n.n}</span><em>{n.nome}</em>
          </li>
        ))}
      </ol>
      <h2 className="tit-sec">Conquistas</h2>
      {MEDALHAS.map((f) => {
        const v = f.valor()
        return (
          <section key={f.familia}>
            <h3 className="tit-fam">{f.familia}</h3>
            <div className="medalhas">
              {f.faixas.map((x) => (
                <figure key={x.tier} className={v >= x.meta ? 'ganha' : ''}>
                  <Medalha tier={x.tier} conquistada={v >= x.meta} />
                  <figcaption>{x.txt}<br /><b>{Math.min(v, x.meta)}/{x.meta}</b></figcaption>
                </figure>
              ))}
            </div>
          </section>
        )
      })}
      <h2 className="tit-sec">Trocar por recompensas</h2>
      <div className="recompensas"><div><Icone nome="star" tam={22} />Em breve</div><div><Icone nome="star" tam={22} />Em breve</div></div>
    </>
  )
}

export function Ranking() {
  const [dados, setDados] = useState(() => (temBanco ? null : ranking()))
  const [erro, setErro] = useState('')
  useEffect(() => {
    if (!temBanco) return undefined
    let vivo = true
    rankingBanco().then((d) => vivo && setDados(d)).catch((e) => vivo && setErro(e.message))
    return () => { vivo = false }
  }, [])
  const { top = [], eu, foraDoTop = false } = dados || {}
  const linha = (r, i) => (
    <li key={`${r.pos}-${i}`} className={r.eu ? 'eu' : ''}>
      <span className={`pos pos-${r.pos}`}>{r.pos}</span>
      <span className="avatar">{r.nome[0]}</span>
      <span className="nome">{r.nome}{r.eu && ' (você)'}</span>
      <b>{r.pontos} pts</b>
    </li>
  )
  return (
    <>
      <NivelBarra />
      <Abas ativa="ranking" />
      <h1 className="tc">Ranking do Bem</h1>
      <p className="sub">Os 10 doadores com mais pontos</p>
      {erro && <p className="msg-erro tc" role="alert">{erro}</p>}
      {!dados && !erro && <p className="sub" role="status">Carregando o ranking…</p>}
      <ol className="rank">
        {top.map(linha)}
        {foraDoTop && <><li className="reticencias" aria-hidden>⋯</li>{linha(eu)}</>}
      </ol>
    </>
  )
}
