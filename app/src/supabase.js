import { createClient } from '@supabase/supabase-js'

// Conexão com o Supabase. As duas variáveis vêm do .env (local) ou dos Secrets do GitHub (site publicado).
// Sem elas, temBanco = false e o app continua funcionando com os dados de exemplo (mock), como antes.
// Só a chave PUBLICÁVEL entra aqui; a SECRET_KEY nunca deve aparecer no código.
const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const chave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

export const temBanco = Boolean(url && chave)
export const supabase = temBanco
  ? createClient(url, chave, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } }) // detectSessionInUrl off: o app usa HashRouter (#/rota)
  : null
