import { useEffect } from 'react'
import { STATUS, usuario, nivelDe } from '../mock.js'

// Enquanto um diálogo está aberto: o topo (sino, avatar, barra) passa para trás do fundo escuro e a página não rola por baixo.
export function useDialogoAberto() {
  useEffect(() => {
    document.body.classList.add('com-dialogo')
    return () => document.body.classList.remove('com-dialogo')
  }, [])
}

export function Botao({ cor = 'verde', bloco, children, ...props }) {
  return <button className={`btn btn-${cor} ${bloco ? 'btn-bloco' : ''}`} {...props}>{children}</button>
}
export function Campo({ label, ...props }) {
  return <label className="campo">{label}<input {...props} /></label>
}
export function ChipStatus({ status }) {
  const s = STATUS[status]
  return <span className={`chip chip-${s.cor}`}>{s.texto}</span>
}
export function BarraProgresso({ pct, cor }) {
  return <div className={`barra ${cor ? `barra-${cor}` : ''}`} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${pct}%` }} /></div>
}

// Foto do usuário (ou inicial, enquanto não há upload no Supabase Storage).
export function Avatar({ tam = 44, className = '', ...props }) {
  return (
    <span className={`avatar ${className}`} style={{ width: tam, height: tam, fontSize: tam * 0.45 }} {...props}>
      {usuario.avatar ? <img src={usuario.avatar} alt="" /> : usuario.inicial}
    </span>
  )
}

// Barra de nível das telas Trilha e Score ("pts", não "xp" — doc v4).
export function NivelBarra() {
  const nv = nivelDe(usuario.pontos)
  return (
    <div className="nivel-barra">
      <span className="n">Nível {nv.atual.n} · {nv.atual.nome}</span>
      <span className="p">{usuario.pontos} pts</span>
      <BarraProgresso pct={nv.pct} cor="verde" />
      <span className="r">{nv.prox ? `${nv.ganhos}/${nv.total} para o próximo nível!` : 'Nível máximo!'}</span>
    </div>
  )
}

// Medalha em SVG (as imagens do Figma não vieram no pacote). tier: ouro | prata | bronze | inicial
const TIERS = {
  ouro: ['#FACC15', '#B8860B', '#FDE68A'], prata: ['#CBD5E1', '#64748B', '#F1F5F9'],
  bronze: ['#D9824B', '#8A4B1F', '#F3B98C'], inicial: ['#4B5563', '#1F2937', '#9CA3AF'],
}
export function Medalha({ tier, conquistada }) {
  const [a, b, c] = TIERS[tier]
  const id = `g-${tier}`
  return (
    <svg className={`medalha ${conquistada ? 'on' : ''}`} viewBox="0 0 100 120" role="img" aria-label={`Medalha ${tier}`}>
      <defs><radialGradient id={id} cx="35%" cy="30%"><stop offset="0" stopColor={c} /><stop offset="1" stopColor={a} /></radialGradient></defs>
      <path d="M30 0h14l8 38H36zM70 0H56l-8 38h16z" fill={b} opacity=".75" />
      <circle cx="50" cy="72" r="38" fill={`url(#${id})`} stroke={b} strokeWidth="4" />
      <circle cx="50" cy="72" r="29" fill="none" stroke={b} strokeWidth="2" strokeDasharray="3 3" />
      <path d="M32 78V62c6-3 12-3 18 2 6-5 12-5 18-2v16c-6-3-12-3-18 2-6-5-12-5-18-2z" fill={b} />
      <path d="M50 64v16" stroke={c} strokeWidth="2" />
      {conquistada && <circle cx="82" cy="40" r="12" fill="#16A34A" stroke="#fff" strokeWidth="3" />}
      {conquistada && <path d="M76 40l4 4 7-8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  )
}

// ---------- Ícones (traço único, herdam a cor do texto) ----------
const ICONES = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  package: <><path d="M21 8 12 3 3 8v8l9 5 9-5z" /><path d="m3 8 9 5 9-5M12 13v8" /></>,
  pin: <><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  cap: <><path d="m22 9-10-5L2 9l10 5z" /><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5M22 9v6" /></>,
  trophy: <path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8M10 17h4" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  heart: <path d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z" />,
  users: <path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M21 20v-1.5a4 4 0 0 0-3-3.9M15.5 4.2a3.5 3.5 0 0 1 0 6.6" />,
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
  bell: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />,
  truck: <><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2" /><circle cx="18.5" cy="18.5" r="2" /></>,
  bag: <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />,
  book: <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" />,
  check: <path d="M20 6 9 17l-5-5" />,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  arrow: <path d="M5 12h14M13 5l7 7-7 7" />,
  edit: <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />,
  star: <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2 2 9.3l6.9-1z" />,
  building: <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 10h.01M15 10h.01" />,
  category: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  note: <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5" />,
  sprout: <path d="M12 21v-9M12 12c0-4 3-6 7-6 0 4-3 6-7 6zM12 15c0-3-2.5-5-6-5 0 3 2.5 5 6 5z" />,
  trash: <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" />,
  info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>,
  swords: <path d="m14.5 17.5 5-5M13 19l6 2-2-6M5 5l7 7M5 5H3v2l7 7" />,
}
export function Icone({ nome, tam = 22, ...props }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>{ICONES[nome]}</svg>
  )
}

// Capa de livro ilustrada (3 cores, como no protótipo). Substitui os emojis 📘📗📙.
const CORES_CAPA = [['#2563EB', '#1D4ED8'], ['#16A34A', '#15803D'], ['#F97316', '#C2410C']]
export function Capa({ i = 0, grande, className = '' }) {
  const [a, b] = CORES_CAPA[i % 3]
  return (
    <span className={`capa ${grande ? 'grande' : ''} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 32 40" width="100%" height="100%">
        <rect x="4" y="2" width="24" height="36" rx="3.5" fill={a} />
        <rect x="4" y="2" width="7" height="36" rx="3.5" fill={b} />
        <rect x="15" y="11" width="10" height="2.6" rx="1.3" fill="#fff" opacity=".9" />
        <rect x="15" y="16" width="7" height="2.2" rx="1.1" fill="#fff" opacity=".65" />
        <rect x="4" y="30" width="24" height="2" fill="#fff" opacity=".25" />
      </svg>
    </span>
  )
}
