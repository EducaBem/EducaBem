import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { STATUS, doacoes } from '../mock.js'
import { Capa, Icone } from '../components/ui.jsx'
import CancelarDoacao from '../components/CancelarDoacao.jsx'
import mascot from '../../../assets/mascot.png'

const ETAPAS = [['package', 'Registrada'], ['truck', 'A caminho'], ['bag', 'Entregue']]

export default function Rastreio() {
  const { state, pathname } = useLocation()
  const navigate = useNavigate()
  const [aviso, setAviso] = useState(state?.cancelada ? `Doação ${state.cancelada} cancelada.` : '')
  // limpa o state da navegação: o aviso não reaparece ao recarregar a página
  useEffect(() => { if (state?.cancelada) navigate(pathname, { replace: true, state: null }) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // navegar para o mesmo lugar re-renderiza o layout (o contador do sino acompanha o aviso removido)
  const removida = (d) => { setAviso(`Doação ${d.id} cancelada.`); navigate(pathname, { replace: true, state: null }) }
  return (
    <>
      <section className="banner">
        <div><h1>Rastreio do Bem</h1><p>Transformando vidas e mentes</p></div>
        <img src={mascot} alt="" />
      </section>
      <section className="painel">
        <h2>Suas doações</h2>
        {aviso && <p className="aviso-ok" role="status"><Icone nome="check" tam={18} strokeWidth={3} />{aviso}</p>}
        {doacoes.length === 0 && <div className="doacao vazio-doacao"><p>Quando você doar um livro, o acompanhamento aparece aqui.</p><Link className="btn btn-azul" to="/doar">Doar um livro</Link></div>}
        {doacoes.map((d, n) => {
          const etapa = STATUS[d.status].etapa
          return (
            <article className="doacao" key={d.id}>
              <div className={`st st-${STATUS[d.status].cor}`}>{STATUS[d.status].texto}</div>
              <div className="corpo">
                <div className="livro"><Capa i={n} />{d.id}</div>
                <div>
                  <h3>{d.titulo}</h3>
                  <ol className="linha" style={{ '--prog': etapa }}>{ETAPAS.map(([ic, nome], i) => <li key={nome} className={i <= etapa ? 'ok' : ''}><span><Icone nome={ic} tam={20} /></span><em>{nome}</em></li>)}</ol>
                </div>
                <div className="rodape">
                  <span>Registrada em {d.datas[0]}</span>
                  <div className="botoes">
                    <Link className="btn btn-azul" to={`/rastreio/${d.id}`}>Ver detalhes</Link>
                    <CancelarDoacao d={d} curto onRemovida={removida} />
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </section>
    </>
  )
}
