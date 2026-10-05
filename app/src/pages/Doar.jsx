import { Link, useNavigate } from 'react-router-dom'
import { addDoacao, CATEGORIAS, ESTADOS, PONTOS_COLETA } from '../mock.js'
import livroAberto from '../../../assets/livro-aberto.png'
import pilhaVerde from '../../../assets/pilha-verde.png'
import pilhaAzul from '../../../assets/pilha-azul.png'
import beijaFlor from '../../../assets/beija-flor-doacao.png'
import { Icone } from '../components/ui.jsx'

const PASSOS = [
  ['Cadastre seu livro', 'Informe o título e o estado de conservação'],
  ['Escolha onde entregar', 'Leve o livro pessoalmente a um ponto parceiro, sem frete'],
  ['Gere impacto e ganhe pontos', 'Seus livros chegam a novas histórias!'],
]

export function Doar() {
  return (
    <>
      <div className="hero-doar"><h1 className="tc">Doe conhecimento.<br />Mude uma história</h1>
        <p className="sub">Seus livros podem transformar novas histórias.</p></div>
      <img className="ilus" src={livroAberto} alt="" />
      <div className="missao"><img src={pilhaVerde} alt="" />
        <div><small>Missão do Bem</small>Doe pelo menos 1 livro<br /><Icone nome="star" tam={18} fill="currentColor" className="est" /> <b>+50</b> no Score do Bem</div></div>
      <h2 className="tit-bloco">Como funciona?</h2>
      <ol className="passos">
        {PASSOS.map(([t, s], i) => <li key={t}><span className="n">{i + 1}</span><div><b>{t}</b>{s && <small>{s}</small>}</div></li>)}
      </ol>
      <Link to="/doar/novo" className="btn btn-amarelo cta">Quero doar <Icone nome="arrow" tam={20} /></Link>
    </>
  )
}

export function NovoLivro() {
  const navigate = useNavigate()
  function enviar(e) {
    e.preventDefault()
    const f = new FormData(e.target)
    addDoacao({ titulo: f.get('titulo').trim(), categoria: f.get('categoria'), estado: f.get('estado'), ponto: f.get('ponto') }) // TODO: POST /doacoes
    navigate('/doar/concluido')
  }
  const sel = (nome, icone, placeholder, opcoes) => (
    <label className="fld"><Icone nome={icone} tam={22} />
      <select name={nome} required defaultValue=""><option value="" disabled>{placeholder}</option>{opcoes.map((o) => <option key={o}>{o}</option>)}</select></label>
  )
  return (
    <>
      <div><h1 className="tc">Cadastrar livro</h1><p className="sub">Preencha os dados para doar.</p></div>
      <img className="ilus pequena" src={pilhaAzul} alt="" />
      <form className="form-livro" onSubmit={enviar}>
        <label className="fld"><Icone nome="book" tam={22} /><input name="titulo" placeholder="Digite o título do livro" required /></label>
        {sel('categoria', 'category', 'Selecione a categoria', CATEGORIAS)}
        {sel('estado', 'note', 'Selecione o estado', ESTADOS)}
        {sel('ponto', 'pin', 'Escolha o ponto de coleta', PONTOS_COLETA)}
        <button className="btn btn-amarelo" type="submit">Confirmar doação</button>
      </form>
    </>
  )
}

export function Concluido() {
  return (
    <>
      <img className="ilus grande" src={beijaFlor} alt="Mascote EducaBem" />
      <div><h1 className="tc">Doação cadastrada!</h1><p className="sub" style={{ marginTop: 10 }}>Seu livro agora pode transformar<br />a história de alguém.</p></div>
      <div className="missao pontos"><Icone nome="star" tam={44} fill="currentColor" className="estrela" /><div><b>+50</b> no Score do Bem</div></div>
      <Link to="/trilha" className="btn btn-amarelo cta">Retomar trilhas <Icone nome="arrow" tam={20} /></Link>
      <Link to="/rastreio" className="voltar">Ver rastreio</Link>
    </>
  )
}
