import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Última rota tratada. Fica fora do componente porque o login e o app usam layouts diferentes:
// ao passar de um para o outro o hook monta de novo, mas a rota mudou e o foco deve ir ao novo título.
let ultimaRota = null

// Em um app de página única o navegador não "troca de página", então o leitor de tela não percebe a navegação.
// A cada troca de rota: atualiza o título da aba e leva o foco ao título (h1, ou h2) da nova tela.
// `raizRef` aponta para a área que muda de tela (o <main>, ou o painel do formulário no login).
export function useAcessibilidadeDeRota(raizRef) {
  const { pathname } = useLocation()
  useEffect(() => {
    const raiz = raizRef.current
    const titulo = raiz?.querySelector('h1') || raiz?.querySelector('h2')
    const texto = (titulo?.textContent || '').replace(/\s+/g, ' ').trim()
    document.title = texto ? `${texto} · EducaBem` : 'EducaBem'
    if (ultimaRota === null) { ultimaRota = pathname; return } // no carregamento inicial não rouba o foco
    if (ultimaRota === pathname) return // remontagem sem troca de tela (ex.: StrictMode em desenvolvimento)
    ultimaRota = pathname
    const alvo = titulo || raiz
    if (!alvo) return
    if (!alvo.hasAttribute('tabindex')) alvo.setAttribute('tabindex', '-1')
    alvo.focus({ preventScroll: true })
    window.scrollTo?.({ top: 0 })
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps
}
