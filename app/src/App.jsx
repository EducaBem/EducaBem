import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import Auth from './pages/Auth.jsx'
import Home from './pages/Home.jsx'
import EmBreve from './pages/EmBreve.jsx'
import { ConfirmarCodigo, EsqueciSenha } from './pages/Recuperacao.jsx'
import { Doar, NovoLivro, Concluido } from './pages/Doar.jsx'
import Rastreio from './pages/Rastreio.jsx'
import { Historico, Detalhes } from './pages/Doacoes.jsx'
import { Trilha, Modulo, Quiz } from './pages/Trilha.jsx'
import { Score, Ranking } from './pages/Score.jsx'
import { Perfil, EditarPerfil, EditarOk } from './pages/Perfil.jsx'
import { Apoiar, ApoiarDoar, Ongs } from './pages/Apoiar.jsx'

// Mapa de rotas = seção 4.3 da documentação v4.
// Telas ainda não codadas: coloque aqui e use <EmBreve>.
const LOGADAS = []

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Auth modo="entrar" />} />
        <Route path="/criar-conta" element={<Auth modo="cadastro" />} />
        <Route path="/confirmar-codigo" element={<ConfirmarCodigo />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      </Route>
      <Route element={<AppLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/doar" element={<Doar />} />
        <Route path="/doar/novo" element={<NovoLivro />} />
        <Route path="/doar/concluido" element={<Concluido />} />
        <Route path="/rastreio" element={<Rastreio />} />
        <Route path="/rastreio/:id" element={<Detalhes />} />
        <Route path="/doacoes" element={<Historico />} />
        <Route path="/trilha" element={<Trilha />} />
        <Route path="/trilha/:modulo" element={<Modulo />} />
        <Route path="/trilha/:modulo/quiz" element={<Quiz />} />
        <Route path="/score" element={<Score />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/perfil/editar" element={<EditarPerfil />} />
        <Route path="/perfil/editar/ok" element={<EditarOk />} />
        <Route path="/apoiar" element={<Apoiar />} />
        <Route path="/apoiar/doar" element={<ApoiarDoar />} />
        <Route path="/ongs" element={<Ongs />} />
        {LOGADAS.map(([p, t]) => <Route key={p} path={p} element={<EmBreve titulo={t} />} />)}
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
