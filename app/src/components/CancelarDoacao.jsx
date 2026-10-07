import { useEffect, useRef, useState } from 'react'
import { PTS, podeCancelar, removerDoacao } from '../mock.js'
import { Icone, useDialogoAberto } from './ui.jsx'

// Botão "Cancelar doação" + diálogo de confirmação.
// Só aparece para doações ainda "registradas" (o livro não saiu do ponto de coleta).
// Com `nota`, as doações que já não dá para cancelar mostram o motivo em vez do botão.
export default function CancelarDoacao({ d, onRemovida, nota = false, curto = false, className = '' }) {
  const [aberto, setAberto] = useState(false)
  const gatilho = useRef(null)

  if (!podeCancelar(d)) {
    return nota
      ? <p className="aviso-cancel"><Icone nome="info" tam={18} />Este livro já saiu do ponto de coleta, então a doação não pode mais ser cancelada.</p>
      : null
  }
  function confirmar() {
    if (removerDoacao(d.id)) { setAberto(false); onRemovida?.(d) }
  }
  function fechar() { setAberto(false); gatilho.current?.focus() }
  return (
    <>
      <button ref={gatilho} type="button" className={`btn-cancelar ${className}`} aria-label={`Cancelar doação ${d.id}`} onClick={() => setAberto(true)}>
        <Icone nome="trash" tam={18} />{curto ? 'Cancelar' : 'Cancelar doação'}
      </button>
      {aberto && <Confirmacao d={d} onManter={fechar} onConfirmar={confirmar} />}
    </>
  )
}

function Confirmacao({ d, onManter, onConfirmar }) {
  useDialogoAberto()
  const manter = useRef(null)
  const caixa = useRef(null)
  useEffect(() => { manter.current?.focus() }, [])
  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onManter(); return }
      if (e.key !== 'Tab') return // prende o foco dentro do diálogo
      const alvos = caixa.current?.querySelectorAll('button')
      if (!alvos?.length) return
      const primeiro = alvos[0], ultimo = alvos[alvos.length - 1]
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus() }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus() }
    }
    window.addEventListener('keydown', aoTeclar, true)
    return () => window.removeEventListener('keydown', aoTeclar, true)
  }, [onManter])
  return (
    <div className="modal-fundo" onClick={onManter}>
      <div ref={caixa} className="dlg" role="alertdialog" aria-modal="true" aria-labelledby="dlg-t" aria-describedby="dlg-d" onClick={(e) => e.stopPropagation()}>
        <span className="dlg-ic"><Icone nome="trash" tam={28} /></span>
        <h2 id="dlg-t">Cancelar esta doação?</h2>
        <p id="dlg-d">O livro <b>{d.titulo}</b> ({d.id}) sai das suas doações e você deixa de contar os <b>{PTS.doacao} pts</b> dela no Score do Bem.</p>
        <div className="dlg-acoes">
          <button ref={manter} type="button" className="dlg-manter" onClick={onManter}>Manter doação</button>
          <button type="button" className="dlg-sim" onClick={onConfirmar}>Sim, cancelar</button>
        </div>
      </div>
    </div>
  )
}
