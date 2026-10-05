import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './app.css'

// HashRouter: URLs como app/#/home. Não precisa configurar rewrite no servidor.
createRoot(document.getElementById('root')).render(
  <HashRouter>
    <App />
  </HashRouter>
)
