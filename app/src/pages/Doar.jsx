import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addDoacao, CATEGORIAS, doacoes, ESTADOS, PONTOS_COLETA, PTS } from '../mock.js'
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
  const andamento = doacoes.filter((d) => d.status !== 'entregue').length
  return (
    <div className="doar-grade">
      <div className="doar-txt">
        <div className="hero-doar"><h1 className="tc">Doe conhecimento.<br />Mude uma história</h1>
          <p className="sub">Seus livros podem transformar novas histórias.</p></div>
        {doacoes.length > 0 && (
          <div className="faixa-doacoes">
            <span><b>{doacoes.length}</b> {doacoes.length === 1 ? 'livro doado' : 'livros doados'}{andamento > 0 && <> · {andamento} em andamento</>}</span>
            <Link to="/rastreio">Ver rastreio</Link>
          </div>
        )}
        <section className="como">
          <h2 className="tit-bloco">Como funciona?</h2>
          <ol className="passos">
            {PASSOS.map(([t, s], i) => <li key={t}><span className="n">{i + 1}</span><div><b>{t}</b>{s && <small>{s}</small>}</div></li>)}
          </ol>
        </section>
        <Link to="/doar/novo" className="btn btn-amarelo cta">Quero doar <Icone nome="arrow" tam={20} /></Link>
      </div>
      <div className="doar-vis">
        <div className="ilus-bola"><img className="ilus" src={livroAberto} alt="" /></div>
        <div className="missao"><img src={pilhaVerde} alt="" />
          <div><small>Missão do Bem</small>Doe pelo menos 1 livro<br /><Icone nome="star" tam={18} fill="currentColor" className="est" /> <b>+{PTS.doacao}</b> no Score do Bem</div></div>
      </div>
    </div>
  )
}

const ESTADO_DICA = { Novo: 'Sem marcas de uso', 'Ótimo': 'Quase sem sinais de uso', Bom: 'Pequenos desgastes', Regular: 'Marcas de uso, mas legível' }

// Opção de rádio estilizada (o <input> real fica por cima, invisível: teclado e leitor de tela funcionam).
function Opcao({ nome, valor, variante, dica, icone }) {
  return (
    <label className={`opt opt-${variante}`}>
      <input type="radio" name={nome} value={valor} required />
      <span>
        {icone && <Icone nome={icone} tam={22} />}
        <span className="txt"><b>{valor}</b>{dica && <small>{dica}</small>}</span>
      </span>
    </label>
  )
}
function Grupo({ n, titulo, children, classe = '' }) {
  return (
    <fieldset className="grupo">
      <legend><span className="n">{n}</span>{titulo}</legend>
      <div className={`opcoes ${classe}`}>{children}</div>
    </fieldset>
  )
}

export function NovoLivro() {
  const navigate = useNavigate()
  const tituloRef = useRef(null)
  const [erro, setErro] = useState('')
  function enviar(e) {
    e.preventDefault()
    const f = new FormData(e.target)
    const titulo = String(f.get('titulo')).trim().replace(/\s+/g, ' ') // "   " passava no required e criava doação sem título
    if (!titulo) { setErro('Digite o título do livro.'); tituloRef.current?.focus(); return }
    addDoacao({ titulo, categoria: f.get('categoria'), estado: f.get('estado'), ponto: f.get('ponto') }) // TODO: POST /doacoes
    navigate('/doar/concluido')
  }
  return (
    <>
      <div><h1 className="tc">Cadastrar livro</h1><p className="sub">Preencha os dados para doar.</p></div>
      <form className="card-livro" onSubmit={enviar}>
        <header className="card-livro-cab">
          <img src={pilhaAzul} alt="" />
          <div><h2>Conte sobre o livro</h2><p>São só 4 passos rápidos.</p></div>
        </header>

        <div className="grupo">
          <label className="rot" htmlFor="titulo"><span className="n">1</span>Título do livro</label>
          <div className={`campo-titulo ${erro ? 'erro' : ''}`}>
            <Icone nome="book" tam={22} />
            <input id="titulo" ref={tituloRef} name="titulo" placeholder="Ex.: Pai Rico, Pai Pobre" maxLength={80} autoComplete="off" required
              aria-invalid={!!erro} aria-describedby={erro ? 'titulo-erro' : undefined} onChange={() => erro && setErro('')} />
          </div>
          {erro && <p id="titulo-erro" className="msg-erro" role="alert">{erro}</p>}
        </div>

        <Grupo n="2" titulo="Categoria" classe="chips">
          {CATEGORIAS.map((c) => <Opcao key={c} nome="categoria" valor={c} variante="chip" />)}
        </Grupo>

        <Grupo n="3" titulo="Estado de conservação" classe="grade">
          {ESTADOS.map((e) => <Opcao key={e} nome="estado" valor={e} variante="card" dica={ESTADO_DICA[e]} />)}
        </Grupo>

        <Grupo n="4" titulo="Onde você vai entregar?" classe="coluna">
          {PONTOS_COLETA.map((p) => <Opcao key={p} nome="ponto" valor={p} variante="ponto" icone="pin" dica="Entrega pessoal, sem frete" />)}
        </Grupo>

        <div className="resumo-pts"><Icone nome="star" tam={22} fill="currentColor" /><span><b>+{PTS.doacao} pts</b> no Score do Bem ao confirmar</span></div>
        <div className="acoes-livro">
          <button className="btn btn-amarelo" type="submit">Confirmar doação</button>
          <p className="nota-cancel">Mudou de ideia? Dá para cancelar no Rastreio do Bem enquanto o livro não sair do ponto de coleta.</p>
          <Link to="/doar" className="voltar escuro">← Voltar</Link>
        </div>
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
