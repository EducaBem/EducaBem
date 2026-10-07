import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ONGS, PLANOS } from '../mock.js'
import mascot from '../../../assets/mascot.png'
import { Icone } from '../components/ui.jsx'

// Fora do MVP (doc v4, seção 7): telas visuais, sem cobrança real.
function Abas({ ativa }) {
  return (
    <nav className="abas pill" aria-label="Tipo de apoio">
      <Link to="/apoiar" className={ativa === 'plano' ? 'on' : ''}><Icone nome="sprout" tam={18} /> Plano Mensal</Link>
      <Link to="/apoiar/doar" className={ativa === 'unica' ? 'on' : ''}><Icone nome="heart" tam={18} /> Doar uma vez</Link>
    </nav>
  )
}

export function Apoiar() {
  const [aviso, setAviso] = useState('')
  return (
    <>
      <header className="apoiar-cab">
        <h1 className="tc">Apoiar o EducaBem</h1>
        <Abas ativa="plano" />
        <p className="sub txt">O EducaBem é gratuito para doar. Quem quiser pode apoiar todo mês e ganhar vantagens assim a plataforma se mantém no ar.</p>
      </header>
      <div className="planos">
        {PLANOS.map((p) => (
          <article key={p.id} className={`plano ${p.destaque ? 'destaque' : ''} ${p.id === 'gratis' ? 'gratis' : ''}`}>
            {p.destaque && <span className="selo">Mais escolhido</span>}
            <span className="ic"><Icone nome={p.icone} tam={26} /></span>
            <h2>{p.nome}</h2>
            {p.sub ? <p className="preco-sub">{p.sub}</p> : <p className="preco">{p.preco} <small>/mês</small></p>}
            <ul>{p.itens.map((i) => <li key={i}>{i}</li>)}</ul>
            {p.id === 'gratis'
              ? <button className="btn btn-cinza-claro" disabled>PLANO ATUAL</button>
              : <button className={`btn ${p.destaque ? 'btn-amarelo' : 'btn-azul-g'}`} onClick={() => setAviso(`Assinatura do plano ${p.nome} em breve!`)}>ASSINAR {p.nome.toUpperCase()}</button>}
          </article>
        ))}
      </div>
      {aviso && <p className="sub" role="status">{aviso}</p>}
    </>
  )
}

export function ApoiarDoar() {
  const [valor, setValor] = useState(25)
  const [outro, setOutro] = useState('')
  const [forma, setForma] = useState('pix')
  const [aviso, setAviso] = useState(false)
  const final = outro ? Number(outro) : valor
  return (
    <>
      <div><h1 className="tc">Apoiar o EducaBem</h1><p className="sub">Apoiar é fazer a diferença!</p></div>
      <Abas ativa="unica" />
      <section className="card-pag">
        <h2>Selecione o Valor:</h2>
        <div className="forma" role="radiogroup" aria-label="Forma de pagamento">
          {['pix', 'cartão'].map((f) => <button key={f} role="radio" aria-checked={forma === f} className={forma === f ? 'on' : ''} onClick={() => setForma(f)}>{f}</button>)}
        </div>
        <div className="valores">
          {[10, 25, 50, 100].map((v) => <button key={v} aria-pressed={!outro && valor === v} className={!outro && valor === v ? 'on' : ''} onClick={() => { setValor(v); setOutro('') }}>R$ {v},00</button>)}
        </div>
        <label className="outro">Outro valor:
          <span><i>R$</i><input inputMode="decimal" type="number" min="1" placeholder="0,00" value={outro} onChange={(e) => setOutro(e.target.value)} /></span></label>
        <button className="btn btn-amarelo" disabled={!(final > 0)} onClick={() => setAviso(true)}>Continuar para o pagamento</button>
        {aviso && <p role="status" className="dica">Pagamento via {forma} de R$ {final} em breve!</p>}
      </section>
    </>
  )
}

export function Ongs() {
  const navigate = useNavigate()
  return (
    <>
      <section className="banner"><div><h1>Ongs Parceiras</h1></div><img src={mascot} alt="" /></section>
      <section className="painel">
        {ONGS.map((o) => (
          <article key={o.nome} className={`ong ong-${o.cor}`}>
            <h3><Icone nome={o.icone} tam={22} /> {o.nome}</h3>
            <p>{o.texto}</p>
            <button className="btn btn-azul" onClick={() => navigate('/doar')}>Acessar ong</button>
          </article>
        ))}
      </section>
    </>
  )
}
