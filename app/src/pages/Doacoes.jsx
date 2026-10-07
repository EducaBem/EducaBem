import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { STATUS, doacoes } from '../mock.js'
import { Capa, ChipStatus, Icone } from '../components/ui.jsx'
import CancelarDoacao from '../components/CancelarDoacao.jsx'

const ETAPAS = [['package', 'Doação registrada'], ['truck', 'A caminho da instituição'], ['bag', 'Entregue na instituição']]

// "ver todas" da Home
export function Historico() {
  return (
    <>
      <div><h1 className="tc">Minhas doações</h1><p className="sub">{doacoes.length} livros doados</p></div>
      {doacoes.length === 0 && <p className="vazio-lista">Nenhuma doação por aqui ainda.</p>}
      {doacoes.length > 0 && <ul className="lista">
        {doacoes.map((d, i) => (
          <li key={d.id}><Capa i={i} />
            <Link className="t" to={`/rastreio/${d.id}`}>{d.titulo}<small>{d.id} · {d.datas[0]}</small></Link>
            <ChipStatus status={d.status} /></li>
        ))}
      </ul>}
      <Link to="/doar" className="btn btn-amarelo cta">Doar outro livro <Icone nome="arrow" tam={18} /></Link>
    </>
  )
}

export function Detalhes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const d = doacoes.find((x) => x.id === id)
  if (!d) return <Navigate to="/rastreio" replace />
  const etapa = STATUS[d.status].etapa
  return (
    <>
      <div><h1 className="tc">Detalhes da doação</h1><p className="sub">{d.id}</p></div>
      <section className="det">
        <div className="det-livro"><Capa grande i={Math.max(0, doacoes.indexOf(d))} />
          <div><h2>{d.titulo}</h2><ChipStatus status={d.status} /></div></div>
        <dl>
          <dt>Categoria</dt><dd>{d.categoria}</dd>
          <dt>Estado</dt><dd>{d.estado}</dd>
          <dt>Ponto de coleta</dt><dd>{d.ponto}</dd>
          <dt>Instituição</dt><dd>{d.inst}</dd>
          <dt>Quantidade</dt><dd>1</dd>
        </dl>
        <h3>Linha do tempo</h3>
        <ol className="tl">
          {ETAPAS.map(([ic, txt], i) => (
            <li key={txt} className={i <= etapa ? 'ok' : ''}><span><Icone nome={ic} tam={22} /></span><div>{txt}<small>{d.datas[i] ? `em ${d.datas[i]}` : 'aguardando'}</small></div></li>
          ))}
        </ol>
        <CancelarDoacao d={d} nota onRemovida={(x) => navigate('/rastreio', { state: { cancelada: x.id } })} />
      </section>
      <Link to="/rastreio" className="voltar">← Voltar ao Rastreio do Bem</Link>
    </>
  )
}
