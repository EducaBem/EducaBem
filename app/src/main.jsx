import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { iniciarSessao } from './mock.js'
import './app.css'

// Confere a sessão do Supabase antes de desenhar a tela (máx. 4 s, para a página nunca ficar em branco se a rede falhar).
const espera = new Promise((ok) => setTimeout(ok, 4000))
// HashRouter: URLs como app/#/home. Não precisa configurar rewrite no servidor.
Promise.race([iniciarSessao(), espera]).catch(() => {}).then(() => {
  createRoot(document.getElementById('root')).render(
    <HashRouter>
      <App />
    </HashRouter>
  )
})
