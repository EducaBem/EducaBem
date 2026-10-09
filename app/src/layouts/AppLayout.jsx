import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../../assets/logo-claro.png' // texto branco: lê direto sobre o marinho, sem placa branca
import { usuario, notificacoes, logado, sair, salvarConta, atualizarDoBanco, marcarLidasBanco } from '../mock.js'
import { Avatar, Icone } from '../components/ui.jsx'
import Chatbot from '../components/Chatbot.jsx'

const ITENS = [['/home', 'home', 'Home'], ['/doar', 'package', 'Doar Livros'], ['/rastreio', 'pin', 'Rastreio do Bem'],
  ['/trilha', 'cap', 'Trilha'], ['/score', 'trophy', 'Score do Bem'], ['/perfil', 'user', 'Perfil']]
const EXTRAS = [['/apoiar', 'heart', 'Apoiar o EducaBem'], ['/ongs', 'users', 'ONGs Parceiras']]
const CLARAS = ['/home'] // telas com fundo claro no protótipo; as demais são azuis
const SEM_BOLA = ['/rastreio', '/ongs'] // o banner já é amarelo: a bola decorativa de fundo some atrás dele

export default function AppLayout() {
  const [aberto, setAberto] = useState(false)
  const [painel, setPainel] = useState(false)
  const [, forcar] = useState(0)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const fechar = () => setAberto(false)
  const naoLidas = notificacoes.filter((n) => !n.lida).length
  const sairDaConta = () => { sair(); navigate('/login') }

  const alternarPainel = () => {
    if (painel) { marcarLidasBanco(); notificacoes.forEach((n) => { n.lida = true }); salvarConta() } // ao fechar, marca como lidas (TODO: PATCH /notificacoes)
    setPainel(!painel); forcar((x) => x + 1)
  }
  // Com o banco ligado, cada troca de tela busca o que mudou (ex.: status da doação alterado pela equipe).
  const primeiraTela = useRef(true)
  useEffect(() => {
    if (primeiraTela.current) { primeiraTela.current = false; return }
    atualizarDoBanco().then((ok) => ok && forcar((x) => x + 1))
  }, [pathname])
  // Esc fecha o menu e o painel de notificações
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setAberto(false); setPainel(false) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!logado()) return <Navigate to="/login" replace /> // sem sessão, volta ao login

  const ativo = (to) => pathname === to || pathname.startsWith(to + '/') || (to === '/score' && pathname === '/ranking')
  const link = ([to, icone, nome]) => (
    <NavLink key={to} to={to} onClick={fechar} className={`item ${ativo(to) ? 'active' : ''}`} aria-current={ativo(to) ? 'page' : undefined}>
      <Icone nome={icone} tam={20} />{nome}
    </NavLink>
  )
  return (
    <div className="shell">
      {aberto && <div className="veu" onClick={fechar} />}
      <aside id="menu-principal" className={`menu ${aberto ? 'aberto' : ''}`} aria-label="Menu principal">
        <img className="logo" src={logo} alt="EducaBem" />
        <nav className="menu-nav">
          {ITENS.map(link)}
          <span className="menu-sep">Mais</span>
          {EXTRAS.map(link)}
          <button className="item" onClick={sairDaConta}><Icone nome="logout" tam={20} />Sair</button>
        </nav>
        <Link to="/perfil" className="usuario" onClick={fechar}>
          <Avatar tam={40} />
          <span><b>{usuario.nome}</b><small>Ver meu perfil</small></span>
        </Link>
      </aside>
      <div className={`principal ${CLARAS.includes(pathname) ? 'clara' : 'azul'} ${SEM_BOLA.includes(pathname) ? 'sem-bola' : ''}`}>
        <header className="topo">
          <div className="barra-m">
            <img className="logo-m" src={logo} alt="EducaBem" />
            <button className="burger" aria-label={aberto ? 'Fechar menu' : 'Abrir menu'} aria-expanded={aberto} aria-controls="menu-principal" onClick={() => setAberto((x) => !x)}><i /><i /><i />[...]
          </div>
          <div className="lado">
            <button className="sino" aria-label={`Notificações${naoLidas ? `, ${naoLidas} novas` : ''}`} aria-expanded={painel} onClick={alternarPainel}>
              <Icone nome="bell" tam={22} />{naoLidas > 0 && <b className="ponto">{naoLidas}</b>}
            </button>
            <Link to="/perfil" aria-label="Perfil"><Avatar tam={46} /></Link>
          </div>
          {painel && (
            <div className="notif" role="dialog" aria-label="Notificações">
              <h3>Notificações</h3>
              {notificacoes.length === 0 && <p className="vazio">Nada por aqui ainda.</p>}
              {notificacoes.map((n) => (
                <Link key={n.id} to={n.to} className={`notif-item ${n.lida ? '' : 'nova'}`} onClick={alternarPainel}>{n.texto}</Link>
              ))}
            </div>
          )}
        </header>
        <main className="conteudo"><Outlet /></main>
        <Chatbot />
      </div>
    </div>
  )
}
