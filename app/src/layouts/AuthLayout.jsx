import { Outlet } from 'react-router-dom'
import logo from '../../../assets/logo-claro.png'
import mascot from '../../../assets/mascot.png'

export default function AuthLayout() {
  return (
    <main className="auth">
      <section className="auth-esq">
        <img className="logo" src={logo} alt="EducaBem" />
        <h1>Quem lê, aprende bem. Quem doa, <span className="g">transforma</span> <span className="y">um futuro.</span></h1>
        <i className="anel" />
        <i className="circ"><img src={mascot} alt="" /></i>
      </section>
      <section className="auth-dir"><Outlet /></section>
    </main>
  )
}
