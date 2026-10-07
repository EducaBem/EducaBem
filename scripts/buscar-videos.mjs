// uso: YT_KEY=sua_chave node scripts/buscar-videos.mjs
const KEY = process.env.YT_KEY
if (!KEY) { console.error('Defina YT_KEY com a chave da YouTube Data API.'); process.exit(1) }

const BUSCAS = {
  m1: 'para que serve o dinheiro educação financeira',
  m2: 'necessidade ou desejo educação financeira',
  m3: 'regra 50 30 20 orçamento pessoal',
  m4: 'reserva de emergência como começar',
  m5: 'juros o que são juros simples e compostos educação financeira',
  m6: 'como definir metas financeiras hábito de poupar',
}

for (const [mod, q] of Object.entries(BUSCAS)) {
  const u = new URL('https://www.googleapis.com/youtube/v3/search')
  u.search = new URLSearchParams({ part: 'snippet', q, type: 'video', videoEmbeddable: 'true', videoDuration: 'short',
    relevanceLanguage: 'pt', regionCode: 'BR', safeSearch: 'strict', maxResults: '5', key: KEY })
  const r = await fetch(u)
  const j = await r.json()
  if (!r.ok) { console.error(mod, 'erro:', j.error?.message); continue }
  console.log(`\n== ${mod}: ${q}`)
  for (const it of j.items) console.log(`  ${it.snippet.title} | ${it.snippet.channelTitle}\n    https://www.youtube.com/watch?v=${it.id.videoId}`)
}
