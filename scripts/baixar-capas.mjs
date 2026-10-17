// Baixa a capa de cada livro da landing para assets/livros/ (com o nome que o index.html espera).
//
// Como usar (precisa de internet e Node 18+):
//   node scripts/baixar-capas.mjs            baixa só as capas que ainda não existem
//   node scripts/baixar-capas.mjs --forcar   baixa de novo todas, trocando as que já existem
//
// Fonte: Google Books (edições em português) e, se não achar, Open Library.
// No fim, o script mostra QUAL título foi encontrado para cada livro. Confira a lista:
// se alguma capa vier errada, apague o arquivo e coloque a certa à mão (mesmo nome).
//
// Opcional: GOOGLE_BOOKS_KEY=sua_chave node scripts/baixar-capas.mjs  (evita limite de requisições)

import { mkdir, writeFile, readdir, unlink } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PASTA = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'livros')
const FORCAR = process.argv.includes('--forcar')
const CHAVE = process.env.GOOGLE_BOOKS_KEY ? `&key=${process.env.GOOGLE_BOOKS_KEY}` : ''
const MIN_BYTES = 6000 // imagens menores que isso costumam ser o aviso "capa indisponível"

// slug = nome do arquivo (igual ao do index.html). isbn é opcional: quando existe, tem prioridade.
export const LIVROS = [
  { slug: 'pai-rico-pai-pobre', titulo: 'Pai Rico, Pai Pobre', autor: 'Robert Kiyosaki', isbn: '9788550801483' },
  { slug: 'o-homem-mais-rico-da-babilonia', titulo: 'O Homem Mais Rico da Babilônia', autor: 'George S. Clason' },
  { slug: 'do-mil-ao-milhao', titulo: 'Do Mil ao Milhão', autor: 'Thiago Nigro' },
  { slug: 'a-psicologia-financeira', titulo: 'A Psicologia Financeira', autor: 'Morgan Housel' },
  { slug: 'me-poupe', titulo: 'Me Poupe!', autor: 'Nathalia Arcuri' },
  { slug: 'os-segredos-da-mente-milionaria', titulo: 'Os Segredos da Mente Milionária', autor: 'T. Harv Eker' },
  { slug: 'quem-pensa-enriquece', titulo: 'Quem Pensa Enriquece', autor: 'Napoleon Hill' },
  { slug: 'o-investidor-inteligente', titulo: 'O Investidor Inteligente', autor: 'Benjamin Graham' },
  { slug: 'casais-inteligentes-enriquecem-juntos', titulo: 'Casais Inteligentes Enriquecem Juntos', autor: 'Gustavo Cerbasi' },
  { slug: 'dinheiro-os-segredos-de-quem-tem', titulo: 'Dinheiro: Os Segredos de Quem Tem', autor: 'Gustavo Cerbasi' },
  { slug: 'como-organizar-sua-vida-financeira', titulo: 'Como Organizar Sua Vida Financeira', autor: 'Gustavo Cerbasi' },
  { slug: 'o-milionario-mora-ao-lado', titulo: 'O Milionário Mora ao Lado', autor: 'Thomas J. Stanley' },
]

const dormir = (ms) => new Promise((r) => setTimeout(r, ms))
const norm = (s = '') => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()
const palavras = (s) => norm(s).split(' ').filter((p) => p.length > 2)

async function json(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'EducaBem-capas/1.0' } })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
}

// baixa uma imagem; devolve { buf, ext } ou null se não for uma capa válida
async function imagem(url) {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'EducaBem-capas/1.0' }, redirect: 'follow' })
    if (!r.ok) return null
    const tipo = (r.headers.get('content-type') || '').toLowerCase()
    if (!tipo.startsWith('image/')) return null
    const buf = Buffer.from(await r.arrayBuffer())
    if (buf.length < MIN_BYTES) return null
    const ext = tipo.includes('png') ? 'png' : tipo.includes('webp') ? 'webp' : 'jpg'
    return { buf, ext }
  } catch { return null }
}

// ---------- Google Books ----------
function pontuar(item, livro) {
  const v = item.volumeInfo || {}
  const titulo = norm(`${v.title || ''} ${v.subtitle || ''}`)
  const quer = palavras(livro.titulo)
  if (!quer.length || !quer.every((p) => titulo.includes(p))) return -1 // o título precisa bater
  let pts = 10
  const sobrenome = norm(livro.autor).split(' ').pop()
  if ((v.authors || []).some((a) => norm(a).includes(sobrenome))) pts += 10
  if (v.language === 'pt') pts += 5
  if (norm(v.title) === norm(livro.titulo)) pts += 3 // título exato ganha de "Edição especial..."
  return pts
}

async function viaGoogle(livro) {
  const consultas = []
  if (livro.isbn) consultas.push({ q: `isbn:${livro.isbn}`, pt: false })
  consultas.push({ q: `intitle:"${livro.titulo}" inauthor:"${livro.autor}"`, pt: true })
  consultas.push({ q: `${livro.titulo} ${livro.autor}`, pt: true })
  for (const c of consultas) {
    let dados
    try {
      dados = await json(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(c.q)}&maxResults=15&printType=books${c.pt ? '&langRestrict=pt' : ''}${CHAVE}`)
    } catch { continue }
    const ranque = (dados.items || [])
      .map((it) => ({ it, pts: pontuar(it, livro) }))
      .filter((x) => x.pts >= 0 && x.it.volumeInfo?.imageLinks)
      .sort((a, b) => b.pts - a.pts)
    for (const { it } of ranque.slice(0, 3)) {
      for (const zoom of [0, 3, 2, 1]) { // do maior tamanho para o menor
        const img = await imagem(`https://books.google.com/books/content?id=${it.id}&printsec=frontcover&img=1&zoom=${zoom}`)
        if (img) return { ...img, fonte: 'Google Books', achou: `${it.volumeInfo.title}${it.volumeInfo.authors ? ' — ' + it.volumeInfo.authors.join(', ') : ''}` }
      }
    }
    await dormir(300)
  }
  return null
}

// ---------- Open Library (reserva) ----------
async function viaOpenLibrary(livro) {
  try {
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(livro.titulo)}&author=${encodeURIComponent(livro.autor)}&limit=10&fields=title,author_name,cover_i`
    const dados = await json(url)
    const quer = palavras(livro.titulo)
    for (const d of dados.docs || []) {
      if (!d.cover_i) continue
      const t = norm(d.title)
      if (!quer.every((p) => t.includes(p))) continue
      const img = await imagem(`https://covers.openlibrary.org/b/id/${d.cover_i}-L.jpg?default=false`)
      if (img) return { ...img, fonte: 'Open Library', achou: `${d.title}${d.author_name ? ' — ' + d.author_name.join(', ') : ''}` }
    }
  } catch { /* segue sem a reserva */ }
  return null
}

async function main() {
  await mkdir(PASTA, { recursive: true })
  const existentes = await readdir(PASTA)
  const relatorio = []
  for (const livro of LIVROS) {
    const ja = existentes.find((f) => f.replace(/\.[a-z0-9]+$/i, '') === livro.slug)
    if (ja && !FORCAR) { relatorio.push([livro.titulo, 'já existe', ja]); continue }
    process.stdout.write(`Buscando: ${livro.titulo} ... `)
    const r = (await viaGoogle(livro)) || (await viaOpenLibrary(livro))
    if (!r) { console.log('não encontrada'); relatorio.push([livro.titulo, 'NÃO ENCONTRADA', 'coloque a imagem à mão']); continue }
    // se trocou de extensão (ex.: antes .png, agora .jpg), apaga a antiga para não ficar duplicada
    for (const f of existentes) if (f !== `${livro.slug}.${r.ext}` && f.replace(/\.[a-z0-9]+$/i, '') === livro.slug) await unlink(join(PASTA, f)).catch(() => {})
    const arquivo = `${livro.slug}.${r.ext}`
    await writeFile(join(PASTA, arquivo), r.buf)
    console.log(`ok (${r.fonte}, ${Math.round(r.buf.length / 1024)} KB)`)
    relatorio.push([livro.titulo, `${r.fonte}`, `${arquivo}  ←  "${r.achou}"`])
    await dormir(400)
  }
  console.log('\n=== CONFIRA se cada título encontrado é mesmo o livro certo ===')
  for (const [t, s, d] of relatorio) console.log(`- ${t}\n    ${s}: ${d}`)
  const faltam = relatorio.filter((x) => x[1] === 'NÃO ENCONTRADA').length
  console.log(faltam ? `\n${faltam} capa(s) não encontrada(s). O site continua mostrando a capa com título e autor para elas.` : '\nTudo certo. Agora faça o commit da pasta assets/livros/.')
}

// só executa quando chamado direto (permite importar LIVROS em testes)
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main()
