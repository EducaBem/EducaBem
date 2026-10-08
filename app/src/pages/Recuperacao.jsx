import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Botao, Campo } from '../components/ui.jsx'
import { Link } from 'react-router-dom'
import { emailPendente, entrar } from '../mock.js'
import { temBanco } from '../supabase.js'

// Tela do protótipo: e-mail + código na mesma tela.
export function ConfirmarCodigo() {
  const navigate = useNavigate()
  const [enviado, setEnviado] = useState(false)
  return (
    <form className="auth-card" onSubmit={(e) => { e.preventDefault(); entrar(new FormData(e.target).get('email')); navigate('/home') /* TODO: supabase.auth.verifyOtp */ }}>
      <header className="auth-cab"><h2>Confirme seu e-mail</h2><p>Enviaremos um código de 6 dígitos para você.</p></header>
      <Campo label="Email" name="email" type="email" placeholder="Digite seu email" defaultValue={emailPendente()} required />
      <Botao bloco type="button" cor="azul-g" onClick={() => setEnviado(true) /* TODO: supabase.auth.resend */}>{enviado ? 'Reenviar código' : 'Enviar código'}</Botao>
      {enviado && <p className="dica ok" role="status">Código enviado! Confira sua caixa de entrada.</p>}
      <div className="espaco" />
      <Campo label="Código" inputMode="numeric" maxLength={6} placeholder="Digite o código" required />
      <Botao bloco type="submit">Finalizar</Botao>
    </form>
  )
}

// Fluxo proposto na doc: e-mail → código → nova senha.
export function EsqueciSenha() {
  const [etapa, setEtapa] = useState(1)
  const navigate = useNavigate()
  // com o banco ligado, esta tela de demonstração não envia nada de verdade: melhor avisar do que fingir
  if (temBanco) return (
    <div className="auth-card">
      <header className="auth-cab"><h2>Recuperar senha</h2><p>A recuperação de senha por e-mail ainda está em construção. Por enquanto, fale com a equipe do EducaBem para redefinir.</p></header>
      <Link className="link-sub" to="/login">Voltar para o login</Link>
    </div>
  )
  function avancar(e) {
    e.preventDefault()
    if (etapa < 3) setEtapa(etapa + 1)
    else navigate('/login') // TODO: supabase.auth.updateUser({ password })
  }
  return (
    <form className="auth-card" onSubmit={avancar}>
      <header className="auth-cab"><h2>Recuperar senha</h2><p>Passo {etapa} de 3</p></header>
      {etapa === 1 && <><Campo label="Email" type="email" placeholder="Digite seu email" required /><Botao bloco type="submit">Enviar código</Botao></>}
      {etapa === 2 && <><p className="dica">Enviamos um código de 6 dígitos para o seu email.</p><Campo label="Código" inputMode="numeric" maxLength={6} placeholder="Digite o código" required /><Botao bloco type="submit">Continuar</Botao></>}
      {etapa === 3 && <><Campo label="Nova senha" type="password" minLength={6} placeholder="Digite a nova senha" required /><Campo label="Confirmar nova senha" type="password" minLength={6} placeholder="Repita a nova senha" required /><Botao bloco type="submit">Salvar senha</Botao></>}
    </form>
  )
}
