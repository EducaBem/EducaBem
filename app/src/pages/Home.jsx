import { Link } from 'react-router-dom'
import { BarraProgresso, Capa, ChipStatus, Icone } from '../components/ui.jsx'
import { usuario, doacoes, nivelDe, stats } from '../mock.js'
import mascot from '../../../assets/mascot.png'

const ATALHOS = [['/doar/novo', 'package', 'Doar livro'], ['/rastreio', 'pin', 'Rastreio'], ['/trilha', 'cap', 'Trilha'], ['/score', 'trophy', 'Score']]

export default function Home() {
  const nv = nivelDe(usuario.pontos)
  const { leitores } = stats()
  return (
    <>
      <h1 className="ola">Olá, {usuario.primeiroNome}</h1>
      <section className="card-nivel">
        <span className="masc-bola"><img className="masc" src={mascot} alt="" /></span>
        <h2>Olá, {usuario.primeiroNome}</h2>
        <p className="impacto-txt">Você já impactou {leitores} {leitores === 1 ? 'leitor' : 'leitores'} até agora.</p>
        <div className="barra-home"><BarraProgresso pct={nv.pct} /></div>
        <p className="nivel-txt">{nv.prox ? `Nível ${nv.atual.n} · faltam ${nv.faltam} pts pro Nível ${nv.prox.n}` : `Nível ${nv.atual.n} · nível máximo!`}</p>
        <Link to="/doar" className="btn btn-amarelo">Doar agora <Icone nome="arrow" tam={18} /></Link>
      </section>
      <nav className="atalhos">{ATALHOS.map(([to, ic, nome]) => <Link key={to} to={to} className="atalho"><Icone nome={ic} tam={22} />{nome}</Link>)}</nav>
      <div className="sec-tit"><h2>Doações recentes</h2><Link to="/doacoes">ver todas</Link></div>
      {doacoes.length === 0 && <p className="vazio-lista">Você ainda não registrou nenhuma doação. <Link to="/doar">Doe seu primeiro livro</Link> e ganhe +50 pts.</p>}
      {doacoes.length > 0 && <ul className="lista">
        {doacoes.slice(0, 3).map((d, i) => (
          <li key={d.id}><Capa i={i} /><Link className="t" to={`/rastreio/${d.id}`}>{d.titulo}</Link><ChipStatus status={d.status} /></li>
        ))}
      </ul>}
    </>
  )
}
