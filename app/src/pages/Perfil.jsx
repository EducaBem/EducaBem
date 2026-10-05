import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MODULOS, TRILHA, moduloAtual, nivelDe, atualizarPerfil, progresso, stats, usuario } from '../mock.js'
import { Avatar, BarraProgresso, Icone } from '../components/ui.jsx'
import parceria from '../../../assets/handshake.png'
import livros from '../../../assets/pilha-mini.png'

export function Perfil() {
  const nv = nivelDe(usuario.pontos)
  const s = stats()
  const feitos = progresso.concluidos.size
  const pct = Math.round((feitos / MODULOS.length) * 100)
  const IMPACTO = [['Livros doados', s.livros, <img src={livros} alt="" />], ['Score do Bem', s.pontos, <span className="ic"><Icone nome="trophy" tam={30} /></span>],
    ['Instituições apoiadas', s.instituicoes, <span className="ic"><Icone nome="building" tam={30} /></span>], ['Leitores impactados', s.leitores, <img src={parceria} alt="" />]]
  return (
    <>
      <h1 className="h-inter">Meu perfil</h1>
      <section className="card-perfil">
        <Avatar tam={130} />
        <h2 className="h-inter">{usuario.nome}</h2>
        <p className="mini"><span>{usuario.email}</span><span>Nível {nv.atual.n}</span></p>
        <BarraProgresso pct={nv.pct} cor="verde" />
        <Link className="btn-editar" to="/perfil/editar"><Icone nome="edit" tam={16} /> Editar informações</Link>
      </section>
      <h2 className="h-inter">Meu impacto</h2>
      <div className="impacto">
        {IMPACTO.map(([t, v, ic]) => <div key={t} className="num">{ic}<div><span>{t}</span><b>{v}</b></div></div>)}
      </div>
      <h2 className="h-inter">Minha aprendizagem</h2>
      <section className="card-aprende">
        <p className="cont">Continuar aprendendo</p>
        <h3>{TRILHA.titulo.replace('–', '-')}</h3>
        <div className="barra barra-verde claro"><i style={{ width: `${pct}%` }} /></div>
        <p className="mini">{pct}% concluído · {feitos} de {MODULOS.length} módulos</p>
        <Link className="btn btn-retomar" to={feitos === MODULOS.length ? '/trilha' : `/trilha/${moduloAtual().id}`}>Retomar</Link>
      </section>
    </>
  )
}

export function EditarPerfil() {
  const navigate = useNavigate()
  const [foto, setFoto] = useState(usuario.avatar)
  function escolherFoto(e) {
    const f = e.target.files?.[0]
    if (!f) return
    const r = new FileReader() // data URL sobrevive ao recarregar (blob: não). TODO: Supabase Storage (bucket "avatars")
    r.onload = () => setFoto(r.result)
    r.readAsDataURL(f)
  }
  function salvar(e) {
    e.preventDefault()
    const d = new FormData(e.target)
    atualizarPerfil({ nome: d.get('nome'), nascimento: d.get('nascimento'), email: d.get('email'), avatar: foto }) // TODO: PATCH /usuarios/me
    navigate('/perfil/editar/ok')
  }
  return (
    <>
      <h1 className="h-inter tc sem-caps">Atualize seus dados pessoais</h1>
      <form className="card-form" onSubmit={salvar}>
        <label className="foto" aria-label="Alterar foto">
          <span className="avatar" style={{ width: 150, height: 150, fontSize: 64 }}>{foto ? <img src={foto} alt="" /> : usuario.inicial}</span>
          <i className="editar"><Icone nome="edit" tam={18} /></i>
          <input type="file" accept="image/*" hidden onChange={escolherFoto} />
        </label>
        <label className="campo-g">Nome<input name="nome" defaultValue={usuario.nome} required /></label>
        <label className="campo-g">Data de nascimento<input name="nascimento" type="date" defaultValue={usuario.nascimento} /></label>
        <label className="campo-g">Email<input name="email" type="email" defaultValue={usuario.email} required /></label>
        <div className="botoes-form">
          <button type="button" className="btn-cinza" onClick={() => navigate('/perfil')}>Cancelar</button>
          <button type="submit" className="btn-salvar">Salvar alterações</button>
        </div>
      </form>
    </>
  )
}

export function EditarOk() {
  return (
    <div className="card-ok">
      <svg viewBox="0 0 100 100" width="150" aria-hidden><circle cx="50" cy="50" r="42" fill="none" stroke="#16A34A" strokeWidth="9" /><path d="M30 52l14 14 27-32" fill="none" stroke="#16A34A" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <h1 className="h-inter">Alterações salvas!</h1>
      <p className="h-inter">Suas informações foram atualizadas<br />com sucesso.</p>
      <Link className="btn-salvar" to="/perfil">Voltar ao meu perfil</Link>
    </div>
  )
}
