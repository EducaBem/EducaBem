import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Botao, Campo } from '../components/ui.jsx'
import { criarConta, criarContaBanco, entrar, entrarBanco, entrarGoogle } from '../mock.js'
import { temBanco } from '../supabase.js'

// Login e Criar conta (modo = 'entrar' | 'cadastro').
export default function Auth({ modo }) {
  const navigate = useNavigate()
  const cadastro = modo === 'cadastro'
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  async function enviar(e) {
    e.preventDefault()
    const f = new FormData(e.target)
    setErro('')
    if (temBanco) { // login e cadastro de verdade, pelo Supabase Auth
      setEnviando(true)
      try {
        if (cadastro) await criarContaBanco({ nome: f.get('nome'), email: f.get('email'), senha: f.get('senha') })
        else await entrarBanco({ email: f.get('email'), senha: f.get('senha') })
        navigate('/home')
      } catch (err) { setErro(err.message); setEnviando(false) }
      return
    }
    // sem variáveis do Supabase: modo de demonstração (dados no navegador)
    if (cadastro) { criarConta({ nome: f.get('nome'), email: f.get('email') }); navigate('/confirmar-codigo') }
    else { entrar(f.get('email')); navigate('/home') }
  }
  return (
    <form className="auth-card" onSubmit={enviar}>
      <header className="auth-cab">
        <h2>{cadastro ? 'Crie sua conta' : 'Bem-vindo de volta'}</h2>
        <p>{cadastro ? 'Doe livros, aprenda e acompanhe seu impacto.' : 'Entre para continuar sua trilha do bem.'}</p>
      </header>
      {cadastro && <Campo label="Nome" name="nome" placeholder="Digite seu nome" autoComplete="name" required />}
      <Campo label="Email" name="email" type="email" placeholder="Digite seu email" autoComplete="email" required />
      <Campo label="Senha" name="senha" type="password" placeholder="Digite sua senha" minLength={6} autoComplete={cadastro ? 'new-password' : 'current-password'} required />
      {cadastro && <label className="aceite"><input type="checkbox" required /> Li e aceito os termos de uso e a política de privacidade (LGPD).</label>}
      {erro && <p className="dica erro" role="alert">{erro}</p>}
      <Botao bloco type="submit" disabled={enviando}>{enviando ? 'Aguarde…' : cadastro ? 'Criar conta' : 'Entrar'}</Botao>
      {!temBanco && <> {/* login com Google só no modo de demonstração; com o banco ligado fica oculto até ser configurado */}
      <div className="ou" aria-hidden="true"><span>ou</span></div>
      <button type="button" className="btn-google" onClick={() => { entrarGoogle(); navigate('/home') }}>
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
        Entrar com Google
      </button>
      </>}
      <div className="acoes">
        {cadastro ? <span /> : <Link className="link-sub" to="/esqueci-senha">Esqueceu a senha?</Link>}
        <Link className="link-sub" to={cadastro ? '/login' : '/criar-conta'}>{cadastro ? 'Já tenho conta' : 'Criar conta'}</Link>
      </div>
    </form>
  )
}
