import { useState } from 'react'

const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const brl2 = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const num = (v) => Math.max(0, Number(v) || 0)

export function Atividade({ dados }) {
  const T = { classificar: Classificar, amortizar: Amortizar, mora: Mora }[dados.tipo]
  return (
    <div className="ativ">
      <h2>{dados.titulo}</h2>
      <p className="dica-ativ">{dados.dica}</p>
      <T dados={dados} />
    </div>
  )
}

function Classificar({ dados }) {
  const [resp, setResp] = useState({})
  const feitos = Object.keys(resp).length
  return (
    <>
      <ul className="class-lista">
        {dados.itens.map(([txt, certa], i) => {
          const r = resp[i]
          return (
            <li key={txt} className={r === undefined ? '' : r === certa ? 'ok' : 'erro'}>
              <span>{txt}</span>
              <div className="class-op" role="group" aria-label={txt}>
                {dados.opcoes.map((o, k) => (
                  <button key={o} disabled={r !== undefined && r === certa} className={r === k ? (k === certa ? 'certa' : 'errada') : ''}
                    onClick={() => setResp({ ...resp, [i]: k })}>{o}</button>
                ))}
              </div>
            </li>
          )
        })}
      </ul>
      <p className="ativ-res" role="status">
        {feitos === 0 ? ' ' : Object.entries(resp).every(([i, k]) => dados.itens[i][1] === k) && feitos === dados.itens.length
          ? 'Tudo certo! Você já separa bem.' : 'Se algo ficar vermelho, toque na outra opção e tente de novo.'}
      </p>
    </>
  )
}

function Amortizar() {
  const [saldo, setSaldo] = useState(2000)
  const [pago, setPago] = useState(500)
  const s = num(saldo), p = Math.min(num(pago), s)
  const pct = s > 0 ? Math.round((p / s) * 100) : 0
  return (
    <>
      <div className="ativ-grade">
        <label className="ativ-campo">Saldo devedor (R$)<input type="number" inputMode="decimal" min="0" value={saldo} onChange={(e) => setSaldo(e.target.value)} /></label>
        <label className="ativ-campo">Quanto você amortiza (R$)<input type="number" inputMode="decimal" min="0" value={pago} onChange={(e) => setPago(e.target.value)} /></label>
      </div>
      <div className="barra-amort" aria-hidden><i style={{ width: `${100 - pct}%` }} /></div>
      <div className="ativ-cards dois">
        <div><small>Saldo devedor depois</small><b>{brl(s - p)}</b></div>
        <div className="favor"><small>A dívida diminuiu</small><b>{pct}%</b></div>
      </div>
      <p className="nota-ativ">Exemplo simples, sem contar os juros do período.</p>
    </>
  )
}

function Mora() {
  const [valor, setValor] = useState(200)
  const [dias, setDias] = useState(30)
  const [taxa, setTaxa] = useState(1)
  const v = num(valor)
  const juros = v * (num(taxa) / 100) * (dias / 30)
  return (
    <>
      <div className="ativ-grade">
        <label className="ativ-campo">Valor da conta (R$)<input type="number" inputMode="decimal" min="0" value={valor} onChange={(e) => setValor(e.target.value)} /></label>
        <label className="ativ-campo">Juros de mora ao mês (%)<input type="number" inputMode="decimal" min="0" step="0.1" value={taxa} onChange={(e) => setTaxa(e.target.value)} /></label>
      </div>
      <label className="ativ-campo">Atraso de <b>{dias} {dias === 1 ? 'dia' : 'dias'}</b>
        <input type="range" min="1" max="90" value={dias} onChange={(e) => setDias(Number(e.target.value))} aria-label="Dias de atraso" /></label>
      <div className="ativ-cards dois">
        <div className="contra"><small>Juros de mora</small><b>{brl2(juros)}</b></div>
        <div><small>Você paga</small><b>{brl2(v + juros)}</b></div>
      </div>
      <p className="nota-ativ">Exemplo simples, proporcional aos dias. Cada contrato define a sua taxa, então confira a do seu.</p>
    </>
  )
}
