import { useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { useAcessibilidadeDeRota } from '../components/acessibilidade.js'
import logo from '../../../assets/logo-claro.png'
import mascot from '../../../assets/mascot.png'

export default function AuthLayout() {
  const painelRef = useRef(null)
  useAcessibilidadeDeRota(painelRef) // título da aba e foco no título do formulário a cada troca de tela
  return (
    <main className="auth">
      <section className="auth-esq">
        <img className="logo" src={logo} alt="EducaBem" />
        <h1>Quem lê, aprende bem. Quem doa, <span className="g">transforma</span> <span className="y">um futuro.</span></h1>
        <i className="anel" />
        <i className="circ"><img src={mascot} alt="" /></i>
      </section>
      <section className="auth-dir" ref={painelRef}><Outlet /></section>
    </main>
  )
}
